import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
	user: User | null
	loading: boolean
	login: (email: string, password: string, role: 'buyer' | 'seller') => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Simulate checking stored auth state
		setLoading(false)
	}, [])

	const login = async (email: string, password: string, role: 'buyer' | 'seller') => {
		// Mock login
		const newUser: User = {
			id: `user_${Date.now()}`,
			name: email.split('@')[0],
			email,
			role,
		}
		setUser(newUser)
	}

	const logout = () => {
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
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
