import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { C, T, BackBtn } from '@/components/ui';
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
  emptyText: {
    fontSize: 14,
    color: C.textTertiary,
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
          <Text style={styles.emptyText}>Ничего не найдено</Text>
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
                  <Text style={styles.resultTitle}>{store.name}</Text>
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
