import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SellerRequestDetailScreen() {
	const { id } = useLocalSearchParams()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const [price, setPrice] = useState('')
	const [description, setDescription] = useState('')

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Header
					title="Отправить предложение"
					onBack={() => router.back()}
				/>

				<ScrollView
					style={styles.content}
					contentContainerStyle={styles.contentPadding}
					showsVerticalScrollIndicator={false}
				>
					<Card variant="outlined">
						<Text style={[styles.carModel, { color: colors.text }]}>
							BMW X5
						</Text>
						<Text style={[styles.carYear, { color: colors.textSecondary }]}>
							2020 · Ищет тормозные колодки
						</Text>
					</Card>

					<Text style={[styles.label, { color: colors.text, marginTop: Spacing.five }]}>
						Ваше предложение
					</Text>

					<Input
						placeholder="Цена в тенге"
						value={price}
						onChangeText={setPrice}
						keyboardType="number-pad"
						style={styles.input}
					/>

					<Input
						placeholder="Описание вашего предложения"
						value={description}
						onChangeText={setDescription}
						multiline
						numberOfLines={4}
						style={styles.input}
					/>

					<Button
						title="Отправить предложение"
						onPress={() => router.back()}
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
	carModel: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
		marginBottom: Spacing.one,
	},
	carYear: {
		fontSize: 13,
		fontWeight: '500',
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
