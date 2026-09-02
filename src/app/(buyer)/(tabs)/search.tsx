import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Header } from '@/components/ui/Header'
import { Ionicons } from '@expo/vector-icons'

export default function SearchScreen() {
	const { category } = useLocalSearchParams()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const [searchText, setSearchText] = useState('')

	const categories = [
		{ id: 'cars', label: '🚗 Автомобили', icon: 'car' },
		{ id: 'parts', label: '🔧 Запчасти', icon: 'settings' },
		{ id: 'services', label: '🔧 Услуги', icon: 'hammer' },
	]

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Поиск" />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Search Input */}
				<Input
					placeholder="Введите что ищете..."
					value={searchText}
					onChangeText={setSearchText}
					style={styles.searchInput}
					icon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
				/>

				{/* Categories */}
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Категории
				</Text>
				<View style={styles.categoryList}>
					{categories.map((cat) => (
						<TouchableOpacity
							key={cat.id}
							style={[
								styles.categoryItem,
								{
									backgroundColor: category === cat.id ? colors.accent : colors.surfaceAlt,
								},
							]}
						>
							<Ionicons
								name={cat.icon as any}
								size={24}
								color={category === cat.id ? colors.background : colors.text}
							/>
							<Text
								style={[
									styles.categoryName,
									{
										color: category === cat.id ? colors.background : colors.text,
									},
								]}
							>
								{cat.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Results */}
				<Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.five }]}>
					Результаты поиска
				</Text>

				{[1, 2, 3].map((i) => (
					<Card key={i} variant="outlined" style={styles.resultCard}>
						<View style={styles.resultImage} />
						<View style={styles.resultInfo}>
							<Text style={[styles.resultTitle, { color: colors.text }]}>
								{category === 'services' ? 'Авто СТО #1' : 'Toyota Camry 70'}
							</Text>
							<Text style={[styles.resultPrice, { color: colors.accent }]}>
								{category === 'services' ? 'Диагностика: 5000 сом' : '$23 500'}
							</Text>
							<View style={styles.resultMeta}>
								<Ionicons name="star" size={14} color={colors.accent} />
								<Text style={[styles.rating, { color: colors.textSecondary }]}>
									4.8 (24)
								</Text>
								<Text style={[styles.location, { color: colors.textTertiary }]}>
									📍 Бишкек
								</Text>
							</View>
						</View>
					</Card>
				))}
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
	searchInput: {
		marginBottom: Spacing.four,
	},
	sectionTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	categoryList: {
		flexDirection: 'row',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	categoryItem: {
		flex: 1,
		paddingVertical: Spacing.three,
		paddingHorizontal: Spacing.two,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		gap: Spacing.one,
	},
	categoryName: {
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'center',
	},
	resultCard: {
		marginBottom: Spacing.three,
		flexDirection: 'row',
		gap: Spacing.three,
		padding: Spacing.three,
	},
	resultImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: '#ccc',
	},
	resultInfo: {
		flex: 1,
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	resultPrice: {
		fontSize: 15,
		fontWeight: '700',
		marginTop: Spacing.one,
	},
	resultMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.one,
		marginTop: Spacing.two,
	},
	rating: {
		fontSize: 12,
		fontWeight: '600',
	},
	location: {
		fontSize: 12,
	},
})
