import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { C, ScreenHeader } from '@/components/ui';
import { Map as MapIcon, MapPin, Wrench, Star } from 'lucide-react-native';
import { listStores, type StoreSummary, type ApiPartCategory } from '@/lib/store-api';

// The map surface itself is still a placeholder (Yandex Maps integration is
// tracked separately — no lat/lng rendering here), but the list beneath it
// is real store data instead of MOCK_PINS.
const FILTER_TYPES: { id: ApiPartCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Все' },
  { id: 'BRAKES', label: 'Тормоза' },
  { id: 'ENGINE', label: 'Двигатель' },
  { id: 'WHEELS', label: 'Колёса' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.bg,
  },
  filterButtonActive: {
    backgroundColor: C.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  mapIcon: {
    fontSize: 48,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
    maxWidth: 200,
  },
  listContainer: {
    backgroundColor: C.surface,
    maxHeight: '35%',
  },
  listTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  pinItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  pinIcon: {
    fontSize: 20,
  },
  pinName: {
    fontWeight: '700',
    fontSize: 15,
    color: C.textPrimary,
    flex: 1,
  },
  pinRating: {
    fontSize: 12,
    color: C.textSecondary,
  },
  pinType: {
    fontSize: 12,
    color: C.textTertiary,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 13,
    color: C.textTertiary,
  },
});

export default function MapScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ApiPartCategory | 'ALL'>('ALL');
  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!cancelled) setLoading(true);
      try {
        const res = await listStores({
          city: '',
          category: activeFilter === 'ALL' ? undefined : activeFilter,
        });
        if (!cancelled) setStores(res.content);
      } catch {
        if (!cancelled) setStores([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Рядом со мной" />

      {/* Filter */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: 'row', gap: 8 }}
        >
          {FILTER_TYPES.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapIcon size={40} color={C.textTertiary} />
          <Text style={styles.mapText}>Карта (Phase 2)</Text>
          <Text style={styles.mapSubtext}>
            Интеграция Yandex Maps в разработке
          </Text>
        </View>
      </View>

      {/* List of stores */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {loading ? 'Загрузка...' : `Найдено: ${stores.length} мест`}
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={C.primary} />
            </View>
          ) : stores.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={32} color={C.textTertiary} />
              <Text style={styles.emptyText}>По этому фильтру ничего не найдено</Text>
            </View>
          ) : (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.pinItem}
                onPress={() => router.push(`/(buyer)/store/${store.id}` as never)}
              >
                <View style={styles.pinHeader}>
                  <Wrench size={18} color={C.primary} />
                  <Text style={styles.pinName}>{store.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}><Star size={13} color="#F5A524" fill="#F5A524" /><Text style={styles.pinRating}>{store.rating.toFixed(1)}</Text></View>
                </View>
                <Text style={styles.pinType}>{store.cities.join(', ')}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
