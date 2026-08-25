import React from 'react'
import { View, StyleSheet, useColorScheme, ViewStyle } from 'react-native'
import { Colors, Spacing } from '@/constants/theme'

interface DividerProps {
	variant?: 'horizontal' | 'vertical'
	style?: ViewStyle
	thickness?: number
}

export function Divider({
	variant = 'horizontal',
	style,
	thickness = 1,
}: DividerProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	if (variant === 'vertical') {
		return (
			<View
				style={[
					styles.vertical,
					{
						backgroundColor: colors.border,
						width: thickness,
					},
					style,
				]}
			/>
		)
	}

	return (
		<View
			style={[
				styles.horizontal,
				{
					backgroundColor: colors.border,
					height: thickness,
				},
				style,
			]}
		/>
	)
}

const styles = StyleSheet.create({
	horizontal: {
		width: '100%',
	},
	vertical: {
		height: '100%',
	},
})
