import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants/theme'

export default function MapScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Text style={[styles.title, { color: colors.text }]}>Карта продавцов</Text>
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
