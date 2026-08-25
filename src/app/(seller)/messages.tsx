import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'

export default function SellerMessagesScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Чат" />
			<View style={styles.content}>
				<Text style={[styles.placeholder, { color: colors.textSecondary }]}>
					Нет сообщений
				</Text>
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
	placeholder: {
		fontSize: 16,
		fontWeight: '500',
	},
})
