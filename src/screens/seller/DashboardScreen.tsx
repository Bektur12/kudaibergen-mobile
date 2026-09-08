import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { C, T, Badge, ScreenHeader, Btn } from '@/components/ui';

const REQUESTS = [
  {
    id: 1,
    car: 'Toyota Camry 70',
    part: 'Тормозные диски — задние',
    budget: '3 000–5 000 с',
    city: 'Бишкек',
    offers: 3,
    urgent: true,
    icon: '🚗',
  },
  {
    id: 2,
    car: 'BMW X5 G05',
    part: 'Масляный фильтр оригинал',
    budget: '1 500–2 500 с',
    city: 'Бишкек',
    offers: 7,
    urgent: false,
    icon: '🏎️',
  },
  {
    id: 3,
    car: 'Kia Sportage',
    part: 'Фара правая LED',
    budget: '8 000–15 000 с',
    city: 'Ош',
    offers: 1,
    urgent: true,
    icon: '🚙',
  },
];

const ACTIVITY = [
  { icon: '👁️', text: 'Просмотр объявления «Тормоза Brembo»', time: '5 мин' },
  { icon: '✅', text: 'Отправлено предложение покупателю на Camry', time: '1 ч' },
  { icon: '💬', text: 'Новое сообщение от Арстан Б.', time: '3 ч' },
  { icon: '⭐', text: 'Получен отзыв 5★ от покупателя', time: '5 ч' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  statsContainer: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '800',
    fontSize: 22,
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  requestsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requestIcon: {
    fontSize: 32,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  requestDesc: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  urgentBadge: {
    backgroundColor: '#EF5350',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  requestDetails: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 8,
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  activityIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: C.textPrimary,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    color: C.textTertiary,
    marginTop: 2,
  },
});

export default function DashboardScreen({
  onOpenChat,
}: {
  onOpenChat?: () => void;
}) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Панель продавца" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Объявления</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>34%</Text>
              <Text style={styles.statLabel}>Конверсия</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Просмотров</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>89.5K</Text>
              <Text style={styles.statLabel}>Доход (мес)</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Btn full onPress={() => {}} variant="primary">
            ➕ Добавить товар
          </Btn>
          <Btn full onPress={() => {}} style={{ marginLeft: 8 }}>
            📊 Аналитика
          </Btn>
        </View>

        {/* Requests */}
        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Новые запросы от покупателей</Text>
          {REQUESTS.map((request) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                request.urgent && { borderLeftColor: '#EF5350' },
              ]}
            >
              <View style={styles.requestHeader}>
                <Text style={styles.requestIcon}>{request.icon}</Text>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>{request.car}</Text>
                  <Text style={styles.requestDesc}>{request.part}</Text>
                </View>
                {request.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>⚡ СРОЧНО</Text>
                  </View>
                )}
              </View>
              <Text style={styles.requestDetails}>
                Бюджет: {request.budget} | 📍 {request.city}
              </Text>
              <Text style={styles.requestDetails}>
                Уже {request.offers} предложений от других
              </Text>
              <Btn full onPress={() => onOpenChat?.()}>
                Отправить предложение
              </Btn>
            </View>
          ))}
        </View>

        {/* Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Последняя активность</Text>
          {ACTIVITY.map((act, idx) => (
            <View key={idx} style={styles.activityItem}>
              <Text style={styles.activityIcon}>{act.icon}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{act.text}</Text>
                <Text style={styles.activityTime}>{act.time} назад</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
