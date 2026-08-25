import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	Alert,
	TextInput,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'

export default function CreateRequestScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const [details, setDetails] = useState('')
	const [hasPhoto, setHasPhoto] = useState(false)
	const [isUrgent, setIsUrgent] = useState(false)

	const suggestions = ['Амортизаторы', 'Колодки', 'Радиатор']

	const handleSubmit = () => {
		if (!details.trim()) {
			Alert.alert('Ошибка', 'Пожалуйста, заполните детали запроса')
			return
		}
		Alert.alert('Успешно', 'Запрос отправлен на 43 продавца')
		router.back()
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			{/* Status Bar */}
			<View style={[styles.statusBar, { borderBottomColor: colors.border }]}>
				<Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>9:41</Text>
				<Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, letterSpacing: 1 }}>▂▄▆ ⏻</Text>
			</View>

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name="close" size={24} color={colors.text} />
				</TouchableOpacity>
				<Text style={[styles.headerTitle, { color: colors.text }]}>Что нужно?</Text>
				<View style={{ width: 24 }} />
			</View>

			<ScrollView
				contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
				showsVerticalScrollIndicator={false}
			>
				{/* Car Selection */}
				<View
					style={[
						styles.carBox,
						{
							backgroundColor: colors.surface,
							borderColor: colors.accent,
						},
					]}
				>
					<Ionicons name="car" size={22} color={colors.accent} />
					<View style={styles.carInfo}>
						<Text style={[styles.carModel, { color: colors.text }]}>
							Toyota Camry 50
						</Text>
						<Text style={[styles.carYear, { color: colors.textSecondary }]}>
							2012 · 2.5 бензин
						</Text>
					</View>
					<Text style={[styles.changeText, { color: colors.accent }]}>Сменить</Text>
				</View>

				{/* Part Details */}
				<View style={styles.partSection}>
					<View
						style={[
							styles.partInput,
							{
								backgroundColor: colors.surface,
								borderColor: colors.accent,
							},
						]}
					>
						<View style={[styles.accentBar, { backgroundColor: colors.accent }]} />
						<TextInput
							placeholder="Стойки передние"
							placeholderTextColor={colors.textSecondary}
							value={details}
							onChangeText={setDetails}
							multiline={true}
							numberOfLines={3}
							style={[
								styles.textInput,
								{ color: colors.text, paddingLeft: Spacing.three },
							]}
						/>
					</View>

					{/* Suggestions */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.suggestionsScroll}
						contentContainerStyle={styles.suggestionsContent}
					>
						{suggestions.map((suggestion, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.suggestion,
									{
										backgroundColor: colors.surface,
										borderColor: colors.border,
									},
								]}
							>
								<Text style={[styles.suggestionPlus, { color: colors.accent }]}>+</Text>
								<Text style={[styles.suggestionText, { color: colors.textTertiary }]}>
									{suggestion}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{/* Buttons */}
				<View style={styles.buttonsRow}>
					<TouchableOpacity
						style={[
							styles.actionButton,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								flex: 1,
							},
						]}
					>
						<Ionicons name="camera" size={21} color={colors.textTertiary} />
						<Text style={[styles.actionButtonText, { color: colors.textTertiary }]}>
							Фото детали
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.actionButton,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								paddingHorizontal: Spacing.four,
							},
						]}
					>
						<Ionicons name="flash" size={19} color={colors.textTertiary} />
						<Text style={[styles.actionButtonText, { color: colors.textTertiary }]}>
							Срочно
						</Text>
					</TouchableOpacity>
				</View>

				{/* Spacer */}
				<View style={{ flex: 1, minHeight: Spacing.four }} />

				{/* Market Info */}
				<View
					style={[
						styles.marketInfo,
						{
							backgroundColor: colors.surfaceAlt,
							borderColor: colors.border,
						},
					]}
				>
					<View>
						<Text style={[styles.marketLabel, { color: colors.textTertiary }]}>
							Всему рынку · 43 продавца
						</Text>
						<Text style={[styles.marketTime, { color: colors.textSecondary }]}>
							ждём ответы 30 минут
						</Text>
					</View>
					<Text style={[styles.changeText, { color: colors.accent }]}>Изменить</Text>
				</View>
			</ScrollView>

			{/* Submit Button */}
			<View
				style={[
					styles.submitContainer,
					{ backgroundColor: colors.background, borderTopColor: colors.border },
				]}
			>
				<TouchableOpacity
					onPress={handleSubmit}
					style={[styles.submitButton, { backgroundColor: colors.accent }]}
				>
					<Text style={[styles.submitText, { color: colors.background }]}>
						Отправить запрос
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: 44,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 22,
		alignItems: 'center',
		borderBottomWidth: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.two,
	},
	headerTitle: {
		fontSize: 19,
		fontWeight: '700',
	},
	content: {
		padding: Spacing.four,
		gap: Spacing.three,
	},
	carBox: {
		height: 56,
		borderRadius: 14,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
		gap: Spacing.three,
	},
	carInfo: {
		flex: 1,
	},
	carModel: {
		fontSize: 17,
		fontWeight: '700',
		marginBottom: 2,
	},
	carYear: {
		fontSize: 13,
	},
	changeText: {
		fontSize: 15,
		fontWeight: '700',
	},
	partSection: {
		gap: Spacing.two,
	},
	partInput: {
		minHeight: 88,
		borderRadius: 14,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingTop: Spacing.three,
	},
	accentBar: {
		width: 2,
		height: 28,
		marginTop: 4,
		marginRight: 2,
	},
	textInput: {
		flex: 1,
		fontSize: 22,
		fontWeight: '600',
		paddingRight: Spacing.three,
		lineHeight: 28,
	},
	suggestionsScroll: {
		marginHorizontal: -Spacing.four,
	},
	suggestionsContent: {
		paddingHorizontal: Spacing.four,
		gap: Spacing.two,
	},
	suggestion: {
		height: 42,
		paddingHorizontal: Spacing.three,
		borderRadius: 21,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginRight: Spacing.two,
	},
	suggestionPlus: {
		fontSize: 15,
		fontWeight: '700',
	},
	suggestionText: {
		fontSize: 15,
		fontWeight: '600',
	},
	buttonsRow: {
		flexDirection: 'row',
		gap: Spacing.two,
	},
	actionButton: {
		height: 56,
		borderRadius: 14,
		borderWidth: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 9,
		paddingHorizontal: Spacing.three,
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: '700',
	},
	marketInfo: {
		padding: Spacing.three,
		borderRadius: 14,
		borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: Spacing.three,
	},
	marketLabel: {
		fontSize: 15,
		fontWeight: '600',
		marginBottom: 3,
	},
	marketTime: {
		fontSize: 14,
	},
	submitContainer: {
		padding: Spacing.four,
		paddingBottom: Spacing.four,
		borderTopWidth: 1,
	},
	submitButton: {
		height: 64,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	submitText: {
		fontSize: 21,
		fontWeight: '800',
	},
})
