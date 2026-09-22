import { Btn, C } from '@/components/ui'
import { PART_CATEGORIES } from '@/data/parts'
import { ApiError } from '@/lib/api'
import { createRequest } from '@/lib/request-api'
import { listStores, type ApiPartCategory } from '@/lib/store-api'
import type { ProductCategory } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SelectedPart {
  id: ProductCategory
  apiCategory: ApiPartCategory
  label: string
  icon: keyof typeof Ionicons.glyphMap
  sellersCount: number | null // null while the count is loading
}

export default function QuickRequestPartScreen() {
  const colors = C
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [selectedPart, setSelectedPart] = useState<SelectedPart | null>(null)
  const [carInfo, setCarInfo] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Stable for the lifetime of this screen — a retried tap on the same
  // in-flight submission won't create a second request server-side. Generated
  // lazily on first submit (Date.now/Math.random are impure — can't run at render).
  const idempotencyKey = useRef<string | null>(null)

  const handleSelectPart = async (part: (typeof PART_CATEGORIES)[number]) => {
    const apiCategory = part.id.toUpperCase() as ApiPartCategory
    setSelectedPart({
      id: part.id,
      apiCategory,
      label: part.label,
      icon: part.icon,
      sellersCount: null,
    })
    try {
      const res = await listStores({ category: apiCategory })
      setSelectedPart((prev) =>
        prev && prev.id === part.id
          ? { ...prev, sellersCount: res.totalElements }
          : prev
      )
    } catch {
      setSelectedPart((prev) =>
        prev && prev.id === part.id ? { ...prev, sellersCount: 0 } : prev
      )
    }
  }

  const handleSubmit = async () => {
    if (!selectedPart || !description.trim()) {
      Alert.alert(
        'Заполните форму',
        'Пожалуйста выберите деталь и опишите что нужно'
      )
      return
    }

    if (!idempotencyKey.current) {
      idempotencyKey.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    }

    setIsLoading(true)
    try {
      const budgetMax = budget.trim()
        ? parseInt(budget.replace(/\D/g, ''), 10)
        : undefined
      const result = await createRequest(
        {
          category: selectedPart.apiCategory,
          description: description.trim(),
          carText: carInfo.trim() || undefined,
          budgetMax:
            budgetMax && !Number.isNaN(budgetMax) ? budgetMax : undefined,
          isUrgent,
        },
        idempotencyKey.current
      )
      router.replace({
        pathname: '/(buyer)/request/[id]',
        params: { id: String(result.id) },
      })
    } catch (err) {
      Alert.alert(
        'Не удалось отправить',
        err instanceof ApiError ? err.message : 'Попробуйте ещё раз'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
              paddingTop: insets.top + 12,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Найти запчасть
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Select Part */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 1: КАКАЯ ДЕТАЛЬ НУЖНА?
            </Text>
            <View style={styles.partsGrid}>
              {PART_CATEGORIES.map((part) => (
                <TouchableOpacity
                  key={part.id}
                  onPress={() => handleSelectPart(part)}
                  style={[
                    styles.partButton,
                    {
                      backgroundColor:
                        selectedPart?.id === part.id
                          ? colors.primary
                          : colors.surfaceAlt,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={part.icon}
                    size={26}
                    color={
                      selectedPart?.id === part.id
                        ? '#fff'
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.partText,
                      {
                        color:
                          selectedPart?.id === part.id
                            ? '#fff'
                            : colors.textPrimary,
                        fontWeight:
                          selectedPart?.id === part.id ? '700' : '600',
                      },
                    ]}
                  >
                    {part.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedPart && (
              <View
                style={[
                  styles.sellerInfoCard,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.sellerInfoTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {selectedPart.label}
                  </Text>
                  <Text
                    style={[
                      styles.sellerInfoDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {selectedPart.sellersCount === null
                      ? 'Считаем продавцов...'
                      : selectedPart.sellersCount > 0
                        ? `${selectedPart.sellersCount} продавцов готовы помочь`
                        : 'Пока нет продавцов этой категории'}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Step 2: Car info (optional) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 2: НА КАКУЮ МАШИНУ? (ОПЦИОНАЛЬНО)
            </Text>
            <TextInput
              placeholder="Пример: Toyota Camry 2018"
              placeholderTextColor={colors.textTertiary}
              value={carInfo}
              onChangeText={setCarInfo}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: 48,
                },
              ]}
            />
          </View>

          {/* Step 3: Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 3: ОПИШИТЕ ЧТО НУЖНО
            </Text>
            <TextInput
              placeholder="Пример: Передние тормозные колодки, оригинал или хорошая копия"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />
          </View>

          {/* Step 4: Budget */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 4: БЮДЖЕТ (ОПЦИОНАЛЬНО)
            </Text>
            <TextInput
              placeholder="Пример: 3000"
              placeholderTextColor={colors.textTertiary}
              value={budget}
              onChangeText={setBudget}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: 48,
                },
              ]}
            />
          </View>

          {/* Step 5: Urgent */}
          <View style={styles.section}>
            <View style={styles.urgentRow}>
              <View>
                <Text
                  style={[styles.sectionTitle, { color: colors.textTertiary }]}
                >
                  СРОЧНО?
                </Text>
                <Text
                  style={[styles.sectionDesc, { color: colors.textSecondary }]}
                >
                  Продавцы будут отвечать быстрее
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsUrgent(!isUrgent)}
                style={[
                  styles.urgentButton,
                  {
                    backgroundColor: isUrgent
                      ? colors.error
                      : colors.surfaceAlt,
                  },
                ]}
              >
                <Ionicons
                  name={isUrgent ? 'flash' : 'flash-outline'}
                  size={20}
                  color={isUrgent ? '#fff' : colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary */}
          {selectedPart && (
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.primaryTint || '#FFEDE3',
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[styles.summaryTitle, { color: colors.textSecondary }]}
              >
                ПРОВЕРЬТЕ ПЕРЕД ОТПРАВКОЙ
              </Text>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textPrimary }]}
                >
                  Деталь:
                </Text>
                <Text
                  style={[styles.summaryValue, { color: colors.textPrimary }]}
                >
                  {selectedPart.label}
                </Text>
              </View>
              {!!carInfo.trim() && (
                <View style={styles.summaryRow}>
                  <Text
                    style={[styles.summaryLabel, { color: colors.textPrimary }]}
                  >
                    Машина:
                  </Text>
                  <Text
                    style={[styles.summaryValue, { color: colors.textPrimary }]}
                  >
                    {carInfo.trim()}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textPrimary }]}
                >
                  Продавцов получат запрос:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {selectedPart.sellersCount ?? '...'}
                </Text>
              </View>
              {isUrgent && (
                <View style={styles.summaryRow}>
                  <Ionicons name="flash" size={16} color={colors.error} />
                  <Text style={[styles.summaryLabel, { color: colors.error }]}>
                    Запрос помечен как СРОЧНЫЙ
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          <Btn
            onPress={handleSubmit}
            disabled={!selectedPart || !description.trim() || isLoading}
            style={{ opacity: !selectedPart || !description.trim() ? 0.5 : 1 }}
          >
            {isLoading ? 'Отправляем...' : 'Отправить запрос'}
          </Btn>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionDesc: {
    fontSize: 15,
    marginTop: 4,
  },
  partsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  partButton: {
    flex: 1,
    minWidth: '46%',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  partText: {
    fontSize: 15,
    textAlign: 'center',
  },
  sellerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  sellerInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sellerInfoDesc: {
    fontSize: 15,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  urgentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgentButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 8,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
})
