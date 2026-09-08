# 🔄 ЛОГИКА ПРИЛОЖЕНИЯ
## Kudaibergen — Flowcharts и сценарии

---

## 📊 ОСНОВНЫЕ ПОТОКИ

### 1️⃣ ПОТОК АУТЕНТИФИКАЦИИ

```
┌─────────────────┐
│   App Start     │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│ isUserLoggedIn?  │
└────┬──────────┬──┘
     │          │
    YES        NO
     │          │
     │          ▼
     │    ┌────────────────┐
     │    │ Auth Screen    │
     │    │ - Register     │
     │    │ - Login        │
     │    └────────┬───────┘
     │             │
     │             ▼
     │    ┌────────────────────┐
     │    │ Enter: Email/Phone │
     │    │ Password           │
     │    └────────┬───────────┘
     │             │
     │             ▼
     │    ┌────────────────────┐
     │    │ Select Role:       │
     │    │ □ Buyer (Покупатель)
     │    │ □ Seller (Продавец)
     │    └────────┬───────────┘
     │             │
     └─────────┬───┘
               │
               ▼
       ┌──────────────┐
       │ Save to      │
       │ AuthContext  │
       │ - user       │
       │ - role       │
       │ - token      │
       └──────┬───────┘
              │
              ▼
       ┌────────────────────┐
       │ role === 'buyer'?  │
       └┬───────────────┬───┘
        │               │
       YES             NO
        │               │
        ▼               ▼
    ┌────────────┐  ┌──────────────┐
    │ /buyer     │  │ /seller      │
    │ Tabs layout│  │ Tabs layout  │
    └────────────┘  └──────────────┘
```

**Логика:**
- Проверяем токен в AsyncStorage
- Если нет → Auth экран
- Выбор роли → перенаправление
- AuthContext хранит: user, role, token, isLoading

---

### 2️⃣ ПОТОК ПОКУПАТЕЛЯ (BUYER)

#### 2.1 Главная → Поиск → Чат → Покупка

```
┌──────────────┐
│ HomeScreen   │
├──────────────┤
│ 1. Просмотр  │
│    рекомендации
│    (LAST_SEARCH
│    promo)     │
└──────┬───────┘
       │
       ▼
   ┌───────────────────┐
   │ Видит товар,      │
   │ кликает на card   │
   └────────┬──────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ Store Screen / Details  │
   │ - Полное описание       │
   │ - Фото галерея          │
   │ - Рейтинг продавца      │
   │ - Кнопка: [Написать]    │
   └────────┬────────────────┘
            │
            ▼
   ┌────────────────────┐
   │ Создать новый чат  │
   │ или открыть       │
   │ существующий      │
   │                   │
   │ Chat {             │
   │   id: string       │
   │   sellerId: string │
   │   buyerId: string  │
   │   offerId?: string │
   │   status: 'active' │
   │ }                 │
   └────────┬───────────┘
            │
            ▼
   ┌─────────────────────┐
   │ ChatDetailScreen    │
   │ - История сообщений │
   │ - Input + Send      │
   │ - Types: text/photo │
   └────────┬────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ Продавец отвечает:     │
   │ "Есть! $23 500"        │
   │ "Есть доставка"        │
   │ "Принимаем карты"      │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────┐
   │ Покупатель:        │
   │ "Хорошо, куплю"    │
   │ → Согласен         │
   │ → Оплата           │
   │ → Доставка         │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │ После доставки:    │
   │ Оставить отзыв     │
   │ - Rating: 1-5 ⭐  │
   │ - Критерии:        │
   │   • Качество       │
   │   • Цена           │
   │   • Ответ          │
   │   • Удобство       │
   │   • Профессионализм│
   │ - Текст отзыва     │
   └────────┬───────────┘
            │
            ▼
   ┌──────────────────┐
   │ Review создан    │
   │ (ждёт модерации) │
   │ status: pending  │
   └──────────────────┘
```

#### 2.2 Поиск с фильтрацией

