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
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '@/context/app'

export default function SellerHomeScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { requests } = useApp()

	const stats = [
		{ label: 'Активные объявления', value: '23', icon: 'list' },
		{ label: 'Конверсия', value: '34%', icon: 'trending-up' },
		{ label: 'Сегодня просмотров', value: '127', icon: 'eye' },
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Панель продавца" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Stats Grid */}
				<View style={styles.statsGrid}>
					{stats.map((stat, i) => (
						<Card key={i} variant="default" style={styles.statCard}>
							<Ionicons
								name={stat.icon as any}
								size={24}
								color={colors.accent}
								style={{ marginBottom: Spacing.one }}
							/>
							<Text style={[styles.statValue, { color: colors.accent }]}>
								{stat.value}
							</Text>
							<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
								{stat.label}
							</Text>
						</Card>
					))}
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Button
						label="➕ Добавить товар"
						variant="primary"
						size="large"
						style={{ marginBottom: Spacing.two }}
					/>
					<Button
						label="📊 Подробная аналитика"
						variant="secondary"
						size="large"
					/>
				</View>

				{/* New Requests */}
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Новые запросы от покупателей
				</Text>

				{requests.length > 0 ? (
					requests.slice(0, 5).map((request) => (
						<Card
							key={request.id}
							variant="outlined"
							style={styles.requestCard}
							onPress={() => router.push(`/seller/request/${request.id}`)}
						>
							<View style={styles.requestHeader}>
								<View>
									<Text style={[styles.requestTitle, { color: colors.text }]}>
										{request.carModel || 'Запрос'}
									</Text>
									{request.isUrgent && (
										<Badge variant="error" label="Срочно!" size="small" />
									)}
								</View>
								<Text style={[styles.requestBudget, { color: colors.accent }]}>
									{request.budget?.max}
									{request.budget?.currency}
								</Text>
							</View>

							<Text
								style={[styles.requestDesc, { color: colors.textSecondary }]}
								numberOfLines={2}
							>
								{request.description}
							</Text>

							<View style={styles.requestFooter}>
								<View style={styles.requestMeta}>
									<Ionicons name="location" size={14} color={colors.textTertiary} />
									<Text style={[styles.requestCity, { color: colors.textTertiary }]}>
										{request.city}
									</Text>
								</View>
								<View style={styles.requestMeta}>
									<Text
										style={[
											styles.offerCount,
											{ color: colors.textSecondary },
										]}
									>
										{request.offerCount} предложений
									</Text>
								</View>
							</View>

							<Button
								label="Отправить предложение"
								variant="primary"
								size="small"
								style={{ marginTop: Spacing.two }}
							/>
						</Card>
					))
				) : (
					<Card variant="outlined" style={styles.emptyCard}>
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							Нет новых запросов
						</Text>
					</Card>
				)}

				{/* Recent Activity */}
				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.five }]}>
					Последняя активность
				</Text>

				{[
					{ type: 'view', text: 'Александр К. просмотрел ваше объявление', time: '5 мин' },
					{ type: 'offer', text: 'Вы отправили предложение Мариам Б.', time: '1 ч' },
					{ type: 'message', text: 'Новое сообщение от Тимур Т.', time: '3 ч' },
				].map((activity, i) => (
					<Card key={i} variant="outlined" style={styles.activityCard}>
						<View style={styles.activityContent}>
							<Ionicons
								name={
									activity.type === 'view'
										? 'eye'
										: activity.type === 'offer'
											? 'checkmark-done'
											: 'chatbubble'
								}
								size={16}
								color={colors.accent}
								style={{ marginRight: Spacing.two }}
							/>
							<View style={styles.activityText}>
								<Text style={[styles.activityDesc, { color: colors.text }]}>
									{activity.text}
								</Text>
								<Text style={[styles.activityTime, { color: colors.textTertiary }]}>
									{activity.time}
								</Text>
							</View>
						</View>
					</Card>
				))}

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
	statsGrid: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: Spacing.three,
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
	},
	statLabel: {
		fontSize: 11,
		fontWeight: '600',
		marginTop: Spacing.one,
		textAlign: 'center',
	},
	quickActions: {
		marginBottom: Spacing.four,
	},
	sectionTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	requestCard: {
		padding: Spacing.three,
		marginBottom: Spacing.three,
	},
	requestHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	requestTitle: {
		fontSize: 14,
		fontWeight: '700',
	},
	requestBudget: {
		fontSize: 15,
		fontWeight: '700',
	},
	requestDesc: {
		fontSize: 13,
		lineHeight: 18,
		marginBottom: Spacing.two,
	},
	requestFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: Spacing.two,
	},
	requestMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
	},
	requestCity: {
		fontSize: 12,
	},
	offerCount: {
		fontSize: 12,
		fontWeight: '600',
	},
	emptyCard: {
		padding: Spacing.four,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyText: {
		fontSize: 14,
	},
	activityCard: {
		padding: Spacing.three,
		marginBottom: Spacing.two,
	},
	activityContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	activityText: {
		flex: 1,
	},
	activityDesc: {
		fontSize: 13,
		fontWeight: '600',
	},
	activityTime: {
		fontSize: 11,
		marginTop: Spacing.one,
	},
})
