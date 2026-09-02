# Data Models - Кудайберген

## 1. User Models

### 1.1 User (Базовый)
```typescript
interface User {
  id: string                      // user_123abc
  name: string                    // "Иван Петров"
  email: string                   // "ivan@example.com"
  phone: string                   // "+7 707 123 4567"
  role: 'buyer' | 'seller'        // Роль пользователя
  avatar?: string                 // URL или Base64
  createdAt: Date                 // Дата регистрации
  lastActiveAt: Date              // Последняя активность
  isVerified: boolean             // Email подтвержден
  isPhoneVerified: boolean        // Телефон подтвержден
  status: 'active' | 'blocked'    // Статус аккаунта
}
```

### 1.2 BuyerProfile
```typescript
interface BuyerProfile extends User {
  vehicles: Vehicle[]             // Сохранённые автомобили
  vehicles: string[]              // ID автомобилей
  rating: number                  // Рейтинг (1-5)
  reviewCount: number             // Количество отзывов
  totalDeals: number              // Всего сделок
  totalSpent: number              // Всего потрачено (KZT)
  preferredPaymentMethod?: 'cash' | 'card' | 'transfer'
  location?: {
    latitude: number
    longitude: number
    city: string
    address: string
  }
}
```

### 1.3 SellerProfile extends User
```typescript
interface SellerProfile extends User {
  businessName: string            // "Авто Сервис №1"
  businessType: 'shop' | 'service' | 'private'
  inn?: string                    // ИНН компании
  businessAddress: string         // Адрес магазина
  workingHours?: {
    open: string                  // "09:00"
    close: string                 // "18:00"
    days: string[]                // ["MON", "TUE", ...]
  }
  rating: number                  // Рейтинг продавца (1-5)
  reviewCount: number             // Количество отзывов
  totalDeals: number              // Всего сделок
  totalRevenue: number            // Общая выручка (KZT)
  averageResponseTime: number     // Среднее время ответа (мин)
  verificationStatus: 'new' | 'verified' | 'trusted' | 'blocked'
  categories: string[]            // ["Engine", "Brakes", ...]
  inventory: string[]             // IDs товаров в каталоге
  locations: Location[]           // Несколько адресов/боксов
  logo?: string                   // Logo URL
}
```

---

## 2. Vehicle Models

### 2.1 Vehicle
```typescript
interface Vehicle {
  id: string                      // "vehicle_123abc"
  buyerId: string                 // ID покупателя-владельца
  brand: string                   // "Toyota"
  model: string                   // "Camry"
  year: number                    // 2020
  engineVolume: string            // "2.5L"
  engineType: 'petrol' | 'diesel' | 'hybrid' | 'electric'
  transmission: 'manual' | 'automatic'
  body: string                    // "Sedan"
  vin?: string                    // VIN номер
  plateNumber?: string            // Номер авто
  color?: string                  // Цвет
  mileage?: number                // Пробег (км)
  isDefault: boolean              // Основной автомобиль
  createdAt: Date
}
```

---

## 3. Request Models

### 3.1 Request (Запрос от покупателя)
```typescript
interface Request {
  id: string                      // "req_123abc"
  buyerId: string                 // ID покупателя
  vehicleId: string               // ID автомобиля
  carModel: string                // "Toyota Camry"
  carYear: number                 // 2020
  carEngine: string               // "2.5L Twin-Turbo"
  
  // Описание запроса
  title?: string                  // "Стойки передние"
  description: string             // Подробное описание
  categories: string[]            // ["Suspension", "Brakes"]
  
  // Фото и вложения
  photos?: string[]               // URLs фотографий
  
  // Параметры запроса
  status: 'active' | 'archived' | 'completed' | 'cancelled'
  isUrgent: boolean               // Срочный запрос
  budget?: {
    min: number                   // Минимальный бюджет
    max: number                   // Максимальный бюджет
    currency: 'KZT' | 'USD'
  }
  visibility: 'all' | 'verified_only'
  
  // Временные параметры
  createdAt: Date                 // Создан
  expiresAt: Date                 // Истекает через 24-72 часа
  
  // Статистика
  offerCount: number              // Количество предложений
  selectedOfferId?: string        // Выбранное предложение (если есть)
  
  // Локация
  location?: {
    city: string
    latitude: number
    longitude: number
  }
}
```

---

