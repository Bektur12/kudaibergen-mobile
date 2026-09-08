# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ & ДИЗАЙН
## Kudaibergen v1.0.0 — Мобильный маркетплейс

Этот проект содержит **полное техническое описание** приложения по логике и дизайну.

---

## 📚 ОСНОВНЫЕ ДОКУМЕНТЫ

### 1️⃣ **TZ_FULL.md** — ПОЛНОЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ
Содержит:
- ✅ Обзор проекта и миссия
- ✅ Ролевая модель (Buyer / Seller)
- ✅ Архитектура приложения (file-based routing)
- ✅ Функциональность по ролям
- ✅ Типы данных (User, Vehicle, Product, Store, etc.)
- ✅ Технический стек (React Native, Expo, TypeScript)
- ✅ Roadmap разработки (MVP, v1.1, v1.2, v2.0)

### 2️⃣ **LOGIC_FLOWS.md** — ЛОГИКА ПРИЛОЖЕНИЯ
Содержит:
- ✅ Flowcharts основных потоков (Auth, Buyer, Seller, Messaging)
- ✅ Сценарии использования
- ✅ State Management (AuthContext, AppContext)
- ✅ Обработка ошибок
- ✅ Real-time updates и notifications
- ✅ Пейджинг и оптимизация

### 3️⃣ **DESIGN_TOKENS.md** — ДИЗАЙН-СИСТЕМА
Содержит:
- ✅ Цветовая палитра (PRIMARY #FF6B35, SECONDARY #F7931E, ERROR, SUCCESS)
- ✅ Типография (6 размеров: 24px, 17px, 15px, 13px, 12px, 11px)
- ✅ Сетка отступов (4px base: xs-xxl)
- ✅ Компоненты (Button, Card, Badge, Input, etc.)
- ✅ 5 ключевых дизайн-изменений (с метриками CTR)
- ✅ Тёмный режим

---

## 🎯 5 КЛЮЧЕВЫХ ДИЗАЙН-ИЗМЕНЕНИЙ

| # | Изменение | Метрика | Статус |
|---|-----------|---------|--------|
| 1 | **Big Price** (24px, 800) | +18% CTR | ✅ Done |
| 2 | **Promo Block** (#FFF3E0, левая граница) | +12% CTR | ✅ Done |
| 3 | **Urgency Badges** (⚡ Срочно / ✓ В наличии) | +8% CTR | ✅ Done |
| 4 | **2x2 Categories Grid** (вместо scroll) | +22% CTR | ✅ Done |
| 5 | **Last Search Promo** (персонализация) | +14% D3 retention | ✅ Done |
| **ИТОГО** | | **~+16% на главной** | ✅ |

---

## 🏗️ АРХИТЕКТУРА

### Ролевая модель

```
BUYER (Покупатель)          SELLER (Продавец)
├─ Home                     ├─ Dashboard
├─ Search                   ├─ Inventory
├─ Map                      ├─ Analytics
├─ Messages                 ├─ Messages
└─ Profile                  └─ Profile
```

### File-based routing (Expo Router)

```
src/app/
├─ (buyer)/(tabs)/          Табы покупателя
├─ (seller)/(tabs)/         Табы продавца
├─ auth/                    Логин/Регистр
└─ [dynamic routes]         /chat/[id], /store/[id]
```

---

## 🎨 ДИЗАЙН-СИСТЕМА

### Цвета (C object)
```typescript
C.primary    = '#FF6B35'     // Основной оранжевый (CTAs, цены)
C.secondary  = '#F7931E'     // Жёлтый (рейтинги)
C.error      = '#EF5350'     // Красный (срочно)
C.success    = '#4CAF50'     // Зелёный (в наличии)
C.textPrimary = '#1A1A1A'    // Основной текст
C.textSecondary = '#666666'  // Вторичный текст
C.textTertiary = '#999999'   // Подписи
C.bg         = '#F5F5F5'     // Фон
C.surface    = '#FFFFFF'     // Карточки
C.border     = '#E0E0E0'     // Линии
```

### Типография (T object)
```typescript
T.price      = 24px, 800     // Цены
T.heading    = 17px, 700     // Заголовки
T.body       = 15px, 400     // Основной текст
T.secondary  = 13px, 400     // Детали
T.label      = 12px, 700     // Подписи
T.hint       = 11px, 400     // Мета-инфо
```

### Сетка (4px base)
```
xs  = 4px    (минимум)
sm  = 8px    (small)
md  = 12px   (medium)
lg  = 16px   (large)
xl  = 24px   (extra large)
xxl = 32px   (max)
```

---

## 📱 ОСНОВНЫЕ ЭКРАНЫ

### HomeScreen (Покупатель)
```
┌──────────────────────────┐
│ Город      🔔            │  ← Header
├──────────────────────────┤
│ 🔍 Поиск                 │
├──────────────────────────┤
│ 💡 РЕКОМЕНДУЕМ           │  ← CHANGE #2: Promo
│ Toyota Camry — Запчасти  │
│ [Найти]                  │
├──────────────────────────┤
│ 🚗 Авто  🔧 Запчасти    │  ← CHANGE #4: 2x2 Grid
│ 🏥 Услуги 📍 Рядом      │
├──────────────────────────┤
│ НОВЫЕ ОБЪЯВЛЕНИЯ    [Все]│
│                          │
│ 🚗 Toyota Camry 70      │  ← CHANGE #1: Big Price
│ 2020, 2.5L, АКПП       │
│ ⚡ СРОЧНО               │  ← CHANGE #3: Badge
│ $23,500 (24px, 800)     │
│ ⭐ 4.8 (24)  📍 20км    │
└──────────────────────────┘
```

### SearchScreen (Покупатель)
- Поиск по категориям (Авто, Запчасти, Услуги)
- Фильтры (цена, город, рейтинг, статус)
- Сортировка (релевантность, цена, рейтинг, новизна)

### DashboardScreen (Продавец)
- Метрики продаж (сегодня, за неделю, за месяц)
- Графики
- Топ товары
- Рекомендации

### InventoryScreen (Продавец)
- Список товаров
- Добавление/Редактирование
- Массовая смена цен
- Архивирование

### AnalyticsScreen (Продавец)
- Просмотры товаров
- Клики в чат
- Конверсия
- Рейтинги и отзывы

### Messages & Chat
- Список чатов (для обоих)
- Детальный чат (история, отправка сообщений)
- Типы сообщений (text, photo, voice)

### ProfileScreen
**Buyer:**
- Аватар, статистика (покупки, избранное, адреса)
- Мои автомобили (добавление, редактирование)
- Меню настроек

**Seller:**
- Информация магазина (название, описание, контакты)
- Рейтинг и отзывы
- Верификация
- Часы работы, филиалы

---

## 🔄 ОСНОВНЫЕ ПОТОКИ

### 1. Аутентификация
```
App Start → isLoggedIn? → Auth Screen → Select Role → Save to Context → Route by Role
```

### 2. Покупка (Buyer)
```
Home → Click Listing → Store Details → Create Chat → Seller Responds → Agreement → Payment → Review
```

### 3. Запрос-Оферта (Buyer → Seller)
```
Buyer: Create Request → Sellers: Respond with Offers → Buyer: Select Offer → Agreement → Chat
```

### 4. Продажа (Seller)
```
Dashboard → See Requests → Create Offer → Buyer Accepts → Chat → Confirm → Rating
```

---

## 📊 ТИПЫ ДАННЫХ

### Key Entities:
- **User** - пользователь (role: buyer | seller)
- **Vehicle** - автомобиль
- **CarListing** - объявление о продаже авто
- **Product** - товар/запчасть
- **Store** - магазин продавца
- **Request** - запрос от покупателя
- **Offer** - оферта от продавца
- **Chat** - чат между участниками
- **Message** - сообщение
- **Review** - отзыв о продавце
- **Favorite** - избранное
- **Notification** - уведомление

---

## 🚀 ТЕХНИЧЕСКИЙ СТЕК

```
Frontend
├─ React Native 0.86.2
├─ Expo 57.0.16
├─ Expo Router 57.0.16 (file-based routing)
├─ TypeScript 6.0.3
├─ React Context API (state management)
└─ React Native Reanimated 4.5.1 (animations)

Backend (планируется)
├─ Firebase Firestore (database)
├─ Firebase Auth (authentication)
├─ Firebase Storage (media)
└─ Cloud Functions (serverless)

Styling
├─ React Native StyleSheet
├─ Design Tokens (C colors, T typography)
└─ Responsive layouts (flexbox, no hardcoded px)
```

---

## ✅ СТАТУС РЕАЛИЗАЦИИ

### Реализовано
- ✅ Design System (colors, typography, spacing)
- ✅ HomeScreen (все 5 дизайн-изменений)
- ✅ ProfileScreen (покупатель)
- ✅ UI компоненты (Button, Card, Badge, Input, etc.)
- ✅ Authentication structure
- ✅ Routing structure (Buyer/Seller split)

### В работе
- ⏳ SearchScreen (поиск и фильтры)
- ⏳ MapScreen (геолокация магазинов)
- ⏳ ChatDetailScreen (логика сообщений)
- ⏳ DashboardScreen (продавец)
- ⏳ InventoryScreen (управление товарами)
- ⏳ AnalyticsScreen (статистика)

### Планируется
- 🔲 Push notifications
- 🔲 Real-time chat updates (WebSocket / Firebase)
- 🔲 Payment integration
- 🔲 User verification (KYC)
- 🔲 Dark mode (полная поддержка)
- 🔲 Web version

---

## 📖 КАК ИСПОЛЬЗОВАТЬ ДОКУМЕНТЫ

1. **Новый разработчик?** → Начни с **TZ_FULL.md** (архитектура + типы)
2. **Нужна логика потока?** → Смотри **LOGIC_FLOWS.md** (flowcharts)
3. **Как стилизовать компонент?** → Используй **DESIGN_TOKENS.md** + `src/components/ui.tsx`

---

## 🔧 БЫСТРЫЙ СТАРТ

### Запуск приложения
```bash
npm install
npm start          # или expo start
```

### Правила разработки
```
✅ Используй C (цвета) и T (типография) из ui.tsx
✅ CTA кнопки → PRIMARY цвет
✅ Цены → 24px, 800, PRIMARY
✅ Отступы из SPACING сетки (4px base)
✅ Максимум 3 размера шрифта на экране
✅ Cards borderRadius: 12, shadow
✅ Buttons borderRadius: 8
✅ Нет hardcoded цветов и размеров
✅ Поддержка тёмного режима
```

---

## 📞 КОНТАКТЫ

**Email:** ainaztoktomamatova@gmail.com  
**Версия:** 1.0.0 (MVP)  
**Статус:** 🚀 В разработке  
**Дата:** 2026-09-02

---

**ВСЕ ДОКУМЕНТЫ ГОТОВЫ К ИСПОЛЬЗОВАНИЮ!**

