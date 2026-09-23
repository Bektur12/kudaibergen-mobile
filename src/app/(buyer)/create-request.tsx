import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius, Layout } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Ionicons } from '@expo/vector-icons'

export default function CreateRequestScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const [description, setDescription] = useState('')
	const [categories, setCategories] = useState<string[]>([])
	const [isUrgent, setIsUrgent] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const availableCategories = ['Амортизаторы', 'Колодки', 'Радиатор', 'Масло', 'Фильтр']

	const toggleCategory = (cat: string) => {
		setCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		)
	}

	const handleSubmit = async () => {
		if (!description.trim()) {
			alert('Пожалуйста, опишите что вам нужно')
			return
		}

		setIsLoading(true)
		try {
			// Mock submit
			await new Promise((resolve) => setTimeout(resolve, 500))
			router.back()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header */}
				<View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="close" size={24} color={colors.text} />
					</TouchableOpacity>
					<Text style={[styles.headerTitle, { color: colors.text }]}>Что нужно?</Text>
					<View style={{ width: 24 }} />
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{/* Vehicle Card */}
					<Card variant="outlined" style={styles.vehicleCard}>
						<View style={styles.vehicleInfo}>
							<View>
								<Text style={[styles.vehicleTitle, { color: colors.text }]}>
									Toyota Camry 50
								</Text>
								<Text style={[styles.vehicleSubtitle, { color: colors.textSecondary }]}>
									2012 · 2.5 бензин
								</Text>
							</View>
							<Button
								title="Сменить"
								variant="ghost"
								size="small"
								onPress={() => {}}
							/>
						</View>
					</Card>

					{/* Description Input */}
					<Input
						placeholder="Стойки передние"
						value={description}
						onChangeText={setDescription}
						multiline
						numberOfLines={4}
						style={styles.descriptionInput}
					/>

					{/* Categories */}
					<Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
						Добавить категории
					</Text>
					<View style={styles.categoriesGrid}>
						{availableCategories.map((cat) => (
							<TouchableOpacity
								key={cat}
								onPress={() => toggleCategory(cat)}
								style={[
									styles.categoryButton,
									{
										backgroundColor: categories.includes(cat)
											? colors.accent
											: colors.surfaceAlt,
										borderColor: colors.border,
									},
								]}
							>
								<Ionicons
									name="add"
									size={16}
									color={categories.includes(cat) ? colors.background : colors.text}
								/>
								<Text
									style={[
										styles.categoryButtonText,
										{
											color: categories.includes(cat)
												? colors.background
												: colors.text,
										},
									]}
								>
									{cat}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Actions */}
					<View style={styles.actionsRow}>
						<TouchableOpacity
							style={[
								styles.actionButton,
								{ backgroundColor: colors.surfaceAlt },
							]}
						>
							<Ionicons name="image" size={20} color={colors.text} />
							<Text style={[styles.actionText, { color: colors.text }]}>
								Фото детали
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setIsUrgent(!isUrgent)}
							style={[
								styles.actionButton,
								{
									backgroundColor: isUrgent
										? colors.accent
										: colors.surfaceAlt,
								},
							]}
						>
							<Ionicons
								name="flash"
								size={20}
								color={isUrgent ? colors.background : colors.text}
							/>
							<Text
								style={[
									styles.actionText,
									{
										color: isUrgent ? colors.background : colors.text,
									},
								]}
							>
								Срочно
							</Text>
						</TouchableOpacity>
					</View>

					{/* Market Info */}
					<Card variant="default" style={styles.infoCard}>
						<View style={styles.infoContent}>
							<View>
								<Text style={[styles.infoTitle, { color: colors.text }]}>
									Всему рынку · 43 продавца
								</Text>
								<Text style={[styles.infoSubtitle, { color: colors.textTertiary }]}>
									ждём ответы 30 минут
								</Text>
							</View>
							<Button
								title="Изменить"
								variant="ghost"
								size="small"
								onPress={() => {}}
							/>
						</View>
					</Card>
				</ScrollView>

				{/* Submit Button */}
				<View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
					<Button
						title={isLoading ? 'Отправка...' : 'Отправить запрос'}
						onPress={handleSubmit}
						disabled={isLoading}
						size="large"
					/>
				</View>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Layout.gutter,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	headerTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
	},
	content: {
		flex: 1,
		padding: Layout.gutter,
	},
	vehicleCard: {
		marginBottom: Spacing.four,
	},
	vehicleInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	vehicleTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	vehicleSubtitle: {
		fontSize: 13,
	},
	descriptionInput: {
		marginBottom: Spacing.four,
	},
	categoryLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginBottom: Spacing.two,
	},
	categoriesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.two,
		marginBottom: Spacing.four,
	},
	categoryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: BorderRadius.xl,
		borderWidth: 1,
		gap: Spacing.one,
	},
	categoryButtonText: {
		fontSize: 13,
		fontWeight: '600',
	},
	actionsRow: {
		flexDirection: 'row',
		gap: Spacing.three,
		marginBottom: Spacing.four,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: Spacing.three,
		borderRadius: BorderRadius.medium,
		gap: Spacing.two,
	},
	actionText: {
		fontSize: 13,
		fontWeight: '600',
	},
	infoCard: {
		marginBottom: Spacing.four,
	},
	infoContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	infoSubtitle: {
		fontSize: 12,
	},
	footer: {
		paddingHorizontal: Layout.gutter,
		paddingVertical: Spacing.three,
		borderTopWidth: 1,
	},
})
