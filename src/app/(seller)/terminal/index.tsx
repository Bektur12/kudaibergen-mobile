import React from 'react'
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
import { Badge } from '@/components/ui/Badge'
import { Request } from '@/types'

const MOCK_REQUESTS: Request[] = [
	{
		id: '1',
		buyerId: 'user_1',
		carModel: 'Toyota Camry 50',
		carYear: 2012,
		carEngine: '2.5 бензин',
		details: 'Стойки передние',
		photos: [],
		status: 'active',
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + 20 * 60000),
		sellerCount: 43,
		waitTime: 30,
	},
	{
		id: '2',
		buyerId: 'user_2',
		carModel: 'Honda Civic',
		carYear: 2018,
		carEngine: '1.8 бензин',
		details: 'Тормозные колодки, диски',
		photos: [],
		status: 'active',
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + 15 * 60000),
		sellerCount: 28,
		waitTime: 30,
	},
	{
		id: '3',
		buyerId: 'user_3',
		carModel: 'Hyundai Solaris',
		carYear: 2015,
		carEngine: '1.6 бензин',
		details: 'Фильтры воздушные',
		photos: [],
		status: 'active',
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + 25 * 60000),
		sellerCount: 51,
		waitTime: 30,
	},
]

export default function TerminalScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const renderRequest = ({ item }: { item: Request }) => (
		<TouchableOpacity
			onPress={() => router.push(`/(seller)/terminal/offer/${item.id}`)}
			activeOpacity={0.7}
		>
			<Card>
				<View style={styles.header}>
					<View style={styles.info}>
						<Text style={[styles.carModel, { color: colors.text }]}>
							{item.carModel}
						</Text>
						<Text style={[styles.carYear, { color: colors.textSecondary }]}>
							{item.carYear} · {item.carEngine}
						</Text>
					</View>
					<Text style={[styles.time, { color: colors.accent }]}>
						20м
					</Text>
				</View>

				<Text style={[styles.details, { color: colors.text }]} numberOfLines={2}>
					{item.details}
				</Text>

				<View style={styles.footer}>
					<View>
						<Badge label="НОВЫЙ" variant="success" size="small" />
						<Text style={[styles.sellers, { color: colors.textTertiary, marginTop: Spacing.one }]}>
							{item.sellerCount} продавцов участвуют
						</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color={colors.accent} />
				</View>
			</Card>
		</TouchableOpacity>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Терминал" />
			<FlatList
				data={MOCK_REQUESTS}
				renderItem={renderRequest}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
			/>
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
	carModel: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.half,
	},
	carYear: {
		fontSize: 13,
	},
	time: {
		fontSize: 13,
		fontWeight: '700',
	},
	details: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: Spacing.two,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: Spacing.two,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.1)',
	},
	sellers: {
		fontSize: 12,
		fontWeight: '500',
	},
})
