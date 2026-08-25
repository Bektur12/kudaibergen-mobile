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
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'

export default function BuyerHome() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const myVehicle = {
		name: 'Toyota Camry 50',
		year: 2012,
		engine: '2.5 бензин',
	}

	const activeRequests = [
		{
			id: '1',
			title: 'Camry 50 - всему рынку',
			offers: 7,
			minPrice: 3200,
			timeLeft: '08:14',
		},
		{
			id: '2',
			title: 'Фара левая',
			offers: 0,
			timeLeft: '24:03',
		},
	]

	const history = [
		{
			title: 'Колодки передние',
			date: 'Куплено 18 августа · Ряд 14',
			price: 1800,
		},
		{
			title: 'Масло 5W-30, 4 л',
			date: 'Куплено 2 августа · Ряд 28',
			price: 3400,
		},
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Your Vehicle Section */}
				<View style={styles.section}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Ваша машина
					</Text>
					<Text style={[styles.vehicleTitle, { color: colors.text }]}>
						{myVehicle.name}
					</Text>
					<Text style={[styles.vehicleSubtitle, { color: colors.textSecondary }]}>
						{myVehicle.year} · {myVehicle.engine}
					</Text>
				</View>

				{/* Find Part Button */}
				<Button
					title="Найти запчасть"
					onPress={() => router.push('/(buyer)/create-request')}
					size="large"
					style={styles.findButton}
					icon={<Ionicons name="search" size={20} color={colors.background} />}
				/>

				{/* Active Requests */}
				{activeRequests.length > 0 && (
					<View style={styles.section}>
						{activeRequests.map((req) => (
							<Card
								key={req.id}
								variant="outlined"
								style={styles.requestCard}
								onPress={() => router.push(`/(buyer)/request/${req.id}`)}
							>
								<View style={styles.requestHeader}>
									<View>
										<Text style={[styles.requestTitle, { color: colors.text }]}>
											{req.title}
										</Text>
										{req.minPrice && (
											<Text style={[styles.priceInfo, { color: colors.textSecondary }]}>
												от {req.minPrice.toLocaleString('ru-KZ')} сом
											</Text>
										)}
									</View>
									<Badge
										label={`${req.offers} ответов`}
										variant="accent"
										size="medium"
									/>
								</View>
								<Text style={[styles.timeLeft, { color: colors.accent }]}>
									{req.timeLeft}
								</Text>
							</Card>
						))}
					</View>
				)}

				{/* History Section */}
				{history.length > 0 && (
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							ИСТОРИЯ
						</Text>
						{history.map((item, index) => (
							<Card
								key={index}
								variant="default"
								style={styles.historyCard}
							>
								<View style={styles.historyContent}>
									<View>
										<Text style={[styles.historyTitle, { color: colors.text }]}>
											{item.title}
										</Text>
										<Text style={[styles.historyDate, { color: colors.textTertiary }]}>
											{item.date}
										</Text>
									</View>
									<Text style={[styles.historyPrice, { color: colors.accent }]}>
										{item.price.toLocaleString('ru-KZ')} сом
									</Text>
								</View>
							</Card>
						))}
					</View>
				)}
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
	section: {
		marginBottom: Spacing.five,
	},
	label: {
		fontSize: 13,
		fontWeight: '500',
		marginBottom: Spacing.one,
	},
	vehicleTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	vehicleSubtitle: {
		fontSize: 14,
	},
	findButton: {
		marginBottom: Spacing.five,
	},
	requestCard: {
		marginBottom: Spacing.three,
		paddingVertical: Spacing.three,
	},
	requestHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: Spacing.two,
	},
	requestTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	priceInfo: {
		fontSize: 13,
	},
	timeLeft: {
		fontSize: 14,
		fontWeight: '700',
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		marginBottom: Spacing.three,
		letterSpacing: 0.5,
	},
	historyCard: {
		marginBottom: Spacing.two,
	},
	historyContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	historyTitle: {
		fontSize: 15,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	historyDate: {
		fontSize: 12,
	},
	historyPrice: {
		fontSize: 16,
		fontWeight: '700',
	},
})
