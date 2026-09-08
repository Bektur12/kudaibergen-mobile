import React from 'react'
import { useRouter } from 'expo-router'
import MessagesScreen from '@/screens/buyer/MessagesScreen'

export default function BuyerMessagesScreen() {
	const router = useRouter()

	const handleOpenChat = (id: number) => {
		router.push(`/(buyer)/chat/${id}`)
	}

	return <MessagesScreen onOpenChat={handleOpenChat} />
}
