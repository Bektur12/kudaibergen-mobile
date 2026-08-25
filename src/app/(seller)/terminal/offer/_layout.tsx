import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/theme'

export default function OfferLayout() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: colors.background },
			}}
		/>
	)
}
