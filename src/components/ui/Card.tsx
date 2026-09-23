import React from 'react'
import {
	View,
	StyleSheet,
	useColorScheme,
	ViewStyle,
	TouchableOpacity,
} from 'react-native'
import { Colors, Spacing, Layout, ShadowSize } from '@/constants/theme'

interface CardProps {
	children: React.ReactNode
	variant?: 'default' | 'outlined' | 'accent' | 'elevated'
	style?: ViewStyle
	onPress?: () => void
	disabled?: boolean
}

export function Card({
	children,
	variant = 'default',
	style,
	onPress,
	disabled = false,
}: CardProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const variants = {
		default: {
			backgroundColor: colors.surface,
			borderWidth: 0,
		},
		outlined: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.border,
		},
		accent: {
			backgroundColor: colors.surface,
			borderWidth: 2,
			borderColor: colors.accent,
		},
		elevated: {
			backgroundColor: colors.surface,
			borderWidth: 0,
			...ShadowSize.small,
		},
	}

	const Container = onPress ? TouchableOpacity : View

	return (
		<Container
			style={[
				styles.card,
				variants[variant],
				style,
			]}
			onPress={onPress}
			disabled={disabled || !onPress}
			activeOpacity={0.8}
		>
			{children}
		</Container>
	)
}

const styles = StyleSheet.create({
	card: {
		borderRadius: Layout.cardRadius,
		padding: Spacing.three,
		overflow: 'hidden',
	},
})
