import React, { useState } from 'react'
import {
	TextInput,
	Text,
	StyleSheet,
	useColorScheme,
	View,
	ViewStyle,
	TextInputProps,
} from 'react-native'
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme'

interface InputProps extends Omit<TextInputProps, 'style'> {
	value: string
	onChangeText: (text: string) => void
	label?: string
	error?: string
	icon?: React.ReactNode
	rightIcon?: React.ReactNode
	style?: ViewStyle
	variant?: 'default' | 'search'
}

export function Input({
	placeholder,
	value,
	onChangeText,
	label,
	error,
	icon,
	rightIcon,
	style,
	variant = 'default',
	editable = true,
	multiline = false,
	numberOfLines,
	...props
}: InputProps) {
	const [isFocused, setIsFocused] = useState(false)
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const height = multiline
		? (numberOfLines ?? 3) * Typography.body.lineHeight + Spacing.three * 2
		: 56

	const borderColor = error
		? colors.error
		: isFocused
			? colors.accent
			: colors.border

	return (
		<View style={style}>
			{label && (
				<Text style={[styles.label, { color: colors.text }]}>
					{label}
				</Text>
			)}
			<View
				style={[
					styles.container,
					{
						backgroundColor: editable ? colors.surface : colors.surfaceAlt,
						borderColor,
						minHeight: height,
					},
				]}
			>
				{icon && (
					<View style={styles.icon}>
						{icon}
					</View>
				)}
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={colors.textTertiary}
					value={value}
					onChangeText={onChangeText}
					multiline={multiline}
					numberOfLines={numberOfLines}
					editable={editable}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					style={[
						styles.input,
						{
							color: colors.text,
							fontSize: Typography.body.fontSize,
						},
					]}
					{...props}
				/>
				{rightIcon && (
					<View style={styles.rightIcon}>
						{rightIcon}
					</View>
				)}
			</View>
			{error && (
				<Text style={[styles.error, { color: colors.error }]}>
					{error}
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: BorderRadius.medium,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
	},
	input: {
		flex: 1,
		fontWeight: '500',
		paddingVertical: Spacing.three,
	},
	icon: {
		marginRight: Spacing.two,
	},
	rightIcon: {
		marginLeft: Spacing.two,
	},
	label: {
		fontSize: Typography.label.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.two,
		textTransform: 'uppercase',
	},
	error: {
		fontSize: Typography.secondary.fontSize,
		fontWeight: '500',
		marginTop: Spacing.one,
	},
})
