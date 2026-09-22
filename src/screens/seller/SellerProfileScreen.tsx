import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { C, Stars, Divider, ListRow, ScreenHeader } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/auth';
import { ApiError } from '@/lib/api';
import { getPartCategoryInfo } from '@/data/parts';
import { toProductCategory, type StoreDetails } from '@/lib/store-api';
import {
  getMyStore,
  updateMyStore,
  getMyBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  type Branch,
} from '@/lib/seller-api';

const VERIFICATION_LABELS: Record<string, string> = {
  NEW: 'Новый',
  VERIFIED: 'Проверен',
  TRUSTED: 'Партнёр',
  BLOCKED: 'Заблокирован',
};

const MENU_ITEMS = [
  { icon: '💳', label: 'Способы оплаты' },
  { icon: '💰', label: 'Комиссии и расчеты' },
  { icon: '🔔', label: 'Уведомления' },
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
    color: '#fff',
    fontWeight: '700',
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
  editLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  editLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.primary,
  },
  statsContainer: {
    backgroundColor: C.surface,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
  },
  branchCard: {
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  branchDetail: {
    fontSize: 12,
    color: C.textSecondary,
    marginBottom: 4,
  },
  branchActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  branchActionButton: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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

export default function SellerProfileScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const [store, setStore] = useState<StoreDetails | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [savingStore, setSavingStore] = useState(false);

  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [branchAddress, setBranchAddress] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [savingBranch, setSavingBranch] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        const [storeRes, branchesRes] = await Promise.all([getMyStore(), getMyBranches()]);
        if (!cancelled) {
          setStore(storeRes);
          setBranches(branchesRes);
        }
      } catch {
        // keep whatever was already on screen
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const openStoreModal = () => {
    if (!store) return;
    setName(store.name);
    setDescription(store.description ?? '');
    setStoreModalVisible(true);
  };

  const saveStore = async () => {
    setSavingStore(true);
    try {
      const updated = await updateMyStore({ name: name.trim(), description: description.trim() });
      setStore(updated);
      setStoreModalVisible(false);
    } catch (err) {
      Alert.alert('Не удалось сохранить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSavingStore(false);
    }
  };

  const openBranchModal = (branch?: Branch) => {
    setEditingBranchId(branch?.id ?? null);
    setBranchAddress(branch?.address ?? '');
    setBranchCity(branch?.city ?? '');
    setBranchPhone(branch?.phone ?? '');
    setBranchModalVisible(true);
  };

  const saveBranch = async () => {
    setSavingBranch(true);
    try {
      const payload = { address: branchAddress.trim(), city: branchCity.trim(), phone: branchPhone.trim() };
      const saved = editingBranchId
        ? await updateBranch(editingBranchId, payload)
        : await createBranch(payload);
      setBranches((prev) =>
        editingBranchId ? prev.map((b) => (b.id === editingBranchId ? saved : b)) : [...prev, saved]
      );
      setBranchModalVisible(false);
    } catch (err) {
      Alert.alert('Не удалось сохранить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
    } finally {
      setSavingBranch(false);
    }
  };

  const removeBranch = (id: number) => {
    Alert.alert('Удалить филиал?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBranch(id);
            setBranches((prev) => prev.filter((b) => b.id !== id));
          } catch (err) {
            Alert.alert('Не удалось удалить', err instanceof ApiError ? err.message : 'Попробуйте ещё раз');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerFill]}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={[styles.container, styles.centerFill]}>
        <Text style={{ color: C.textSecondary }}>Не удалось загрузить магазин</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Профиль магазина" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shop Header */}
        <View style={styles.header}>
          <View style={styles.shopInfo}>
            <View style={styles.shopLogo}>
              <Text style={styles.shopLogoText}>{store.name.charAt(0)}</Text>
            </View>
            <Text style={styles.shopName}>{store.name}</Text>
            <Text style={styles.shopType}>{store.businessType || 'Магазин'}</Text>
            <View style={styles.statusBadges}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {store.verificationStatus === 'TRUSTED' || store.verificationStatus === 'VERIFIED' ? '✅ ' : ''}
                  {VERIFICATION_LABELS[store.verificationStatus] ?? store.verificationStatus}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editLink} onPress={openStoreModal}>
              <Text style={styles.editLinkText}>Изменить название и описание</Text>
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={{ marginTop: 12 }}>
            <Stars rating={store.rating} count={store.reviewCount} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{store.totalDeals}</Text>
            <Text style={styles.statLabel}>Сделок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{store.reviewCount}</Text>
            <Text style={styles.statLabel}>Отзывов</Text>
          </View>
        </View>

        {/* Branches */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Филиалы</Text>
            <TouchableOpacity onPress={() => openBranchModal()}>
              <Text style={{ fontSize: 18 }}>➕</Text>
            </TouchableOpacity>
          </View>
          {branches.length === 0 ? (
            <Text style={{ color: C.textTertiary, fontSize: 13 }}>Филиалы пока не добавлены</Text>
          ) : (
            branches.map((branch) => (
              <View key={branch.id} style={styles.branchCard}>
                <Text style={styles.branchDetail}>📍 {branch.city}, {branch.address}</Text>
                {branch.phone && <Text style={styles.branchDetail}>📞 {branch.phone}</Text>}
                {branch.workHours && (
                  <Text style={styles.branchDetail}>
                    🕐 {branch.workHours.days.join(', ')}: {branch.workHours.open}-{branch.workHours.close}
                  </Text>
                )}
                <View style={styles.branchActions}>
                  <TouchableOpacity style={styles.branchActionButton} onPress={() => openBranchModal(branch)}>
                    <Text style={{ fontSize: 14 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.branchActionButton} onPress={() => removeBranch(branch.id)}>
                    <Text style={{ fontSize: 14 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Категории товаров</Text>
            <TouchableOpacity onPress={() => router.push('/(seller)/(tabs)/inventory' as never)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>Изменить</Text>
            </TouchableOpacity>
          </View>
          {store.categories.length === 0 ? (
            <Text style={{ color: C.textTertiary, fontSize: 13 }}>Категории не выбраны</Text>
          ) : (
            <View style={styles.categoryTags}>
              {store.categories.map((cat) => {
                const info = getPartCategoryInfo(toProductCategory(cat));
                return (
                  <View key={cat} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{info?.label ?? cat}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, paddingTop: 16, marginBottom: 0 }]}>
            Настройки магазина
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

      {/* Edit store modal */}
      <Modal visible={storeModalVisible} transparent animationType="slide" onRequestClose={() => setStoreModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setStoreModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Название и описание</Text>
            <Input placeholder="Название магазина" value={name} onChangeText={setName} />
            <Input placeholder="Описание" value={description} onChangeText={setDescription} multiline numberOfLines={3} />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: C.bg }]}
                onPress={() => setStoreModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: C.textPrimary }]}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: C.primary }]}
                onPress={saveStore}
                disabled={savingStore}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  {savingStore ? 'Сохранение...' : 'Сохранить'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add/edit branch modal */}
      <Modal visible={branchModalVisible} transparent animationType="slide" onRequestClose={() => setBranchModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setBranchModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{editingBranchId ? 'Изменить филиал' : 'Новый филиал'}</Text>
            <Input placeholder="Город" value={branchCity} onChangeText={setBranchCity} />
            <Input placeholder="Адрес" value={branchAddress} onChangeText={setBranchAddress} />
            <Input placeholder="Телефон" value={branchPhone} onChangeText={setBranchPhone} keyboardType="phone-pad" />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: C.bg }]}
                onPress={() => setBranchModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: C.textPrimary }]}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: C.primary }]}
                onPress={saveBranch}
                disabled={savingBranch}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  {savingBranch ? 'Сохранение...' : 'Сохранить'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