```
SearchScreen:

┌─────────────────────┐
│ ТАБЫ               │
├─ Авто              │
├─ Запчасти          │
├─ Услуги            │
└─────────┬───────────┘
          │
          ▼
┌──────────────────────┐
│ ПОИСКОВАЯ СТРОКА     │
│ "Toyota Camry..."    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ФИЛЬТРЫ              │
├─ Цена: $500-$50,000 │
├─ Город: Бишкек      │
├─ Рейтинг: 4+        │
├─ Статус: В наличии  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ СОРТИРОВКА           │
├─ По релевантности   │
├─ По цене            │
├─ По рейтингу        │
├─ По новизне         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ РЕЗУЛЬТАТЫ (List)    │
│ [Card 1]  $23,500    │
│ [Card 2]  $48,000    │
│ [Card 3]  $31,000    │
└──────────────────────┘
```

**Логика поиска:**
```
const [filters, setFilters] = useState({
  category: 'cars',           // Авто, Запчасти, Услуги
  priceMin: 0,
  priceMax: 100000,
  city: 'Бишкек',
  rating: 4,
  status: 'in_stock',
  sortBy: 'relevance',        // relevance, price, rating, newest
});

const results = searchAPI(filters);
```

#### 2.3 Избранное (Favorites)

```
ProfileScreen → Favorites:

┌──────────────────┐
│ Favorites Tab    │
├──────────────────┤
│ [Card] Toyota    │
│ ⭐ Добавлено     │
│ [Remove]         │
│                  │
│ [Card] Mercedes  │
│ ⭐ Добавлено     │
│ [Remove]         │
└──────────────────┘

Логика:
- Таблица Favorite {
    userId: string
    type: 'car' | 'product' | 'store'
    targetId: string (carId, productId, storeId)
  }
- Кнопка "❤️ Like" → добавить в Favorite
- Повторный клик → удалить из Favorite
```

---

### 3️⃣ ПОТОК ПРОДАВЦА (SELLER)

#### 3.1 Добавление товара

```
Inventory → [+ Добавить товар]

┌─────────────────────┐
│ Выбрать тип:        │
├─ Автомобиль        │
├─ Запчасти          │
├─ Услуга (СТО)      │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ Заполнить данные:    │
│ - Название/Марка    │
│ - Категория         │
│ - Цена (KZT/USD)    │
│ - Описание          │
│ - Фото (6)          │
│ - Характеристики    │
│ - Гарантия?         │
│ - Остаток           │
│ - Статус (активно)  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Product создан:      │
│ {                    │
│   id: uuid           │
│   storeId: string    │
│   name: string       │
│   category: string   │
│   price: number      │
│   status: 'active'   │
│   photos: string[]   │
│ }                    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Добавлен в          │
│ InventoryScreen     │
│ Видно в SearchScreen│
└──────────────────────┘
```

#### 3.2 Получение запроса от покупателя

```
Покупатель создает Request:

┌────────────────────────┐
│ Buyer: Create Request  │
│ "Нужны колодки"        │
│ "Toyota Camry 2020"    │
│ Budget: $50-150        │
│ City: Бишкек           │
│ isUrgent: true         │
└────────┬───────────────┘
         │
         ▼
┌──────────────────────────┐
│ Request {                │
│   id: uuid               │
│   buyerId: string        │
│   description: string    │
│   category: 'brakes'     │
│   status: 'active'       │
│   budget: {...}          │
│   expiresAt: Date+48h    │
│   offerCount: 0          │
│ }                        │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ SELLER видит запрос в       │
│ Dashboard или через чата    │
│                             │
│ Уведомление: "🔔 Новый     │
│ запрос: Нужны колодки"      │
│                             │
│ Опции:                      │
│ 1. Написать в чат          │
│ 2. Создать оферту          │
│    (Product link +          │
│     Custom price)           │
│ 3. Отклонить              │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Seller отвечает Offer:   │
│ {                        │
│   id: uuid               │
│   requestId: string      │
│   sellerId: string       │
│   productId?: string     │
│   price: number          │
│   deliveryDays: 2        │
│   paymentMethods:        │
│     ['cash','card']      │
│   status: 'active'       │
│ }                        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Request.offerCount++     │
│ Buyer видит:             │
│ "3 предложения"          │
│                          │
│ Опции:                   │
│ 1. Выбрать это           │
│ 2. См. другие            │
│ 3. Написать вопрос       │
└──────────────────────────┘
```

