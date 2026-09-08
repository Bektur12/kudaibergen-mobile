import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { C, CDark, Btn } from '@/components/ui'
import { MOCK_REQUESTS, getTimeAgo, getTimeRemaining } from '@/data/requests'
import type { Request } from '@/types'

type FilterType = 'all' | 'urgent' | 'active'

export default function RequestsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = isDark ? CDark : C

  const [filter, setFilter] = useState<FilterType>('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    if (filter === 'urgent') return req.isUrgent
    if (filter === 'active') return req.status === 'active'
    return true
  })

  const renderRequestCard = (request: Request) => {
    const isExpanded = showDetails === request.id
    const timeAgo = getTimeAgo(request.createdAt)
    const timeRemaining = getTimeRemaining(request.expiresAt)

    return (
      <TouchableOpacity
        key={request.id}
        onPress={() =>
          setShowDetails(isExpanded ? null : request.id)
        }
        style={[
          styles.requestCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.carModel, { color: colors.textPrimary }]}>
                🚗 {request.carModel}
              </Text>
              {request.isUrgent && (
                <View
                  style={[
                    styles.urgentBadge,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <Ionicons
                    name="flash"
                    size={12}
                    color="#fff"
                  />
                  <Text style={styles.urgentText}>СРОЧНО</Text>
                </View>
              )}
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.description,
                { color: colors.textSecondary },
              ]}
            >
              {request.description}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textTertiary}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textTertiary}
            />
            <Text style={[styles.statText, { color: colors.textTertiary }]}>
              {timeAgo}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statText, { color: colors.primary }]}>
              💬 {request.offerCount} предложений
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statText, { color: colors.error }]}>
              ⏱️ {timeRemaining}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View
            style={[
              styles.details,
              { borderTopColor: colors.border },
            ]}
          >
            {/* Full Description */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                ОПИСАНИЕ
              </Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                {request.description}
              </Text>
            </View>

            {/* Budget */}
            {request.budget && (
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                  БЮДЖЕТ
                </Text>
                <Text
                  style={[
                    styles.detailText,
                    { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  ${request.budget.min.toLocaleString()} - $
                  {request.budget.max.toLocaleString()}{' '}
                  {request.budget.currency}
                </Text>
              </View>
            )}

            {/* City */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                ГОРОД
              </Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                📍 {request.city}
              </Text>
            </View>

            {/* Expires At */}
            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                ДЕЙСТВИТЕЛЕН
              </Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                {getTimeRemaining(request.expiresAt)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Отправить предложение</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={colors.textPrimary}
                />
                <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                  Написать
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Запросы покупателей
        </Text>
        <View style={styles.headerStats}>
          <View
            style={[
              styles.statBadge,
              { backgroundColor: colors.primaryTint || '#FFEDE3' },
            ]}
          >
            <Text style={[styles.statBadgeText, { color: colors.primary }]}>
              {filteredRequests.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View
        style={[
          styles.filterContainer,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row' }}
        >
          {[
            { id: 'all' as FilterType, label: 'Все', icon: '📋' },
            { id: 'urgent' as FilterType, label: 'Срочные', icon: '⚡' },
            { id: 'active' as FilterType, label: 'Активные', icon: '✓' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filter === f.id ? colors.primary : colors.bg,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === f.id ? '#fff' : colors.textPrimary,
                    fontWeight: filter === f.id ? '700' : '500',
                  },
                ]}
              >
                {f.icon} {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
            Нет запросов по этому фильтру
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderRequestCard(item)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  requestCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  carModel: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  description: {
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  details: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 14,
  },
})
