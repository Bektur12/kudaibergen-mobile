import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/components/ui';
import { PART_CATEGORIES } from '@/data/parts';
import { getMyCategories, setMyCategories } from '@/lib/seller-api';
import type { ApiPartCategory } from '@/lib/store-api';
import { ApiError } from '@/lib/api';

// The backend has no per-SKU product catalog — a store's "inventory" is just
// which of the 7 fixed part categories it carries, and that's exactly what
// drives which buyer requests reach it (GET /my-store/requests matching).
// This tab used to mock a priced product list; there's no endpoint backing
// that shape, so it's repurposed to manage the real thing instead.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
  },
  content: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: C.textPrimary,
  },
  saveButton: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function InventoryScreen() {
  const [selected, setSelected] = useState<Set<ApiPartCategory>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const categories = await getMyCategories();
        if (!cancelled) setSelected(new Set(categories));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (cat: ApiPartCategory) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await setMyCategories(Array.from(selected));
      setSelected(new Set(saved));
      setDirty(false);
    } catch (err) {
      Alert.alert('Не удалось сохранить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerFill]}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Категории товаров</Text>
        <Text style={styles.headerSubtitle}>
          От этого зависит, какие запросы покупателей увидит ваш магазин
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {PART_CATEGORIES.map((cat) => {
          const apiCategory = cat.id.toUpperCase() as ApiPartCategory;
          const isOn = selected.has(apiCategory);
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryRow,
                { borderColor: isOn ? C.primary : C.border, backgroundColor: isOn ? '#FFF3E0' : C.surface },
              ]}
              onPress={() => toggle(apiCategory)}
            >
              <Ionicons name={cat.icon} size={22} color={isOn ? C.primary : C.textSecondary} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Ionicons
                name={isOn ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isOn ? C.primary : C.textTertiary}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.saveButton, (!dirty || saving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!dirty || saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Сохранение...' : 'Сохранить'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
