import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { C, T, Avatar, Stars, Divider, ListRow, Btn } from '@/components/ui';

const VEHICLES = [
  { id: 1, brand: 'Toyota', model: 'Camry', year: 2020, isDefault: true },
  { id: 2, brand: 'BMW', model: '320i', year: 2019, isDefault: false },
];

const MENU_ITEMS = [
  { icon: '📍', label: 'Адреса доставки' },
  { icon: '💳', label: 'Способы оплаты' },
  { icon: '🔔', label: 'Уведомления' },
  { icon: '🛡️', label: 'Конфиденциальность' },
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
  headerTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: C.success,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: C.textTertiary,
    marginVertical: 2,
  },
  statsContainer: {
    backgroundColor: C.surface,
    marginTop: 8,
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  statValue: {
    fontWeight: '700',
    fontSize: 20,
    color: C.primary, // PRIMARY color for important values
  },
  statLabel: {
    fontSize: 12,
    color: C.textTertiary,
    marginTop: 2,
  },
  vehiclesSection: {
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
  },
  vehicleCard: {
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontWeight: '700',
    fontSize: 15,
    color: C.textPrimary,
  },
  vehicleYear: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 11,
    color: C.primary, // PRIMARY for badge text
    fontWeight: '600',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addVehicleButton: {
    backgroundColor: C.primary, // PRIMARY for CTA button
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addVehicleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
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

export default function ProfileScreen() {
  const [vehicles, setVehicles] = useState(VEHICLES);

  const setDefault = (id: number) => {
    setVehicles((prev) =>
      prev.map((v) => ({ ...v, isDefault: v.id === id }))
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Профиль</Text>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Avatar initials="ИК" size={60} color={C.primary} />
            <View style={styles.verifiedBadge}>
              <Text style={{ fontSize: 10, color: '#fff', fontWeight: '700' }}>✓</Text>
            </View>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Иван Кожобеков</Text>
            <Text style={styles.userEmail}>ivan.k@email.com</Text>
            <Stars rating={4.7} count={12} />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: C.bg,
              borderRadius: 10,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16 }}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Покупок</Text>
          </View>
          <View style={[styles.statItem, { borderRightWidth: 0 }]}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Избранных</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Адресов</Text>
          </View>
        </View>

        {/* Vehicles */}
        <View style={styles.vehiclesSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Мои автомобили</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 18 }}>➕</Text>
            </TouchableOpacity>
          </View>
          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                  {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={styles.vehicleYear}>{vehicle.year}</Text>
              </View>
              {vehicle.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>По умолчанию</Text>
                </View>
              )}
              <View style={styles.vehicleActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setDefault(vehicle.id)}
                >
                  <Text style={{ fontSize: 14 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={{ fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addVehicleButton}>
            <Text style={styles.addVehicleText}>➕ Добавить авто</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, paddingTop: 16 }]}>
            Настройки
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
