import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/app'

export default function CreateRequestScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { createRequest } = useApp()

	const [carModel, setCarModel] = useState('')
	const [carYear, setCarYear] = useState('')
	const [carEngine, setCarEngine] = useState('')
	const [details, setDetails] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleCreateRequest = async () => {
		if (!carModel || !carYear || !carEngine || !details) {
			alert('Please fill in all fields')
			return
		}

		setIsLoading(true)
		try {
			await createRequest({
				buyerId: 'current_user_id',
				carModel,
				carYear: parseInt(carYear),
				carEngine,
				details,
				photos: [],
				status: 'active',
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			})
			router.back()
		} catch (err) {
			alert('Failed to create request')
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
				<Header
					title="Новый запрос"
					onBack={() => router.back()}
				/>

				<ScrollView
					style={styles.content}
					contentContainerStyle={styles.contentPadding}
					showsVerticalScrollIndicator={false}
				>
					<Text style={[styles.label, { color: colors.text }]}>
						Информация об автомобиле
					</Text>

					<Input
						placeholder="Модель автомобиля"
						value={carModel}
						onChangeText={setCarModel}
						style={styles.input}
					/>

					<Input
						placeholder="Год выпуска"
						value={carYear}
						onChangeText={setCarYear}
						keyboardType="number-pad"
						style={styles.input}
					/>

					<Input
						placeholder="Объем двигателя"
						value={carEngine}
						onChangeText={setCarEngine}
						style={styles.input}
					/>

					<Text style={[styles.label, { color: colors.text, marginTop: Spacing.five }]}>
						Описание запроса
					</Text>

					<Input
						placeholder="Детально опишите, что вам нужно..."
						value={details}
						onChangeText={setDetails}
						multiline
						numberOfLines={5}
						style={styles.input}
					/>

					<Button
						title={isLoading ? 'Создание...' : 'Создать запрос'}
						onPress={handleCreateRequest}
						disabled={isLoading}
						size="large"
						style={styles.submitButton}
					/>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	contentPadding: {
		padding: Spacing.four,
		paddingBottom: Spacing.six,
	},
	label: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.three,
	},
	input: {
		marginBottom: Spacing.three,
	},
	submitButton: {
		marginTop: Spacing.four,
	},
})
