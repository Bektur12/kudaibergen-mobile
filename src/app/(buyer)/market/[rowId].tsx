import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function MarketDetailScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { rowId } = useLocalSearchParams()

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="SC-001"
				onBack={() => router.back()}
				rightAction={{
					label: 'Написать',
					onPress: () => router.push('/(buyer)/chats/1'),
				}}
			/>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={[
						styles.boxPreview,
						{
							backgroundColor: colors.surface,
							borderColor: colors.accent,
						},
					]}
				>
					<Ionicons name="cube" size={64} color={colors.accent} />
				</View>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Артикул
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						SC-001
					</Text>
				</Card>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Наименование
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						Стойки передние Toyota Camry
					</Text>
				</Card>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Цена
					</Text>
					<Text style={[styles.price, { color: colors.accent }]}>
						45,000 KZT
					</Text>
				</Card>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						В наличии
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						5 шт
					</Text>
				</Card>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Место хранения
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						Полка A1
					</Text>
				</Card>

				<Card>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Информация о продавце
					</Text>
					<View style={styles.sellerInfo}>
						<View
							style={[
								styles.avatar,
								{ backgroundColor: colors.accent },
							]}
						>
							<Text
								style={[
									styles.avatarText,
									{ color: colors.background },
								]}
							>
								S
							</Text>
						</View>
						<View style={styles.sellerDetails}>
							<Text style={[styles.sellerName, { color: colors.text }]}>
								Auto Parts Store
							</Text>
							<View style={styles.rating}>
								<Text style={[styles.ratingText, { color: colors.accent }]}>
									4.9 ★
								</Text>
								<Text
									style={[
										styles.ratingCount,
										{ color: colors.textSecondary },
									]}
								>
									234 отзывов
								</Text>
							</View>
						</View>
					</View>
				</Card>

				<Button
					title="Написать продавцу"
					onPress={() => router.push('/(buyer)/chats/1')}
					style={{ marginTop: Spacing.three }}
				/>

				<Button
					title="Добавить в корзину"
					variant="secondary"
					onPress={() => {}}
					style={{ marginTop: Spacing.two, marginBottom: Spacing.four }}
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
	boxPreview: {
		aspectRatio: 1,
		borderRadius: 14,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: Spacing.three,
	},
	label: {
		fontSize: 12,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	value: {
		fontSize: 16,
		fontWeight: '600',
	},
	price: {
		fontSize: 22,
		fontWeight: '800',
	},
	sellerInfo: {
		flexDirection: 'row',
		gap: Spacing.two,
		alignItems: 'center',
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 18,
		fontWeight: '800',
	},
	sellerDetails: {
		flex: 1,
	},
	sellerName: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.half,
	},
	rating: {
		flexDirection: 'row',
		gap: Spacing.one,
		alignItems: 'center',
	},
	ratingText: {
		fontSize: 12,
		fontWeight: '700',
	},
	ratingCount: {
		fontSize: 12,
	},
})
