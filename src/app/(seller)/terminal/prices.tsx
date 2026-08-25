import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Price {
	id: string
	partNumber: string
	description: string
	price: number
	quantity: number
	lastUpdated: Date
}

const MOCK_PRICES: Price[] = [
	{
		id: '1',
		partNumber: 'SC-001',
		description: 'Стойки передние Toyota',
		price: 45000,
		quantity: 5,
		lastUpdated: new Date(Date.now() - 2 * 60 * 60000),
	},
	{
		id: '2',
		partNumber: 'BR-001',
		description: 'Тормозные колодки',
		price: 25000,
		quantity: 8,
		lastUpdated: new Date(Date.now() - 24 * 60 * 60000),
	},
	{
		id: '3',
		partNumber: 'FI-001',
		description: 'Воздушные фильтры',
		price: 8000,
		quantity: 15,
		lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60000),
	},
]

function formatDate(date: Date) {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)

	if (hours < 24) return `${hours}ч назад`
	return `${days}д назад`
}

export default function PricesScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const [prices] = useState<Price[]>(MOCK_PRICES)

	const renderPrice = ({ item }: { item: Price }) => (
		<Card>
			<View style={styles.header}>
				<View style={styles.info}>
					<Text style={[styles.partNumber, { color: colors.text }]}>
						{item.partNumber}
					</Text>
					<Text
						style={[styles.description, { color: colors.textSecondary }]}
						numberOfLines={1}
					>
						{item.description}
					</Text>
				</View>
				<TouchableOpacity>
					<Ionicons name="ellipsis-vertical" size={20} color={colors.textTertiary} />
				</TouchableOpacity>
			</View>

			<View style={[styles.divider, { backgroundColor: colors.border }]} />

			<View style={styles.footer}>
				<View>
					<Text style={[styles.price, { color: colors.accent }]}>
						{item.price.toLocaleString()} KZT
					</Text>
					<Text style={[styles.quantity, { color: colors.textSecondary }]}>
						В наличии: {item.quantity} шт
					</Text>
				</View>
				<Text style={[styles.updated, { color: colors.textTertiary }]}>
					{formatDate(item.lastUpdated)}
				</Text>
			</View>
		</Card>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Мои цены" />
			<FlatList
				data={prices}
				renderItem={renderPrice}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Ionicons name="pricetag-outline" size={48} color={colors.textTertiary} />
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							Нет добавленных цен
						</Text>
					</View>
				}
			/>
			<View style={styles.fab}>
				<Button
					title="Добавить цену"
					size="large"
					onPress={() => {/* Add new price */}}
				/>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		padding: Spacing.four,
		gap: Spacing.three,
		paddingBottom: 100,
	},
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: Spacing.seven,
	},
	emptyText: {
		fontSize: 14,
		marginTop: Spacing.two,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	info: {
		flex: 1,
	},
	partNumber: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: Spacing.half,
	},
	description: {
		fontSize: 13,
	},
	divider: {
		height: 1,
		marginVertical: Spacing.two,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	price: {
		fontSize: 16,
		fontWeight: '800',
		marginBottom: Spacing.half,
	},
	quantity: {
		fontSize: 12,
	},
	updated: {
		fontSize: 12,
	},
	fab: {
		position: 'absolute',
		bottom: Spacing.four,
		left: Spacing.four,
		right: Spacing.four,
	},
})
