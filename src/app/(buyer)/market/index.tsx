import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'

interface Box {
	id: string
	rowId: string
	partNumber: string
	price: number
	quantity: number
	location: string
}

interface Row {
	id: string
	name: string
	boxes: Box[]
}

const MOCK_ROWS: Row[] = [
	{
		id: '1',
		name: 'Стойки и амортизаторы',
		boxes: [
			{ id: '1-1', rowId: '1', partNumber: 'SC-001', price: 45000, quantity: 5, location: 'Полка A1' },
			{ id: '1-2', rowId: '1', partNumber: 'SC-002', price: 38000, quantity: 3, location: 'Полка A2' },
			{ id: '1-3', rowId: '1', partNumber: 'SC-003', price: 52000, quantity: 2, location: 'Полка A3' },
		],
	},
	{
		id: '2',
		name: 'Тормозные детали',
		boxes: [
			{ id: '2-1', rowId: '2', partNumber: 'BR-001', price: 25000, quantity: 8, location: 'Полка B1' },
			{ id: '2-2', rowId: '2', partNumber: 'BR-002', price: 32000, quantity: 4, location: 'Полка B2' },
		],
	},
]

export default function MarketScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const renderBox = ({ item }: { item: Box }) => (
		<TouchableOpacity
			onPress={() => router.push(`/(buyer)/market/${item.id}`)}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.box,
					{
						backgroundColor: colors.surface,
						borderColor: colors.border,
					},
				]}
			>
				<Text style={[styles.partNumber, { color: colors.text }]}>
					{item.partNumber}
				</Text>
				<Text style={[styles.price, { color: colors.accent }]}>
					{item.price.toLocaleString()} KZT
				</Text>
				<View style={styles.boxFooter}>
					<Text style={[styles.quantity, { color: colors.textSecondary }]}>
						Шт: {item.quantity}
					</Text>
					<Ionicons name="chevron-forward" size={16} color={colors.accent} />
				</View>
			</View>
		</TouchableOpacity>
	)

	const renderRow = ({ item }: { item: Row }) => (
		<View key={item.id} style={styles.rowSection}>
			<View style={styles.rowHeader}>
				<Text style={[styles.rowName, { color: colors.text }]}>
					{item.name}
				</Text>
				<Text style={[styles.boxCount, { color: colors.textSecondary }]}>
					{item.boxes.length} коробок
				</Text>
			</View>
			<FlatList
				scrollEnabled={false}
				data={item.boxes}
				renderItem={renderBox}
				keyExtractor={(box) => box.id}
				numColumns={2}
				columnWrapperStyle={styles.columnWrapper}
			/>
		</View>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Рынок" />
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<FlatList
					scrollEnabled={false}
					data={MOCK_ROWS}
					renderItem={renderRow}
					keyExtractor={(row) => row.id}
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
	},
	rowSection: {
		marginBottom: Spacing.four,
	},
	rowHeader: {
		marginBottom: Spacing.two,
	},
	rowName: {
		fontSize: 16,
		fontWeight: '700',
	},
	boxCount: {
		fontSize: 13,
	},
	columnWrapper: {
		justifyContent: 'space-between',
		gap: Spacing.two,
		marginBottom: Spacing.two,
	},
	box: {
		flex: 0.48,
		borderRadius: 12,
		borderWidth: 2,
		padding: Spacing.two,
		aspectRatio: 1,
		justifyContent: 'space-between',
	},
	partNumber: {
		fontSize: 12,
		fontWeight: '600',
	},
	price: {
		fontSize: 14,
		fontWeight: '700',
		marginVertical: Spacing.one,
	},
	boxFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	quantity: {
		fontSize: 11,
	},
})
