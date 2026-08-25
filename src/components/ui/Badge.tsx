import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ViewStyle,
} from 'react-native'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'

interface BadgeProps {
	label: string
	variant?: 'accent' | 'success' | 'warning' | 'error' | 'gray' | 'outline'
	size?: 'small' | 'medium' | 'large'
	style?: ViewStyle
}

export function Badge({
	label,
	variant = 'accent',
	size = 'small',
	style,
}: BadgeProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const variants = {
		accent: { bg: colors.accent, text: colors.background },
		success: { bg: colors.success, text: '#FFFFFF' },
		warning: { bg: colors.warning, text: '#FFFFFF' },
		error: { bg: colors.error, text: '#FFFFFF' },
		gray: { bg: colors.surfaceAlt, text: colors.text },
		outline: { bg: 'transparent', text: colors.text, border: colors.border },
	}

	const sizes = {
		small: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, fontSize: 11 },
		medium: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, fontSize: 12 },
		large: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, fontSize: 13 },
	}

	const v = variants[variant]
	const s = sizes[size]

	return (
		<View
			style={[
				styles.badge,
				{
					backgroundColor: v.bg,
					paddingHorizontal: s.paddingHorizontal,
					paddingVertical: s.paddingVertical,
					borderWidth: variant === 'outline' ? 1 : 0,
					borderColor: v.border || 'transparent',
				},
				style,
			]}
		>
			<Text style={[styles.text, { color: v.text, fontSize: s.fontSize }]}>
				{label}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	badge: {
		borderRadius: BorderRadius.full,
		alignSelf: 'flex-start',
	},
	text: {
		fontWeight: '700',
		lineHeight: 16,
	},
})
