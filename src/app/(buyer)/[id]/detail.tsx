import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
	FlatList,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Offer } from '@/types'

const MOCK_OFFERS: Offer[] = [
	{
		id: '1',
		requestId: '1',
		sellerId: 'seller_1',
		price: 45000,
		currency: 'KZT',
		description: 'Оригинальные стойки Toyota',
		estimatedDelivery: 2,
		createdAt: new Date(),
	},
	{
		id: '2',
		requestId: '1',
		sellerId: 'seller_2',
		price: 38000,
		currency: 'KZT',
		description: 'Аналоги, хорошее качество',
		estimatedDelivery: 3,
		createdAt: new Date(),
	},
	{
		id: '3',
		requestId: '1',
		sellerId: 'seller_3',
		price: 52000,
		currency: 'KZT',
		description: 'Премиум качество, в наличии',
		estimatedDelivery: 1,
		createdAt: new Date(),
	},
]

export default function RequestDetailScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const minutes = Math.floor(timeLeft / 60)
	const seconds = timeLeft % 60

	const renderOffer = ({ item }: { item: Offer }) => (
		<Card>
			<View style={styles.offerHeader}>
				<Text style={[styles.price, { color: colors.accent }]}>
					{item.price.toLocaleString()} {item.currency}
				</Text>
				<Badge label={`Доставка ${item.estimatedDelivery} дн`} size="small" />
			</View>
			<Text style={[styles.sellerName, { color: colors.text }]}>
				Продавец #{item.sellerId}
			</Text>
			{item.description && (
				<Text style={[styles.description, { color: colors.textSecondary }]}>
					{item.description}
				</Text>
			)}
			<Button
				title="Связаться"
				size="small"
				variant="secondary"
				onPress={() => router.push(`/(buyer)/chats/[chatId]`)}
				style={{ marginTop: Spacing.two }}
			/>
		</Card>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Запрос #{id?.toString().substring(0, 4)}"
				onBack={() => router.back()}
			/>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={[styles.timerBox, { backgroundColor: colors.accent }]}>
					<Text style={[styles.timerLabel, { color: colors.background }]}>
						Ожидание ответов
					</Text>
					<Text style={[styles.timerValue, { color: colors.background }]}>
						{minutes}:{seconds.toString().padStart(2, '0')}
					</Text>
				</View>

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

				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Получено предложений: {MOCK_OFFERS.length}
				</Text>

				<FlatList
					scrollEnabled={false}
					data={MOCK_OFFERS}
					renderItem={renderOffer}
					keyExtractor={(item) => item.id}
					ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
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
	timerBox: {
		borderRadius: 14,
		padding: Spacing.three,
		alignItems: 'center',
	},
	timerLabel: {
		fontSize: 14,
		fontWeight: '600',
	},
	timerValue: {
		fontSize: 36,
		fontWeight: '800',
		marginTop: Spacing.one,
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
	sectionTitle: {
		fontSize: 15,
		fontWeight: '600',
		marginTop: Spacing.two,
	},
	offerHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Spacing.two,
	},
	price: {
		fontSize: 18,
		fontWeight: '800',
	},
	sellerName: {
		fontSize: 13,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	description: {
		fontSize: 13,
	},
})
