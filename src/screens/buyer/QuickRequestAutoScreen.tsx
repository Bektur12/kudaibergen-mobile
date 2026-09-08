import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { C, CDark, Btn } from '@/components/ui'
import { getSellersForBrand, MOCK_SELLERS } from '@/data/sellers'

const CAR_BRANDS = [
  'Toyota',
  'BMW',
  'Mercedes',
  'Audi',
  'Honda',
  'Mazda',
  'Nissan',
  'Volkswagen',
  'Hyundai',
  'Kia',
  'Chevrolet',
  'Ford',
]

interface SelectedBrand {
  name: string
  sellersCount: number
}

export default function QuickRequestAutoScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = isDark ? CDark : C
  const router = useRouter()

  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(null)
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectBrand = (brand: string) => {
    const sellers = getSellersForBrand(brand)
    setSelectedBrand({
      name: brand,
      sellersCount: sellers.length,
    })
  }

  const handleSubmit = async () => {
    if (!selectedBrand || !description.trim()) {
      alert('Пожалуйста выберите марку и опишите что нужно')
      return
    }

    setIsLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(
        `Запрос отправлен ${selectedBrand.sellersCount} продавцам!\nВы получите предложения в течение часа.`
      )
      router.back()
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
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Найти авто
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Select Brand */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 1: ВЫБЕРИТЕ МАРКУ
            </Text>
            <View style={styles.brandsGrid}>
              {CAR_BRANDS.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => handleSelectBrand(brand)}
                  style={[
                    styles.brandButton,
                    {
                      backgroundColor:
                        selectedBrand?.name === brand
                          ? colors.primary
                          : colors.surfaceAlt,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.brandText,
                      {
                        color:
                          selectedBrand?.name === brand
                            ? '#fff'
                            : colors.textPrimary,
                        fontWeight:
                          selectedBrand?.name === brand ? '700' : '600',
                      },
                    ]}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedBrand && (
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
                    {selectedBrand.name}
                  </Text>
                  <Text
                    style={[
                      styles.sellerInfoDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {selectedBrand.sellersCount} продавцов готовы помочь
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Step 2: Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 2: ЧТО ВАМ НУЖНО?
            </Text>
            <TextInput
              placeholder="Пример: Ищу Camry 2015-2020 в отличном состоянии, не битую"
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

          {/* Step 3: Budget */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              ШАГ 3: БЮДЖЕТ (ОПЦИОНАЛЬНО)
            </Text>
            <TextInput
              placeholder="Пример: $15000-22000"
              placeholderTextColor={colors.textTertiary}
              value={budget}
              onChangeText={setBudget}
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

          {/* Step 4: Urgent */}
          <View style={styles.section}>
            <View style={styles.urgentRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
                  СРОЧНО?
                </Text>
                <Text
                  style={[
                    styles.sectionDesc,
                    { color: colors.textSecondary },
                  ]}
                >
                  Продавцы будут отвечать быстрее
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsUrgent(!isUrgent)}
                style={[
                  styles.urgentButton,
                  {
                    backgroundColor: isUrgent ? colors.error : colors.surfaceAlt,
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
          {selectedBrand && (
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
                style={[
                  styles.summaryTitle,
                  { color: colors.primary },
                ]}
              >
                📊 Краткая информация
              </Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>
                  Марка:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {selectedBrand.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>
                  Продавцов получат запрос:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {selectedBrand.sellersCount}
                </Text>
              </View>
              {isUrgent && (
                <View style={styles.summaryRow}>
                  <Ionicons
                    name="flash"
                    size={16}
                    color={colors.error}
                  />
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
            disabled={!selectedBrand || !description.trim() || isLoading}
            style={{ opacity: !selectedBrand || !description.trim() ? 0.5 : 1 }}
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
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  brandButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  brandText: {
    fontSize: 13,
    textAlign: 'center',
  },
  sellerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  sellerInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  sellerInfoDesc: {
    fontSize: 13,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
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
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
})
