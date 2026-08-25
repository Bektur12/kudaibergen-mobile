import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
} from 'react-native'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'

export default function AnalyticsScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const StatCard = ({ label, value, trend }: { label: string; value: string; trend?: string }) => (
		<Card>
			<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
				{label}
			</Text>
			<Text style={[styles.statValue, { color: colors.accent }]}>
				{value}
			</Text>
			{trend && (
				<Text style={[styles.trend, { color: colors.success }]}>
					{trend}
				</Text>
			)}
		</Card>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Аналитика" />
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Эта неделя
				</Text>
				<View style={styles.grid}>
					<View style={{ flex: 1 }}>
						<StatCard label="Предложения" value="24" trend="+12%" />
					</View>
					<View style={{ flex: 1 }}>
						<StatCard label="Просмотры" value="156" trend="+8%" />
					</View>
				</View>

				<View style={styles.grid}>
					<View style={{ flex: 1 }}>
						<StatCard label="Контакты" value="8" trend="+2" />
					</View>
					<View style={{ flex: 1 }}>
						<StatCard label="Продажи" value="3" trend="+100%" />
					</View>
				</View>

				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.four }]}>
					Месяц
				</Text>
				<Card>
					<View style={styles.monthStats}>
						<View style={styles.monthStat}>
							<Text style={[styles.monthLabel, { color: colors.textSecondary }]}>
								Выручка
							</Text>
							<Text style={[styles.monthValue, { color: colors.accent }]}>
								2,450,000 KZT
							</Text>
						</View>
						<View
							style={[
								styles.monthDivider,
								{ backgroundColor: colors.border },
							]}
						/>
						<View style={styles.monthStat}>
							<Text style={[styles.monthLabel, { color: colors.textSecondary }]}>
								Сделок
							</Text>
							<Text style={[styles.monthValue, { color: colors.accent }]}>
								47
							</Text>
						</View>
					</View>
				</Card>

				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.four }]}>
					Рейтинг
				</Text>
				<Card>
					<View style={styles.ratingContent}>
						<Text style={[styles.rating, { color: colors.accent }]}>
							4.9 ★
						</Text>
						<Text style={[styles.ratingCount, { color: colors.textSecondary }]}>
							Based on 234 reviews
						</Text>

						<View style={styles.ratingBars}>
							<View style={styles.ratingBar}>
								<Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
									5★
								</Text>
								<View
									style={[
										styles.bar,
										{ backgroundColor: colors.surfaceAlt },
									]}
								>
									<View
										style={[
											styles.barFill,
											{ backgroundColor: colors.accent, width: '85%' },
										]}
									/>
								</View>
							</View>
							<View style={styles.ratingBar}>
								<Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
									4★
								</Text>
								<View
									style={[
										styles.bar,
										{ backgroundColor: colors.surfaceAlt },
									]}
								>
									<View
										style={[
											styles.barFill,
											{ backgroundColor: colors.accent, width: '10%' },
										]}
									/>
								</View>
							</View>
						</View>
					</View>
				</Card>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: Spacing.four,
		paddingBottom: Spacing.five,
		gap: Spacing.three,
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: '600',
	},
	grid: {
		flexDirection: 'row',
		gap: Spacing.two,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '500',
	},
	statValue: {
		fontSize: 24,
		fontWeight: '800',
		marginTop: Spacing.one,
		marginBottom: Spacing.half,
	},
	trend: {
		fontSize: 12,
		fontWeight: '600',
	},
	monthStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	monthStat: {
		alignItems: 'center',
		flex: 1,
	},
	monthLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginBottom: Spacing.one,
	},
	monthValue: {
		fontSize: 20,
		fontWeight: '800',
	},
	monthDivider: {
		width: 1,
		height: 40,
	},
	ratingContent: {
		alignItems: 'center',
	},
	rating: {
		fontSize: 28,
		fontWeight: '800',
		marginBottom: Spacing.one,
	},
	ratingCount: {
		fontSize: 12,
		marginBottom: Spacing.three,
	},
	ratingBars: {
		width: '100%',
		gap: Spacing.two,
	},
	ratingBar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
	},
	ratingLabel: {
		fontSize: 12,
		width: 20,
	},
	bar: {
		flex: 1,
		height: 6,
		borderRadius: 3,
	},
	barFill: {
		height: 6,
		borderRadius: 3,
	},
})
