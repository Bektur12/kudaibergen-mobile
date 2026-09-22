import { Client, ReconnectionTimeMode, type StompSubscription } from '@stomp/stompjs'
import { API_BASE_URL, getAccessToken, ensureFreshAccessToken } from '@/lib/api'
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
		// React Native's WebSocket bridge chops the trailing NULL byte off text
		// frames sent via `.send()` — and every STOMP frame (including CONNECT)
		// *must* end in NULL per the protocol. Confirmed server-side: bytes
		// arrive (~295 for our CONNECT), but StompDecoder logs "Incomplete
		// frame, resetting input buffer" and silently drops it — no error frame
		// back to the client, just a connection that never reaches CONNECTED.
		// forceBinaryWSFrames sends frames as ArrayBuffers instead of strings,
		// sidestepping the RN bridge bug entirely rather than patching the
		// missing byte after the fact. Only matters on native (the browser's
		// WebSocket doesn't have this bug), but setting it always is harmless.
		forceBinaryWSFrames: true,
		appendMissingNULLonIncoming: true,
		// Exponential backoff instead of a flat retry every 3s — during a real
		// outage (not just a token refresh) that's needless hammering. Starts
		// at 2s, doubles each failed attempt, caps at 30s.
		reconnectDelay: 2000,
		maxReconnectDelay: 30000,
		reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
		// heartbeatIncoming (expecting a ping FROM the server on a strict
		// schedule) turned out to be the likely cause of subscriptions getting
		// silently recreated every ~10-20s: any jitter in the server's actual
		// heartbeat cadence (or just normal mobile-network/JS-thread timing
		// slop) makes the client decide the connection is dead, force a
		// reconnect, and onConnect re-subscribes everything — which reads on
		// the server as fresh SUBSCRIBE frames every few seconds, and explains
		// "message only shows up after leaving and reopening the chat": there's
		// a window on every one of those reconnects where nothing is subscribed.
		// heartbeatOutgoing (us pinging the server) has no such failure mode —
		// keep that one, it still helps NAT/carrier connections stay alive.
		heartbeatIncoming: 0,
		heartbeatOutgoing: 10000,
		// Runs before every CONNECT attempt — including every automatic
		// reconnect stompjs fires. Without this, a reconnect reuses whatever
		// connectHeaders was set at client construction time; once the access
		// token (15 min TTL) expires, every reconnect keeps presenting the
		// same dead token, the server rejects it, and the socket never
		// recovers on its own (confirmed server-side: hundreds of CONNECT
		// attempts, a handful of CONNECTED). Refreshing here breaks that loop.
		beforeConnect: async () => {
			await ensureFreshAccessToken()
			if (client) client.connectHeaders = { Authorization: `Bearer ${getAccessToken() ?? ''}` }
		},
		// Silent by default — without these, a connection that never succeeds
		// (wrong URL, CORS, expired token, network unreachable) just retries
		// forever with zero visible signal. This is the fastest way to see
		// *why* messages/typing/presence only ever show up after a REST
		// refetch (leaving and reopening the chat) instead of live.
		debug: (msg) => {
			if (__DEV__) console.log('[stomp]', msg)
		},
		onConnect: () => {
			if (__DEV__) console.log('[stomp] connected:', resolveWsUrl())
			// STOMP subscriptions don't survive a reconnect — reapply every topic
			// we still have listeners for, across all three families.
			for (const family of families) {
				for (const chatId of family.listeners.keys()) {
					subscribeOnBroker(family, chatId)
				}
			}
		},
		onDisconnect: () => {
			if (__DEV__) console.log('[stomp] disconnected')
		},
		onStompError: (frame) => {
			if (__DEV__) console.log('[stomp] broker error:', frame.headers['message'], frame.body)
		},
		onWebSocketError: (event) => {
			if (__DEV__) console.log('[stomp] websocket error:', resolveWsUrl(), event)
		},
		onWebSocketClose: (event) => {
			if (__DEV__) console.log('[stomp] websocket closed:', event.code, event.reason)
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