## 4. Offer Models

### 4.1 Offer (Предложение от продавца)
```typescript
interface Offer {
  id: string                      // "offer_123abc"
  requestId: string               // ID запроса
  sellerId: string                // ID продавца
  
  // Цена и условия
  price: number                   // Цена в тенге
  currency: 'KZT' | 'USD'
  
  // Описание предложения
  description?: string            // Описание товара
  condition: 'new' | 'used' | 'refurbished'
  warranty?: {
    period: number                // Дней гарантии
    type: 'manufacturer' | 'seller' | 'none'
  }
  
  // Доставка и встреча
  deliveryOptions: {
    method: 'pickup' | 'delivery' | 'mail'
    estimatedDays: number
    deliveryPrice?: number
  }[]
  location?: string               // Адрес магазина/бокса
  
  // Способы оплаты
  paymentMethods: ('cash' | 'card' | 'transfer')[]
  
  // Статус
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  acceptedAt?: Date               // Когда принято
  
  // Временные данные
  createdAt: Date
  expiresAt: Date                 // Предложение актуально 7 дней
  
  // Фото товара
  photos?: string[]               // URLs фотографий товара
}
```

---

## 5. Chat Models

### 5.1 Chat
```typescript
interface Chat {
  id: string                      // "chat_123abc"
  participantIds: string[]        // [buyerId, sellerId]
  requestId?: string              // Связанный запрос (если есть)
  offerId?: string                // Связанное предложение (если есть)
  
  // Информация
  lastMessage?: string            // Последнее сообщение
  lastMessageTime?: Date          // Время последнего сообщения
  lastMessageSenderId?: string    // Кто отправил
  
  // Статусы
  status: 'active' | 'archived' | 'closed'
  unreadCount: number             // Непрочитанные сообщения
  
  // Временные данные
  createdAt: Date
  closedAt?: Date                 // Когда закрыт
  lastActivityAt: Date
  
  // Информация о товаре (кешировано)
  productInfo?: {
    offerId: string
    price: number
    description: string
    sellerName: string
  }
}
```

### 5.2 Message
```typescript
interface Message {
  id: string                      // "msg_123abc"
  chatId: string                  // ID чата
  senderId: string                // ID отправителя
  recipientId: string             // ID получателя
  
  // Содержание
  type: 'text' | 'photo' | 'voice' | 'file'
  content: string                 // Текст сообщения или URL
  metadata?: {
    fileName?: string
    fileSize?: number
    duration?: number             // Для голоса
    mimeType?: string
  }
  
  // Статус
  isRead: boolean
  readAt?: Date
  
  // Временные данные
  createdAt: Date
  editedAt?: Date
}
```

---

## 6. Review & Rating Models

### 6.1 Review (Отзыв)
```typescript
interface Review {
  id: string                      // "review_123abc"
  reviewerId: string              // Кто оставил отзыв (покупатель)
  sellerId: string                // О ком отзыв (продавец)
  offerId: string                 // За какое предложение
  
  // Оценка
  rating: number                  // 1-5 звёзд
  
  // Критерии оценки
  criteria: {
    qualityRating: number         // Качество товара
    priceHonesty: number          // Честность цены
    responseSpeed: number         // Скорость ответа
    meetingConvenience: number    // Удобство встречи
    professionalism: number       // Профессионализм
  }
  
  // Текст отзыва
  text: string                    // Текст отзыва
  
  // Ответ продавца
  sellerResponse?: string         // Ответ на отзыв
  sellerResponseAt?: Date
  
  // Статусы
  isVerified: boolean             // Проверен ли отзыв (купили ли действительно)
  isPublished: boolean            // Опубликован ли
  status: 'pending' | 'approved' | 'rejected'
  
  // Временные данные
  createdAt: Date
  publishedAt?: Date
}
```

---

## 7. Transaction & Deal Models

### 7.1 Deal (Сделка)
```typescript
interface Deal {
  id: string                      // "deal_123abc"
  requestId: string               // Связанный запрос
  offerId: string                 // Выбранное предложение
  buyerId: string                 // Покупатель
  sellerId: string                // Продавец
  
  // Товар
  productInfo: {
    title: string
    price: number
    currency: 'KZT' | 'USD'
    description: string
  }
  
  // Встреча
  meetingDetails?: {
    date: Date
    time: string
    location: string
    address: string
  }
  
  // Статус сделки
  status: 'negotiating' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'
  
  // Платёж
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod?: 'cash' | 'card' | 'transfer'
  paidAt?: Date
  
  // Временные данные
  createdAt: Date
  completedAt?: Date
  disputeRaisedAt?: Date
}
```

