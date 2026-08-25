import React, { createContext, useContext, useState, useCallback } from 'react'
import { Request, Offer, Chat, Message } from '@/types'

interface AppContextType {
	requests: Request[]
	createRequest: (request: Omit<Request, 'id' | 'createdAt' | 'sellerCount' | 'waitTime'>) => Promise<void>
	getRequest: (id: string) => Request | undefined
	updateRequest: (id: string, updates: Partial<Request>) => void

	offers: Offer[]
	createOffer: (offer: Omit<Offer, 'id' | 'createdAt'>) => Promise<void>
	getOffersByRequest: (requestId: string) => Offer[]

	chats: Chat[]
	getOrCreateChat: (participantIds: string[]) => string
	getChat: (id: string) => Chat | undefined

	messages: Message[]
	sendMessage: (chatId: string, senderId: string, content: string) => Promise<void>
	getMessagesByChat: (chatId: string) => Message[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [requests, setRequests] = useState<Request[]>([])
	const [offers, setOffers] = useState<Offer[]>([])
	const [chats, setChats] = useState<Chat[]>([])
	const [messages, setMessages] = useState<Message[]>([])

	const createRequest = useCallback(
		async (request: Omit<Request, 'id' | 'createdAt' | 'sellerCount' | 'waitTime'>) => {
			const newRequest: Request = {
				...request,
				id: `req_${Date.now()}`,
				createdAt: new Date(),
				sellerCount: 0,
				waitTime: 24,
			}
			setRequests((prev) => [newRequest, ...prev])
		},
		[]
	)

	const getRequest = useCallback(
		(id: string) => requests.find((r) => r.id === id),
		[requests]
	)

	const updateRequest = useCallback((id: string, updates: Partial<Request>) => {
		setRequests((prev) =>
			prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
		)
	}, [])

	const createOffer = useCallback(
		async (offer: Omit<Offer, 'id' | 'createdAt'>) => {
			const newOffer: Offer = {
				...offer,
				id: `offer_${Date.now()}`,
				createdAt: new Date(),
			}
			setOffers((prev) => [newOffer, ...prev])
		},
		[]
	)

	const getOffersByRequest = useCallback(
		(requestId: string) => offers.filter((o) => o.requestId === requestId),
		[offers]
	)

	const getOrCreateChat = useCallback((participantIds: string[]) => {
		const existingChat = chats.find((c) =>
			c.participantIds.every((id) => participantIds.includes(id))
		)

		if (existingChat) {
			return existingChat.id
		}

		const newChat: Chat = {
			id: `chat_${Date.now()}`,
			participantIds,
			unreadCount: 0,
		}
		setChats((prev) => [newChat, ...prev])
		return newChat.id
	}, [chats])

	const getChat = useCallback(
		(id: string) => chats.find((c) => c.id === id),
		[chats]
	)

	const sendMessage = useCallback(
		async (chatId: string, senderId: string, content: string) => {
			const newMessage: Message = {
				id: `msg_${Date.now()}`,
				chatId,
				senderId,
				content,
				createdAt: new Date(),
				isRead: false,
			}
			setMessages((prev) => [newMessage, ...prev])

			setChats((prev) =>
				prev.map((c) =>
					c.id === chatId
						? {
								...c,
								lastMessage: content,
								lastMessageTime: new Date(),
							}
						: c
				)
			)
		},
		[]
	)

	const getMessagesByChat = useCallback(
		(chatId: string) =>
			messages
				.filter((m) => m.chatId === chatId)
				.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
		[messages]
	)

	const value: AppContextType = {
		requests,
		createRequest,
		getRequest,
		updateRequest,
		offers,
		createOffer,
		getOffersByRequest,
		chats,
		getOrCreateChat,
		getChat,
		messages,
		sendMessage,
		getMessagesByChat,
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useApp must be used within AppProvider')
	}
	return context
}
