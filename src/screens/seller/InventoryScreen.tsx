import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import { C, T, ScreenHeader, Btn } from '@/components/ui';

const PRODUCTS = [
  {
    id: 1,
    name: 'Тормозные диски Brembo Toyota Camry',
    price: 4500,
    currency: 'с',
    stock: 5,
    views: 123,
    msgs: 2,
    icon: '🔩',
    status: 'active',
  },
  {
    id: 2,
    name: 'Масляный фильтр Mann BMW 5-я серия',
    price: 850,
    currency: 'с',
    stock: 23,
    views: 456,
    msgs: 12,
    icon: '⚙️',
    status: 'active',
  },
  {
    id: 3,
    name: 'Аккумулятор Bosch S5 60Ah',
    price: 8500,
    currency: 'с',
    stock: 3,
    views: 89,
    msgs: 4,
    icon: '🔋',
    status: 'active',
  },
  {
    id: 4,
    name: 'Фара LED BMW X5 G05 правая',
    price: 45000,
    currency: 'с',
    stock: 0,
    views: 234,
    msgs: 7,
    icon: '💡',
    status: 'out',
  },
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
  },
  addButton: {
    backgroundColor: C.primary,
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: C.bg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
    marginBottom: 10,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  productsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  productContent: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    backgroundColor: C.bg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: '700',
    fontSize: 14,
    color: C.textPrimary,
  },
  productPrice: {
    fontWeight: '800',
    fontSize: 16,
    color: C.primary,
    marginVertical: 4,
  },
  productStats: {
    flexDirection: 'row',
    gap: 8,
  },
  productStat: {
    fontSize: 11,
    color: C.textTertiary,
  },
  productFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  footerButton: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSecondary,
  },
  stockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  outOfStock: {
    backgroundColor: '#FFEBEE',
  },
  outOfStockText: {
    color: '#C62828',
  },
});

export default function InventoryScreen() {
  const [search, setSearch] = useState('');

  const products = PRODUCTS.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderProductCard = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.productContent}>
        <View style={styles.productImage}>
          <Text style={{ fontSize: 32 }}>{item.icon}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            {item.price} {item.currency}
          </Text>
          <View style={styles.productStats}>
            <Text style={styles.productStat}>👁️ {item.views}</Text>
            <Text style={styles.productStat}>💬 {item.msgs}</Text>
          </View>
        </View>
        <View style={[styles.stockBadge, item.stock === 0 && styles.outOfStock]}>
          <Text style={[styles.stockText, item.stock === 0 && styles.outOfStockText]}>
            {item.stock === 0 ? 'Нет' : `${item.stock} шт`}
          </Text>
        </View>
      </View>
      <View style={styles.productFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>✏️ Редактировать</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>📊 Статистика</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Товары</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={{ fontSize: 20, color: '#fff', fontWeight: '700' }}>
              +
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            placeholder="Поиск в товарах..."
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              fontSize: 14,
              color: C.textPrimary,
              fontWeight: '500',
            }}
          />
        </View>
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🔽 Фильтр</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>📊 Сортировка</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
