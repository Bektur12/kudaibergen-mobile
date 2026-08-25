import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { useColorScheme } from 'react-native'

interface StarRatingProps {
	rating: number
	maxRating?: number
	onRatingChange?: (rating: number) => void
	size?: 'small' | 'medium' | 'large'
	readonly?: boolean
	showLabel?: boolean
}

export function StarRating({
	rating,
	maxRating = 5,
	onRatingChange,
	size = 'medium',
	readonly = true,
	showLabel = false,
}: StarRatingProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const sizeMap = {
		small: 16,
		medium: 20,
		large: 24,
	}

	const starSize = sizeMap[size]

	return (
		<View style={styles.container}>
			<View style={styles.stars}>
				{Array.from({ length: maxRating }).map((_, i) => (
					<TouchableOpacity
						key={i}
						onPress={() => !readonly && onRatingChange?.(i + 1)}
						disabled={readonly}
						style={styles.star}
						activeOpacity={0.7}
					>
						<Ionicons
							name={i < rating ? 'star' : 'star-outline'}
							size={starSize}
							color={colors.accent}
						/>
					</TouchableOpacity>
				))}
			</View>
			{showLabel && (
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					{rating.toFixed(1)}
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	stars: {
		flexDirection: 'row',
		gap: Spacing.half,
	},
	star: {
		padding: Spacing.one,
	},
	label: {
		fontSize: 12,
		fontWeight: '600',
		marginLeft: Spacing.one,
	},
})
