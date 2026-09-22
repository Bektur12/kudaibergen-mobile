import { apiFetch } from '@/lib/api'

export type ApiRole = 'BUYER' | 'SELLER'

export interface TokenResponse {
	accessToken: string
	refreshToken: string
	expiresInSeconds: number
	isNewUser: boolean
	role: ApiRole
}

export interface RequestCodeResponse {
	expiresInSeconds: number
	/** Only populated in dev — backend echoes the code instead of sending real SMS. */
	debugCode?: string
}

export interface MeResponse {
	id: number
	phone: string
	name: string | null
	role: ApiRole
	city: string | null
	createdAt: string
}

export interface RegisterRolePayload {
	role: ApiRole
	name?: string
	storeName?: string
	businessType?: string
	city?: string
}

const PHONE_PATTERN = /^\+996\d{9}$/

export function isValidKgPhone(phone: string): boolean {
	return PHONE_PATTERN.test(phone)
}

export function requestCode(phone: string) {
	return apiFetch<RequestCodeResponse>('/api/v1/auth/request-code', {
		method: 'POST',
		body: { phone },
		auth: false,
	})
}

export function verifyCode(phone: string, code: string) {
	return apiFetch<TokenResponse>('/api/v1/auth/verify', {
		method: 'POST',
		body: { phone, code },
		auth: false,
	})
}

export function registerRole(payload: RegisterRolePayload) {
	return apiFetch<TokenResponse>('/api/v1/auth/register-role', {
		method: 'POST',
		body: payload,
	})
}

export function getMe() {
	return apiFetch<MeResponse>('/api/v1/me')
}

export function updateMe(payload: { name?: string; city?: string }) {
	return apiFetch<MeResponse>('/api/v1/me', { method: 'PATCH', body: payload })
}

export function registerDevice(token: string, platform: 'IOS' | 'ANDROID') {
	return apiFetch<void>('/api/v1/devices', {
		method: 'POST',
		body: { token, platform },
	})
}

export function unregisterDevice(token: string) {
	return apiFetch<void>(`/api/v1/devices/${encodeURIComponent(token)}`, {
		method: 'DELETE',
	})
}
