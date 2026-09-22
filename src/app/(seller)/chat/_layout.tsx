import { Stack } from 'expo-router'

export default function SellerChatLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="[id]" />
		</Stack>
	)
}
