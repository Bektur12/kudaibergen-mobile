# Кудайберген - Полная Design Specification

## 📱 Обзор приложения

Мобильное приложение автомобильного маркетплейса для Кыргызстана с поддержкой трёх основных категорий:
- 🚗 Автомобили (покупка/продажа)
- 🔧 Запчасти (розница)
- 🔧 Услуги (СТО, мойка, шиномонтаж)

**Целевая аудитория:** Водители (18-65 лет) и автомагазины/СТО

---

## 🎨 Design System

### Палитра цветов

**Light Mode:**
```
Primary (Accent): #FF6B35 (оранжевый)
Secondary: #F7931E
Error/Destructive: #EF5350
Success: #4CAF50
Text Primary: #1A1A1A
Text Secondary: #666666
Text Tertiary: #999999
Background: #F5F5F5
Surface: #FFFFFF
Surface Alt: #F9F9F9
Border: #E0E0E0
```

**Dark Mode:**
```
Primary (Accent): #FF6B35 (оранжевый - идентичный)
Text Primary: #FFFFFF
Text Secondary: #B0B0B0
Text Tertiary: #808080
Background: #0A0A0A
Surface: #1A1A1A
Surface Alt: #2A2A2A
Border: #333333
```

### Typography

```
Price (26px, 700): Для больших ценников
Heading (17px, 700): Заголовки секций
Button (17px, 700): Текст кнопок
Body (15px, 400): Основной текст
Secondary (13px, 400): Вторичный текст
Label (12px, 600): Лейблы и метки
Hint (11px, 400): Хинты и подсказки
```

### Spacing System

```
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
7: 32px
8: 40px
```

### Border Radius

```
Small: 8px
Medium: 12px
Large: 14px
XL: 16px
Full: 999px
```

---

## 📋 Screen Map

### ПОКУПАТЕЛЬ (Buyer Role)

#### 🏠 Главная (Home)
**URL:** `/(buyer)/(tabs)`

**Layout:**
```
┌─────────────────────────┐
│ [≡] Бишкек      [🔔]    │  ← Header с городом и уведомлениями
├─────────────────────────┤
│ [🔍 Авто, запч, услуга]│  ← Search bar
├─────────────────────────┤
│ Мой автомобиль          │
│ ┌───────────────────────┐│
│ │ 🚗 Toyota Camry 2020  ││
│ │    [Найти запчасти] ││
│ └───────────────────────┘│
├─────────────────────────┤
│ Категории               │
│ 🚗 Авто | 🔧 Запч      │
│ 🔧 Услуг | 📍 Рядом    │
├─────────────────────────┤
│ Новые объявления        │
│ ┌───────────────────────┐│
│ │ [Фото]                ││
│ │ Toyota Camry 70       ││
│ │ 2020, 2.0L, АКПП     ││
│ │ $23,500 ⭐ 4.8 📍 20км││
│ └───────────────────────┘│
└─────────────────────────┘
```

**Business Logic:**
- Отображение текущего города (Бишкек по умолчанию)
- Подсчёт неприходящих уведомлений
-显示основного автомобиля пользователя
- Показ 4-6 последних объявлений по категориям

**Data needed:**
- `user.city` (текущий город)
- `user.defaultVehicle` (основной авто)
- `notifications.unreadCount`
- `listings` (массив последних объявлений)

---

#### 🔍 Поиск (Search)
**URL:** `/(buyer)/(tabs)/search`

**Layout:**
```
┌─────────────────────────┐
│ ← [Поиск]               │
├─────────────────────────┤
│ [🔍 Введите что ищете...]│
├─────────────────────────┤
│ Категории               │
│ [🚗 Авто] [🔧 Запч]    │
│ [🔧 Услуги]             │
├─────────────────────────┤
│ Результаты поиска       │
│ ┌───────────────────────┐│
│ │ [Фото] Toyota...      ││
│ │ $23,500 ⭐ 4.8 (24)  ││
│ └───────────────────────┘│
└─────────────────────────┘
```

