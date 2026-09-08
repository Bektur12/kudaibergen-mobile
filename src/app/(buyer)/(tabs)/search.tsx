import React from 'react'
import { useRouter } from 'expo-router'
import SearchScreen from '@/screens/buyer/SearchScreen'

export default function BuyerSearchScreen() {
	const router = useRouter()

	const handleNavigate = (tab: string) => {
		router.back()
	}

	return <SearchScreen onNavigate={handleNavigate} />
}
