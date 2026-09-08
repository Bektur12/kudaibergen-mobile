import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { C, T, Avatar, Stars, Divider, ListRow, ScreenHeader, Btn } from '@/components/ui';

const BRANCHES = [
  {
    id: 1,
    name: 'Филиал №1',
    address: 'ул. Ленина, 100',
    hours: 'Пн–Пт: 9:00–19:00',
    phone: '+996 312 91-20-01',
  },
  {
    id: 2,
    name: 'Филиал №2',
    address: 'пр. Чуй, 55',
    hours: 'Пн–Сб: 8:00–20:00',
    phone: '+996 312 55-33-22',
  },
];

const CATEGORIES = ['Запчасти', 'Масла', 'Шины', 'Аксессуары'];
const MENU_ITEMS = [
  { icon: 'ℹ️', label: 'Основная информация' },
  { icon: '💳', label: 'Способы оплаты' },
  { icon: '💰', label: 'Комиссии и расчеты' },
  { icon: '🔔', label: 'Уведомления' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  shopInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shopLogo: {
    width: 70,
    height: 70,
    backgroundColor: C.primary,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shopLogoText: {
    fontSize: 32,
  },
  shopName: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
  },
  shopType: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: C.surface,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 18,
    color: C.primary,
  },
  statLabel: {
    fontSize: 11,
    color: C.textTertiary,
    marginTop: 2,
  },
  section: {
    backgroundColor: C.surface,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchCard: {
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  branchName: {
    fontWeight: '700',
    fontSize: 14,
    color: C.textPrimary,
    marginBottom: 6,
  },
  branchDetail: {
    fontSize: 12,
    color: C.textSecondary,
    marginBottom: 4,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: C.surface,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: C.surface,
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: C.error,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default function SellerProfileScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Профиль магазина" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shop Header */}
        <View style={styles.header}>
          <View style={styles.shopInfo}>
            <View style={styles.shopLogo}>
              <Text style={styles.shopLogoText}>🏪</Text>
            </View>
            <Text style={styles.shopName}>АвтоПрофи</Text>
            <Text style={styles.shopType}>Автомагазин</Text>
            <View style={styles.statusBadges}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>✅ Проверен</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>✅ Активен</Text>
              </View>
            </View>
          </View>
          <Divider />
          <View style={{ marginTop: 12 }}>
            <Stars rating={4.8} count={124} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Товаров</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>892</Text>
            <Text style={styles.statLabel}>Продаж</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2ч</Text>
            <Text style={styles.statLabel}>Ответ</Text>
          </View>
        </View>

        {/* Branches */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase' }}>
              Филиалы
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 18 }}>➕</Text>
            </TouchableOpacity>
          </View>
          {BRANCHES.map((branch) => (
            <View key={branch.id} style={styles.branchCard}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchDetail}>📍 {branch.address}</Text>
              <Text style={styles.branchDetail}>🕐 {branch.hours}</Text>
              <Text style={styles.branchDetail}>📞 {branch.phone}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: C.bg,
                    borderRadius: 6,
                    paddingVertical: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: C.bg,
                    borderRadius: 6,
                    paddingVertical: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', marginBottom: 12 }}>
            Категории товаров
          </Text>
          <View style={styles.categoryTags}>
            {CATEGORIES.map((cat) => (
              <View key={cat} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 16, marginBottom: 0 }}>
            Настройки магазина
          </Text>
          {MENU_ITEMS.map((item) => (
            <ListRow key={item.label} icon={item.icon} label={item.label} />
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Выход</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
