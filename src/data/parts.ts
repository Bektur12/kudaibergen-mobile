import { Ionicons } from '@expo/vector-icons'
import { MOCK_SELLERS } from './sellers'
import type { Store, ProductCategory } from '@/types'

export interface PartCategory {
  id: ProductCategory
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

// Categories of parts buyers can request
export const PART_CATEGORIES: PartCategory[] = [
  { id: 'brakes', label: 'Тормоза', icon: 'disc-outline' },
  { id: 'suspension', label: 'Подвеска', icon: 'swap-vertical-outline' },
  { id: 'engine', label: 'Двигатель', icon: 'cog-outline' },
  { id: 'wheels', label: 'Колёса и шины', icon: 'radio-button-off-outline' },
  { id: 'lights', label: 'Освещение', icon: 'bulb-outline' },
  { id: 'oils', label: 'Масла и жидкости', icon: 'water-outline' },
  { id: 'accessories', label: 'Аксессуары', icon: 'cube-outline' },
]

// Which sellers carry which part categories
export const SELLER_PART_CATEGORIES: Record<string, ProductCategory[]> = {
  'seller-1': ['brakes', 'suspension', 'engine', 'oils', 'accessories'], // АвтоПрофи
  'seller-2': ['brakes', 'engine', 'wheels', 'lights'], // MegaAvto
  'seller-3': ['engine', 'oils'], // Toyota Service
  'seller-4': ['accessories', 'lights', 'wheels'], // AutoKing
  'seller-5': ['brakes', 'suspension', 'engine'], // BMW Express
}

export function getSellersForPart(category: ProductCategory): Store[] {
  return MOCK_SELLERS.filter((seller) =>
    (SELLER_PART_CATEGORIES[seller.id] || []).includes(category)
  )
}

export function getPartCategoryInfo(category: ProductCategory): PartCategory | undefined {
  return PART_CATEGORIES.find((p) => p.id === category)
}
