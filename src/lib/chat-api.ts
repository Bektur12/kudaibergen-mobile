import { apiFetch, API_BASE_URL, type PageResponse } from '@/lib/api'

export interface ChatSummary {
	id: number
	requestId: number
	buyerId: number
	storeId: number
	storeName: string
	lastMessage: string | null
	lastMessageAt: string | null
	hasUnread: boolean
	createdAt: string
	/** Starting snapshot — kept live afterwards via subscribeToPresence, see chat-socket.ts. */
	otherOnline: boolean
	otherLastSeenAt: string | null
}

export type MessageType = 'TEXT' | 'PHOTO' | 'VOICE' | 'VIDEO'

export interface ChatMessage {
	id: number
	chatId: number
	senderId: number
	type: MessageType
	body: string
	mediaUrl: string | null
	mimeType: string | null
	durationSeconds: number | null
	readAt: string | null
	createdAt: string
}

export function listChats() {
	return apiFetch<ChatSummary[]>('/api/v1/chats')
}

/** Newest first, matching the API — pairs directly with a FlatList `inverted`. */
export function getChatMessages(chatId: number, page = 0, size = 50) {
	return apiFetch<PageResponse<ChatMessage>>(
		`/api/v1/chats/${chatId}/messages?page=${page}&size=${size}`
	)
}

export function sendTextMessage(chatId: number, body: string) {
	return apiFetch<ChatMessage>(`/api/v1/chats/${chatId}/messages`, {
		method: 'POST',
		body: { body },
	})
}

/** `form` must already have `file` + `type` (PHOTO/VOICE/VIDEO) appended, `caption`/`durationSeconds` optional. */
export function sendMediaMessage(chatId: number, form: FormData) {
	return apiFetch<ChatMessage>(`/api/v1/chats/${chatId}/messages/media`, {
		method: 'POST',
		body: form,
	})
}

export function markChatRead(chatId: number) {
	return apiFetch<void>(`/api/v1/chats/${chatId}/read`, { method: 'POST' })
}

/** mediaUrl comes back as a relative path (`/media/uuid.jpg`) — needs the backend origin to be loadable. */
export function resolveMediaUrl(mediaUrl: string | null): string | null {
	if (!mediaUrl) return null
	return `${API_BASE_URL}${mediaUrl}`
}
