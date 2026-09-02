import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Ionicons } from '@expo/vector-icons'

export default function AnalyticsScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light

	const metrics = [
		{ label: 'Просмотров', value: '1,247', change: '+12%', color: colors.accent },
		{ label: 'Контакты', value: '284', change: '+8%', color: '#4CAF50' },
		{ label: 'Конверсия', value: '22.8%', change: '+2%', color: '#2196F3' },
		{ label: 'Доход', value: '45,000 с', change: '+18%', color: '#FF9800' },
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Аналитика" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Period Selector */}
				<View style={styles.periodContainer}>
					{['Неделя', 'Месяц', 'Год'].map((period) => (
						<View
							key={period}
							style={[
								styles.periodBtn,
								period === 'Месяц' && [
									styles.periodBtnActive,
									{ backgroundColor: colors.accent },
								],
								{
									borderColor: period === 'Месяц' ? colors.accent : colors.border,
								},
							]}
						>
							<Text
								style={[
									styles.periodLabel,
									{
										color: period === 'Месяц' ? colors.background : colors.text,
									},
								]}
							>
								{period}
							</Text>
						</View>
					))}
				</View>

				{/* Key Metrics */}
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Основные показатели
				</Text>
				<View style={styles.metricsGrid}>
					{metrics.map((metric) => (
						<Card key={metric.label} variant="default" style={styles.metricCard}>
							<View style={styles.metricIconBg}>
								<View
									style={[
										styles.metricIcon,
										{ backgroundColor: `${metric.color}22` },
									]}
								>
									<Text style={{ fontSize: 16 }}>
										{metric.label === 'Просмотров'
											? '👁️'
											: metric.label === 'Контакты'
												? '📞'
												: metric.label === 'Конверсия'
													? '📈'
													: '💰'}
									</Text>
								</View>
							</View>
							<Text style={[styles.metricValue, { color: metric.color }]}>
								{metric.value}
							</Text>
							<Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
								{metric.label}
							</Text>
							<Text style={[styles.metricChange, { color: '#4CAF50' }]}>
								{metric.change}
							</Text>
						</Card>
					))}
				</View>

				{/* Top Performing Items */}
				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.five }]}>
					Топ товары
				</Text>
				{['Тормозные диски', 'Фильтр масла', 'Амортизаторы'].map((item, i) => (
					<Card key={item} variant="outlined" style={styles.itemCard}>
						<View style={styles.itemContent}>
							<View>
								<Text style={[styles.itemName, { color: colors.text }]}>
									{item}
								</Text>
								<Text style={[styles.itemViews, { color: colors.textSecondary }]}>
									{150 - i * 30} просмотров
								</Text>
							</View>
							<Text style={[styles.itemConversion, { color: colors.accent }]}>
								{18 - i * 2}%
							</Text>
						</View>
					</Card>
				))}

				{/* Traffic Sources */}
				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.five }]}>
					Источники трафика
				</Text>
				{[
					{ name: 'Поиск', value: '45%', icon: 'search' },
					{ name: 'Рекомендации', value: '30%', icon: 'heart' },
					{ name: 'Карта', value: '15%', icon: 'map' },
					{ name: 'Прямой переход', value: '10%', icon: 'arrow-forward' },
				].map((source) => (
					<View key={source.name} style={styles.sourceRow}>
						<View style={styles.sourceInfo}>
							<Ionicons name={source.icon as any} size={20} color={colors.accent} />
							<Text style={[styles.sourceName, { color: colors.text }]}>
								{source.name}
							</Text>
						</View>
						<View style={styles.sourceBar}>
							<View
								style={[
									styles.sourceBarFill,
									{
										width: source.value,
										backgroundColor: colors.accent,
									},
								]}
							/>
						</View>
						<Text style={[styles.sourceValue, { color: colors.textSecondary }]}>
							{source.value}
						</Text>
					</View>
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
	periodContainer: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	periodBtn: {
		flex: 1,
		paddingVertical: Spacing.two,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center',
	},
	periodBtnActive: {
		borderWidth: 0,
	},
	periodLabel: {
		fontSize: 13,
		fontWeight: '600',
	},
	sectionTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	metricsGrid: {
		flexDirection: 'row',
		gap: Spacing.two,
		flexWrap: 'wrap',
		marginBottom: Spacing.four,
	},
	metricCard: {
		width: '48%',
		paddingVertical: Spacing.three,
		alignItems: 'center',
	},
	metricIconBg: {
		marginBottom: Spacing.two,
	},
	metricIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	metricValue: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	metricLabel: {
		fontSize: 12,
		marginBottom: Spacing.one,
	},
	metricChange: {
		fontSize: 12,
		fontWeight: '600',
	},
	itemCard: {
		padding: Spacing.three,
		marginBottom: Spacing.two,
	},
	itemContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	itemName: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	itemViews: {
		fontSize: 12,
	},
	itemConversion: {
		fontSize: 14,
		fontWeight: '700',
	},
	sourceRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		marginBottom: Spacing.three,
	},
	sourceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		width: 100,
	},
	sourceName: {
		fontSize: 13,
		fontWeight: '600',
	},
	sourceBar: {
		height: 6,
		backgroundColor: '#333',
		borderRadius: 3,
		flex: 1,
		overflow: 'hidden',
	},
	sourceBarFill: {
		height: '100%',
	},
	sourceValue: {
		fontSize: 13,
		fontWeight: '600',
		width: 50,
		textAlign: 'right',
	},
})
