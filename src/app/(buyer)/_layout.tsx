import { Stack } from 'expo-router'

export default function BuyerLayout() {
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
				name="create-request"
				options={{
					animationEnabled: true,
					presentation: 'card',
				}}
			/>
			<Stack.Screen
				name="request/[id]"
				options={{
					animationEnabled: true,
					presentation: 'card',
				}}
			/>
			<Stack.Screen
				name="chat"
				options={{
					animationEnabled: true,
				}}
			/>
		</Stack>
	)
}
