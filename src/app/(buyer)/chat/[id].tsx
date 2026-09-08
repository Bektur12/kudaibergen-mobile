import React from 'react'
import { useRouter } from 'expo-router'
import ChatDetailScreen from '@/screens/ChatDetailScreen'

export default function ChatDetail() {
	const router = useRouter()

	const handleBack = () => {
		router.back()
	}

	return <ChatDetailScreen onBack={handleBack} />
}
