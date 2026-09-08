import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { C, T, ScreenHeader, Stars } from '@/components/ui';

const FILTER_TYPES = ['Все', 'Запчасти', 'Услуги', 'СТО'];

const MOCK_PINS = [
  { id: 1, type: 'СТО', name: 'AutoPro СТО', x: 55, y: 40, rating: 4.9, icon: '🏥' },
  { id: 2, type: 'Запчасти', name: 'MegaAvto', x: 30, y: 60, rating: 4.7, icon: '🔧' },
  { id: 3, type: 'Услуги', name: 'AquaWash', x: 70, y: 70, rating: 4.8, icon: '💨' },
  { id: 4, type: 'СТО', name: 'TechServis', x: 20, y: 30, rating: 4.5, icon: '🏥' },
  { id: 5, type: 'Запчасти', name: 'AutoParts KG', x: 80, y: 45, rating: 4.6, icon: '🔧' },
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
  const [activeFilter, setActiveFilter] = useState('Все');
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const visiblePins = MOCK_PINS.filter(
    (p) => activeFilter === 'Все' || p.type === activeFilter
  );
  const selected = MOCK_PINS.find((p) => p.id === selectedPin);

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
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Карта (Phase 2)</Text>
          <Text style={styles.mapSubtext}>
            Интеграция Yandex Maps в разработке
          </Text>
        </View>
      </View>

      {/* List of pins */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Найдено: {visiblePins.length} мест
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {visiblePins.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyText}>
                По этому фильтру ничего не найдено
              </Text>
            </View>
          ) : (
            visiblePins.map((pin) => (
              <TouchableOpacity
                key={pin.id}
                style={styles.pinItem}
                onPress={() => setSelectedPin(pin.id)}
              >
                <View style={styles.pinHeader}>
                  <Text style={styles.pinIcon}>{pin.icon}</Text>
                  <Text style={styles.pinName}>{pin.name}</Text>
                  <Text style={styles.pinRating}>⭐ {pin.rating}</Text>
                </View>
                <Text style={styles.pinType}>{pin.type}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