**Business Logic:**
- Фильтрация по категориям
- Поиск в реальном времени (debounce 300ms)
- Фильтр по цене (min/max)
- Фильтр по городу (по умолчанию текущий)
- Сортировка (новые, цена ↑/↓, рейтинг)

**Components:**
- Input (с иконкой поиска)
- Category selector (3 кнопки)
- Filter panel (цена, города, сортировка)
- Listing cards (grid или list view)

---

#### 🗺️ Карта (Map)
**URL:** `/(buyer)/(tabs)/map`

**Layout:**
```
┌─────────────────────────┐
│ ← [Рядом со мной]       │
├─────────────────────────┤
│ ┌───────────────────────┐│
│ │                       ││
│ │   [Карта Yandex]     ││
│ │   (с маркерами)      ││
│ │                       ││
│ └───────────────────────┘│
│ [Фильтр] [Все] [СТО]   │
└─────────────────────────┘
```

**Business Logic (Phase 2):**
- Интеграция Yandex Maps API
- Показ маркеров: магазины, СТО, авто
- Фильтр по типу (все / запчасти / услуги)
- Click на маркер → детали магазина
- Поиск по текущей геолокации

**Phase 1 (Current):**
- Placeholder с информацией о планах

---

#### 💬 Чаты (Messages)
**URL:** `/(buyer)/(tabs)/messages`

**Layout:**
```
┌─────────────────────────┐
│ [Чаты]          [≡]     │
├─────────────────────────┤
│ [🔍 Поиск в чатах...]  │
├─────────────────────────┤
│ ┌───────────────────────┐│
│ │ [AA] АвтоДетали       ││
│ │ Последнее сообщение... [2]
│ │                   9:38││
│ └───────────────────────┘│
│ ┌───────────────────────┐│
│ │ [МП] Мотор-Плюс       ││
│ │ Фара левая - 6 500 сом  │
│ │                   9:38││
│ └───────────────────────┘│
└─────────────────────────┘
```

**Business Logic:**
- Список всех активных чатов
- Последнее сообщение + время
- Badge с кол-вом непрочитанных
- Поиск по имени магазина
- Сортировка по времени последнего сообщения
- Свайп влево → архивировать/удалить

**Click action:**
- Tap на chat row → `/(buyer)/chat/[id]`

---

#### 💬 Детали чата (Chat Detail)
**URL:** `/(buyer)/chat/[id]`

**Layout:**
```
┌─────────────────────────┐
│ ← [AA] АвтоДетали [☎️] │
│    🟢 В сети             │
├─────────────────────────┤
│ ┌───────────────────────┐│
│ │ [Фото] Тормоз. диски ││
│ │ $45.99                ││
│ └───────────────────────┘│
├─────────────────────────┤
│ ⚠️ Не передавайте деньги│
│ до встречи. Проверьте! │
├─────────────────────────┤
│ [Зарезервировать][Встреча]
├─────────────────────────┤
│ Сообщение от продавца   │
│     Товар в наличии     │
│                    9:38 │
│                         │
│ Ваше сообщение          │
│     Есть другие варианты?
│                    9:45 │
├─────────────────────────┤
│ [💬 Введите сообщение] [➤]
└─────────────────────────┘
```

**Business Logic:**
- История сообщений (bottom-to-top)
- Differentiation: свои сообщения (orange accent), сообщения продавца (gray)
- Показ товара в контексте
- Warning box о безопасности
- Action buttons (reserve, arrange meeting)
- Отправка текстовых сообщений

**Components:**
- Header (назад, имя продавца, статус онлайн, звонок)
- Product preview card
- Warning box
- Action buttons
- Messages list
- Text input with send button

---

#### 👤 Профиль (Profile)
**URL:** `/(buyer)/(tabs)/profile`

