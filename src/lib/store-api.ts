import { apiFetch, type PageResponse } from '@/lib/api'
import type { ChatSummary } from '@/lib/chat-api'
import type { ProductCategory } from '@/types'

export type ApiPartCategory =
	| 'BRAKES'
	| 'SUSPENSION'
	| 'ENGINE'
	| 'WHEELS'
	| 'LIGHTS'
	| 'OILS'
	| 'ACCESSORIES'

export type VerificationStatus = 'NEW' | 'VERIFIED' | 'TRUSTED' | 'BLOCKED'

export interface StoreSummary {
	id: number
	name: string
	businessType: string
	rating: number
	reviewCount: number
	totalDeals: number
	verificationStatus: VerificationStatus
	categories: ApiPartCategory[]
	cities: string[]
}

export interface WorkHours {
	open: string
	close: string
	days: string[]
}

export interface StoreBranch {
	id: number
	address: string
	city: string
	/** Only visible to the store's owner or a buyer with an accepted deal — null otherwise. */
	phone: string | null
	latitude: number | null
	longitude: number | null
	workHours: WorkHours | null
}

export interface StoreDetails {
	id: number
	name: string
	businessType: string
	description: string | null
	rating: number
	reviewCount: number
	totalDeals: number
	verificationStatus: VerificationStatus
	categories: ApiPartCategory[]
	branches: StoreBranch[]
}

export interface ListStoresParams {
	category?: ApiPartCategory
	city?: string
	page?: number
	size?: number
}

/** Same lowercase spelling on both sides (BRAKES ↔ brakes) — see ProductCategory in src/types. */
export function toProductCategory(category: ApiPartCategory): ProductCategory {
	return category.toLowerCase() as ProductCategory
}

export function listStores(params: ListStoresParams = {}) {
	// Cyrillic (city names) must be percent-encoded — URLSearchParams does this
	// correctly by default; hand-built query strings don't and get a bare 400.
	const qs = new URLSearchParams()
	if (params.category) qs.set('category', params.category)
	if (params.city) qs.set('city', params.city)
	if (params.page !== undefined) qs.set('page', String(params.page))
	if (params.size !== undefined) qs.set('size', String(params.size))
	const query = qs.toString()
	return apiFetch<PageResponse<StoreSummary>>(`/api/v1/stores${query ? `?${query}` : ''}`)
}

export function getStore(id: number) {
	return apiFetch<StoreDetails>(`/api/v1/stores/${id}`)
}

/** Idempotent — repeat calls for the same store return the same chat, no dupes. */
export function startStoreChat(storeId: number) {
	return apiFetch<ChatSummary>(`/api/v1/stores/${storeId}/chat`, { method: 'POST' })
}

export interface Review {
	id: number
	storeId: number
	authorId: number
	authorName: string
	rating: number
	text: string | null
	status: string
	createdAt: string
}

export function getStoreReviews(storeId: number, page = 0, size = 20) {
	return apiFetch<PageResponse<Review>>(`/api/v1/stores/${storeId}/reviews?page=${page}&size=${size}`)
}

/** Only allowed after a deal with this store has gone through — offerId ties the review to it. */
export function createReview(storeId: number, payload: { rating: number; text?: string; offerId?: number }) {
	return apiFetch<Review>(`/api/v1/stores/${storeId}/reviews`, { method: 'POST', body: payload })
}
