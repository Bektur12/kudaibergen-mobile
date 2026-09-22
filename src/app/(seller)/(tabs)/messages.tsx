import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import MessagesScreen from '@/screens/buyer/MessagesScreen'
import { listChats, type ChatSummary } from '@/lib/chat-api'

export default function SellerMessagesScreen() {
  const router = useRouter()
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await listChats()
        if (!cancelled) setChats(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setChats(await listChats())
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleOpenChat = (chat: ChatSummary) => {
    router.push({
      pathname: '/(seller)/chat/[id]',
      // The API doesn't expose a buyer name/phone on ChatSummary yet — buyerId
      // is all we have to identify the other side. Swap this the day /chats
      // (or a /me/buyers lookup) starts returning one.
      params: {
        id: chat.id.toString(),
        name: `Покупатель #${chat.buyerId}`,
        online: String(chat.otherOnline),
        lastSeenAt: chat.otherLastSeenAt ?? '',
      },
    })
  }

  return (
    <MessagesScreen
      chats={chats}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onOpenChat={handleOpenChat}
      titleFor={(chat) => `Покупатель #${chat.buyerId}`}
    />
  )
}
