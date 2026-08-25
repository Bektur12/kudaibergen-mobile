import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function SummaryScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Итоги запроса"
				onBack={() => router.back()}
			/>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<Card>
					<Text style={[styles.carModel, { color: colors.text }]}>
						Toyota Camry 50
					</Text>
					<Text style={[styles.carYear, { color: colors.textSecondary }]}>
						2012 · 2.5 бензин
					</Text>
					<Text style={[styles.details, { color: colors.text, marginTop: Spacing.two }]}>
						Стойки передние
					</Text>
				</Card>

				<View style={styles.statsSection}>
					<View style={styles.statItem}>
						<Text style={[styles.statValue, { color: colors.accent }]}>
							43
						</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
							Продавцов участвует
						</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={[styles.statValue, { color: colors.accent }]}>
							3
						</Text>
						<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
							Получено предложений
						</Text>
					</View>
				</View>

				<Text style={[styles.priceRangeLabel, { color: colors.text }]}>
					Диапазон цен
				</Text>
				<Card>
					<View style={styles.priceRange}>
						<View style={styles.priceBox}>
							<Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
								Минимум
							</Text>
							<Text style={[styles.price, { color: colors.accent }]}>
								38,000 KZT
							</Text>
						</View>
						<View
							style={[
								styles.priceDivider,
								{ backgroundColor: colors.border },
							]}
						/>
						<View style={styles.priceBox}>
							<Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
								Максимум
							</Text>
							<Text style={[styles.price, { color: colors.accent }]}>
								52,000 KZT
							</Text>
						</View>
					</View>
				</Card>

				<Button
					title="Посмотреть все предложения"
					onPress={() => router.back()}
					style={{ marginTop: Spacing.four }}
				/>
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
	carModel: {
		fontSize: 17,
		fontWeight: '700',
		marginBottom: Spacing.half,
	},
	carYear: {
		fontSize: 13,
	},
	details: {
		fontSize: 15,
		fontWeight: '500',
	},
	statsSection: {
		flexDirection: 'row',
		gap: Spacing.two,
	},
	statItem: {
		flex: 1,
	},
	statValue: {
		fontSize: 24,
		fontWeight: '800',
		marginBottom: Spacing.half,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '500',
	},
	priceRangeLabel: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: Spacing.two,
	},
	priceRange: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	priceBox: {
		flex: 1,
		alignItems: 'center',
	},
	priceLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginBottom: Spacing.one,
	},
	price: {
		fontSize: 18,
		fontWeight: '800',
	},
	priceDivider: {
		width: 1,
		height: 50,
	},
})
