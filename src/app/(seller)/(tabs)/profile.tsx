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
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Divider } from '@/components/ui/Divider'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/auth'

export default function SellerProfileScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const { user, logout } = useAuth()
	const router = useRouter()

	const handleLogout = () => {
		logout()
		router.replace('/auth/login')
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Профиль" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Store Info Card */}
				<View style={[styles.storeCard, { backgroundColor: colors.surface }]}>
					<View style={[styles.logo, { backgroundColor: colors.surfaceAlt }]} />
					<View style={styles.storeInfo}>
						<Text style={[styles.storeName, { color: colors.text }]}>
							АвтоПрофи
						</Text>
						<Text style={[styles.storeType, { color: colors.textSecondary }]}>
							Автомагазин
						</Text>
						<View style={styles.badges}>
							<Badge variant="success" label="Проверен" size="small" />
							<Badge variant="accent" label="Активен" size="small" />
						</View>
						<View style={styles.ratingRow}>
							<StarRating rating={4.8} readonly size="small" />
							<Text style={[styles.ratingText, { color: colors.textSecondary }]}>
								4.8 (124)
							</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.editBtn}>
						<Ionicons name="pencil" size={20} color={colors.accent} />
					</TouchableOpacity>
				</View>

				{/* Store Stats */}
				<View style={styles.statsRow}>
					{[
						{ label: 'Товаров', value: '23' },
						{ label: 'Продаж', value: '892' },
						{ label: 'Ответ', value: '2ч' },
					].map((stat) => (
						<View key={stat.label} style={styles.statItem}>
							<Text style={[styles.statValue, { color: colors.accent }]}>
								{stat.value}
							</Text>
							<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
								{stat.label}
							</Text>
						</View>
					))}
				</View>

				{/* Store Branches */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Филиалы
						</Text>
						<TouchableOpacity>
							<Ionicons name="add-circle-outline" size={24} color={colors.accent} />
						</TouchableOpacity>
					</View>

					{[1, 2].map((i) => (
						<Card key={i} variant="outlined" style={styles.branchCard}>
							<View style={styles.branchHeader}>
								<Ionicons name="location" size={20} color={colors.accent} />
								<Text style={[styles.branchName, { color: colors.text }]}>
									Филиал №{i}
								</Text>
							</View>
							<Text style={[styles.branchAddress, { color: colors.textSecondary }]}>
								ул. Ленина, дом {100 + i * 10}, Бишкек
							</Text>
							<Text style={[styles.branchHours, { color: colors.textTertiary }]}>
								Пн-Пт: 9:00-19:00 | Сб: 10:00-16:00
							</Text>
							<Text style={[styles.branchPhone, { color: colors.accent }]}>
								+996 (312) 91-{20 + i}-0{i}
							</Text>
						</Card>
					))}
				</View>

				<Divider style={{ marginVertical: Spacing.four }} />

				{/* Store Categories */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Категории товаров
					</Text>

					<View style={styles.categoriesGrid}>
						{['Запчасти', 'Масла', 'Шины', 'Аксессуары'].map((cat) => (
							<Card key={cat} variant="default" style={styles.categoryChip}>
								<Text style={[styles.categoryText, { color: colors.text }]}>
									{cat}
								</Text>
							</Card>
						))}
					</View>
				</View>

				<Divider style={{ marginVertical: Spacing.four }} />

				{/* Settings */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Настройки магазина
					</Text>

					{[
						{ label: 'Основная информация', icon: 'information' },
						{ label: 'Способы оплаты', icon: 'card' },
						{ label: 'Комиссии и расчеты', icon: 'calculator' },
						{ label: 'Уведомления', icon: 'notifications' },
					].map((item) => (
						<TouchableOpacity
							key={item.label}
							style={[styles.settingItem, { borderBottomColor: colors.border }]}
						>
							<View style={styles.settingContent}>
								<Ionicons name={item.icon as any} size={20} color={colors.accent} />
								<Text style={[styles.settingLabel, { color: colors.text }]}>
									{item.label}
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
						</TouchableOpacity>
					))}
				</View>

				{/* Logout Button */}
				<Button
					label="Выход"
					variant="destructive"
					size="large"
					onPress={handleLogout}
					style={styles.logoutBtn}
				/>

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
		padding: Spacing.four,
	},
	storeCard: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: Spacing.three,
		padding: Spacing.four,
		borderRadius: 12,
		marginBottom: Spacing.four,
	},
	logo: {
		width: 70,
		height: 70,
		borderRadius: 12,
	},
	storeInfo: {
		flex: 1,
	},
	storeName: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	storeType: {
		fontSize: 12,
		marginBottom: Spacing.one,
	},
	badges: {
		flexDirection: 'row',
		gap: Spacing.one,
		marginBottom: Spacing.one,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
	},
	ratingText: {
		fontSize: 11,
	},
	editBtn: {
		padding: Spacing.two,
	},
	statsRow: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: Spacing.three,
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	statLabel: {
		fontSize: 11,
		fontWeight: '600',
	},
	section: {
		marginBottom: Spacing.four,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Spacing.three,
	},
	sectionTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
	},
	branchCard: {
		padding: Spacing.three,
		marginBottom: Spacing.two,
	},
	branchHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		marginBottom: Spacing.one,
	},
	branchName: {
		fontSize: 14,
		fontWeight: '700',
	},
	branchAddress: {
		fontSize: 12,
		marginBottom: Spacing.one,
		marginLeft: Spacing.four,
	},
	branchHours: {
		fontSize: 11,
		marginBottom: Spacing.one,
		marginLeft: Spacing.four,
	},
	branchPhone: {
		fontSize: 12,
		fontWeight: '600',
		marginLeft: Spacing.four,
	},
	categoriesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.two,
	},
	categoryChip: {
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
	},
	categoryText: {
		fontSize: 13,
		fontWeight: '600',
	},
	settingItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	settingContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	settingLabel: {
		fontSize: 14,
		fontWeight: '600',
	},
	logoutBtn: {
		marginTop: Spacing.two,
	},
})
