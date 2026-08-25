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
					animationEnabled: false,
				}}
			/>
			<Stack.Screen
				name="request/[id]"
				options={{
					animationEnabled: true,
					presentation: 'card',
				}}
			/>
		</Stack>
	)
}