**Layout:**
```
┌─────────────────────────┐
│ [Профиль]               │
├─────────────────────────┤
│ [AA] Иван К.            │
│ ivan@email.com          │
│ ⭐ 4.7 (12 отзывов)    │
│ [✏️]                    │
├─────────────────────────┤
│ Покупок: 24 | Избр: 8  │
│ Адресов: 2              │
├─────────────────────────┤
│ Мои автомобили      [+] │
│ ┌───────────────────────┐│
│ │ Toyota Camry 2020     ││
│ │ ⭐ По умолчанию       ││
│ │ [✏️] [🗑️]            ││
│ └───────────────────────┘│
│ ┌───────────────────────┐│
│ │ BMW 320 2019          ││
│ │ [✏️] [🗑️]            ││
│ └───────────────────────┘│
│ [➕ Добавить авто]      │
├─────────────────────────┤
│ Настройки               │
│ 📍 Адреса доставки     │
│ 💳 Способы оплаты      │
│ 🔔 Уведомления         │
│ 🛡️ Конфиденциальность  │
├─────────────────────────┤
│ [Выход]                 │
└─────────────────────────┘
```

**Business Logic:**
- Отображение профиля пользователя
- CRUD операции для автомобилей
- Управление адресами доставки
- Настройки уведомлений
- Изменение пароля
- Удаление аккаунта

**Components:**
- User info card
- Statistics row
- Vehicle list with edit/delete
- Add vehicle button (modal)
- Settings list
- Logout button

---

### ПРОДАВЕЦ (Seller Role)

#### 📋 Запросы (Home/Requests)
**URL:** `/(seller)/(tabs)`

**Layout:**
```
┌─────────────────────────┐
│ [≡] Панель продавца     │
├─────────────────────────┤
│ Активные объявления: 23 │
│ Конверсия: 34%          │
│ Просмотров: 127 сегодня │
├─────────────────────────┤
│ [➕ Добавить товар]     │
│ [📊 Подробная анали...]│
├─────────────────────────┤
│ Новые запросы от БС     │
│ ┌───────────────────────┐│
│ │ 🏎️ Toyota Camry      ││
│ │ Бюджет: $500-1000    ││
│ │ Поиск тормозных диск  ││
│ │ 📍 Бишкек | 5 предло││
│ │ ⚡ СРОЧНО             ││
│ │ [Отправить предложение]
│ └───────────────────────┘│
├─────────────────────────┤
│ Последняя активность    │
│ 👁️ Просмотр объявления │
│                     5м  │
│ ✅ Отправлено предложе  │
│                     1ч  │
│ 💬 Новое сообщение      │
│                     3ч  │
└─────────────────────────┘
```

**Business Logic:**
- Dashboard с основной статистикой
- Список новых запросов от покупателей
- Фильтр по срочности
- Quick action для отправки предложения
- Activity feed с последними действиями

---

#### 💬 Чаты (Seller Chat)
**URL:** `/(seller)/(tabs)/messages`

**Layout:** Идентичен покупателю, но с другой стороны (продавец видит своих клиентов)

---

#### 📦 Товары (Inventory)
**URL:** `/(seller)/(tabs)/inventory`

**Layout:**
```
┌─────────────────────────┐
│ [Товары]           [+]  │
├─────────────────────────┤
│ [Поиск в товарах...]   │
│ [Фильтр] [Сортировка] │
├─────────────────────────┤
│ ┌───────────────────────┐│
│ │ [Фото] Тормоз. диски ││
│ │ $45.99 | В наличии: 5││
│ │ 👁️ 123 просм 💬 2  ││
│ │ [✏️ Редактир.] [📊]  ││
│ └───────────────────────┘│
│ ┌───────────────────────┐│
│ │ [Фото] Фильтр масла  ││
│ │ $8.50 | В наличии: 23││
│ │ 👁️ 456 просм 💬 12 ││
│ │ [✏️ Редактир.] [📊]  ││
│ └───────────────────────┘│
└─────────────────────────┘
```

**Business Logic:**
- Полный список всех товаров продавца
- Показ: фото, название, цена, статус наличия
- Просмотры и сообщения по товару
- Редактирование товара (modal)
- Добавление нового товара
- Удаление товара
- Статистика по товару

---

#### 📊 Аналитика (Analytics)
**URL:** `/(seller)/(tabs)/analytics`

