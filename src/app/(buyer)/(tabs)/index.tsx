import React from 'react'
import { useRouter } from 'expo-router'
import HomeScreen from '@/screens/buyer/HomeScreen'

export default function BuyerHome() {
	const router = useRouter()

	const handleNavigate = (tab: string) => {
		switch(tab) {
			case 'home':
				router.push('/(buyer)/(tabs)')
				break
			case 'search':
				router.push('/(buyer)/(tabs)/search' as any)
				break
			case 'map':
				router.push('/(buyer)/(tabs)/map' as any)
				break
			case 'messages':
				router.push('/(buyer)/(tabs)/messages' as any)
				break
			case 'profile':
				router.push('/(buyer)/(tabs)/profile' as any)
				break
		}
	}

	const handleOpenChat = () => {
		router.push({
			pathname: '/(buyer)/chat/[id]' as any,
			params: { id: '1' }
		})
	}

	return <HomeScreen onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
}
