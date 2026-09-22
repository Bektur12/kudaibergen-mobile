import { Client, type StompSubscription } from '@stomp/stompjs'
import { API_BASE_URL, getAccessToken } from '@/lib/api'
import type { ChatMessage } from '@/lib/chat-api'

/**
 * Live delivery — STOMP over WebSocket (Spring's native protocol, not
 * Socket.IO — see the backend doc: SockJS speaks its own thing on top of WS
 * that Spring doesn't understand). REST/STOMP-SEND stay the source of truth
 * for *sending*; subscriptions here only deliver what was already persisted
 * (messages) or broadcast (typing/presence) to whoever's subscribed. One
 * shared connection for the whole app — screens just subscribe/unsubscribe
 * to a chat's topics, they don't own the socket.
 */

export interface TypingEvent {
	userId: number
	typing: boolean
}

export interface PresenceEvent {
	userId: number
	online: boolean
}

function resolveWsUrl(): string {
	const wsBase = API_BASE_URL.replace(/^http/, 'ws')
	return `${wsBase}/ws`
}

// Three independent topic families per chat (messages/typing/presence) share
// the exact same subscribe/reconnect/unsubscribe shape, just a different
// destination and payload type — one generic registry instead of tripling
// the bookkeeping.
interface TopicFamily<T> {
	destination: (chatId: number) => string
	listeners: Map<number, Set<(event: T) => void>>
	subs: Map<number, StompSubscription>
}

function makeFamily<T>(destination: (chatId: number) => string): TopicFamily<T> {
	return { destination, listeners: new Map(), subs: new Map() }
}

const messages = makeFamily<ChatMessage>((id) => `/topic/chats/${id}`)
const typing = makeFamily<TypingEvent>((id) => `/topic/chats/${id}/typing`)
const presence = makeFamily<PresenceEvent>((id) => `/topic/chats/${id}/presence`)
// Only used for the generic "reconnect everything" loop below, where the
// payload type genuinely doesn't matter — each family's own subscribe
// function (subscribeToChat/Typing/Presence) keeps its proper T.
const families = [messages, typing, presence] as unknown as TopicFamily<unknown>[]

let client: Client | null = null

function ensureClient(): Client {
	if (client) return client

	client = new Client({
		brokerURL: resolveWsUrl(),
		connectHeaders: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
		reconnectDelay: 3000,
		onConnect: () => {
			// STOMP subscriptions don't survive a reconnect — reapply every topic
			// we still have listeners for, across all three families.
			for (const family of families) {
				for (const chatId of family.listeners.keys()) {
					subscribeOnBroker(family, chatId)
				}
			}
		},
	})
	return client
}

function subscribeOnBroker<T>(family: TopicFamily<T>, chatId: number) {
	if (!client || family.subs.has(chatId)) return
	const sub = client.subscribe(family.destination(chatId), (frame) => {
		const event: T = JSON.parse(frame.body)
		family.listeners.get(chatId)?.forEach((handler) => handler(event))
	})
	family.subs.set(chatId, sub)
}

function subscribeToFamily<T>(family: TopicFamily<T>, chatId: number, handler: (event: T) => void): () => void {
	if (!family.listeners.has(chatId)) family.listeners.set(chatId, new Set())
	family.listeners.get(chatId)!.add(handler)

	const c = ensureClient()
	if (c.connected) subscribeOnBroker(family, chatId)

	return () => {
		const set = family.listeners.get(chatId)
		set?.delete(handler)
		if (set && set.size === 0) {
			family.listeners.delete(chatId)
			family.subs.get(chatId)?.unsubscribe()
			family.subs.delete(chatId)
		}
	}
}

/** Call once after login (and once after restoring a session) — see AuthProvider. */
export function connectChatSocket() {
	const c = ensureClient()
	// Token may have changed since the client was first created (fresh login
	// after a previous logout) — always refresh the CONNECT header before activating.
	c.connectHeaders = { Authorization: `Bearer ${getAccessToken() ?? ''}` }
	if (!c.active) c.activate()
}

/** Call on logout — drops the socket, all topic subscriptions go with it. */
export function disconnectChatSocket() {
	for (const family of families) {
		family.subs.clear()
		family.listeners.clear()
	}
	client?.deactivate()
}

/**
 * Subscribe to live messages for one chat. Safe to call before the socket
 * has finished connecting — it just gets applied on `onConnect` too.
 * Returns an unsubscribe function.
 */
export function subscribeToChat(chatId: number, handler: (message: ChatMessage) => void): () => void {
	return subscribeToFamily(messages, chatId, handler)
}

/** Fires whenever the other side starts/stops typing in this chat. */
export function subscribeToTyping(chatId: number, handler: (event: TypingEvent) => void): () => void {
	return subscribeToFamily(typing, chatId, handler)
}

/** Fires whenever the other side's online status changes for this chat. */
export function subscribeToPresence(chatId: number, handler: (event: PresenceEvent) => void): () => void {
	return subscribeToFamily(presence, chatId, handler)
}

/** SEND /app/chats/{id}/typing — best-effort, no queueing while disconnected (a missed "stopped typing" self-heals via the receiver's own timeout). */
export function sendTyping(chatId: number, typingNow: boolean) {
	const c = ensureClient()
	if (!c.connected) return
	c.publish({
		destination: `/app/chats/${chatId}/typing`,
		body: JSON.stringify({ typing: typingNow }),
	})
}
