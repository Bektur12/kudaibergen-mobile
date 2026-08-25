import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	useColorScheme,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing } from '@/constants/theme'
import { Header } from '@/components/ui/Header'
import { Chat } from '@/types'

const MOCK_CHATS: Chat[] = [
	{
		id: '1',
		participantIds: ['user_1', 'seller_1'],
		lastMessage: 'Есть в наличии, доставлю за 2 дня',
		lastMessageTime: new Date(Date.now() - 10 * 60000),
		unreadCount: 2,
	},
	{
		id: '2',
		participantIds: ['user_1', 'seller_2'],
		lastMessage: 'Спасибо за запрос, проверю наличие',
		lastMessageTime: new Date(Date.now() - 60 * 60000),
		unreadCount: 0,
	},
	{
		id: '3',
		participantIds: ['user_1', 'seller_3'],
		lastMessage: 'Готовы предложить по цене ниже',
		lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
		unreadCount: 0,
	},
]

function formatTime(date: Date) {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)

	if (minutes < 1) return 'Сейчас'
	if (minutes < 60) return `${minutes}м назад`
	if (hours < 24) return `${hours}ч назад`
	return `${days}д назад`
}

export default function ChatsScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const renderChat = ({ item }: { item: Chat }) => (
		<TouchableOpacity
			onPress={() => router.push(`/(buyer)/chats/${item.id}`)}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.chatItem,
					{
						backgroundColor: item.unreadCount > 0 ? colors.surfaceAlt : colors.surface,
						borderColor: colors.border,
					},
				]}
			>
				<View style={styles.avatar}>
					<Text style={[styles.avatarText, { color: colors.background }]}>
						S{item.id}
					</Text>
				</View>

				<View style={styles.chatContent}>
					<Text style={[styles.sellerName, { color: colors.text }]}>
						Продавец #{item.participantIds[1].split('_')[1]}
					</Text>
					<Text
						style={[
							styles.lastMessage,
							{ color: colors.textSecondary },
						]}
						numberOfLines={1}
					>
						{item.lastMessage}
					</Text>
				</View>

				<View style={styles.chatRight}>
					<Text style={[styles.time, { color: colors.textTertiary }]}>
						{formatTime(item.lastMessageTime || new Date())}
					</Text>
					{item.unreadCount > 0 && (
						<View style={[styles.badge, { backgroundColor: colors.accent }]}>
							<Text style={[styles.badgeText, { color: colors.background }]}>
								{item.unreadCount}
							</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Header title="Чаты" />
			<FlatList
				data={MOCK_CHATS}
				renderItem={renderChat}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		padding: Spacing.four,
		gap: Spacing.two,
	},
	chatItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: Spacing.three,
		borderRadius: 12,
		borderWidth: 1,
		gap: Spacing.three,
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#FFB020',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 13,
		fontWeight: '700',
	},
	chatContent: {
		flex: 1,
	},
	sellerName: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: Spacing.half,
	},
	lastMessage: {
		fontSize: 13,
	},
	chatRight: {
		alignItems: 'flex-end',
		gap: Spacing.one,
	},
	time: {
		fontSize: 11,
	},
	badge: {
		width: 20,
		height: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeText: {
		fontSize: 10,
		fontWeight: '700',
	},
})
