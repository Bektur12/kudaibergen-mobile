import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors, Spacing } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'

export default function BuyerLayout() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
					borderTopWidth: 1,
					paddingBottom: 8,
					paddingTop: 8,
					height: 64,
				},
				tabBarActiveTintColor: colors.accent,
				tabBarInactiveTintColor: colors.textTertiary,
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: '600',
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Запросы',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="list-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="messages"
				options={{
					title: 'Чат',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbubble-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