**Layout:**
```
┌─────────────────────────┐
│ [Аналитика]             │
├─────────────────────────┤
│ [Неделя][Месяц][Год]  │
├─────────────────────────┤
│ Просмотров    Контакты │
│    1,247        284    │
│    +12%         +8%    │
│                        │
│ Конверсия      Доход   │
│    22.8%      45,000 с │
│    +2%         +18%    │
├─────────────────────────┤
│ Топ товары              │
│ 1. Тормоз. диски 150пр │
│    18% конверсия        │
│ 2. Фильтр масла 120пр  │
│    16% конверсия        │
│ 3. Амортизаторы 90пр   │
│    14% конверсия        │
├─────────────────────────┤
│ Источники трафика       │
│ 🔍 Поиск      45% ▓▓▓  │
│ 💗 Рекоменда  30% ▓▓   │
│ 🗺️ Карта      15% ▓    │
│ ➤ Прямой      10% □    │
└─────────────────────────┘
```

**Business Logic:**
- Key metrics (views, contacts, conversion, revenue)
- Period selector (неделя/месяц/год)
- Top performing products
- Traffic sources breakdown
- Trends (% change)
- Export data option

---

#### 👤 Профиль (Seller Profile)
**URL:** `/(seller)/(tabs)/profile`

**Layout:**
```
┌─────────────────────────┐
│ [Профиль магазина]      │
├─────────────────────────┤
│ [Logo] АвтоПрофи        │
│ Автомагазин             │
│ ✅ Проверен | ✅ Активен│
│ ⭐ 4.8 (124 отзывов)   │
│ [✏️]                    │
├─────────────────────────┤
│ Товаров: 23 | Продаж: 892
│ Ответ: 2ч               │
├─────────────────────────┤
│ Филиалы             [+] │
│ ┌───────────────────────┐│
│ │ 📍 Филиал №1          ││
│ │ ул. Ленина, дом 100   ││
│ │ Пн-Пт: 9:00-19:00    ││
│ │ +996 (312) 91-20-01   ││
│ │ [✏️] [🗑️]            ││
│ └───────────────────────┘│
├─────────────────────────┤
│ Категории товаров       │
│ [Запчасти][Масла][Шины]│
│ [Аксессуары]            │
├─────────────────────────┤
│ Настройки магазина      │
│ ℹ️ Основная информация  │
│ 💳 Способы оплаты       │
│ 💰 Комиссии и расчеты   │
│ 🔔 Уведомления         │
├─────────────────────────┤
│ [Выход]                 │
└─────────────────────────┘
```

**Business Logic:**
- Информация о магазине (лого, название, статус)
- Управление филиалами (адреса, часы, контакты)
- Категории товаров
- Пайменты и комиссии
- Рейтинг и отзывы

---

## 🎯 User Flows

### Flow 1: Покупатель ищет запчасть

```
1. Home (Главная)
   ↓
2. Click "Поиск" или Search bar
   ↓
3. Search Screen
   - Select category: "Запчасти"
   - Enter: "Тормозные диски"
   - Click filter (optional)
   ↓
4. Results displayed
   - Grid/List view of products
   ↓
5. Click on product card
   ↓
6. Product Detail Screen (NOT IN CURRENT SCOPE)
   - Product info, photos, reviews
   - Store info, rating
   - "Send message" button
   ↓
7. Click "Send message"
   ↓
8. Chat Screen
   - Create chat with seller
   - Send message asking about availability
   ↓
9. Negotiate and arrange meeting
```

### Flow 2: Продавец получает запрос от покупателя

```
1. Seller Home (Запросы)
   - See new request from buyer
   - "Toyota запчасти $200-500"
   ↓
2. Click on request
   ↓
3. Request Detail Screen (NOT IN CURRENT SCOPE)
   - See full request
   - See buyer's vehicle
   - See budget and timeline
   ↓
4. Click "Отправить предложение"
   ↓
5. Create Offer Modal
   - Select product from inventory
   - Set price
   - Add message
   ↓
6. Send offer
   ↓
7. Chat is created automatically
   - Seller can negotiate
   - Buyer can accept/reject
```

---

## 🔌 API Endpoints (Backend struktura)

