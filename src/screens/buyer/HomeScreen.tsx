import { ScrollView, View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { C, CDark, T, NotifBell, Btn, Stars } from '@/components/ui';
import QuickRequestCard from '@/components/QuickRequestCard';
import QuickRequestSheet from '@/components/QuickRequestSheet';

// Data with urgency & stock status
const LISTINGS = [
  {
    id: 1,
    img: '🚗',
    title: 'Toyota Camry 70',
    desc: '2020, 2.5L, АКПП',
    price: 23500,
    currency: '$',
    rating: 4.8,
    reviews: 24,
    distance: '20 км',
    urgency: 'urgent', // 'urgent' | 'available' | null
  },
  {
    id: 2,
    img: '🚙',
    title: 'BMW X5 G05',
    desc: '2021, 3.0L, Автомат',
    price: 48000,
    currency: '$',
    rating: 4.9,
    reviews: 37,
    distance: '5 км',
    urgency: null,
  },
  {
    id: 3,
    img: '🏎️',
    title: 'Mercedes E200',
    desc: '2019, 2.0L, АКПП',
    price: 31000,
    currency: '$',
    rating: 4.7,
    reviews: 12,
    distance: '12 км',
    urgency: 'available',
  },
];

const CATEGORIES = [
  { icon: '🚗', label: 'Авто', tab: 'search', action: 'quick-request-auto' },
  { icon: '🔧', label: 'Запчасти', tab: 'search' },
  { icon: '🏥', label: 'Услуги', tab: 'search' },
  { icon: '📍', label: 'Рядом', tab: 'map' },
];

const LAST_SEARCH = {
  vehicle: 'Toyota Camry',
  category: 'Запчасти',
  isPersonalized: true,
};

export default function HomeScreen({
  onNavigate,
  onOpenChat,
}: {
  onNavigate: (tab: string) => void;
  onOpenChat?: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? CDark : C;
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleQuickRequest = async (data: any) => {
    // TODO: Send to API
    console.log('Quick Request:', data);

    // Mock API response - replace with real API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ sellersMatched: 14 });
      }, 1500);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header: City + Notifications */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
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
          <Text>🔍</Text>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onNavigate('search')}
          >
            <Text style={[styles.searchText, { color: colors.textTertiary }]}>
              Авто, запчасти, услуги...
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Quick Request Card (Hero Block) */}
        <QuickRequestCard onPress={() => setIsSheetOpen(true)} />

        {/* Promo Block */}
        <View style={[styles.promoBlock, { backgroundColor: colors.primaryTint || '#FFEDE3' }]}>
          <Text style={[styles.promoLabel, { color: colors.primary }]}>
            💡 Рекомендуем
          </Text>
          <View style={styles.promoContent}>
            <View style={[styles.promoImage, { backgroundColor: '#E5A860' }]}>
              🚗
            </View>
            <View style={styles.promoText}>
              <Text style={[styles.promoTitle, { color: colors.textPrimary }]}>
                {LAST_SEARCH.vehicle} — {LAST_SEARCH.category}
              </Text>
              <Text style={[styles.promoDesc, { color: colors.textSecondary }]}>
                На основе вашего поиска
              </Text>
              <Btn
                size="sm"
                onPress={() => onNavigate('search')}
                style={styles.promoButton}
              >
                Найти запчасти
              </Btn>
            </View>
          </View>
        </View>

        {/* Categories Grid (2x2) */}
        <View style={[styles.categoriesContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryButton, { backgroundColor: colors.bg, borderColor: colors.border }]}
                onPress={() => {
                  if ('action' in cat && cat.action) {
                    router.push(`/(buyer)/${cat.action}` as any)
                  } else {
                    onNavigate(cat.tab)
                  }
                }}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryLabel, { color: colors.textPrimary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Listings Section */}
        <View style={styles.listingsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              Новые объявления
            </Text>
            <TouchableOpacity onPress={() => onNavigate('search')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Все →</Text>
            </TouchableOpacity>
          </View>

          {LISTINGS.map((listing) => (
            <View
              key={listing.id}
              style={[
                styles.listingCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Image with badge */}
              <View
                style={[
                  styles.listingImage,
                  {
                    backgroundColor:
                      listing.id === 1 ? '#E5A860' : listing.id === 2 ? '#6B5B95' : '#FF6B6B',
                  },
                ]}
              >
                <Text style={{ fontSize: 48 }}>{listing.img}</Text>

                {/* Urgency/Available Badge */}
                {listing.urgency === 'urgent' && (
                  <View style={[styles.urgencyBadge, { backgroundColor: colors.error }]}>
                    <Text style={styles.badgeText}>⚡ СРОЧНО</Text>
                  </View>
                )}
                {listing.urgency === 'available' && (
                  <View style={[styles.availableBadge, { backgroundColor: colors.success }]}>
                    <Text style={styles.badgeText}>✓ В наличии</Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.listingContent}>
                <Text style={[styles.listingTitle, { color: colors.textPrimary }]}>
                  {listing.title}
                </Text>
                <Text style={[styles.listingDesc, { color: colors.textSecondary }]}>
                  {listing.desc}
                </Text>

                {/* BIG PRICE */}
                <Text style={[styles.listingPrice, { color: colors.primary }]}>
                  {listing.currency}
                  {listing.price.toLocaleString()}
                </Text>

                {/* Rating + Distance */}
                <View style={styles.listingFooter}>
                  <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                    ⭐ {listing.rating} ({listing.reviews})
                  </Text>
                  <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                    📍 {listing.distance}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Quick Request Bottom Sheet */}
      <QuickRequestSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleQuickRequest}
        defaultCategory="parts"
        userCity="Бишкек"
      />
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
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cityName: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  searchBar: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
  },
  searchText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Promo Block
  promoBlock: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    padding: 16,
  },
  promoLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  promoContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  promoImage: {
    width: 60,
    height: 60,
    backgroundColor: '#E5A860',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 28,
    flexShrink: 0,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  promoDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  promoButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  // Categories Grid
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Listings
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
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Listing Card (with border instead of shadow)
  listingCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
  },
  listingImage: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 48,
    position: 'relative',
  },
  urgencyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listingContent: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  listingDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  listingPrice: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 8,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
  },
  footerText: {
    fontSize: 12,
  },
});