#### 3.3 Dashboard & Analytics

```
Dashboard:

┌────────────────────────────┐
│ КЛЮЧЕВЫЕ МЕТРИКИ           │
├────────────────────────────┤
│ 📊 Сегодня:                │
│   • Продано: $2,340        │
│   • Заказов: 5             │
│   • Рейтинг: 4.8 ⭐       │
│                            │
│ 📈 Тренды:                 │
│   • За неделю: +23%        │
│   • За месяц: +12%         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ ГРАФИК ПРОДАЖ              │
│ (7 дней, 30 дней, 90 дн)  │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ ТОП ТОВАРЫ                 │
│ 1. Toyota Camry - 45 клик  │
│ 2. Колодки - 32 клика      │
│ 3. Масло - 28 кликов       │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ РЕКОМЕНДАЦИИ:              │
│ • Пополните фото → +30% CTR│
│ • Ответьте быстрее → +15%  │
│ • Добавьте гарантию → +8%  │
└────────────────────────────┘

Analytics Query:
const analytics = {
  period: '7d',             // 7d, 30d, 90d
  metrics: {
    views: 234,             // Просмотры товаров
    clicks: 45,             // Переходы в чат
    conversionRate: 0.19,   // 19%
    avgResponseTime: 8,     // минут
    rating: 4.8,
    reviewCount: 127,
    totalDeals: 342,
  }
}
```

---

### 4️⃣ ПОТОК СООБЩЕНИЙ (ДЛЯ ОБОИХ)

```
Chat Flow:

┌──────────────────────┐
│ MessagesScreen       │
│ (Список чатов)       │
├──────────────────────┤
│ [1] Магазин "Авто"   │
│     "Есть в наличии" │
│     2 часа назад     │
│     💬 2 непрочитан. │
│                      │
│ [2] Продавец Марат   │
│     "Привет!"        │
│     10 часов назад   │
│                      │
│ [3] ТагМет СТО       │
│     "Готово!"        │
│     1 день назад      │
└──────────┬───────────┘
           │ (Click на чат)
           ▼
┌────────────────────────────┐
│ ChatDetailScreen           │
├────────────────────────────┤
│ [Header]                   │
│ Магазин "Авто" ⭐ 4.8      │
│ Ответ обычно: 5 мин        │
│                            │
│ [Messages]                 │
│ [Left]  "Hi! У вас Camry?" │
│ [Right] "Да, есть! $23.5k" │
│ [Left]  "Фото есть?"       │
│ [Right] [Photo]            │
│                            │
│ [Input]                    │
│ 💬 Type message...  📎 📸  │
│ [Send Button →]            │
│                            │
│ Статусы сообщений:         │
│ • sending (⌛)             │
│ • delivered (✓)           │
│ • read (✓✓)               │
└────────────────────────────┘

Message Schema:
{
  id: uuid
  chatId: string
  senderId: string      // Кто отправил
  content: string
  type: 'text' | 'photo' | 'voice'
  isRead: boolean
  readAt?: Date
  createdAt: Date
}
```

---

### 5️⃣ ПОТОК ВЕРИФИКАЦИИ (SELLER)

