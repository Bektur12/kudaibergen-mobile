import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { C, T, Avatar, ScreenHeader } from '@/components/ui';

const CHATS = [
  {
    id: 1,
    name: 'АвтоДетали',
    initials: 'АД',
    lastMsg: 'Товар в наличии, приходите!',
    time: '9:38',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Мотор-Плюс',
    initials: 'МП',
    lastMsg: 'Фара левая — 6 500 сом',
    time: '9:15',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'AutoPro СТО',
    initials: 'АС',
    lastMsg: 'Записали вас на 14:00',
    time: 'Вчера',
    unread: 1,
    online: true,
  },
  {
    id: 4,
    name: 'TireKing',
    initials: 'ТК',
    lastMsg: 'Сезонные шины в наличии',
    time: 'Вчера',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Азамат (Camry)',
    initials: 'АМ',
    lastMsg: 'Договорились, встречаемся!',
    time: 'Пн',
    unread: 0,
    online: false,
  },
];

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
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
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
    fontSize: 15,
    color: C.textPrimary,
  },
  chatTime: {
    fontSize: 12,
    color: C.textTertiary,
  },
  chatMessage: {
    fontSize: 13,
    color: C.textSecondary,
  },
  unreadBadge: {
    backgroundColor: C.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: C.textTertiary,
    textAlign: 'center',
  },
});

export default function MessagesScreen({
  onOpenChat,
}: {
  onOpenChat?: (id: number) => void;
}) {
  const [search, setSearch] = useState('');
  const filteredChats = CHATS.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: typeof CHATS[0] }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onOpenChat?.(item.id)}
    >
      <View style={{ position: 'relative' }}>
        <Avatar initials={item.initials} size={44} />
        {item.online && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: C.success,
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        )}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.lastMsg}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Чаты" />

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            placeholder="Поиск в чатах..."
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              fontSize: 14,
              color: C.textPrimary,
              fontWeight: '500',
            }}
          />
        </View>
      </View>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>Чатов не найдено</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChatItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
