import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

/** Shared shape for every paginated list endpoint on this backend. */
export interface PageResponse<T> {
	content: T[]
	page: number
	size: number
	totalElements: number
	totalPages: number
}

/**
 * Base URL resolution:
 * 1. EXPO_PUBLIC_API_URL — set this for a real backend (staging/prod).
 * 2. Dev fallback: reuse the Metro bundler's LAN IP (Constants.expoConfig.hostUri
 *    looks like "192.168.1.23:8081") and swap the port for the backend's 8090.
 *    This means a phone/simulator on the same network reaches the Mac's
 *    `localhost:8090` backend with zero manual config.
 * 3. Last resort: localhost (only works in web/simulator on the same machine).
 */
function resolveBaseUrl(): string {
	if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL

	const hostUri = Constants.expoConfig?.hostUri
	if (hostUri) {
		const host = hostUri.split(':')[0]
		return `http://${host}:8090`
	}

	return 'http://localhost:8090'
}

export const API_BASE_URL = resolveBaseUrl()

const ACCESS_TOKEN_KEY = 'kb_access_token'
const REFRESH_TOKEN_KEY = 'kb_refresh_token'

// expo-secure-store has no native implementation on web (no OS keychain there —
// its web shim is a literal `{}`), so this project's only web surface (the
// browser preview) falls back to localStorage. Real device/simulator builds
// always use SecureStore.
const isWeb = Platform.OS === 'web'

async function storageGet(key: string): Promise<string | null> {
	if (isWeb) {
		try {
			return window.localStorage.getItem(key)
		} catch {
			return null
		}
	}
	return SecureStore.getItemAsync(key)
}

async function storageSet(key: string, value: string): Promise<void> {
	if (isWeb) {
		try {
			window.localStorage.setItem(key, value)
		} catch {
			// private-mode/blocked storage — nothing we can do, session just won't persist
		}
		return
	}
	await SecureStore.setItemAsync(key, value)
}

async function storageDelete(key: string): Promise<void> {
	if (isWeb) {
		try {
			window.localStorage.removeItem(key)
		} catch {
			// ignore
		}
		return
	}
	await SecureStore.deleteItemAsync(key)
}

export const tokenStore = {
	async get() {
		const [accessToken, refreshToken] = await Promise.all([
			storageGet(ACCESS_TOKEN_KEY),
			storageGet(REFRESH_TOKEN_KEY),
		])
		return { accessToken, refreshToken }
	},
	async set(accessToken: string, refreshToken: string) {
		await Promise.all([
			storageSet(ACCESS_TOKEN_KEY, accessToken),
			storageSet(REFRESH_TOKEN_KEY, refreshToken),
		])
	},
	async clear() {
		await Promise.all([
			storageDelete(ACCESS_TOKEN_KEY),
			storageDelete(REFRESH_TOKEN_KEY),
		])
	},
}

export class ApiError extends Error {
	code: string
	field: string | null
	status: number

	constructor(status: number, body: { code?: string; message?: string; field?: string | null }) {
		super(body.message ?? `Request failed with status ${status}`)
		this.status = status
		this.code = body.code ?? 'UNKNOWN'
		this.field = body.field ?? null
	}
}

let accessTokenMemo: string | null = null
let refreshInFlight: Promise<boolean> | null = null

/** Called once at app boot after reading persisted tokens (see AuthProvider). */
export function primeAccessToken(token: string | null) {
	accessTokenMemo = token
}

/** Current access token, if any — used by the STOMP client to build its CONNECT frame. */
export function getAccessToken(): string | null {
	return accessTokenMemo
}

async function doRefresh(): Promise<boolean> {
	const { refreshToken } = await tokenStore.get()
	if (!refreshToken) return false

	try {
		const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken }),
		})
		if (!res.ok) return false
		const data = await res.json()
		accessTokenMemo = data.accessToken
		await tokenStore.set(data.accessToken, data.refreshToken)
		return true
	} catch {
		return false
	}
}

/**
 * Forces a token refresh regardless of whether the current one has actually
 * expired yet. Used by the STOMP client's `beforeConnect` hook before every
 * CONNECT attempt (including automatic reconnects) — a WS reconnect that
 * reuses a stale access token gets silently rejected by the server and just
 * retries forever with the same dead token otherwise. Shares the reactive
 * 401 path's in-flight guard so a REST call and a socket reconnect racing
 * each other coalesce into a single refresh instead of firing two.
 */
export async function ensureFreshAccessToken(): Promise<void> {
	refreshInFlight = refreshInFlight ?? doRefresh().finally(() => {
		refreshInFlight = null
	})
	await refreshInFlight
}

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	body?: unknown
	auth?: boolean // defaults to true
	idempotencyKey?: string
}

/**
 * Thin fetch wrapper: JSON in/out, Bearer auth, one automatic refresh-and-retry
 * on 401. A second 401 after refresh means the session is really dead —
 * callers (AuthProvider) should catch that and log the user out.
 *
 * `body` may be a plain object (sent as JSON) or a `FormData` (sent as-is,
 * multipart — used for the chat media upload). We never set Content-Type
 * ourselves for FormData: fetch needs to add the multipart boundary.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body, auth = true, idempotencyKey } = options
	const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

	const headers: Record<string, string> = {}
	if (!isFormData) headers['Content-Type'] = 'application/json'
	if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
	if (auth && accessTokenMemo) headers.Authorization = `Bearer ${accessTokenMemo}`

	const res = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers,
		body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
	})

	if (res.status === 401 && auth) {
		// Avoid stampeding /refresh if several requests 401 at once.
		refreshInFlight = refreshInFlight ?? doRefresh().finally(() => {
			refreshInFlight = null
		})
		const refreshed = await refreshInFlight
		if (refreshed) {
			return apiFetch<T>(path, { ...options, auth: true })
		}
		const body = await res.json().catch(() => ({}))
		throw new ApiError(401, body)
	}

	if (!res.ok) {
		const body = await res.json().catch(() => ({}))
		throw new ApiError(res.status, body)
	}

	if (res.status === 204) return undefined as T
	return res.json()
}
