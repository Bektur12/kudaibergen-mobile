export type UserRole = 'buyer' | 'seller'

export interface User {
	id: string
	name: string
	email: string
	role: UserRole
	phone?: string
	avatar?: string
	city?: string
	isVerified?: boolean
}

// VEHICLES
export interface Vehicle {
	id: string
	buyerId: string
	brand: string
	model: string
	year: number
	engineVolume: string
	engineType: 'petrol' | 'diesel' | 'hybrid' | 'electric'
	transmission: 'manual' | 'automatic'
	isDefault: boolean
	createdAt: Date
}

// CAR LISTINGS
export interface CarListing {
	id: string
	sellerId: string
	vehicle: Vehicle
	price: number
	currency: 'KZT' | 'USD'
	mileage: number
	description: string
	photos: string[]
	status: 'active' | 'sold' | 'archived'
	city: string
	createdAt: Date
}

// PRODUCTS & PARTS
export type ProductCategory = 'brakes' | 'suspension' | 'engine' | 'wheels' | 'lights' | 'oils' | 'accessories'

export interface Product {
	id: string
	storeId: string
	name: string
	category: ProductCategory
	price: number
	currency: 'KZT' | 'USD'
	description?: string
	condition: 'new' | 'used' | 'refurbished'
	warranty?: {
		period: number
		type: 'manufacturer' | 'seller' | 'none'
	}
	inStock: number
	photos?: string[]
	createdAt: Date
}

// STORES
export interface Store {
	id: string
	sellerId: string
	name: string
	type: 'shop' | 'service' | 'private'
	businessType?: 'parts' | 'tires' | 'oils' | 'accessories' | 'sto' | 'carwash'
	description?: string
	rating: number
	reviewCount: number
	totalDeals: number
	verificationStatus: 'new' | 'verified' | 'trusted' | 'blocked'
	logo?: string
	branches: StoreBranch[]
	createdAt: Date
}

export interface StoreBranch {
	id: string
	storeId: string
	address: string
	city: string
	phone: string
	latitude: number
	longitude: number
	workingHours?: {
		open: string
		close: string
		days: string[]
	}
}

// SERVICES / STO
export type ServiceCategory = 'diagnostics' | 'engine' | 'suspension' | 'electrical' | 'bodywork' | 'tires' | 'oil' | 'ac' | 'carwash'

export interface Service {
	id: string
	storeId: string
	name: string
	category: ServiceCategory
	price?: number
	description?: string
	duration?: number
	createdAt: Date
}

// REQUESTS & OFFERS
export interface Request {
	id: string
	buyerId: string
	vehicleId?: string
	carModel?: string
	description: string
	category: ProductCategory | ServiceCategory
	photos?: string[]
	status: 'active' | 'completed' | 'cancelled'
	budget?: {
		min: number
		max: number
		currency: 'KZT' | 'USD'
	}
	city: string
	isUrgent: boolean
	createdAt: Date
	expiresAt: Date
	offerCount: number
	selectedOfferId?: string
}

export interface Offer {
	id: string
	requestId: string
	sellerId: string
	productId?: string
	price: number
	currency: 'KZT' | 'USD'
	description?: string
	estimatedDelivery?: number
	paymentMethods: ('cash' | 'card' | 'transfer')[]
	status: 'active' | 'accepted' | 'rejected' | 'expired'
	createdAt: Date
}

// CHAT & MESSAGES
export interface Chat {
	id: string
	participantIds: string[]
	requestId?: string
	offerId?: string
	lastMessage?: string
	lastMessageTime?: Date
	unreadCount: number
	status: 'active' | 'archived' | 'closed'
	createdAt: Date
}

export interface Message {
	id: string
	chatId: string
	senderId: string
	content: string
	type: 'text' | 'photo' | 'voice'
	isRead: boolean
	createdAt: Date
}

// REVIEWS & RATINGS
export interface Review {
	id: string
	reviewerId: string
	sellerId: string
	offerId?: string
	rating: number
	criteria?: {
		quality: number
		price: number
		response: number
		convenience: number
		professionalism: number
	}
	text: string
	status: 'pending' | 'approved' | 'rejected'
	createdAt: Date
}

// FAVORITES
export interface Favorite {
	id: string
	userId: string
	type: 'car' | 'product' | 'store' | 'service'
	targetId: string
	createdAt: Date
}

// NOTIFICATIONS
export interface Notification {
	id: string
	userId: string
	type: 'new_offer' | 'new_message' | 'price_drop' | 'item_appeared' | 'review_request'
	title: string
	body: string
	data?: Record<string, string>
	isRead: boolean
	createdAt: Date
}
