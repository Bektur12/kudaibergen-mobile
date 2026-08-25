import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/auth'

export default function SellerProfileScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const { user, logout } = useAuth()
	const router = useRouter()

	const handleLogout = () => {
		logout()
		router.replace('/auth/login')
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Профиль" />
			<View style={styles.content}>
				<Text style={[styles.name, { color: colors.text }]}>
					{user?.name || 'Anonymous'}
				</Text>
				<Text style={[styles.email, { color: colors.textSecondary }]}>
					{user?.email}
				</Text>

				<Button
					title="Выход"
					variant="destructive"
					size="large"
					onPress={handleLogout}
					style={styles.logoutButton}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: Spacing.four,
	},
	name: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	email: {
		fontSize: 14,
		marginBottom: Spacing.five,
	},
	logoutButton: {
		marginTop: Spacing.four,
		width: '100%',
	},
})
