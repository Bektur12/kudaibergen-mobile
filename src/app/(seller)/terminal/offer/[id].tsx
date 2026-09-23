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
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function OfferScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { id } = useLocalSearchParams()

	const [price, setPrice] = useState('')
	const [description, setDescription] = useState('')
	const [delivery, setDelivery] = useState('3')

	const handleSubmit = () => {
		if (!price.trim()) {
			Alert.alert('Ошибка', 'Пожалуйста, укажите цену')
			return
		}
		Alert.alert('Успешно', `Предложение ${price} KZT отправлено покупателю`)
		router.back()
	}

	const Keypad = () => (
		<View style={styles.keypad}>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, ','].map((key) => (
				<TouchableOpacity
					key={key}
					onPress={() => {
						if (key === '←') {
							setPrice(price.slice(0, -1))
						} else if (key === ',') {
							if (!price.includes(',')) setPrice(price + ',')
						} else {
							setPrice(price + key.toString())
						}
					}}
					style={[
						styles.keypadButton,
						{
							backgroundColor: key === '←' ? colors.surfaceAlt : colors.surface,
							borderColor: colors.border,
						},
					]}
				>
					<Text
						style={[
							styles.keypadText,
							{ color: key === '←' ? colors.accent : colors.text },
						]}
					>
						{key === '←' ? '⌫' : key}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Сделать предложение"
				onBack={() => router.back()}
			/>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
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

				<View style={styles.priceSection}>
					<Text style={[styles.label, { color: colors.text }]}>
						Ваша цена
					</Text>
					<Card variant="highlighted">
						<Text style={[styles.priceDisplay, { color: colors.accent }]}>
							{price || '0'} KZT
						</Text>
					</Card>
				</View>

				<Text style={[styles.keypadLabel, { color: colors.textSecondary }]}>
					Введите цену
				</Text>
				<Keypad />

				<View style={styles.optionsSection}>
					<Text style={[styles.label, { color: colors.text }]}>
						Время доставки (дни)
					</Text>
					<View style={styles.deliveryOptions}>
						{['1', '2', '3', '4'].map((day) => (
							<TouchableOpacity
								key={day}
								onPress={() => setDelivery(day)}
								style={[
									styles.deliveryOption,
									{
										backgroundColor: delivery === day ? colors.accent : colors.surface,
										borderColor: delivery === day ? colors.accent : colors.border,
									},
								]}
							>
								<Text
									style={[
										styles.deliveryText,
										{ color: delivery === day ? colors.background : colors.text },
									]}
								>
									{day}д
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				<View style={styles.descSection}>
					<Text style={[styles.label, { color: colors.text }]}>
						Описание (опционально)
					</Text>
					<Input
						placeholder="Например: оригинальные, в наличии"
						value={description}
						onChangeText={setDescription}
						multiline
						numberOfLines={2}
					/>
				</View>

				<Button
					title="Отправить предложение"
					onPress={handleSubmit}
					disabled={!price.trim()}
					style={{ marginTop: Spacing.five }}
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
	priceSection: {
		gap: Spacing.two,
	},
	label: {
		fontSize: 15,
		fontWeight: '600',
	},
	priceDisplay: {
		fontSize: 32,
		fontWeight: '800',
		textAlign: 'center',
		paddingVertical: Spacing.three,
	},
	keypadLabel: {
		fontSize: 13,
		marginBottom: Spacing.one,
	},
	keypad: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: Spacing.one,
		marginBottom: Spacing.four,
	},
	keypadButton: {
		width: '31%',
		aspectRatio: 1,
		borderRadius: 10,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	keypadText: {
		fontSize: 18,
		fontWeight: '700',
	},
	optionsSection: {
		gap: Spacing.two,
	},
	deliveryOptions: {
		flexDirection: 'row',
		gap: Spacing.two,
	},
	deliveryOption: {
		flex: 1,
		paddingVertical: Spacing.two,
		borderRadius: 10,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	deliveryText: {
		fontSize: 14,
		fontWeight: '600',
	},
	descSection: {
		gap: Spacing.two,
	},
})
