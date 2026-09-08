import { Store } from '@/types'

// Mock sellers data
export const MOCK_SELLERS: Store[] = [
  {
    id: 'seller-1',
    sellerId: 'user-1',
    name: 'АвтоПрофи',
    type: 'shop',
    businessType: 'parts',
    description: 'Магазин автозапчастей с большим выбором',
    rating: 4.8,
    reviewCount: 124,
    totalDeals: 892,
    verificationStatus: 'trusted',
    logo: '🏪',
    branches: [
      {
        id: 'branch-1',
        storeId: 'seller-1',
        address: 'ул. Чуй, 123',
        city: 'Бишкек',
        phone: '+996 312 91-20-01',
        latitude: 42.8746,
        longitude: 74.6142,
        workingHours: {
          open: '09:00',
          close: '19:00',
          days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        },
      },
    ],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'seller-2',
    sellerId: 'user-2',
    name: 'MegaAvto',
    type: 'shop',
    businessType: 'parts',
    description: 'Запчасти для всех марок авто',
    rating: 4.7,
    reviewCount: 98,
    totalDeals: 567,
    verificationStatus: 'verified',
    logo: '🛠️',
    branches: [
      {
        id: 'branch-2',
        storeId: 'seller-2',
        address: 'пр. Дикий Запад, 456',
        city: 'Бишкек',
        phone: '+996 312 55-44-33',
        latitude: 42.8850,
        longitude: 74.6200,
        workingHours: {
          open: '08:00',
          close: '20:00',
          days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        },
      },
    ],
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 'seller-3',
    sellerId: 'user-3',
    name: 'Toyota Service',
    type: 'service',
    businessType: 'sto',
    description: 'Официальный сервис Toyota',
    rating: 4.9,
    reviewCount: 234,
    totalDeals: 1203,
    verificationStatus: 'trusted',
    logo: '🏥',
    branches: [
      {
        id: 'branch-3',
        storeId: 'seller-3',
        address: 'ул. Ленина, 789',
        city: 'Бишкек',
        phone: '+996 312 62-70-80',
        latitude: 42.8750,
        longitude: 74.6050,
        workingHours: {
          open: '08:30',
          close: '18:30',
          days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
        },
      },
    ],
    createdAt: new Date('2022-06-10'),
  },
  {
    id: 'seller-4',
    sellerId: 'user-4',
    name: 'AutoKing',
    type: 'shop',
    businessType: 'accessories',
    description: 'Аксессуары для авто и тюнинг',
    rating: 4.6,
    reviewCount: 76,
    totalDeals: 345,
    verificationStatus: 'verified',
    logo: '⚙️',
    branches: [
      {
        id: 'branch-4',
        storeId: 'seller-4',
        address: 'ул. Панфилова, 234',
        city: 'Бишкек',
        phone: '+996 312 33-22-11',
        latitude: 42.8920,
        longitude: 74.6300,
      },
    ],
    createdAt: new Date('2023-05-01'),
  },
  {
    id: 'seller-5',
    sellerId: 'user-5',
    name: 'BMW Express',
    type: 'shop',
    businessType: 'parts',
    description: 'Запчасти для BMW и немецких авто',
    rating: 4.5,
    reviewCount: 54,
    totalDeals: 267,
    verificationStatus: 'new',
    logo: '🚙',
    branches: [
      {
        id: 'branch-5',
        storeId: 'seller-5',
        address: 'ул. Абдулалиева, 100',
        city: 'Бишкек',
        phone: '+996 312 77-88-99',
        latitude: 42.8600,
        longitude: 74.6400,
      },
    ],
    createdAt: new Date('2024-01-10'),
  },
]

// Map of which sellers sell which car brands
export const SELLER_CAR_BRANDS: Record<string, string[]> = {
  'seller-1': ['Toyota', 'Honda', 'Mazda', 'Nissan'],
  'seller-2': ['Toyota', 'BMW', 'Mercedes', 'Audi'],
  'seller-3': ['Toyota'],
  'seller-4': ['All'],
  'seller-5': ['BMW', 'Audi', 'Mercedes', 'Volkswagen'],
}

export function getSellersForBrand(brand: string): Store[] {
  return MOCK_SELLERS.filter((seller) => {
    const brands = SELLER_CAR_BRANDS[seller.id] || []
    return brands.includes(brand) || brands.includes('All')
  })
}
