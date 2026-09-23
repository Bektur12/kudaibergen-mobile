import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C } from '@/components/ui'
import { getTimeAgo, getTimeRemaining } from '@/data/requests'
import { getPartCategoryInfo } from '@/data/parts'
import { toProductCategory } from '@/lib/store-api'
import {
  getMyStoreRequests,
  getMyTemplates,
  markRequestSeen,
  type SellerRequestRow,
  type Template,
} from '@/lib/seller-api'
import { createOffer, bulkReply } from '@/lib/request-api'
import { ApiError } from '@/lib/api'

type FilterType = 'ALL' | 'URGENT' | 'UNANSWERED'

const FILTER_LABELS: { id: FilterType; label: string }[] = [
  { id: 'ALL', label: 'Все' },
  { id: 'URGENT', label: 'Срочные' },
  { id: 'UNANSWERED', label: 'Без ответа' },
]

export default function RequestsScreen() {
  const colors = C
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [filter, setFilter] = useState<FilterType>('ALL')
  const [requests, setRequests] = useState<SellerRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])

  const [showDetails, setShowDetails] = useState<number | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [templateTargetIds, setTemplateTargetIds] = useState<number[] | null>(null)
  const [sendingTemplateFor, setSendingTemplateFor] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [reqRes, tplRes] = await Promise.all([
          getMyStoreRequests(filter, 0, 100),
          getMyTemplates(),
        ])
        if (!cancelled) {
          setRequests(reqRes.content)
          setTemplates(tplRes)
        }
      } catch {
        // keep whatever was on screen
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filter])

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const [reqRes, tplRes] = await Promise.all([
        getMyStoreRequests(filter, 0, 100),
        getMyTemplates(),
      ])
      setRequests(reqRes.content)
      setTemplates(tplRes)
    } catch {
      // keep whatever was on screen
    } finally {
      setRefreshing(false)
    }
  }, [filter])

  // Auto-group requests by part category so the seller sees
  // "23 people want brake pads" instead of 23 separate rows.
  const groupedRequests = useMemo(() => {
    const map = new Map<string, SellerRequestRow[]>()
    requests.forEach((req) => {
      const key = req.category
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(req)
    })
    return Array.from(map.entries())
      .map(([category, items]) => ({
        category,
        items,
        urgentCount: items.filter((i) => i.isUrgent).length,
      }))
      .sort((a, b) => b.urgentCount - a.urgentCount || b.items.length - a.items.length)
  }, [requests])

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleGroupExpanded = (category: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const expandCard = (requestId: number) => {
    const next = showDetails === requestId ? null : requestId
    setShowDetails(next)
    if (next !== null) {
      const row = requests.find((r) => r.requestId === requestId)
      if (row && !row.seenAt) {
        markRequestSeen(requestId).catch(() => {})
        setRequests((prev) =>
          prev.map((r) => (r.requestId === requestId ? { ...r, seenAt: new Date().toISOString() } : r))
        )
      }
    }
  }

  const sendSingleTemplate = async (requestId: number, template: Template) => {
    setSendingTemplateFor(requestId)
    try {
      await createOffer({ requestId, comment: template.body })
      setRequests((prev) =>
        prev.map((r) =>
          r.requestId === requestId
            ? { ...r, offerCount: r.offerCount + 1, repliedAt: new Date().toISOString() }
            : r
        )
      )
    } catch (err) {
      Alert.alert('Не удалось отправить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
    } finally {
      setSendingTemplateFor(null)
    }
  }

  const sendBulkTemplate = async (template: Template) => {
    if (!templateTargetIds) return
    try {
      const result = await bulkReply({ requestIds: templateTargetIds, templateId: template.id })
      Alert.alert('Готово', `Отправлено: ${result.created}, пропущено: ${result.skipped}`)
      setSelectedIds(new Set())
      setSelectionMode(false)
      setTemplateTargetIds(null)
      refresh()
    } catch (err) {
      Alert.alert('Не удалось отправить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз')
    }
  }

  const openOfferScreen = (request: SellerRequestRow) => {
    const categoryInfo = getPartCategoryInfo(toProductCategory(request.category))
    router.push({
      pathname: '/(seller)/request/[id]',
      params: {
        id: request.requestId.toString(),
        categoryLabel: categoryInfo?.label ?? request.category,
        description: request.description,
        car: request.car ?? '',
        budgetMin: request.budgetMin?.toString() ?? '',
        budgetMax: request.budgetMax?.toString() ?? '',
        currency: request.currency ?? '',
      },
    })
  }

  const renderRequestCard = (request: SellerRequestRow) => {
    const isExpanded = showDetails === request.requestId
    const isSelected = selectedIds.has(request.requestId)
    const timeAgo = getTimeAgo(new Date(request.createdAt))
    const timeRemaining = getTimeRemaining(new Date(request.expiresAt))
    const partInfo = getPartCategoryInfo(toProductCategory(request.category))

    return (
      <TouchableOpacity
        key={request.requestId}
        onPress={() =>
          selectionMode ? toggleSelected(request.requestId) : expandCard(request.requestId)
        }
        style={[
          styles.requestCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          {selectionMode && (
            <Ionicons
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={isSelected ? colors.primary : colors.textTertiary}
            />
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.carModel, { color: colors.textPrimary }]}>
                {partInfo ? partInfo.label : request.category}
              </Text>
              {request.isUrgent && (
                <View style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.urgentText}>СРОЧНО</Text>
                </View>
              )}
              {!request.seenAt && (
                <View style={[styles.newDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text numberOfLines={1} style={[styles.description, { color: colors.textSecondary }]}>
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
            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.statText, { color: colors.textTertiary }]}>{timeAgo}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statText, { color: colors.textTertiary }]}>
              Ответили: {request.offerCount}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text
              style={[styles.statText, { color: request.isUrgent ? colors.error : colors.textTertiary }]}
            >
              {timeRemaining}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={[styles.details, { borderTopColor: colors.border }]}>
            {request.car && (
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>МАШИНА</Text>
                <Text style={[styles.detailText, { color: colors.textPrimary }]}>{request.car}</Text>
              </View>
            )}

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>ОПИСАНИЕ</Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                {request.description}
              </Text>
            </View>

            {(request.budgetMin || request.budgetMax) && (
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>БЮДЖЕТ</Text>
                <Text style={[styles.detailText, { color: colors.primary, fontWeight: '700' }]}>
                  {request.budgetMin?.toLocaleString()} - {request.budgetMax?.toLocaleString()}{' '}
                  {request.currency}
                </Text>
              </View>
            )}

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>ГОРОД</Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>{request.city}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>ДЕЙСТВИТЕЛЕН</Text>
              <Text style={[styles.detailText, { color: colors.textPrimary }]}>
                {getTimeRemaining(new Date(request.expiresAt))}
              </Text>
            </View>

            {templates.length > 0 && (
              <>
                <Text style={[styles.detailLabel, { color: colors.textTertiary, marginTop: 4 }]}>
                  БЫСТРЫЙ ОТВЕТ
                </Text>
                <View style={styles.quickChipsRow}>
                  {templates.map((tpl) => (
                    <TouchableOpacity
                      key={tpl.id}
                      onPress={() => sendSingleTemplate(request.requestId, tpl)}
                      disabled={sendingTemplateFor === request.requestId}
                      style={[
                        styles.quickChip,
                        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                      ]}
                    >
                      <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.quickChipText, { color: colors.textPrimary }]}>
                        {tpl.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => openOfferScreen(request)}
              >
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Отправить предложение</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderGroup = (group: { category: string; items: SellerRequestRow[]; urgentCount: number }) => {
    if (group.items.length === 1) {
      return <View key={group.category}>{renderRequestCard(group.items[0])}</View>
    }

    const partInfo = getPartCategoryInfo(toProductCategory(group.category as never))
    const isExpanded = expandedGroups.has(group.category)

    return (
      <View
        key={group.category}
        style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => toggleGroupExpanded(group.category)} style={styles.groupHeader}>
          <Text style={[styles.groupTitle, { color: colors.textPrimary }]}>
            {partInfo ? partInfo.label : group.category}
          </Text>
          <View style={[styles.groupCountBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.groupCountText}>{group.items.length}</Text>
          </View>
          {group.urgentCount > 0 && (
            <View style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
              <Ionicons name="flash" size={12} color="#fff" />
              <Text style={styles.urgentText}>{group.urgentCount}</Text>
            </View>
          )}
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <Text style={[styles.groupSubtitle, { color: colors.textSecondary }]}>
          {group.items.length} покупателей ищут это — ответьте всем сразу
        </Text>

        <TouchableOpacity
          onPress={() => setTemplateTargetIds(group.items.map((i) => i.requestId))}
          style={[styles.groupReplyButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="send" size={16} color="#fff" />
          <Text style={styles.groupReplyButtonText}>
            Ответить всем ({group.items.length}) одним нажатием
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.groupItems}>{group.items.map((item) => renderRequestCard(item))}</View>
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 12 },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Запросы покупателей</Text>
        <View style={styles.headerStats}>
          <TouchableOpacity onPress={toggleSelectionMode}>
            <Text style={[styles.selectModeText, { color: colors.primary }]}>
              {selectionMode ? 'Отмена' : 'Выбрать'}
            </Text>
          </TouchableOpacity>
          <View style={[styles.statBadge, { backgroundColor: colors.primaryTint || '#FFEDE3' }]}>
            <Text style={[styles.statBadgeText, { color: colors.primary }]}>{requests.length}</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.filterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
          {FILTER_LABELS.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterButton,
                { backgroundColor: filter === f.id ? colors.primary : colors.bg, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f.id ? '#fff' : colors.textPrimary, fontWeight: filter === f.id ? '700' : '500' },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={44} color={colors.textTertiary} />
          {filter === 'ALL' ? (
            <>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                Пока нет запросов для вашего магазина
              </Text>
              {/* The #1 reason a seller sees nothing here: no categories set,
                  so the backend has nothing to match their store against. */}
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                Запросы приходят по категориям товаров. Проверьте, что вы выбрали,
                что продаёте — иначе мы не знаем, что вам показывать.
              </Text>
              <TouchableOpacity
                style={[styles.emptyAction, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(seller)/(tabs)/inventory' as never)}
              >
                <Text style={styles.emptyActionText}>Выбрать категории товаров</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {filter === 'URGENT' ? 'Нет срочных запросов' : 'Вы ответили на все запросы'}
              </Text>
              <TouchableOpacity onPress={() => setFilter('ALL')}>
                <Text style={[styles.emptyActionLink, { color: colors.primary }]}>
                  Показать все запросы
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={groupedRequests}
          keyExtractor={(group) => group.category}
          renderItem={({ item }) => renderGroup(item)}
          contentContainerStyle={[styles.listContent, selectionMode && selectedIds.size > 0 && { paddingBottom: 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        />
      )}

      {selectionMode && selectedIds.size > 0 && (
        <View style={[styles.bulkBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Text style={[styles.bulkBarText, { color: colors.textPrimary }]}>Выбрано: {selectedIds.size}</Text>
          <TouchableOpacity
            onPress={() => setTemplateTargetIds(Array.from(selectedIds))}
            style={[styles.bulkBarButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="send" size={16} color="#fff" />
            <Text style={styles.bulkBarButtonText}>Ответить всем одним нажатием</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={templateTargetIds !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setTemplateTargetIds(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTemplateTargetIds(null)}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Выберите шаблон ответа</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Отправится сразу {templateTargetIds?.length ?? 0} покупателям
            </Text>
            {templates.length === 0 ? (
              <Text style={{ color: colors.textTertiary, paddingVertical: 12 }}>
                Шаблонов пока нет — добавьте их в профиле магазина
              </Text>
            ) : (
              templates.map((tpl) => (
                <TouchableOpacity
                  key={tpl.id}
                  onPress={() => sendBulkTemplate(tpl)}
                  style={[styles.modalTemplateRow, { borderColor: colors.border }]}
                >
                  <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTemplateLabel, { color: colors.textPrimary }]}>{tpl.title}</Text>
                    <Text numberOfLines={1} style={[styles.modalTemplateText, { color: colors.textTertiary }]}>
                      {tpl.body}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectModeText: { fontSize: 14, fontWeight: '600' },
  statBadge: { minWidth: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  statBadgeText: { fontSize: 13, fontWeight: '700' },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  filterText: { fontSize: 15 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  requestCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 6 },
  carModel: { fontSize: 17, fontWeight: '700', flex: 1 },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  urgentText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  newDot: { width: 8, height: 8, borderRadius: 4 },
  description: { fontSize: 15 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 12, gap: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13 },
  details: { paddingHorizontal: 12, paddingVertical: 12, borderTopWidth: 1 },
  detailSection: { marginBottom: 12 },
  detailLabel: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.3 },
  detailText: { fontSize: 16, lineHeight: 24 },
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, gap: 6 },
  actionButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyAction: { marginTop: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  emptyActionText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  emptyActionLink: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  quickChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 4 },
  quickChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  quickChipText: { fontSize: 15, fontWeight: '600' },
  bulkBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, gap: 12 },
  bulkBarText: { fontSize: 14, fontWeight: '600' },
  bulkBarButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, gap: 6 },
  bulkBarButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 32 },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, marginBottom: 16 },
  modalTemplateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1 },
  modalTemplateLabel: { fontSize: 14, fontWeight: '700' },
  modalTemplateText: { fontSize: 12, marginTop: 2 },
  groupCard: { borderRadius: 12, borderWidth: 1, padding: 12 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  groupCountBadge: { minWidth: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  groupCountText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  groupSubtitle: { fontSize: 12, marginTop: 6, marginBottom: 10 },
  groupReplyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  groupReplyButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  groupItems: { marginTop: 12, gap: 12 },
})
