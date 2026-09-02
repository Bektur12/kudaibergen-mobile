import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '@/context/app'

export default function ChatDetailScreen() {
	const { id } = useLocalSearchParams()
	const router = useRouter()
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const { getMessagesByChat, sendMessage } = useApp()

	const [messageText, setMessageText] = useState('')
	const [messages, setMessages] = useState<any[]>([])

	useEffect(() => {
		if (id) {
			const msgs = getMessagesByChat(id as string)
			setMessages(msgs)
		}
	}, [id, getMessagesByChat])

	const handleSend = async () => {
		if (!messageText.trim() || !id) return

		await sendMessage(id as string, 'user_current', messageText)
		setMessageText('')

		const updatedMessages = getMessagesByChat(id as string)
		setMessages(updatedMessages)
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<Header title="Переписка" />

			{/* Seller Info Bar */}
			<View style={[styles.sellerBar, { backgroundColor: colors.surface }]}>
				<View style={styles.sellerInfo}>
					<View style={[styles.sellerAvatar, { backgroundColor: colors.surfaceAlt }]} />
					<View>
						<Text style={[styles.sellerName, { color: colors.text }]}>
							АвтоПрофи Магазин
						</Text>
						<Text style={[styles.sellerStatus, { color: colors.textSecondary }]}>
							🟢 В сети
						</Text>
					</View>
				</View>
				<TouchableOpacity>
					<Ionicons name="call" size={20} color={colors.accent} />
				</TouchableOpacity>
			</View>

			{/* Product Preview */}
			<Card variant="outlined" style={[styles.productCard, { marginHorizontal: Spacing.three }]}>
				<View style={[styles.productImage, { backgroundColor: colors.surfaceAlt }]} />
				<View style={styles.productInfo}>
					<Text style={[styles.productName, { color: colors.text }]}>
						Тормозные колодки Toyota
					</Text>
					<Text style={[styles.productPrice, { color: colors.accent }]}>
						$45.99
					</Text>
				</View>
			</Card>

			{/* Messages */}
			<ScrollView
				style={styles.messagesContainer}
				contentContainerStyle={styles.messagesList}
				showsVerticalScrollIndicator={false}
			>
				{messages.length > 0 ? (
					messages.map((msg, idx) => (
						<View
							key={idx}
							style={[
								styles.messageRow,
								msg.senderId === 'user_current' ? styles.sentMessage : styles.receivedMessage,
							]}
						>
							<View
								style={[
									styles.messageBubble,
									{
										backgroundColor:
											msg.senderId === 'user_current' ? colors.accent : colors.surface,
									},
								]}
							>
								<Text
									style={[
										styles.messageText,
										{
											color:
												msg.senderId === 'user_current'
													? colors.background
													: colors.text,
										},
									]}
								>
									{msg.content}
								</Text>
								<Text
									style={[
										styles.messageTime,
										{
											color:
												msg.senderId === 'user_current'
													? 'rgba(255,255,255,0.7)'
													: colors.textTertiary,
										},
									]}
								>
									{new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</Text>
							</View>
						</View>
					))
				) : (
					<View style={styles.emptyState}>
						<Ionicons name="chatbubble-outline" size={48} color={colors.textTertiary} />
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							Нет сообщений
						</Text>
						<Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
							Начните переписку с продавцом
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Warning Box */}
			<View style={[styles.warningBox, { backgroundColor: colors.surfaceAlt }]}>
				<Ionicons name="alert-circle-outline" size={16} color={colors.accent} />
				<Text style={[styles.warningText, { color: colors.textSecondary }]}>
					Не передавайте деньги до встречи. Проверьте товар лично.
				</Text>
			</View>

			{/* Action Buttons */}
			<View style={styles.actionsContainer}>
				<Button
					label="Зарезервировать"
					variant="primary"
					size="medium"
					style={{ flex: 1 }}
				/>
				<Button
					label="Встреча"
					variant="secondary"
					size="medium"
					style={{ flex: 1 }}
				/>
			</View>

			{/* Input */}
			<View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
				<View
					style={[
						styles.inputField,
						{
							backgroundColor: colors.surfaceAlt,
							borderColor: colors.border,
						},
					]}
				>
					<TextInput
						style={[styles.input, { color: colors.text }]}
						placeholder="Введите сообщение..."
						placeholderTextColor={colors.textTertiary}
						value={messageText}
						onChangeText={setMessageText}
						multiline
						maxHeight={100}
					/>
					<TouchableOpacity onPress={handleSend} disabled={!messageText.trim()}>
						<Ionicons
							name="send"
							size={20}
							color={messageText.trim() ? colors.accent : colors.textTertiary}
						/>
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
	sellerBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
	},
	sellerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		flex: 1,
	},
	sellerAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	sellerName: {
		fontSize: 14,
		fontWeight: '700',
	},
	sellerStatus: {
		fontSize: 12,
	},
	productCard: {
		marginVertical: Spacing.three,
		flexDirection: 'row',
		gap: Spacing.two,
		padding: Spacing.two,
	},
	productImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
	},
	productInfo: {
		flex: 1,
		justifyContent: 'center',
	},
	productName: {
		fontSize: 13,
		fontWeight: '600',
		marginBottom: Spacing.one,
	},
	productPrice: {
		fontSize: 14,
		fontWeight: '700',
	},
	messagesContainer: {
		flex: 1,
		paddingHorizontal: Spacing.three,
	},
	messagesList: {
		paddingVertical: Spacing.three,
		gap: Spacing.two,
	},
	messageRow: {
		flexDirection: 'row',
	},
	sentMessage: {
		justifyContent: 'flex-end',
	},
	receivedMessage: {
		justifyContent: 'flex-start',
	},
	messageBubble: {
		borderRadius: 12,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		maxWidth: '80%',
	},
	messageText: {
		fontSize: 14,
		lineHeight: 18,
		marginBottom: Spacing.one,
	},
	messageTime: {
		fontSize: 11,
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: Spacing.six,
	},
	emptyText: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: Spacing.two,
	},
	emptyHint: {
		fontSize: 12,
		marginTop: Spacing.one,
	},
	warningBox: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.two,
		marginHorizontal: Spacing.three,
		marginVertical: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: 8,
	},
	warningText: {
		fontSize: 12,
		flex: 1,
	},
	actionsContainer: {
		flexDirection: 'row',
		gap: Spacing.two,
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
	},
	inputContainer: {
		borderTopWidth: 1,
		borderTopColor: '#333',
		padding: Spacing.three,
	},
	inputField: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		borderRadius: 8,
		borderWidth: 1,
		paddingHorizontal: Spacing.two,
		paddingVertical: Spacing.one,
		gap: Spacing.two,
	},
	input: {
		flex: 1,
		fontSize: 14,
		paddingVertical: Spacing.two,
		maxHeight: 100,
	},
})
