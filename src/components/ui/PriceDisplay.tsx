import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Colors, Typography } from '@/constants/theme'
import { useColorScheme } from 'react-native'

interface PriceDisplayProps {
	amount: number | string
	currency?: 'KZT' | 'USD'
	size?: 'small' | 'medium' | 'large'
	showLabel?: boolean
}

export function PriceDisplay({
	amount,
	currency = 'KZT',
	size = 'medium',
	showLabel = false,
}: PriceDisplayProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const sizeMap = {
		small: {
			fontSize: 14,
			fontWeight: '700' as const,
		},
		medium: {
			fontSize: 18,
			fontWeight: '800' as const,
		},
		large: {
			fontSize: Typography.price.fontSize,
			fontWeight: '800' as const,
		},
	}

	const style = sizeMap[size]
	const currencySymbol = currency === 'USD' ? '$' : '₸'

	const formattedAmount = typeof amount === 'number'
		? new Intl.NumberFormat('ru-KZ').format(amount)
		: amount

	return (
		<View style={styles.container}>
			<Text
				style={[
					styles.price,
					{
						fontSize: style.fontSize,
						fontWeight: style.fontWeight,
						color: colors.accent,
					},
				]}
			>
				{formattedAmount}
				<Text style={styles.currency}>{currencySymbol}</Text>
			</Text>
			{showLabel && (
				<Text style={[styles.label, { color: colors.textTertiary }]}>
					{currency}
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
	},
	price: {
		lineHeight: 28,
	},
	currency: {
		fontSize: 14,
		marginLeft: 2,
	},
	label: {
		fontSize: 11,
		fontWeight: '600',
		marginTop: 2,
	},
})
