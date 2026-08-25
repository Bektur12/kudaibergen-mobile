import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	TextInput,
} from 'react-native'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Ionicons } from '@expo/vector-icons'

interface Chat {
	id: string
	avatar: string
	name: string
	lastMessage: string
	lastTime: string
	unread: number
	price?: string
}

export default function MessagesScreen() {
	const colorScheme = useColorScheme() ?? 'dark'
	const isDark = colorScheme === 'dark'
	const colors = isDark ? Colors.dark : Colors.light
	const router = useRouter()

	const chats: Chat[] = [
		{
			id: '1',
			avatar: 'АА',
			name: 'Автодеталь Азамат',
			lastMessage: 'Стойки передние · 3 200 сом',
			lastTime: '9:38',
			unread: 2,
			price: '3 200',
		},
		{
			id: '2',
			avatar: 'МП',
			name: 'Мотор-Плюс',
			lastMessage: 'Фара левая · 6 500 сом',
			lastTime: '9:38',
			unread: 0,
			price: '6 500',
		},
		{
			id: '3',
			avatar: 'ША',
			name: 'Шрот Ак-Ниет',
			lastMessage: 'Балка задняя · 2 400 сом',
			lastTime: '9:38',
			unread: 0,
			price: '2 400',
		},
	]

	const renderChatItem = ({ item }: { item: Chat }) => (
		<TouchableOpacity
			onPress={() => router.push(`/(buyer)/chat/${item.id}`)}
		>
			<View style={[styles.chatItem, { borderBottomColor: colors.border }]}>
				<View
					style={[
						styles.avatar,
						{ backgroundColor: colors.accent },
					]}
				>
					<Text style={styles.avatarText}>{item.avatar}</Text>
				</View>

				<View style={styles.chatContent}>
					<View style={styles.chatHeader}>
						<Text style={[styles.chatName, { color: colors.text }]}>
							{item.name}
						</Text>
						<Text style={[styles.time, { color: colors.textTertiary }]}>
							{item.lastTime}
						</Text>
					</View>
					<View style={styles.messageRow}>
						<Text
							style={[styles.lastMessage, { color: colors.textSecondary }]}
							numberOfLines={1}
						>
							{item.lastMessage}
						</Text>
						{item.unread > 0 && (
							<Badge
								label={item.unread.toString()}
								variant="accent"
								size="small"
							/>
						)}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			{/* Header */}
			<View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
				<Text style={[styles.headerTitle, { color: colors.text }]}>
					Чаты
				</Text>
				<Ionicons name="search" size={20} color={colors.textSecondary} />
			</View>

			{/* Chat List */}
			<FlatList
				data={chats}
				renderItem={renderChatItem}
				keyExtractor={(item) => item.id}
				scrollEnabled={true}
			/>
		</View>
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
	headerTitle: {
		fontSize: Typography.heading.fontSize,
		fontWeight: '700',
	},
	chatItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: Spacing.four,
		paddingVertical: Spacing.three,
		borderBottomWidth: 1,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: Spacing.three,
	},
	avatarText: {
		color: '#000000',
		fontSize: 14,
		fontWeight: '700',
	},
	chatContent: {
		flex: 1,
	},
	chatHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: Spacing.one,
	},
	chatName: {
		fontSize: 15,
		fontWeight: '600',
	},
	time: {
		fontSize: 12,
	},
	messageRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	lastMessage: {
		fontSize: 13,
		flex: 1,
	},
})
