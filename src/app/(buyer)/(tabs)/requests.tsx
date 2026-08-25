import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants/theme'

export default function RequestsScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Text style={[styles.title, { color: colors.text }]}>Мои запросы</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.four,
	},
	title: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
	},
})
