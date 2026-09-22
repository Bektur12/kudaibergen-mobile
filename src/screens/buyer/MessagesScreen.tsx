import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, Avatar, ScreenHeader } from '@/components/ui';
import type { ChatSummary } from '@/lib/chat-api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  searchContainer: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  searchBar: {
    backgroundColor: C.bg,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  chatItem: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
  },
  chatTime: {
    fontSize: 13,
    color: C.textTertiary,
  },
  chatMessage: {
    fontSize: 15,
    color: C.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    color: C.textTertiary,
    textAlign: 'center',
  },
});

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';
}

export default function MessagesScreen({
  chats = [],
  loading = false,
  refreshing = false,
  onRefresh,
  onOpenChat,
  /** Buyer chats are titled by store name; seller chats have no buyer-name field from the API yet. */
  titleFor = (chat) => chat.storeName,
}: {
  chats?: ChatSummary[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenChat?: (chat: ChatSummary) => void;
  titleFor?: (chat: ChatSummary) => string;
}) {
  const [search, setSearch] = useState('');
  const filteredChats = chats.filter(
    (c) => !search || titleFor(c).toLowerCase().includes(search.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: ChatSummary }) => {
    const title = titleFor(item);
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => onOpenChat?.(item)}>
        <Avatar initials={initialsOf(title)} size={44} />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{title}</Text>
            <Text style={styles.chatTime}>{formatTime(item.lastMessageAt)}</Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.lastMessage || 'Нет сообщений'}
          </Text>
        </View>
        {item.hasUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Чаты" />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={C.textTertiary} />
          <TextInput
            placeholder="Поиск в чатах"
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              fontSize: 16,
              color: C.textPrimary,
            }}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : filteredChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={44} color={C.textTertiary} />
          <Text style={styles.emptyText}>Чатов не найдено</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />
            ) : undefined
          }
        />
      )}
    </View>
  );
}
