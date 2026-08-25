export type UserRole = 'buyer' | 'seller'

export interface User {
	id: string
	name: string
	email: string
	role: UserRole
	phone?: string
	avatar?: string
}

export interface Request {
	id: string
	buyerId: string
	carModel: string
	carYear: number
	carEngine: string
	details: string
	photos: string[]
	status: 'active' | 'completed' | 'cancelled'
	createdAt: Date
	expiresAt: Date
	sellerCount: number
	waitTime: number
}

export interface Offer {
	id: string
	requestId: string
	sellerId: string
	price: number
	currency: 'KZT' | 'USD'
	description?: string
	estimatedDelivery?: number
	createdAt: Date
}

export interface Chat {
	id: string
	participantIds: string[]
	lastMessage?: string
	lastMessageTime?: Date
	unreadCount: number
}

export interface Message {
	id: string
	chatId: string
	senderId: string
	content: string
	createdAt: Date
	isRead: boolean
}