```
New Seller Registration:

┌─────────────────────┐
│ Select Role: SELLER │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│ Заполнить данные магазина│
│ - Название              │
│ - Тип (Магазин/СТО)     │
│ - Описание              │
│ - Логотип               │
│ - Адреса (филиалы)      │
│ - Телефон               │
│ - Email                 │
│ - Часы работы           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Store {                  │
│   id: uuid               │
│   sellerId: string       │
│   name: string           │
│   type: 'shop'           │
│   rating: 0              │
│   reviewCount: 0         │
│   verification:          │
│     status: 'new'        │
│ }                        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ UPLOAD DOCUMENTS:        │
│ □ Паспорт                │
│ □ Лицензия               │
│ □ Свидетельство регистр. │
│ □ ИНН                    │
└────────┬─────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Verification Status:       │
│                            │
│ 1. 'new' - новый продавец  │
│    (может добавлять товар) │
│                            │
│ 2. 'verified' - проверен   │
│    (получает бейджик ✓)    │
│                            │
│ 3. 'trusted' - надежный    │
│    (получает бейджик ⭐)   │
│                            │
│ 4. 'blocked' - заблокирован│
│    (не может продавать)    │
└────────────────────────────┘
```

---

## 🔄 ПОБОЧНЫЕ ПОТОКИ

### Push Notifications

```
Events:
├─ new_offer           → "Новое предложение: $23.5k"
├─ new_message         → "Магазин отвечает: 'Есть!'"
├─ price_drop          → "Цена упала: $50 → $35"
├─ item_appeared       → "Нашлась Toyota Camry!"
└─ review_request      → "Оставьте отзыв"

Notification {
  id: uuid
  userId: string
  type: string
  title: string
  body: string
  data?: { offerId, chatId, etc }
  isRead: boolean
}
```

### Real-Time Updates (Firebase)

```
Listeners:
├─ Chat updates → новые сообщения
├─ Offer updates → продавец отвечает
├─ Price updates → изменение цены
├─ Stock updates → остаток меняется
└─ Rating updates → новый отзыв
```

### Деактивация объявления

```
Когда объявление продано:

1. Buyer подтверждает покупку
2. Chat status → 'closed'
3. Offer status → 'accepted'
4. CarListing status → 'sold'
   или
   Product.inStock → 0
5. Удаляется из SearchScreen
6. Уведомление другим продавцам
   "Этот запрос закрыт"
```

---

## 📱 STATE MANAGEMENT

### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  role: 'buyer' | 'seller' | null;
  token: string | null;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<void>;
}
```

### AppContext (Global)

```typescript
interface AppContextType {
  // Параметры поиска
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  
  // Последний поиск (для прomo)
  lastSearch: {
    vehicle: string;
    category: string;
    timestamp: Date;
  };
  setLastSearch: (search) => void;
  
  // Уведомления
  unreadCount: number;
  
  // Избранное
  favorites: Favorite[];
  addFavorite: (type: string, targetId: string) => void;
  removeFavorite: (type: string, targetId: string) => void;
}
```

---

## ⚡ ОПТИМИЗАЦИЯ & ПРОИЗВОДИТЕЛЬНОСТЬ

### Кэширование
```
- Последние результаты поиска (in-memory)
- Профили продавцов (1 час TTL)
- Фото товаров (Device storage)
- Чаты (локальное хранилище)
```

### Paging/Infinity Scroll
```
SearchScreen:
- Загружать по 20 товаров
- При scroll to bottom → fetchMore()
- Cursor-based pagination

MessagesScreen:
- Загружать по 50 сообщений
- Scroll up → loadOlderMessages()
```

### Lazy Loading
```
- Фото загружаются по мере прокрутки
- Avatar'ы кэшируются
- Рейтинги загружаются при клике
```

---

## 🚨 ERROR HANDLING

### Сценарии ошибок

```
Network Error:
└─ Показать: "Нет интернета"
   Retry кнопка
   Cache fallback

API 400 - Validation Error:
└─ Показать: "Проверьте данные"
   Highlight invalid fields

API 401 - Unauthorized:
└─ Logout user
   Redirect to Auth

API 404 - Not Found:
└─ Показать: "Товар удалён"

API 500 - Server Error:
└─ Показать: "Ошибка сервера"
   Retry кнопка

Timeout:
└─ Показать: "Запрос занял долго"
   Retry кнопка
```

---

**END OF LOGIC FLOWS DOCUMENT**
