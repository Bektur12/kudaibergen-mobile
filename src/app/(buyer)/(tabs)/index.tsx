import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'

export default function BuyerHome() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			{/* Header */}
			<View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
				<View style={styles.headerLeft}>
					<Ionicons name="location-outline" size={20} color={colors.accent} />
					<Text style={[styles.city, { color: colors.text }]}>Бишкек</Text>
				</View>
				<Ionicons name="notifications-outline" size={24} color={colors.text} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Search Bar */}
				<TouchableOpacity
					style={[styles.searchBar, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
					onPress={() => router.push('/(buyer)/search')}
				>
					<Ionicons name="search" size={20} color={colors.textSecondary} />
					<Text style={[styles.searchText, { color: colors.textTertiary }]}>
						Авто, запчасть, услуга...
					</Text>
				</TouchableOpacity>

				{/* My Vehicle */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
						Мой автомобиль
					</Text>
					<Card variant="outlined" style={styles.vehicleCard}>
						<View style={styles.vehicleContent}>
							<View>
								<Ionicons name="car" size={32} color={colors.accent} />
								<Text style={[styles.vehicleModel, { color: colors.text }]}>
									Toyota Camry 2020
								</Text>
							</View>
							<Button
								title="Найти запчасть"
								variant="primary"
								size="small"
								onPress={() => router.push('/(buyer)/search?category=parts')}
							/>
						</View>
					</Card>
				</View>

				{/* Quick Categories */}
				<View style={styles.section}>
					<View style={styles.categoryGrid}>
						{/* Cars */}
						<TouchableOpacity
							style={[styles.categoryButton, { backgroundColor: colors.surfaceAlt }]}
							onPress={() => router.push('/(buyer)/search?category=cars')}
						>
							<Ionicons name="car" size={28} color={colors.accent} />
							<Text style={[styles.categoryLabel, { color: colors.text }]}>
								🚗 Авто
							</Text>
						</TouchableOpacity>

						{/* Parts */}
						<TouchableOpacity
							style={[styles.categoryButton, { backgroundColor: colors.surfaceAlt }]}
							onPress={() => router.push('/(buyer)/search?category=parts')}
						>
							<Ionicons name="settings" size={28} color={colors.warning} />
							<Text style={[styles.categoryLabel, { color: colors.text }]}>
								🔧 Запчасти
							</Text>
						</TouchableOpacity>

						{/* Services */}
						<TouchableOpacity
							style={[styles.categoryButton, { backgroundColor: colors.surfaceAlt }]}
							onPress={() => router.push('/(buyer)/search?category=services')}
						>
							<Ionicons name="hammer" size={28} color={colors.success} />
							<Text style={[styles.categoryLabel, { color: colors.text }]}>
								🔧 Услуги
							</Text>
						</TouchableOpacity>

						{/* Map */}
						<TouchableOpacity
							style={[styles.categoryButton, { backgroundColor: colors.surfaceAlt }]}
							onPress={() => router.push('/(buyer)/map')}
						>
							<Ionicons name="map" size={28} color={colors.warning} />
							<Text style={[styles.categoryLabel, { color: colors.text }]}>
								📍 Рядом
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Новые объявления */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Новые объявления
						</Text>
						<TouchableOpacity onPress={() => router.push('/(buyer)/search')}>
							<Text style={[styles.seeAll, { color: colors.accent }]}>
								Все →
							</Text>
						</TouchableOpacity>
					</View>

					{/* Sample listings */}
					{[1, 2].map((i) => (
						<Card key={i} variant="outlined" style={styles.listingCard}>
							<View style={styles.listingImage} />
							<View style={styles.listingInfo}>
								<Text style={[styles.listingTitle, { color: colors.text }]}>
									Toyota Camry 70
								</Text>
								<Text style={[styles.listingMeta, { color: colors.textSecondary }]}>
									2020 • 2.5 • AT
								</Text>
								<Text style={[styles.listingPrice, { color: colors.accent }]}>
									$23 500
								</Text>
								<View style={styles.listingFooter}>
									<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
										<Ionicons name="star" size={14} color={colors.accent} />
										<Text style={[styles.rating, { color: colors.textSecondary }]}>
											4.8
										</Text>
									</View>
									<Text style={[styles.location, { color: colors.textTertiary }]}>
										📍 Бишкек
									</Text>
								</View>
							</View>
						</Card>
					))}
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
	},
	city: {
		fontSize: 16,
		fontWeight: '700',
	},
	content: {
		flex: 1,
		padding: Spacing.four,
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: 24,
		borderWidth: 1,
		marginBottom: Spacing.four,
		gap: Spacing.two,
	},
	searchText: {
		fontSize: 14,
		fontWeight: '500',
	},
	section: {
		marginBottom: Spacing.five,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Spacing.three,
	},
	sectionTitle: {
		fontSize: Typography.secondary.fontSize,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	seeAll: {
		fontSize: 14,
		fontWeight: '600',
	},
	vehicleCard: {
		padding: Spacing.three,
	},
	vehicleContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	vehicleModel: {
		fontSize: 16,
		fontWeight: '700',
		marginTop: Spacing.two,
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.two,
		justifyContent: 'space-between',
	},
	categoryButton: {
		width: '48%',
		paddingVertical: Spacing.four,
		paddingHorizontal: Spacing.three,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		gap: Spacing.two,
	},
	categoryLabel: {
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'center',
	},
	listingCard: {
		marginBottom: Spacing.three,
		flexDirection: 'row',
		gap: Spacing.three,
	},
	listingImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
		backgroundColor: '#ccc',
	},
	listingInfo: {
		flex: 1,
		justifyContent: 'space-between',
	},
	listingTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	listingMeta: {
		fontSize: 13,
		marginTop: Spacing.one,
	},
	listingPrice: {
		fontSize: 16,
		fontWeight: '700',
		marginTop: Spacing.one,
	},
	listingFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: Spacing.two,
	},
	rating: {
		fontSize: 12,
		fontWeight: '600',
	},
	location: {
		fontSize: 12,
	},
})
