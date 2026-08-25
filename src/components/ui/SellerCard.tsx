import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	ViewStyle,
} from 'react-native'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { Card } from './Card'
import { StarRating } from './StarRating'

interface SellerCardProps {
	name: string
	rating?: number
	reviewCount?: number
	responseTime?: string
	distance?: string
	onPress?: () => void
	style?: ViewStyle
}

export function SellerCard({
	name,
	rating = 4.5,
	reviewCount = 24,
	responseTime = '< 1 часа',
	distance = '5 км',
	onPress,
	style,
}: SellerCardProps) {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	return (
		<Card
			variant="outlined"
			style={[styles.card, style]}
			onPress={onPress}
		>
			<View style={styles.header}>
				<View style={[styles.avatar, { backgroundColor: colors.accent }]}>
					<Text style={styles.avatarText}>
						{name.charAt(0).toUpperCase()}
					</Text>
				</View>

				<View style={styles.info}>
					<Text style={[styles.name, { color: colors.text }]}>
						{name}
					</Text>
					<View style={styles.ratingRow}>
						<StarRating rating={Math.floor(rating)} readonly size="small" />
						<Text style={[styles.ratingText, { color: colors.textSecondary }]}>
							{rating} ({reviewCount})
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={[styles.stat, { color: colors.textTertiary }]}>
					⏱ {responseTime}
				</Text>
				<Text style={[styles.stat, { color: colors.textTertiary }]}>
					📍 {distance}
				</Text>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	card: {
		marginBottom: Spacing.three,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Spacing.three,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: BorderRadius.large,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: Spacing.three,
	},
	avatarText: {
		color: '#000000',
		fontSize: 18,
		fontWeight: '700',
	},
	info: {
		flex: 1,
	},
	name: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	ratingText: {
		fontSize: 12,
		fontWeight: '500',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.1)',
		paddingTop: Spacing.two,
	},
	stat: {
		fontSize: 12,
		fontWeight: '500',
	},
})
