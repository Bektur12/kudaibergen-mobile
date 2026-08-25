import React from 'react'
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	useColorScheme,
	ViewStyle,
	TextStyle,
} from 'react-native'
import { Colors, Spacing, BorderRadius, Typography, ShadowSize } from '@/constants/theme'

interface ButtonProps {
	onPress: () => void
	title: string
	variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
	size?: 'small' | 'medium' | 'large'
	disabled?: boolean
	style?: ViewStyle
	textStyle?: TextStyle
	icon?: React.ReactNode
}

export function Button({
	onPress,
	title,
	variant = 'primary',
	size = 'large',
	disabled = false,
	style,
	textStyle,
	icon,
}: ButtonProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const sizeStyles = {
		small: { height: 40, paddingHorizontal: Spacing.three },
		medium: { height: 48, paddingHorizontal: Spacing.four },
		large: { height: 56, paddingHorizontal: Spacing.four },
	}

	const variants = {
		primary: {
			backgroundColor: disabled ? colors.disabled : colors.accent,
			borderWidth: 0,
			...(variant === 'primary' && !disabled ? ShadowSize.medium : {}),
		},
		secondary: {
			backgroundColor: colors.surfaceAlt,
			borderWidth: 2,
			borderColor: colors.border,
		},
		ghost: {
			backgroundColor: 'transparent',
			borderWidth: 2,
			borderColor: colors.border,
		},
		destructive: {
			backgroundColor: colors.error,
			borderWidth: 0,
		},
	}

	const textColor = {
		primary: colors.background,
		secondary: colors.text,
		ghost: colors.accent,
		destructive: '#FFFFFF',
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
			style={[
				styles.button,
				sizeStyles[size],
				variants[variant],
				style,
			]}
		>
			{icon && <>{icon}</>}
			<Text
				style={[
					styles.text,
					{ color: textColor[variant] },
					textStyle,
				]}
			>
				{title}
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: BorderRadius.large,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		gap: Spacing.two,
	},
	text: {
		fontWeight: '700',
		fontSize: 17,
	},
})
