import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
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

export default function BuyerHome() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const activeRequests = [
		{
			id: '1',
			carModel: 'BMW X5',
			carYear: 2020,
			carEngine: '3.0L Twin-Turbo',
			details: 'Ищу две передние тормозные колодки',
			waitTime: 24,
			sellerCount: 3,
			status: 'active' as const,
		},
		{
			id: '2',
			carModel: 'Toyota Camry',
			carYear: 2019,
			carEngine: '2.5L',
			details: 'Нужна новая батарея',
			waitTime: 12,
			sellerCount: 5,
			status: 'active' as const,
		},
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Запросы"
				rightAction={{
					label: 'Новый',
					onPress: () => router.push('/(buyer)/create-request'),
				}}
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Активные запросы
					</Text>

					{activeRequests.map((request) => (
						<Card
							key={request.id}
							variant="outlined"
							style={styles.requestCard}
							onPress={() => router.push(`/(buyer)/request/${request.id}`)}
						>
							<View style={styles.requestHeader}>
								<View style={styles.requestInfo}>
									<Text style={[styles.carModel, { color: colors.text }]}>
										{request.carModel}
									</Text>
									<Text style={[styles.carYear, { color: colors.textSecondary }]}>
										{request.carYear} · {request.carEngine}
									</Text>
								</View>
								<Badge
									label={`${request.sellerCount} предложений`}
									variant="accent"
									size="medium"
								/>
							</View>

							<Text style={[styles.details, { color: colors.textSecondary }]}>
								{request.details}
							</Text>

							<View style={styles.footer}>
								<View style={styles.waitTime}>
									<Ionicons
										name="time-outline"
										size={14}
										color={colors.textTertiary}
									/>
									<Text style={[styles.waitText, { color: colors.textTertiary }]}>
										{request.waitTime}ч ожидания
									</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color={colors.textSecondary}
								/>
							</View>
						</Card>
					))}
				</View>
			</ScrollView>

			<View style={[styles.floatingButton, { bottom: 80 }]}>
				<Button
					title="Создать запрос"
					onPress={() => router.push('/(buyer)/create-request')}
					size="large"
				/>
			</View>
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
		marginBottom: Spacing.three,
		lineHeight: 20,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	waitTime: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
	},
	waitText: {
		fontSize: 12,
		fontWeight: '500',
	},
	floatingButton: {
		position: 'absolute',
		right: Spacing.four,
		left: Spacing.four,
		paddingBottom: Spacing.four,
	},
})
