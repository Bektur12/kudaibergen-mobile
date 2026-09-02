import React, { useState } from 'react'
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

export default function BuyerProfileScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const { user, logout } = useAuth()
	const router = useRouter()

	const [vehicles, setVehicles] = useState([
		{ id: '1', brand: 'Toyota', model: 'Camry', year: 2020, isDefault: true },
		{ id: '2', brand: 'BMW', model: '320', year: 2019, isDefault: false },
	])

	const handleLogout = () => {
		logout()
		router.replace('/auth/login')
	}

	const handleDeleteVehicle = (id: string) => {
		setVehicles(vehicles.filter((v) => v.id !== id))
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Профиль" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* User Info Card */}
				<View style={[styles.userCard, { backgroundColor: colors.surface }]}>
					<View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
						<Ionicons name="person" size={40} color={colors.accent} />
					</View>
					<View style={styles.userInfo}>
						<Text style={[styles.name, { color: colors.text }]}>
							{user?.name || 'Пользователь'}
						</Text>
						<Text style={[styles.email, { color: colors.textSecondary }]}>
							{user?.email}
						</Text>
						<View style={styles.ratingRow}>
							<StarRating rating={4.7} readonly size="small" />
							<Text style={[styles.ratingText, { color: colors.textSecondary }]}>
								4.7 (12 отзывов)
							</Text>
						</View>
					</View>
					<TouchableOpacity style={styles.editBtn}>
						<Ionicons name="pencil" size={20} color={colors.accent} />
					</TouchableOpacity>
				</View>

				{/* Stats */}
				<View style={styles.statsRow}>
					{[
						{ label: 'Покупок', value: '24' },
						{ label: 'Избранное', value: '8' },
						{ label: 'Адресов', value: '2' },
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

				{/* My Vehicles Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							Мои автомобили
						</Text>
						<TouchableOpacity>
							<Ionicons name="add-circle-outline" size={24} color={colors.accent} />
						</TouchableOpacity>
					</View>

					{vehicles.map((vehicle) => (
						<Card key={vehicle.id} variant="outlined" style={styles.vehicleCard}>
							<View style={styles.vehicleHeader}>
								<View style={styles.vehicleInfo}>
									<Text style={[styles.vehicleModel, { color: colors.text }]}>
										{vehicle.brand} {vehicle.model}
									</Text>
									<Text style={[styles.vehicleYear, { color: colors.textSecondary }]}>
										{vehicle.year} г.
									</Text>
								</View>
								{vehicle.isDefault && (
									<Badge variant="accent" label="По умолчанию" size="small" />
								)}
							</View>

							<View style={styles.vehicleActions}>
								<TouchableOpacity style={styles.actionBtn}>
									<Ionicons name="pencil-outline" size={18} color={colors.accent} />
									<Text style={[styles.actionText, { color: colors.accent }]}>
										Редактировать
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleDeleteVehicle(vehicle.id)}
									style={styles.actionBtn}
								>
									<Ionicons name="trash-outline" size={18} color="#EF5350" />
									<Text style={[styles.actionText, { color: '#EF5350' }]}>
										Удалить
									</Text>
								</TouchableOpacity>
							</View>
						</Card>
					))}

					<Card
						variant="outlined"
						style={[styles.addVehicleCard, { borderStyle: 'dashed' }]}
					>
						<TouchableOpacity style={styles.addVehicleBtn}>
							<Ionicons name="add" size={28} color={colors.accent} />
							<Text style={[styles.addVehicleText, { color: colors.accent }]}>
								Добавить автомобиль
							</Text>
						</TouchableOpacity>
					</Card>
				</View>

				<Divider style={{ marginVertical: Spacing.four }} />

				{/* Settings Section */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Настройки
					</Text>

					{[
						{ label: 'Адреса доставки', icon: 'location' },
						{ label: 'Способы оплаты', icon: 'card' },
						{ label: 'Уведомления', icon: 'notifications' },
						{ label: 'Конфиденциальность', icon: 'shield' },
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
	userCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.three,
		padding: Spacing.four,
		borderRadius: 12,
		marginBottom: Spacing.four,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userInfo: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	email: {
		fontSize: 13,
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
	vehicleCard: {
		padding: Spacing.three,
		marginBottom: Spacing.two,
	},
	vehicleHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	vehicleInfo: {
		flex: 1,
	},
	vehicleModel: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	vehicleYear: {
		fontSize: 12,
	},
	vehicleActions: {
		flexDirection: 'row',
		gap: Spacing.two,
		paddingTop: Spacing.two,
	},
	actionBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
		paddingVertical: Spacing.one,
		paddingHorizontal: Spacing.two,
	},
	actionText: {
		fontSize: 12,
		fontWeight: '600',
	},
	addVehicleCard: {
		padding: Spacing.four,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: Spacing.two,
	},
	addVehicleBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		gap: Spacing.two,
	},
	addVehicleText: {
		fontSize: 14,
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