---

## 8. Analytics Models

### 8.1 SellerStats
```typescript
interface SellerStats {
  sellerId: string
  period: 'daily' | 'weekly' | 'monthly'
  date: Date
  
  // Метрики
  totalOffers: number             // Всего предложений
  acceptedOffers: number          // Принято предложений
  dealsCompleted: number          // Завершено сделок
  conversionRate: number          // % конверсия
  
  revenue: number                 // Выручка за период
  averageOrderValue: number       // Средний чек
  
  messagesSent: number            // Отправлено сообщений
  averageResponseTime: number     // Среднее время ответа (мин)
  
  newReviews: number              // Новых отзывов
  averageRating: number           // Средний рейтинг
}
```

---

## 9. Notification Models

### 9.1 Notification
```typescript
interface Notification {
  id: string
  userId: string                  // Кому отправить
  
  type: 'new_offer' | 'new_message' | 'offer_expiring' | 
        'request_expiring' | 'deal_completed' | 'review_received'
  
  title: string
  body: string
  
  // Действие
  actionUrl?: string              // Куда перейти при клике
  actionData?: {
    requestId?: string
    offerId?: string
    chatId?: string
  }
  
  // Статус
  isRead: boolean
  readAt?: Date
  
  // Доставка
  deliveryMethods: ('in_app' | 'push' | 'email' | 'sms')[]
  
  createdAt: Date
}
```

---

## 10. Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  role ENUM('buyer', 'seller'),
  avatar_url TEXT,
  is_verified BOOLEAN,
  status ENUM('active', 'blocked'),
  created_at TIMESTAMP,
  last_active_at TIMESTAMP
);

-- Buyer Profiles
CREATE TABLE buyer_profiles (
  buyer_id UUID PRIMARY KEY REFERENCES users(id),
  rating DECIMAL(3,2),
  review_count INT,
  total_deals INT,
  total_spent DECIMAL(15,2)
);

-- Seller Profiles
CREATE TABLE seller_profiles (
  seller_id UUID PRIMARY KEY REFERENCES users(id),
  business_name VARCHAR(255),
  business_type ENUM('shop', 'service', 'private'),
  rating DECIMAL(3,2),
  review_count INT,
  total_deals INT,
  avg_response_time INT,
  verification_status ENUM('new', 'verified', 'trusted', 'blocked')
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  brand VARCHAR(100),
  model VARCHAR(100),
  year INT,
  engine_volume VARCHAR(50),
  is_default BOOLEAN,
  created_at TIMESTAMP
);

-- Requests
CREATE TABLE requests (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  title VARCHAR(255),
  description TEXT,
  status ENUM('active', 'archived', 'completed'),
  is_urgent BOOLEAN,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  offer_count INT
);

-- Offers
CREATE TABLE offers (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  seller_id UUID REFERENCES users(id),
  price DECIMAL(15,2),
  currency ENUM('KZT', 'USD'),
  description TEXT,
  status ENUM('active', 'accepted', 'expired'),
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Chats
CREATE TABLE chats (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  request_id UUID REFERENCES requests(id),
  status ENUM('active', 'archived', 'closed'),
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type ENUM('text', 'photo', 'voice'),
  is_read BOOLEAN,
  created_at TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  offer_id UUID REFERENCES offers(id),
  rating INT,
  text TEXT,
  status ENUM('pending', 'approved', 'rejected'),
  created_at TIMESTAMP
);

-- Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  offer_id UUID REFERENCES offers(id),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  status ENUM('negotiating', 'confirmed', 'completed', 'cancelled'),
  payment_status ENUM('pending', 'paid'),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_requests_buyer_id ON requests(buyer_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_offers_request_id ON offers(request_id);
CREATE INDEX idx_offers_seller_id ON offers(seller_id);
CREATE INDEX idx_chats_buyer_id ON chats(buyer_id);
CREATE INDEX idx_chats_seller_id ON chats(seller_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX idx_deals_seller_id ON deals(seller_id);
```

---

**Версия:** 1.0  
**Последнее обновление:** 2024-09-02
