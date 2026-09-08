import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { C, T, Badge, BackBtn } from '@/components/ui';

const RESULTS = [
  {
    id: 1,
    icon: '🔩',
    title: 'Тормозные диски',
    desc: 'Бренд: Brembo',
    price: 850,
    currency: 'сом',
    rating: 4.9,
    views: 234,
    color: '#E5A860',
  },
  {
    id: 2,
    icon: '⚙️',
    title: 'Фильтр масла',
    desc: 'Для Toyota, Honda',
    price: 450,
    currency: 'сом',
    rating: 4.7,
    views: 156,
    color: '#6B5B95',
  },
  {
    id: 3,
    icon: '🛞',
    title: 'Амортизаторы',
    desc: 'Комплект из 4 шт',
    price: 12500,
    currency: 'сом',
    rating: 4.8,
    views: 412,
    color: '#FF6B6B',
  },
  {
    id: 4,
    icon: '💨',
    title: 'Воздушный фильтр',
    desc: 'Оригинальный',
    price: 280,
    currency: 'сом',
    rating: 4.6,
    views: 89,
    color: '#26C485',
  },
];

const CATEGORIES = ['Все', '🚗 Авто', '🔧 Запчасти', '🏥 Услуги'];

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
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
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
    width: 80,
    height: 80,
    backgroundColor: '#E5A860',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  resultPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: C.primary,
    marginVertical: 6,
  },
  resultFooter: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default function SearchScreen({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const [searchText, setSearchText] = useState('Тормозные диски');
  const [activeCategory, setActiveCategory] = useState('Все');

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
            placeholder="Введите что ищете..."
            placeholderTextColor={C.textTertiary}
            style={{
              flex: 1,
              fontSize: 14,
              color: C.textPrimary,
              fontWeight: '500',
            }}
          />
          <TouchableOpacity>
            <Text>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                activeCategory === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>🔽 Цена</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>📊 Сортировка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>⚙️ Еще</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', marginBottom: 12 }}>
            Результаты поиска ({RESULTS.length})
          </Text>
          {RESULTS.map((result) => (
            <TouchableOpacity key={result.id} style={styles.resultCard}>
              <View style={[styles.resultImage, { backgroundColor: result.color }]}>
                <Text style={{ fontSize: 32 }}>{result.icon}</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultDesc}>{result.desc}</Text>
                <Text style={styles.resultPrice}>
                  {result.price} {result.currency}
                </Text>
                <View style={styles.resultFooter}>
                  <Text style={{ fontSize: 11, color: C.textTertiary }}>⭐ {result.rating}</Text>
                  <Text style={{ fontSize: 11, color: C.textTertiary }}>👁️ {result.views}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
