import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ChatDetailScreen from '@/screens/ChatDetailScreen'

export default function SellerChatDetail() {
	const router = useRouter()
	const { id, name, online, lastSeenAt } = useLocalSearchParams<{
		id: string
		name?: string
		online?: string
		lastSeenAt?: string
	}>()

	const handleBack = () => {
		router.back()
	}

	return (
		<ChatDetailScreen
			chatId={Number(id)}
			chatName={name ?? 'Чат'}
			initialOnline={online === 'true'}
			initialLastSeenAt={lastSeenAt ?? null}
			onBack={handleBack}
		/>
	)
}
