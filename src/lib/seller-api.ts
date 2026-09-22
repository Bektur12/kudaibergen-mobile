import { apiFetch, type PageResponse } from '@/lib/api'
import type { ApiPartCategory, StoreDetails, WorkHours } from '@/lib/store-api'

// ── Store profile ───────────────────────────────────────────────────

export function getMyStore() {
	return apiFetch<StoreDetails>('/api/v1/my-store')
}

export function updateMyStore(payload: { name?: string; description?: string; businessType?: string }) {
	return apiFetch<StoreDetails>('/api/v1/my-store', { method: 'PATCH', body: payload })
}

// ── Categories (what the store sells — drives which requests reach it) ─

export function getMyCategories() {
	return apiFetch<ApiPartCategory[]>('/api/v1/my-store/categories')
}

export function setMyCategories(categories: ApiPartCategory[]) {
	return apiFetch<ApiPartCategory[]>('/api/v1/my-store/categories', {
		method: 'PUT',
		body: { categories },
	})
}

// ── Branches ────────────────────────────────────────────────────────

export interface Branch {
	id: number
	address: string
	city: string
	phone: string | null
	latitude: number | null
	longitude: number | null
	workHours: WorkHours | null
}

export interface BranchPayload {
	address?: string
	city?: string
	phone?: string
	latitude?: number
	longitude?: number
	workHours?: WorkHours
}

export function getMyBranches() {
	return apiFetch<Branch[]>('/api/v1/my-store/branches')
}

export function createBranch(payload: BranchPayload) {
	return apiFetch<Branch>('/api/v1/my-store/branches', { method: 'POST', body: payload })
}

export function updateBranch(id: number, payload: BranchPayload) {
	return apiFetch<Branch>(`/api/v1/my-store/branches/${id}`, { method: 'PATCH', body: payload })
}

export function deleteBranch(id: number) {
	return apiFetch<void>(`/api/v1/my-store/branches/${id}`, { method: 'DELETE' })
}

// ── Quick-reply templates ───────────────────────────────────────────

export interface Template {
	id: number
	title: string
	body: string
	sortOrder: number
}

export interface TemplatePayload {
	title?: string
	body?: string
	sortOrder?: number
}

export function getMyTemplates() {
	return apiFetch<Template[]>('/api/v1/my-store/templates')
}

export function createTemplate(payload: TemplatePayload) {
	return apiFetch<Template>('/api/v1/my-store/templates', { method: 'POST', body: payload })
}

export function updateTemplate(id: number, payload: TemplatePayload) {
	return apiFetch<Template>(`/api/v1/my-store/templates/${id}`, { method: 'PATCH', body: payload })
}

export function deleteTemplate(id: number) {
	return apiFetch<void>(`/api/v1/my-store/templates/${id}`, { method: 'DELETE' })
}

// ── Incoming requests feed ──────────────────────────────────────────

export type SellerRequestFilter = 'ALL' | 'URGENT' | 'UNANSWERED'

export interface SellerRequestRow {
	requestId: number
	category: ApiPartCategory
	description: string
	car: string | null
	budgetMin: number | null
	budgetMax: number | null
	currency: string | null
	city: string
	isUrgent: boolean
	offerCount: number
	createdAt: string
	expiresAt: string
	seenAt: string | null
	repliedAt: string | null
}

export function getMyStoreRequests(filter: SellerRequestFilter = 'ALL', page = 0, size = 20) {
	return apiFetch<PageResponse<SellerRequestRow>>(
		`/api/v1/my-store/requests?filter=${filter}&page=${page}&size=${size}`
	)
}

export function markRequestSeen(id: number) {
	return apiFetch<void>(`/api/v1/my-store/requests/${id}/seen`, { method: 'POST' })
}

// ── Analytics ───────────────────────────────────────────────────────

export interface CategoryDemand {
	category: string
	requests: number
	answered: number
}

export interface SellerAnalytics {
	requestsReceived: number
	requestsAnswered: number
	responseRate: number
	requestsMissed: number
	missedBudgetSum: number
	avgResponseMinutes: number
	dealsClosed: number
	topDemandedCategories: CategoryDemand[]
}

export function getMyAnalytics(period?: string) {
	return apiFetch<SellerAnalytics>(`/api/v1/my-store/analytics${period ? `?period=${period}` : ''}`)
}
