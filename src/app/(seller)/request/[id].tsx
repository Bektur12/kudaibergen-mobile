import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing, Typography, Layout } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createOffer } from '@/lib/request-api'
import { ApiError } from '@/lib/api'

export default function SellerRequestDetailScreen() {
	// These come straight from the requests list (SellerRequestRow) that
	// navigated here — no second fetch needed, GET /requests/{id} is scoped
	// to the buyer who owns it anyway.
	const { id, categoryLabel, description, car, budgetMin, budgetMax, currency } = useLocalSearchParams<{
		id: string
		categoryLabel?: string
		description?: string
		car?: string
		budgetMin?: string
		budgetMax?: string
		currency?: string
	}>()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const [price, setPrice] = useState('')
	const [comment, setComment] = useState('')
	const [deliveryDays, setDeliveryDays] = useState('')
	const [sending, setSending] = useState(false)

	const budgetLine =
		budgetMin || budgetMax
			? `${budgetMin ?? ''}${budgetMin && budgetMax ? '–' : ''}${budgetMax ?? ''} ${currency ?? ''}`.trim()
			: null

	const handleSubmit = async () => {
		setSending(true)
		try {
			// No separate "buyer accepts" step anymore — the chat exists the
			// moment this reply is sent, so jump straight into it instead of
			// just going back to the requests list.
			const offer = await createOffer({
				requestId: Number(id),
				price: price.trim() ? parseInt(price.replace(/\D/g, ''), 10) : undefined,
				comment: comment.trim() || undefined,
				deliveryDays: deliveryDays.trim() ? parseInt(deliveryDays.replace(/\D/g, ''), 10) : undefined,
			})
			router.replace({
				pathname: '/(seller)/chat/[id]',
				params: { id: offer.chatId.toString(), name: 'Покупатель' },
			})
		} catch (err) {
			Alert.alert('Не удалось отправить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
		} finally {
			setSending(false)
		}
	}

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
							{categoryLabel || 'Запчасть'}
						</Text>
						{!!car && (
							<Text style={[styles.carYear, { color: colors.textSecondary }]}>{car}</Text>
						)}
						<Text style={[styles.description, { color: colors.text }]}>{description}</Text>
						{budgetLine && (
							<Text style={[styles.budget, { color: colors.accent }]}>Бюджет: {budgetLine}</Text>
						)}
					</Card>

					<Text style={[styles.label, { color: colors.text, marginTop: Spacing.five }]}>
						Ваше предложение
					</Text>

					<Input
						placeholder="Цена в сомах (необязательно)"
						value={price}
						onChangeText={setPrice}
						keyboardType="number-pad"
						style={styles.input}
					/>

					<Input
						placeholder="Описание вашего предложения"
						value={comment}
						onChangeText={setComment}
						multiline
						numberOfLines={4}
						style={styles.input}
					/>

					<Input
						placeholder="Срок доставки, дней (необязательно)"
						value={deliveryDays}
						onChangeText={setDeliveryDays}
						keyboardType="number-pad"
						style={styles.input}
					/>

					<Button
						title={sending ? 'Отправка...' : 'Отправить предложение'}
						onPress={handleSubmit}
						disabled={sending}
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
		padding: Layout.gutter,
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
		marginBottom: Spacing.two,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: Spacing.two,
	},
	budget: {
		fontSize: 14,
		fontWeight: '700',
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
