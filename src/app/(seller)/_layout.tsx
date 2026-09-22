import { Stack } from 'expo-router'

export default function SellerLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="(tabs)"
				options={{
					animation: 'none',
				}}
			/>
			<Stack.Screen
				name="request/[id]"
				options={{
					presentation: 'card',
				}}
			/>
		</Stack>
	)
}