### Authentication
```
POST /auth/login
POST /auth/logout
POST /auth/register
POST /auth/refresh
GET  /auth/profile
```

### Users
```
GET    /users/[id]
PUT    /users/[id]
DELETE /users/[id]
GET    /users/[id]/vehicles
POST   /users/[id]/vehicles
PUT    /users/[id]/vehicles/[vid]
DELETE /users/[id]/vehicles/[vid]
```

### Vehicles
```
GET  /vehicles
POST /vehicles
PUT  /vehicles/[id]
DELETE /vehicles/[id]
```

### Listings (Cars, Products)
```
GET    /listings?category=cars&city=bishkek&page=1
GET    /listings/[id]
POST   /listings
PUT    /listings/[id]
DELETE /listings/[id]
GET    /listings/[id]/reviews
POST   /listings/[id]/reviews
```

### Stores
```
GET  /stores
GET  /stores/[id]
PUT  /stores/[id]
POST /stores/[id]/branches
PUT  /stores/[id]/branches/[bid]
DELETE /stores/[id]/branches/[bid]
```

### Products (Inventory)
```
GET    /products
GET    /products/[id]
POST   /products
PUT    /products/[id]
DELETE /products/[id]
GET    /products/[id]/analytics
```

### Requests & Offers
```
GET    /requests
GET    /requests/[id]
POST   /requests
PUT    /requests/[id]
GET    /requests/[id]/offers
POST   /offers
PUT    /offers/[id]
```

### Chat & Messages
```
GET    /chats
GET    /chats/[id]
POST   /chats
POST   /chats/[id]/messages
GET    /chats/[id]/messages
PUT    /chats/[id]/messages/[mid]
DELETE /chats/[id]/messages/[mid]
```

### Reviews & Ratings
```
GET    /reviews
POST   /reviews
PUT    /reviews/[id]
DELETE /reviews/[id]
GET    /reviews?seller=[id]
GET    /reviews?product=[id]
```

### Analytics (Seller only)
```
GET /analytics/dashboard
GET /analytics/products
GET /analytics/traffic
GET /analytics/conversion
```

---

## 📊 Data Models

### User
```typescript
{
  id: string
  email: string
  password: string (hashed)
  role: 'buyer' | 'seller'
  name: string
  avatar?: string
  phone?: string
  city: string
  rating: number (0-5)
  reviewCount: number
  isVerified: boolean
  createdAt: date
  updatedAt: date
}
```

### Vehicle
```typescript
{
  id: string
  userId: string (buyer)
  brand: string
  model: string
  year: number
  engineVolume: string
  engineType: 'petrol' | 'diesel' | 'hybrid' | 'electric'
  transmission: 'manual' | 'automatic'
  isDefault: boolean
  createdAt: date
}
```

### Listing (Car)
```typescript
{
  id: string
  sellerId: string
  vehicle: Vehicle
  price: number
  currency: 'KZT' | 'USD'
  mileage: number
  description: string
  photos: string[]
  status: 'active' | 'sold' | 'archived'
  city: string
  rating: number
  createdAt: date
}
```

### Product
```typescript
{
  id: string
  storeId: string
  name: string
  category: string
  price: number
  currency: 'KZT' | 'USD'
  description: string
  condition: 'new' | 'used' | 'refurbished'
  inStock: number
  photos: string[]
  views: number
  messages: number
  rating: number
  createdAt: date
}
```

### Store
```typescript
{
  id: string
  sellerId: string
  name: string
  type: 'shop' | 'service' | 'private'
  businessType: string
  description: string
  rating: number
  reviewCount: number
  totalDeals: number
  verificationStatus: 'new' | 'verified' | 'trusted'
  logo?: string
  branches: Branch[]
  createdAt: date
}
```

### Request
```typescript
{
  id: string
  buyerId: string
  vehicleId?: string
  carModel?: string
  description: string
  category: string
  photos: string[]
  status: 'active' | 'completed' | 'cancelled'
  budget: { min, max, currency }
  city: string
  isUrgent: boolean
  offerCount: number
  selectedOfferId?: string
  createdAt: date
  expiresAt: date
}
```

