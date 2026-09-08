import React from 'react'
import { useRouter } from 'expo-router'
import MessagesScreen from '@/screens/buyer/MessagesScreen'

export default function SellerMessagesScreen() {
  const router = useRouter()

  const handleOpenChat = (id: number) => {
    router.push({
      pathname: '/(seller)/chat/[id]' as any,
      params: { id: id.toString() },
    })
  }

  return <MessagesScreen onOpenChat={handleOpenChat} />
}
