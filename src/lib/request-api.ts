import { apiFetch, type PageResponse } from '@/lib/api'
import type { ApiPartCategory } from '@/lib/store-api'

export type RequestStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
export type OfferStatus = 'ACTIVE' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED'

export interface OfferSummary {
	id: number
	storeId: number
	storeName: string
	storeRating: number
	price: number | null
	currency: string
	comment: string | null
	deliveryDays: number | null
	status: OfferStatus | string
	createdAt: string
}

export interface RequestDetails {
	id: number
	category: ApiPartCategory
	description: string
	car: string | null
	budgetMin: number | null
	budgetMax: number | null
	currency: string | null
	city: string
	isUrgent: boolean
	status: RequestStatus
	offerCount: number
	createdAt: string
	expiresAt: string
	offers: OfferSummary[]
}

export interface CreateRequestPayload {
	category: ApiPartCategory
	description: string
	vehicleId?: number
	carText?: string
	budgetMin?: number
	budgetMax?: number
	isUrgent?: boolean
}

export interface CreateRequestResult {
	id: number
	sellersMatched: number
	expiresAt: string
}

export function createRequest(payload: CreateRequestPayload, idempotencyKey?: string) {
	return apiFetch<CreateRequestResult>('/api/v1/requests', {
		method: 'POST',
		body: payload,
		idempotencyKey,
	})
}

export function getMyRequests(page = 0, size = 20) {
	return apiFetch<PageResponse<RequestDetails>>(`/api/v1/requests/my?page=${page}&size=${size}`)
}

export function getRequest(id: number) {
	return apiFetch<RequestDetails>(`/api/v1/requests/${id}`)
}

export function extendRequest(id: number) {
	return apiFetch<RequestDetails>(`/api/v1/requests/${id}/extend`, { method: 'POST' })
}

export function cancelRequest(id: number) {
	return apiFetch<RequestDetails>(`/api/v1/requests/${id}/cancel`, { method: 'POST' })
}

// ── Offers ──────────────────────────────────────────────────────────

export interface OfferDetails {
	id: number
	requestId: number
	storeId: number
	price: number | null
	currency: string
	comment: string | null
	deliveryDays: number | null
	status: OfferStatus
	createdAt: string
}

export interface CreateOfferPayload {
	requestId: number
	price?: number
	comment?: string
	deliveryDays?: number
}

export function createOffer(payload: CreateOfferPayload, idempotencyKey?: string) {
	return apiFetch<OfferDetails>('/api/v1/offers', {
		method: 'POST',
		body: payload,
		idempotencyKey,
	})
}

export interface AcceptOfferResult {
	offerId: number
	chatId: number
}

/** Buyer accepts a seller's offer — creates (or returns) the chat for the deal. */
export function acceptOffer(id: number) {
	return apiFetch<AcceptOfferResult>(`/api/v1/offers/${id}/accept`, { method: 'POST' })
}

export function rejectOffer(id: number) {
	return apiFetch<OfferDetails>(`/api/v1/offers/${id}/reject`, { method: 'POST' })
}

export function cancelOffer(id: number) {
	return apiFetch<OfferDetails>(`/api/v1/offers/${id}/cancel`, { method: 'POST' })
}

export interface BulkReplyPayload {
	requestIds: number[]
	templateId?: number
	text?: string
	price?: number
	deliveryDays?: number
}

export interface BulkReplyResult {
	created: number
	skipped: number
}

/** One template/price applied to many requests at once — the seller's "reply to all" action. */
export function bulkReply(payload: BulkReplyPayload) {
	return apiFetch<BulkReplyResult>('/api/v1/offers/bulk', { method: 'POST', body: payload })
}
