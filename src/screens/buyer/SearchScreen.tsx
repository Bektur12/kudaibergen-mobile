import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { C, T, Badge, BackBtn } from '@/components/ui';
import { PART_CATEGORIES } from '@/data/parts';
import { listStores, type ApiPartCategory, type StoreSummary } from '@/lib/store-api';

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  parts: 'Магазин запчастей',
  tires: 'Шиномонтаж',
  oils: 'Масла и жидкости',
  accessories: 'Аксессуары',
  sto: 'СТО',
  carwash: 'Автомойка',
};

// Trust signal — the main thing a buyer decides on before tapping into a
// store, so it belongs on the list card, not just the store's own page.
// NEW gets nothing rather than a "новый" label: an honest absence reads
// better than a badge that looks like a warning.
const TRUST_BADGE: Record<string, { label: string; variant: 'success' | 'accent' } | undefined> = {
  TRUSTED: { label: '✓ Партнёр', variant: 'success' },
  VERIFIED: { label: '✓ Проверен', variant: 'accent' },
};

// Same lowercase ids as PART_CATEGORIES, backend wants the uppercase form.
const CATEGORY_CHIPS: { value: ApiPartCategory | null; label: string }[] = [
  { value: null, label: 'Все' },
  ...PART_CATEGORIES.map((cat) => ({
    value: cat.id.toUpperCase() as ApiPartCategory,
    label: cat.label,
  })),
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    borderWidth: 2,
    borderColor: C.primary,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: C.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    marginBottom: 12,
  },
  resultImage: {
    width: 56,
    height: 56,
    backgroundColor: C.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImageText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultContent: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  resultDesc: {
    fontSize: 12,
    color: C.textSecondary,
    marginVertical: 2,
  },
  resultFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 13,
    color: C.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyAction: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.primary,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default function SearchScreen({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<ApiPartCategory | null>(null);
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await listStores({ category: activeCategory ?? undefined, size: 50 });
        if (!cancelled) setStores(res.content);
      } catch {
        // keep whatever was on screen — a transient network hiccup shouldn't blank the results
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  // No free-text search endpoint on the backend yet — filter what we already
  // fetched by name client-side instead of hitting the network per keystroke.
  const query = searchText.trim().toLowerCase();
  const results = query ? stores.filter((s) => s.name.toLowerCase().includes(query)) : stores;

  // An empty list means three different things — say which one it is instead
  // of a flat "ничего не найдено" that leaves the buyer at a dead end.
  const activeCategoryLabel = CATEGORY_CHIPS.find((c) => c.value === activeCategory)?.label;
  const emptyState = query
    ? {
        title: `Магазин «${searchText.trim()}» не найден`,
        hint: 'Проверьте написание или посмотрите все магазины',
        canReset: true,
      }
    : activeCategory
      ? {
          title: `Пока нет продавцов в категории «${activeCategoryLabel}»`,
          hint: 'Мы только начали подключать магазины — попробуйте другую категорию',
          canReset: true,
        }
      : {
          title: 'Магазины ещё не подключены',
          hint: 'Скоро здесь появятся продавцы с Кудайбергена',
          canReset: false,
        };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackBtn onBack={() => onNavigate('home')} />
        <Text style={[T.heading, { color: C.textPrimary, flex: 1 }]}>
          Поиск
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Название магазина..."
            placeholderTextColor={C.textTertiary}
            style={{
              flex: 1,
              fontSize: 14,
              color: C.textPrimary,
              fontWeight: '500',
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORY_CHIPS.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[
                styles.categoryButton,
                activeCategory === cat.value && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat.value && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{emptyState.title}</Text>
          <Text style={styles.emptyText}>{emptyState.hint}</Text>
          {emptyState.canReset && (
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => {
                setSearchText('');
                setActiveCategory(null);
              }}
            >
              <Text style={styles.emptyActionText}>Показать все магазины</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsContainer}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', marginBottom: 12 }}>
              Результаты поиска ({results.length})
            </Text>
            {results.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.resultCard}
                onPress={() => router.push(`/(buyer)/store/${store.id}` as any)}
              >
                <View style={styles.resultImage}>
                  <Text style={styles.resultImageText}>{store.name.charAt(0)}</Text>
                </View>
                <View style={styles.resultContent}>
                  <View style={styles.resultTitleRow}>
                    <Text style={styles.resultTitle}>{store.name}</Text>
                    {TRUST_BADGE[store.verificationStatus] && (
                      <Badge variant={TRUST_BADGE[store.verificationStatus]!.variant}>
                        {TRUST_BADGE[store.verificationStatus]!.label}
                      </Badge>
                    )}
                  </View>
                  <Text style={styles.resultDesc}>
                    {BUSINESS_TYPE_LABELS[store.businessType] ?? store.businessType}
                    {store.cities.length > 0 ? ` · ${store.cities.join(', ')}` : ''}
                  </Text>
                  <View style={styles.resultFooter}>
                    <Text style={{ fontSize: 11, color: C.textTertiary }}>⭐ {store.rating.toFixed(1)}</Text>
                    <Text style={{ fontSize: 11, color: C.textTertiary }}>
                      {store.reviewCount} отзывов
                    </Text>
                    <Text style={{ fontSize: 11, color: C.textTertiary }}>
                      {store.totalDeals} сделок
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
