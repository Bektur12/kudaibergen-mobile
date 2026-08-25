import React from 'react'
import {
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ViewStyle,
} from 'react-native'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'

interface CheckboxProps {
	checked: boolean
	onToggle: (checked: boolean) => void
	label?: string
	style?: ViewStyle
	disabled?: boolean
}

export function Checkbox({
	checked,
	onToggle,
	label,
	style,
	disabled = false,
}: CheckboxProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			onPress={() => !disabled && onToggle(!checked)}
			disabled={disabled}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.checkbox,
					{
						backgroundColor: checked ? colors.accent : colors.surface,
						borderColor: checked ? colors.accent : colors.border,
					},
				]}
			>
				{checked && (
					<Ionicons
						name="checkmark"
						size={14}
						color={colors.background}
						style={styles.icon}
					/>
				)}
			</View>
			{label && (
				<Text
					style={[
						styles.label,
						{
							color: disabled ? colors.textTertiary : colors.text,
						},
					]}
				>
					{label}
				</Text>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: BorderRadius.small,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		fontWeight: '700',
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		flex: 1,
	},
})
