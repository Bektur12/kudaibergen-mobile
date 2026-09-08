import { Request } from '@/types'

// Mock quick requests data
export const MOCK_REQUESTS: Request[] = [
  {
    id: 'req-1',
    buyerId: 'buyer-1',
    carModel: 'Toyota Camry',
    description: 'Ищу Camry 2015-2020 в хорошем состоянии',
    category: 'brakes',
    status: 'active',
    budget: {
      min: 15000,
      max: 22000,
      currency: 'USD',
    },
    city: 'Бишкек',
    isUrgent: true,
    createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    expiresAt: new Date(Date.now() + 6 * 60 * 60000), // 6 hours from now
    offerCount: 4,
  },
  {
    id: 'req-2',
    buyerId: 'buyer-2',
    carModel: 'BMW X5',
    description: 'Нужна коробка передач для BMW X5 G05',
    category: 'engine',
    status: 'active',
    budget: {
      min: 1000,
      max: 2000,
      currency: 'USD',
    },
    city: 'Бишкек',
    isUrgent: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    expiresAt: new Date(Date.now() + 4 * 60 * 60000), // 4 hours from now
    offerCount: 2,
  },
  {
    id: 'req-3',
    buyerId: 'buyer-3',
    carModel: 'Mercedes E200',
    description: 'Тормозные диски в хорошем состоянии',
    category: 'brakes',
    status: 'active',
    budget: {
      min: 300,
      max: 600,
      currency: 'USD',
    },
    city: 'Бишкек',
    isUrgent: true,
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    expiresAt: new Date(Date.now() + 8 * 60 * 60000), // 8 hours from now
    offerCount: 5,
  },
  {
    id: 'req-4',
    buyerId: 'buyer-4',
    carModel: 'Honda Civic',
    description: 'Масляный фильтр оригинальный',
    category: 'oils',
    status: 'active',
    budget: undefined,
    city: 'Бишкек',
    isUrgent: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60000), // 1 hour ago
    expiresAt: new Date(Date.now() + 7 * 60 * 60000), // 7 hours from now
    offerCount: 3,
  },
  {
    id: 'req-5',
    buyerId: 'buyer-5',
    carModel: 'Nissan Altima',
    description: 'Амортизаторы передние пара',
    category: 'suspension',
    status: 'active',
    budget: {
      min: 500,
      max: 900,
      currency: 'USD',
    },
    city: 'Бишкек',
    isUrgent: true,
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    expiresAt: new Date(Date.now() + 5.5 * 60 * 60000), // 5.5 hours from now
    offerCount: 1,
  },
]

// Get time ago string
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}м назад`
  if (hours < 24) return `${hours}ч назад`
  if (days < 7) return `${days}д назад`
  return date.toLocaleDateString('ru-RU')
}

// Get remaining time
export function getTimeRemaining(expiresAt: Date): string {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  if (hours < 1) return `${minutes}м осталось`
  return `${hours}ч ${minutes}м осталось`
}
