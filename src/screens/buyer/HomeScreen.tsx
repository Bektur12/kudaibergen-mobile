import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, NotifBell } from '@/components/ui';
import QuickRequestCard from '@/components/QuickRequestCard';
import { listStores, type StoreSummary } from '@/lib/store-api';

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  parts: 'Магазин запчастей',
  tires: 'Шиномонтаж',
  oils: 'Масла и жидкости',
  accessories: 'Аксессуары',
  sto: 'СТО',
  carwash: 'Автомойка',
};

export default function HomeScreen({
  onNavigate,
  onOpenChat,
}: {
  onNavigate: (tab: string) => void;
  onOpenChat?: () => void;
}) {
  const colors = C;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [stores, setStores] = useState<StoreSummary[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await listStores();
        if (!cancelled) setStores(res.content);
      } catch {
        // keep whatever was on screen — a transient network hiccup shouldn't blank the home feed
      } finally {
        if (!cancelled) setLoadingStores(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header: City + Notifications */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.cityLabel, { color: colors.textTertiary }]}>
              ГОРОД
            </Text>
            <Text style={[styles.cityName, { color: colors.textPrimary }]}>
              Бишкек
            </Text>
          </View>
          <NotifBell count={2} />
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onNavigate('search')}
          >
            <Text style={[styles.searchText, { color: colors.textTertiary }]}>
              Поиск запчастей и магазинов
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Quick Request Card (Hero Block) */}
        <QuickRequestCard onPress={() => router.push('/(buyer)/quick-request-part' as any)} />

        {/* Stores Section */}
        <View style={styles.listingsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              Магазины запчастей
            </Text>
          </View>

          {loadingStores ? (
            <ActivityIndicator color={colors.textTertiary} style={{ marginVertical: 16 }} />
          ) : stores.length === 0 ? (
            <View style={{ gap: 4 }}>
              <Text style={[styles.storeName, { color: colors.textPrimary }]}>
                Магазины ещё не подключены
              </Text>
              <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                Создайте запрос — мы отправим его продавцам, как только они появятся
              </Text>
            </View>
          ) : (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                onPress={() => router.push(`/(buyer)/store/${store.id}` as any)}
                style={[
                  styles.storeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.storeLogo, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.storeLogoText, { color: colors.textSecondary }]}>
                    {store.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.storeContent}>
                  <View style={styles.storeTitleRow}>
                    <Text style={[styles.storeName, { color: colors.textPrimary }]}>
                      {store.name}
                    </Text>
                    {store.verificationStatus === 'TRUSTED' && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                    )}
                    {store.verificationStatus === 'VERIFIED' && (
                      <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
                    )}
                  </View>
                  <Text style={[styles.storeType, { color: colors.textSecondary }]}>
                    {BUSINESS_TYPE_LABELS[store.businessType] || 'Магазин'}
                  </Text>
                  <View style={styles.storeFooter}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color={colors.textTertiary} />
                      <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                        {store.rating} ({store.reviewCount})
                      </Text>
                    </View>
                    {store.cities[0] && (
                      <Text
                        style={[styles.footerText, { color: colors.textTertiary, flex: 1 }]}
                        numberOfLines={1}
                      >
                        {store.cities[0]}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  searchBar: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
  },
  searchText: {
    fontSize: 16,
  },

  // Stores Section
  listingsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Store Card
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  storeLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  storeLogoText: {
    fontSize: 22,
    fontWeight: '700',
  },
  storeContent: {
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '700',
  },
  storeType: {
    fontSize: 15,
    marginTop: 2,
  },
  storeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
});
