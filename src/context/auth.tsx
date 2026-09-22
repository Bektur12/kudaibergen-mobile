import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { User, UserRole } from '@/types'
import { primeAccessToken, tokenStore, ApiError } from '@/lib/api'
import {
	requestCode as apiRequestCode,
	verifyCode as apiVerifyCode,
	registerRole as apiRegisterRole,
	getMe,
	type ApiRole,
	type RegisterRolePayload,
	type RequestCodeResponse,
} from '@/lib/auth-api'
import {
	registerForPushNotificationsAsync,
	syncDeviceToken,
	forgetDeviceToken,
} from '@/lib/notifications'
import { connectChatSocket, disconnectChatSocket } from '@/lib/chat-socket'

function roleFromApi(role: ApiRole): UserRole {
	return role === 'SELLER' ? 'seller' : 'buyer'
}

function userFromMe(me: { id: number; phone: string; name: string | null; role: ApiRole; city: string | null }): User {
	return {
		id: String(me.id),
		name: me.name ?? me.phone,
		email: '',
		phone: me.phone,
		role: roleFromApi(me.role),
		city: me.city ?? undefined,
	}
}

interface VerifyResult {
	isNewUser: boolean
	role: UserRole
}

interface AuthContextType {
	user: User | null
	loading: boolean
	/** Step 1: send an SMS code to a +996 number. */
	requestCode: (phone: string) => Promise<RequestCodeResponse>
	/** Step 2: check the code. If `isNewUser`, caller must follow up with `finishRegistration`. */
	verifyCode: (phone: string, code: string) => Promise<VerifyResult>
	/** Step 3 (new users only): pick a role and fill in name/store details. */
	finishRegistration: (payload: RegisterRolePayload) => Promise<void>
	logout: () => Promise<void>
	/** Re-fetches /me — call after PATCH /me so the header/profile UI reflects the save. */
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function registerPushToken() {
	const result = await registerForPushNotificationsAsync()
	if (result.ok) {
		if (__DEV__) console.log('[push] registered token:', result.token)
		await syncDeviceToken(result.token)
		return result.token
	}
	if (__DEV__) console.log('[push] registration skipped:', result.reason)
	return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const pushTokenRef = useRef<string | null>(null)

	// Restore session on boot: read persisted tokens, prime the in-memory
	// access token for apiFetch, then hydrate the user from /me. A dead
	// refresh token (or no tokens at all) just leaves the user logged out.
	useEffect(() => {
		let cancelled = false
		async function restore() {
			const { accessToken, refreshToken } = await tokenStore.get()
			if (!accessToken || !refreshToken) {
				setLoading(false)
				return
			}
			primeAccessToken(accessToken)
			try {
				const me = await getMe()
				if (!cancelled) {
					setUser(userFromMe(me))
					connectChatSocket()
					// Re-sync the push token on every app boot, not just fresh
					// login/registration — otherwise reopening an already-signed-in
					// session (the common case) never registers a device token with
					// the backend at all, and pushes silently never arrive.
					pushTokenRef.current = await registerPushToken()
				}
			} catch {
				await tokenStore.clear()
				primeAccessToken(null)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		restore()
		return () => {
			cancelled = true
		}
	}, [])

	const requestCode = async (phone: string) => apiRequestCode(phone)

	const verifyCode = async (phone: string, code: string): Promise<VerifyResult> => {
		const res = await apiVerifyCode(phone, code)
		primeAccessToken(res.accessToken)
		await tokenStore.set(res.accessToken, res.refreshToken)

		if (!res.isNewUser) {
			const me = await getMe()
			setUser(userFromMe(me))
			connectChatSocket()
			pushTokenRef.current = await registerPushToken()
		}

		return { isNewUser: res.isNewUser, role: roleFromApi(res.role) }
	}

	const finishRegistration = async (payload: RegisterRolePayload) => {
		const res = await apiRegisterRole(payload)
		primeAccessToken(res.accessToken)
		await tokenStore.set(res.accessToken, res.refreshToken)
		const me = await getMe()
		setUser(userFromMe(me))
		connectChatSocket()
		pushTokenRef.current = await registerPushToken()
	}

	const refreshUser = async () => {
		const me = await getMe()
		setUser(userFromMe(me))
	}

	const logout = async () => {
		disconnectChatSocket()
		if (pushTokenRef.current) {
			await forgetDeviceToken(pushTokenRef.current)
			pushTokenRef.current = null
		}
		await tokenStore.clear()
		primeAccessToken(null)
		setUser(null)
	}

	return (
		<AuthContext.Provider
			value={{ user, loading, requestCode, verifyCode, finishRegistration, logout, refreshUser }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

export { ApiError }
