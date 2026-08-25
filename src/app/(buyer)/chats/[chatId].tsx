import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	FlatList,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Message } from '@/types'

const MOCK_MESSAGES: Message[] = [
	{
		id: '1',
		chatId: '1',
		senderId: 'seller_1',
		content: 'Привет! Спасибо за запрос',
		createdAt: new Date(Date.now() - 10 * 60000),
		isRead: true,
	},
	{
		id: '2',
		chatId: '1',
		senderId: 'user_1',
		content: 'Привет! Нужны ли стойки передние?',
		createdAt: new Date(Date.now() - 8 * 60000),
		isRead: true,
	},
	{
		id: '3',
		chatId: '1',
		senderId: 'seller_1',
		content: 'Есть в наличии, доставлю за 2 дня',
		createdAt: new Date(Date.now() - 2 * 60000),
		isRead: true,
	},
]

export default function ChatDetailScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()
	const { chatId } = useLocalSearchParams()

	const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
	const [newMessage, setNewMessage] = useState('')

	const handleSend = () => {
		if (!newMessage.trim()) return
		const message: Message = {
			id: `${Date.now()}`,
			chatId: chatId as string,
			senderId: 'user_1',
			content: newMessage,
			createdAt: new Date(),
			isRead: false,
		}
		setMessages([...messages, message])
		setNewMessage('')
	}

	const renderMessage = ({ item }: { item: Message }) => {
		const isOwn = item.senderId === 'user_1'
		return (
			<View
				style={[
					styles.messageRow,
					{ justifyContent: isOwn ? 'flex-end' : 'flex-start' },
				]}
			>
				<View
					style={[
						styles.messageBubble,
						{
							backgroundColor: isOwn ? colors.accent : colors.surface,
							borderColor: isOwn ? colors.accent : colors.border,
						},
					]}
				>
					<Text
						style={[
							styles.messageText,
							{ color: isOwn ? colors.background : colors.text },
						]}
					>
						{item.content}
					</Text>
				</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header
				title="Продавец #1"
				onBack={() => router.back()}
			/>

			<KeyboardAvoidingView
				style={styles.content}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<FlatList
					data={messages}
					renderItem={renderMessage}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.messagesList}
					scrollEnabled={true}
					inverted
				/>

				<View
					style={[
						styles.inputContainer,
						{ borderTopColor: colors.border, backgroundColor: colors.surface },
					]}
				>
					<TextInput
						placeholder="Напишите сообщение..."
						placeholderTextColor={colors.textTertiary}
						value={newMessage}
						onChangeText={setNewMessage}
						multiline
						style={[
							styles.input,
							{ color: colors.text },
						]}
					/>
					<TouchableOpacity
						onPress={handleSend}
						disabled={!newMessage.trim()}
					>
						<Ionicons
							name="send"
							size={20}
							color={newMessage.trim() ? colors.accent : colors.textTertiary}
						/>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	messagesList: {
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		gap: Spacing.two,
	},
	messageRow: {
		flexDirection: 'row',
		marginBottom: Spacing.one,
	},
	messageBubble: {
		maxWidth: '80%',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		borderRadius: 12,
		borderWidth: 1,
	},
	messageText: {
		fontSize: 14,
		lineHeight: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.three,
		paddingVertical: Spacing.two,
		gap: Spacing.two,
		borderTopWidth: 1,
	},
	input: {
		flex: 1,
		maxHeight: 100,
		fontSize: 14,
		paddingVertical: Spacing.one,
	},
})
