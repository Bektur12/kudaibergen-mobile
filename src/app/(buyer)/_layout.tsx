import { Stack } from 'expo-router'

export default function BuyerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      <Stack.Screen
        name="create-request"
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="request/[id]"
        options={{ presentation: 'card' }}
      />
      <Stack.Screen name="chat" />
    </Stack>
  )
}
