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
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'

export default function SellerHome() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const availableRequests = [
		{
			id: '1',
			carModel: 'BMW X5',
			carYear: 2020,
			details: 'Ищет тормозные колодки',
			priceRange: '5,000 - 8,000 тенге',
			urgency: 'Срочно',
		},
		{
			id: '2',
			carModel: 'Mercedes-Benz C-Class',
			carYear: 2021,
			details: 'Требуется масляный фильтр',
			priceRange: '2,000 - 3,500 тенге',
			urgency: 'Обычно',
		},
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Запросы"
				rightAction={{
					label: 'Фильтры',
					onPress: () => {},
				}}
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.statsContainer}>
					<Card variant="elevated" style={styles.statCard}>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
							Активные предложения
						</Text>
						<Text style={[styles.statValue, { color: colors.accent }]}>
							12
						</Text>
					</Card>
					<Card variant="elevated" style={styles.statCard}>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
							Конверсия
						</Text>
						<Text style={[styles.statValue, { color: colors.success }]}>
							35%
						</Text>
					</Card>
				</View>

				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Новые запросы
					</Text>

					{availableRequests.map((request) => (
						<Card
							key={request.id}
							variant="outlined"
							style={styles.requestCard}
							onPress={() => router.push(`/(seller)/request/${request.id}`)}
						>
							<View style={styles.requestHeader}>
								<View style={styles.requestInfo}>
									<Text style={[styles.carModel, { color: colors.text }]}>
										{request.carModel}
									</Text>
									<Text style={[styles.carYear, { color: colors.textSecondary }]}>
										{request.carYear}
									</Text>
								</View>
								<Badge
									label={request.urgency}
									variant={request.urgency === 'Срочно' ? 'error' : 'gray'}
									size="medium"
								/>
							</View>

							<Text style={[styles.details, { color: colors.textSecondary }]}>
								{request.details}
							</Text>

							<View style={styles.priceSection}>
								<Text style={[styles.priceLabel, { color: colors.textTertiary }]}>
									Диапазон предложения:
								</Text>
								<Text style={[styles.priceValue, { color: colors.accent }]}>
									{request.priceRange}
								</Text>
							</View>

							<Button
								title="Отправить предложение"
								variant="primary"
								size="small"
								style={styles.offerButton}
								onPress={() => router.push(`/(seller)/request/${request.id}`)}
							/>
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
	content: {
		flex: 1,
		padding: Spacing.four,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: Spacing.three,
		marginBottom: Spacing.five,
	},
	statCard: {
		flex: 1,
		padding: Spacing.three,
		alignItems: 'center',
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginBottom: Spacing.one,
	},
	statValue: {
		fontSize: 28,
		fontWeight: '800',
	},
	section: {
		marginBottom: Spacing.six,
	},
	sectionTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	requestCard: {
		marginBottom: Spacing.three,
	},
	requestHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	requestInfo: {
		flex: 1,
	},
	carModel: {
		fontSize: 16,
		fontWeight: '700',
	},
	carYear: {
		fontSize: 13,
		marginTop: Spacing.one,
	},
	details: {
		fontSize: 14,
		marginBottom: Spacing.two,
		lineHeight: 20,
	},
	priceSection: {
		marginBottom: Spacing.three,
	},
	priceLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginBottom: Spacing.one,
	},
	priceValue: {
		fontSize: 16,
		fontWeight: '700',
	},
	offerButton: {
		marginTop: Spacing.two,
	},
})
