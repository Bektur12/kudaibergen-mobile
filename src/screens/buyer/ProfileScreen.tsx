import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, Avatar, Stars, ListRow } from '@/components/ui';
import { MapPin, CreditCard, Bell, Shield, Pencil, Plus, Star, Trash2 } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/auth';
import { updateMe } from '@/lib/auth-api';
import { ApiError } from '@/lib/api';
import {
  getMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  type Vehicle,
} from '@/lib/vehicle-api';

const MENU_ITEMS = [
  { icon: <MapPin size={20} color={C.textSecondary} />, label: 'Адреса доставки' },
  { icon: <CreditCard size={20} color={C.textSecondary} />, label: 'Способы оплаты' },
  { icon: <Bell size={20} color={C.textSecondary} />, label: 'Уведомления' },
  { icon: <Shield size={20} color={C.textSecondary} />, label: 'Конфиденциальность' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
  },
  userCity: {
    fontSize: 13,
    color: C.textTertiary,
    marginVertical: 2,
  },
  editButton: {
    backgroundColor: C.bg,
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: C.primary,
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
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
    gap: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getMyVehicles();
        if (!cancelled) setVehicles(data);
      } catch {
        // keep whatever was on screen
      } finally {
        if (!cancelled) setLoadingVehicles(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const openProfileModal = () => {
    setName(user?.name ?? '');
    setCity(user?.city ?? '');
    setProfileModalVisible(true);
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateMe({ name: name.trim(), city: city.trim() });
      await refreshUser();
      setProfileModalVisible(false);
    } catch (err) {
      Alert.alert('Не удалось сохранить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSavingProfile(false);
    }
  };

  const openVehicleModal = (vehicle?: Vehicle) => {
    setEditingVehicleId(vehicle?.id ?? null);
    setBrand(vehicle?.brand ?? '');
    setModel(vehicle?.model ?? '');
    setYear(vehicle?.year ? String(vehicle.year) : '');
    setVehicleModalVisible(true);
  };

  const saveVehicle = async () => {
    if (!brand.trim() || !model.trim()) {
      Alert.alert('Заполните марку и модель');
      return;
    }
    setSavingVehicle(true);
    try {
      const yearNum = year.trim() ? parseInt(year, 10) : undefined;
      const saved = editingVehicleId
        ? await updateVehicle(editingVehicleId, { brand: brand.trim(), model: model.trim(), year: yearNum })
        : await createVehicle({ brand: brand.trim(), model: model.trim(), year: yearNum });
      setVehicles((prev) =>
        editingVehicleId ? prev.map((v) => (v.id === editingVehicleId ? saved : v)) : [...prev, saved]
      );
      setVehicleModalVisible(false);
    } catch (err) {
      Alert.alert('Не удалось сохранить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSavingVehicle(false);
    }
  };

  const setDefault = async (vehicle: Vehicle) => {
    try {
      const saved = await updateVehicle(vehicle.id, { isDefault: true });
      setVehicles((prev) => prev.map((v) => (v.id === saved.id ? saved : { ...v, isDefault: false })));
    } catch (err) {
      Alert.alert('Не удалось изменить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    }
  };

  const removeVehicle = (id: number) => {
    Alert.alert('Удалить автомобиль?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
          } catch (err) {
            Alert.alert('Не удалось удалить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Профиль</Text>
        <View style={styles.userInfo}>
          <Avatar initials={(user?.name ?? '?').slice(0, 2).toUpperCase()} size={60} color={C.primary} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name ?? user?.phone ?? 'Без имени'}</Text>
            <Text style={styles.userCity}>{user?.city ?? 'Город не указан'}</Text>
            <Stars rating={0} count={0} />
          </View>
          <TouchableOpacity style={styles.editButton} onPress={openProfileModal}>
            <Pencil size={16} color={C.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Vehicles */}
        <View style={styles.vehiclesSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Мои автомобили</Text>
            <TouchableOpacity onPress={() => openVehicleModal()}>
              <Plus size={22} color={C.primary} />
            </TouchableOpacity>
          </View>
          {loadingVehicles ? (
            <ActivityIndicator color={C.primary} />
          ) : vehicles.length === 0 ? (
            <Text style={{ color: C.textTertiary, fontSize: 13, marginBottom: 8 }}>
              Автомобили не добавлены
            </Text>
          ) : (
            vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  {vehicle.year && <Text style={styles.vehicleYear}>{vehicle.year}</Text>}
                </View>
                {vehicle.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>По умолчанию</Text>
                  </View>
                )}
                <View style={styles.vehicleActions}>
                  {!vehicle.isDefault && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => setDefault(vehicle)}>
                      <Star size={15} color={C.textSecondary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.actionButton} onPress={() => openVehicleModal(vehicle)}>
                    <Pencil size={15} color={C.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => removeVehicle(vehicle.id)}>
                    <Trash2 size={15} color={C.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addVehicleButton} onPress={() => openVehicleModal()}>
            <Plus size={18} color="#fff" />
            <Text style={styles.addVehicleText}>Добавить авто</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выход</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit name/city modal */}
      <Modal visible={profileModalVisible} transparent animationType="slide" onRequestClose={() => setProfileModalVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setProfileModalVisible(false)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Имя и город</Text>
              <Input placeholder="Имя" value={name} onChangeText={setName} />
              <Input placeholder="Город" value={city} onChangeText={setCity} />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: C.bg }]}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: C.textPrimary }]}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: C.primary }]}
                  onPress={saveProfile}
                  disabled={savingProfile}
                >
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                    {savingProfile ? 'Сохранение...' : 'Сохранить'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add/edit vehicle modal */}
      <Modal visible={vehicleModalVisible} transparent animationType="slide" onRequestClose={() => setVehicleModalVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVehicleModalVisible(false)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{editingVehicleId ? 'Изменить авто' : 'Новый автомобиль'}</Text>
              <Input placeholder="Марка (Toyota)" value={brand} onChangeText={setBrand} />
              <Input placeholder="Модель (Camry)" value={model} onChangeText={setModel} />
              <Input placeholder="Год" value={year} onChangeText={setYear} keyboardType="number-pad" />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: C.bg }]}
                  onPress={() => setVehicleModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: C.textPrimary }]}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: C.primary }]}
                  onPress={saveVehicle}
                  disabled={savingVehicle}
                >
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                    {savingVehicle ? 'Сохранение...' : 'Сохранить'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