### Offer
```typescript
{
  id: string
  requestId: string
  sellerId: string
  productId?: string
  price: number
  currency: 'KZT' | 'USD'
  description: string
  estimatedDelivery: number (days)
  paymentMethods: array
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  createdAt: date
}
```

### Chat
```typescript
{
  id: string
  participantIds: string[]
  requestId?: string
  offerId?: string
  lastMessage: string
  lastMessageTime: date
  unreadCount: number
  status: 'active' | 'archived' | 'closed'
  createdAt: date
}
```

### Message
```typescript
{
  id: string
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'photo' | 'voice'
  isRead: boolean
  createdAt: date
}
```

### Review
```typescript
{
  id: string
  reviewerId: string
  sellerId: string
  offerId?: string
  rating: number (1-5)
  criteria: {
    quality: number
    price: number
    response: number
    convenience: number
  }
  text: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: date
}
```

---

## 🎨 Component Library

### Buttons
- **Primary** (Orange accent background)
- **Secondary** (Outlined)
- **Ghost** (Transparent)
- **Destructive** (Red background)
- **Disabled** (Grayed out)

Sizes: Small (40px), Medium (48px), Large (56px)

### Cards
- **Default** (Light background, subtle shadow)
- **Outlined** (Border only)
- **Accent** (Orange tinted)
- **Elevated** (Strong shadow, interactive)

### Input Fields
- Text input
- Text area (multiline)
- Number input
- Select/Dropdown
- Date picker

### Badges
- Success (Green)
- Error (Red)
- Accent (Orange)
- Default (Gray)

Sizes: Small, Medium, Large

### Ratings
- Star rating (interactive for input, readonly for display)
- Rating with count "(4.8 из 5, 234 отзыва)"

### Headers
- Simple title
- Title + subtitle
- Back button + title + right action

### Lists
- Simple list items
- List items with avatar
- List items with action buttons

---

## 🎬 Animations & Transitions

- **Page transitions:** Slide from right (push), slide to left (pop)
- **Modal appearance:** Fade + slide from bottom
- **Button press:** Scale 0.95x + fade feedback
- **Loading state:** Skeleton loaders or spinner
- **Pull-to-refresh:** Standard iOS/Android behavior

---

## 📱 Responsive Design

**Breakpoints:**
- **Small phones** (280-384px): 1 column layouts
- **Regular phones** (384-640px): Standard 1-column layouts
- **Tablets** (640px+): 2-column layouts (NOT primary focus, but support)

---

## ✅ Checklist для дизайнера

- [ ] Все экраны покупателя (5 основных табов + 5 detail экранов)
- [ ] Все экраны продавца (5 основных табов)
- [ ] Все компоненты (кнопки, карточки, инпуты, бейджи, рейтинги)
- [ ] Темный и светлый режимы
- [ ] Все состояния компонентов (hover, active, disabled, error)
- [ ] Микроинтеракции и анимации
- [ ] Онбординг (если требуется)
- [ ] Экраны ошибок (404, no connection)
- [ ] Loading states
- [ ] Empty states

---

## 🔒 Security & Privacy

- Пароли никогда не отправляются в открытом виде
- HTTPS для всех API запросов
- JWT токены для аутентификации
- Rate limiting на API endpoints
- Модерация контента (фотографии, отзывы)
- Personal data protection (GDPR compliant)

---

## 📈 Phase-based Rollout

### Phase 1 (MVP - Current)
- ✅ Auth (login/register)
- ✅ Buyer home, search, profile
- ✅ Seller dashboard, inventory
- ✅ Chat system (basic)
- ✅ Requests & offers (basic)
- Map placeholder
- Basic ratings/reviews

### Phase 2 (Q1 2025)
- Full map integration (Yandex Maps)
- Product detail pages
- Advanced filters & sorting
- Favorites/bookmarks
- Full review system
- Notifications (push, in-app)
- Payment integration

### Phase 3 (Q2 2025)
- Appointment booking for services
- Advanced analytics for sellers
- Seller verification process
- Ads/promoted listings
- Loyalty program
- Multi-language support

