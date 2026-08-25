import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	TextInput,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'

interface Message {
	id: string
	sender: 'user' | 'seller'
	text: string
	time: string
}

export default function ChatScreen() {
	const { id } = useLocalSearchParams()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const [messageText, setMessageText] = useState('')

	const messages: Message[] = [
		{
			id: '1',
			sender: 'user',
			text: 'Салам. Стойки на Камри 50 есть в наличии?',
			time: '9:31',
		},
		{
			id: '2',
			sender: 'seller',
			text: 'Салам. Есть, две пары. 3 200 за штуку.',
			time: '9:33',
		},
	]

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header */}
				<View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="chevron-back" size={24} color={colors.text} />
					</TouchableOpacity>

					<View style={styles.headerInfo}>
						<Text style={[styles.headerTitle, { color: colors.text }]}>
							Автодеталь Азамат
						</Text>
						<Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
							4.8 · 8 в сети · Ряд 14 · Бокс #12
						</Text>
					</View>

					<Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
				</View>

				{/* Product Card */}
				<Card variant="outlined" style={styles.productCard}>
					<View style={styles.productInfo}>
						<View>
							<Text style={[styles.productTitle, { color: colors.text }]}>
								Стойки передние · Camry 50
							</Text>
							<Text style={[styles.productDesc, { color: colors.textSecondary }]}>
								Дубликат 555 - гарантия 3 мес
							</Text>
						</View>
						<Text style={[styles.productPrice, { color: colors.accent }]}>
							3 200
						</Text>
					</View>
				</Card>

				{/* Warning */}
				<View style={[styles.warning, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
					<Ionicons name="alert-circle" size={16} color={colors.error} />
					<Text style={[styles.warningText, { color: colors.error }]}>
						Оплата в боксе при смотре. Предложу не переводить.
					</Text>
				</View>

				{/* Messages */}
				<ScrollView
					style={styles.messages}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.messagesContent}
				>
					<Text style={[styles.dateLabel, { color: colors.textTertiary }]}>
						Сегодня
					</Text>

					{messages.map((msg) => (
						<View
							key={msg.id}
							style={[
								styles.messageGroup,
								msg.sender === 'user' ? styles.userMessage : styles.sellerMessage,
							]}
						>
							<View
								style={[
									styles.messageBubble,
									{
										backgroundColor:
											msg.sender === 'user'
												? colors.accent
												: colors.surfaceAlt,
									},
								]}
							>
								<Text
									style={[
										styles.messageText,
										{
											color:
												msg.sender === 'user'
													? colors.background
													: colors.text,
										},
									]}
								>
									{msg.text}
								</Text>
								<Text
									style={[
										styles.messageTime,
										{
											color:
												msg.sender === 'user'
													? 'rgba(0,0,0,0.5)'
													: colors.textTertiary,
										},
									]}
								>
									{msg.time}
								</Text>
							</View>
						</View>
					))}

					<View style={styles.actionButtons}>
						<Button
							title="Забронировать на 2 часа"
							variant="secondary"
							size="medium"
							onPress={() => {}}
						/>
					</View>

					<Text style={[styles.infoText, { color: colors.textSecondary }]}>
						Как пройти в бокс
					</Text>
				</ScrollView>

				{/* Input */}
				<View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
					<TextInput
						placeholder="Сообщение"
						placeholderTextColor={colors.textTertiary}
						value={messageText}
						onChangeText={setMessageText}
						style={[
							styles.input,
							{ color: colors.text, borderColor: colors.border },
						]}
					/>
					<TouchableOpacity
						style={[styles.sendButton, { backgroundColor: colors.accent }]}
						onPress={() => setMessageText('')}
					>
						<Ionicons name="mic" size={20} color={colors.background} />
					</TouchableOpacity>
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
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	headerInfo: {
		flex: 1,
		marginHorizontal: Spacing.three,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	headerSubtitle: {
		fontSize: 12,
		marginTop: Spacing.one,
	},
	productCard: {
		margin: Spacing.four,
		marginBottom: Spacing.two,
	},
	productInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	productTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	productDesc: {
		fontSize: 12,
	},
	productPrice: {
		fontSize: 18,
		fontWeight: '700',
	},
	warning: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: Spacing.four,
		marginBottom: Spacing.three,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: BorderRadius.medium,
		gap: Spacing.two,
	},
	warningText: {
		fontSize: 12,
		flex: 1,
		fontWeight: '500',
	},
	messages: {
		flex: 1,
		paddingHorizontal: Spacing.four,
	},
	messagesContent: {
		paddingVertical: Spacing.three,
	},
	dateLabel: {
		fontSize: 12,
		textAlign: 'center',
		marginBottom: Spacing.three,
		fontWeight: '500',
	},
	messageGroup: {
		marginBottom: Spacing.three,
		flexDirection: 'row',
	},
	userMessage: {
		justifyContent: 'flex-end',
	},
	sellerMessage: {
		justifyContent: 'flex-start',
	},
	messageBubble: {
		maxWidth: '80%',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: BorderRadius.large,
	},
	messageText: {
		fontSize: 14,
		marginBottom: Spacing.one,
	},
	messageTime: {
		fontSize: 11,
		fontWeight: '500',
	},
	actionButtons: {
		marginVertical: Spacing.four,
		gap: Spacing.two,
	},
	infoText: {
		fontSize: 14,
		fontWeight: '500',
		marginTop: Spacing.three,
	},
	inputArea: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderTopWidth: 1,
		gap: Spacing.two,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderRadius: BorderRadius.full,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		fontSize: 14,
	},
	sendButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
