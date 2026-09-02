import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Divider } from '@/components/ui/Divider'
import { Ionicons } from '@expo/vector-icons'

export default function StoreProfileScreen() {
	const { storeId } = useLocalSearchParams()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'services'>('info')

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Профиль магазина" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Store Header */}
				<View style={[styles.storeHeader, { backgroundColor: colors.surface }]}>
					<View style={[styles.logo, { backgroundColor: colors.surfaceAlt }]} />
					<View style={styles.storeInfo}>
						<Text style={[styles.storeName, { color: colors.text }]}>
							АвтоПрофи - Бишкек
						</Text>
						<View style={styles.badges}>
							<Badge variant="success" label="Проверен" />
							<Badge variant="accent" label="Надежный продавец" />
						</View>
						<View style={styles.ratingRow}>
							<StarRating rating={4.8} readonly size="small" />
							<Text style={[styles.ratingText, { color: colors.textSecondary }]}>
								4.8 (124 отзыва)
							</Text>
						</View>
					</View>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsGrid}>
					{[
						{ label: 'Отзывов', value: '124' },
						{ label: 'Сделок', value: '892' },
						{ label: 'Ответ', value: '2ч' },
					].map((stat, i) => (
						<View key={i} style={[styles.statItem, { backgroundColor: colors.surface }]}>
							<Text style={[styles.statValue, { color: colors.accent }]}>
								{stat.value}
							</Text>
							<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
								{stat.label}
							</Text>
						</View>
					))}
				</View>

				{/* Tabs */}
				<View style={styles.tabsContainer}>
					{['info', 'reviews', 'services'].map((tab) => (
						<TouchableOpacity
							key={tab}
							style={[
								styles.tab,
								activeTab === tab && [
									styles.tabActive,
									{ borderBottomColor: colors.accent },
								],
							]}
							onPress={() => setActiveTab(tab as any)}
						>
							<Text
								style={[
									styles.tabLabel,
									{
										color: activeTab === tab ? colors.accent : colors.textSecondary,
									},
								]}
							>
								{tab === 'info'
									? 'Информация'
									: tab === 'reviews'
										? 'Отзывы'
										: 'Услуги'}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<Divider />

				{/* Tab Content */}
				{activeTab === 'info' && (
					<View style={styles.tabContent}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Адреса магазинов
						</Text>
						{[1, 2].map((i) => (
							<Card key={i} variant="outlined" style={styles.addressCard}>
								<View style={styles.addressIcon}>
									<Ionicons name="location" size={20} color={colors.accent} />
								</View>
								<View style={styles.addressInfo}>
									<Text style={[styles.addressTitle, { color: colors.text }]}>
										Отделение №{i}
									</Text>
									<Text style={[styles.addressText, { color: colors.textSecondary }]}>
										ул. Ленина, дом {100 + i * 10}
									</Text>
									<Text style={[styles.workingHours, { color: colors.textTertiary }]}>
										Пн-Пт: 9:00-19:00 | Сб: 10:00-16:00
									</Text>
									<Text style={[styles.phone, { color: colors.accent }]}>
										+996 (312) 91-{20 + i}-0{i}
									</Text>
								</View>
							</Card>
						))}

						<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.four }]}>
							О магазине
						</Text>
						<Text style={[styles.description, { color: colors.textSecondary }]}>
							АвтоПрофи - сеть автомагазинов Кыргызстана специализирующаяся на продаже оригинальных запчастей и аксессуаров для всех основных марок автомобилей.
						</Text>
					</View>
				)}

				{activeTab === 'reviews' && (
					<View style={styles.tabContent}>
						{[1, 2, 3].map((i) => (
							<Card key={i} variant="outlined" style={styles.reviewCard}>
								<View style={styles.reviewHeader}>
									<View>
										<Text style={[styles.reviewAuthor, { color: colors.text }]}>
											Ильяс К.
										</Text>
										<StarRating rating={5} readonly size="small" />
									</View>
									<Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
										2 дня назад
									</Text>
								</View>
								<Text style={[styles.reviewText, { color: colors.textSecondary }]}>
									Отличный магазин! Быстрая доставка, оригинальные товары. Рекомендую!
								</Text>
							</Card>
						))}
					</View>
				)}

				{activeTab === 'services' && (
					<View style={styles.tabContent}>
						{['Диагностика', 'Замена масла', 'Шиномонтаж', 'Техническое обслуживание'].map((service, i) => (
							<Card key={i} variant="outlined" style={styles.serviceCard}>
								<Text style={[styles.serviceTitle, { color: colors.text }]}>
									{service}
								</Text>
								<Text style={[styles.servicePrice, { color: colors.accent }]}>
									от {5000 + i * 2000} сом
								</Text>
							</Card>
						))}
					</View>
				)}

				<Button label="Написать сообщение" style={styles.messageBtn} />
				<View style={{ height: Spacing.four }} />
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	storeHeader: {
		padding: Spacing.four,
		flexDirection: 'row',
		gap: Spacing.three,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 12,
	},
	storeInfo: {
		flex: 1,
	},
	storeName: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	badges: {
		flexDirection: 'row',
		gap: Spacing.one,
		marginBottom: Spacing.two,
		flexWrap: 'wrap',
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	ratingText: {
		fontSize: 12,
		fontWeight: '600',
	},
	statsGrid: {
		flexDirection: 'row',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		gap: Spacing.two,
	},
	statItem: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderRadius: 12,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '600',
	},
	tabsContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#333',
		paddingHorizontal: Spacing.four,
	},
	tab: {
		flex: 1,
		paddingVertical: Spacing.three,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	tabActive: {
		borderBottomWidth: 2,
	},
	tabLabel: {
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
	tabContent: {
		padding: Spacing.four,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	addressCard: {
		flexDirection: 'row',
		gap: Spacing.three,
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	addressIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addressInfo: {
		flex: 1,
	},
	addressTitle: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	addressText: {
		fontSize: 13,
		marginBottom: Spacing.one,
	},
	workingHours: {
		fontSize: 12,
		marginBottom: Spacing.one,
	},
	phone: {
		fontSize: 13,
		fontWeight: '600',
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
	},
	reviewCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	reviewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: Spacing.two,
	},
	reviewAuthor: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	reviewDate: {
		fontSize: 12,
	},
	reviewText: {
		fontSize: 13,
		lineHeight: 18,
	},
	serviceCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	serviceTitle: {
		fontSize: 14,
		fontWeight: '600',
	},
	servicePrice: {
		fontSize: 14,
		fontWeight: '700',
	},
	messageBtn: {
		marginHorizontal: Spacing.four,
		marginBottom: Spacing.four,
	},
})
