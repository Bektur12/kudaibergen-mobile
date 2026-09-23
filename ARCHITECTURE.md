# Архитектура Приложения Кудайберген

## 1. Архитектурная Диаграмма

git

```
┌─────────────────────────────────────────────────────────────────┐
│                     МОБИЛЬНОЕ ПРИЛОЖЕНИЕ                         │
│                    (React Native + Expo)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   Presentation   │         │  State & Context │              │
│  │   (Screens)      │◄────────┤  (Auth, App)     │              │
│  │                  │         │                  │              │
│  │ - Login          │         │ - useAuth()      │              │
│  │ - Home           │         │ - useApp()       │              │
│  │ - Chats          │         │ - useColorScheme │              │
│  │ - Profile        │         │                  │              │
│  │ - Requests       │         │                  │              │
│  │ - Map            │         │                  │              │
│  └──────────────────┘         └──────────────────┘              │
│           ▲                              ▲                       │
│           │                              │                       │
│  ┌────────┴──────────────────────────────┴──────┐               │
│  │          UI Components Library                │               │
│  │  (Button, Card, Input, Header, etc.)        │               │
│  │                                              │               │
│  │ + Design System                             │               │
│  │ - Colors (light/dark)                       │               │
│  │ - Typography                                │               │
│  │ - Spacing                                   │               │
│  │ - Shadows & Radius                          │               │
│  └──────────────────────────────────────────────┘               │
│                         ▲                                         │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │
                    Expo Router
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐       ┌────▼────┐      ┌────▼────┐
   │ (buyer) │       │(seller) │      │  (auth) │
   │  Tabs   │       │  Tabs   │      │         │
   └─────────┘       └─────────┘      └─────────┘
        │                 │
   ┌────┴────┬────┬──────┐       ┌────┴────┬────┬──────┐
   │ Home    │Chat│Map   │       │ Home    │Chat│Inv   │
   │ Request │Msg │Prof  │       │ Request │Msg │Prof  │
   └─────────┴────┴──────┘       └─────────┴────┴──────┘


                    ┌──────────────────────────┐
                    │   BACKEND API (Future)   │
                    │    Node.js + Express     │
                    │   PostgreSQL + Redis     │
                    └──────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
        ┌───▼──┐          ┌───▼──┐         ┌───▼──┐
        │ Auth │          │ Data │         │ Chat │
        │ API  │          │ API  │         │ API  │
        └──────┘          └──────┘         └──────┘
```

## 2. Слои Архитектуры

### 2.1 Presentation Layer

- **Screens** - Экраны приложения
- **Components** - Переиспользуемые UI компоненты
- **Navigation** - Роутинг (Expo Router)

### 2.2 State Management Layer

- **Contexts** - Global state (auth, app data)
- **Hooks** - Custom hooks (useAuth, useApp)
- **Types** - TypeScript interfaces

### 2.3 Design System Layer

- **Colors** - Палитра (light/dark)
- **Typography** - Шрифты и размеры
- **Spacing** - Система отступов
- **Components** - UI library

### 2.4 API Layer (Future)

- **REST Endpoints** - Для данных
- **WebSocket** - Для real-time чатов
- **Authentication** - JWT

### 2.5 Database Layer (Future)

- **PostgreSQL** - Основная БД
- **Redis** - Кеш и sessions

---

## 3. Data Flow

### 3.1 Аутентификация

```
User Input (Email, Password, Role)
         ↓
   LoginScreen
         ↓
   useAuth() hook
         ↓
   AuthContext.login()
         ↓
   setUser() state
         ↓
   Redirect to /(buyer)/(tabs) или /(seller)/(tabs)
         ↓
   App initialized
```

### 3.2 Создание Запроса (Покупатель)

```
CreateRequestScreen
         ↓
   Form Input (Авто, Описание, Категории, Фото)
         ↓
   useApp() hook
         ↓
   AppContext.createRequest()
         ↓
   setRequests() state
         ↓
   Request stored in memory
         ↓
   Navigate back to Home
         ↓
   Request appears in list
```

### 3.3 Отправка Предложения (Продавец)

```
RequestDetailScreen (Seller)
         ↓
   OfferForm (Цена, Описание, Доставка)
         ↓
   useApp() hook
         ↓
   AppContext.createOffer()
         ↓
   setOffers() state
         ↓
   Offer stored in memory
         ↓
   Navigation back
```

### 3.4 Система Чатов

```
SelectOffer (Покупатель выбирает)
         ↓
   useApp().getOrCreateChat()
         ↓
   ChatScreen с history messages
         ↓
   User types message
         ↓
   useApp().sendMessage()
         ↓
   Message добавляется в state
         ↓
   Real-time update (Future: WebSocket)
```

---

## 4. Component Hierarchy

```
App (_layout.tsx)
├── AuthProvider
│   └── AppProvider
│       ├── Redirect to Login or App
│       │   └── auth/login
│       │       └── LoginScreen
│       │
│       ├── (buyer)/_layout.tsx
│       │   ├── (tabs)/_layout.tsx (Tabs Navigation)
│       │   │   ├── (tabs)/index.tsx (Home)
│       │   │   ├── (tabs)/requests.tsx
│       │   │   ├── (tabs)/map.tsx
│       │   │   ├── (tabs)/messages.tsx
│       │   │   └── (tabs)/profile.tsx
│       │   │
│       │   ├── create-request.tsx (Modal)
│       │   ├── request/[id].tsx (Modal)
│       │   │
│       │   └── chat/_layout.tsx
│       │       └── chat/[id].tsx (Full Screen)
│       │
│       └── (seller)/_layout.tsx
│           ├── (tabs)/_layout.tsx (Tabs Navigation)
│           │   ├── (tabs)/index.tsx (Home)
│           │   ├── (tabs)/messages.tsx
│           │   ├── (tabs)/inventory.tsx
│           │   ├── (tabs)/analytics.tsx
│           │   └── (tabs)/profile.tsx
│           │
│           └── request/[id].tsx (Modal)
```

---

## 5. State Management Structure

### 5.1 AuthContext

```typescript
{
  user: {
    id: string
    name: string
    email: string
    role: 'buyer' | 'seller'
    phone?: string
    avatar?: string
  } | null
  loading: boolean
  login: (email, password, role) => Promise<void>
  logout: () => void
}
```

### 5.2 AppContext

```typescript
{
  // Requests
  requests: Request[]
  createRequest: (request) => Promise<void>
  getRequest: (id) => Request | undefined
  updateRequest: (id, updates) => void

  // Offers
  offers: Offer[]
  createOffer: (offer) => Promise<void>
  getOffersByRequest: (requestId) => Offer[]

  // Chats
  chats: Chat[]
  getOrCreateChat: (participantIds) => string
  getChat: (id) => Chat | undefined

  // Messages
  messages: Message[]
  sendMessage: (chatId, senderId, content) => Promise<void>
  getMessagesByChat: (chatId) => Message[]
}
```

---

## 6. Дизайн-Система

### 6.1 Colors

```
Light Mode:
- background: #F4F6F8
- surface: #FFFFFF
- text: #0F1115
- accent: #FFB020
- success: #22C55E
- error: #EF4444

Dark Mode:
- background: #0F1115
- surface: #1A1D23
- text: #F5F7FA
- accent: #FFB020
- success: #22C55E
- error: #EF4444
```

### 6.2 Typography

```
- Price: 34px, 800 weight
- Heading: 24px, 700 weight
- Button: 17px, 700 weight
- Body: 16px, 500 weight
- Secondary: 14px, 500 weight
- Label: 12px, 700 weight
```

### 6.3 Spacing

```
2px, 4px, 8px, 16px, 24px, 32px, 48px, 64px
```

### 6.4 Border Radius

```
8px (small)
12px (medium)
14px (large)
16px (xl)
999px (full)
```

---

## 7. File Structure

```
kudaibergen-rn/
├── src/
│   ├── app/
│   │   ├── _layout.tsx (Root with Providers)
│   │   ├── index.tsx (Auth Redirect)
│   │   ├── auth/
│   │   │   ├── _layout.tsx
│   │   │   └── login.tsx
│   │   ├── (buyer)/
│   │   │   ├── _layout.tsx (Stack)
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx (Tabs)
│   │   │   │   ├── index.tsx (Home)
│   │   │   │   ├── requests.tsx
│   │   │   │   ├── map.tsx
│   │   │   │   ├── messages.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── create-request.tsx
│   │   │   ├── request/[id].tsx
│   │   │   └── chat/[id].tsx
│   │   └── (seller)/
│   │       ├── _layout.tsx (Stack)
│   │       ├── (tabs)/
│   │       │   ├── _layout.tsx (Tabs)
│   │       │   ├── index.tsx (Home)
│   │       │   ├── messages.tsx
│   │       │   ├── inventory.tsx
│   │       │   ├── analytics.tsx
│   │       │   └── profile.tsx
│   │       └── request/[id].tsx
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Header.tsx
│   │       ├── Badge.tsx
│   │       ├── StarRating.tsx
│   │       └── ... (другие компоненты)
│   │
│   ├── constants/
│   │   └── theme.ts (Design System)
│   │
│   ├── context/
│   │   ├── auth.tsx
│   │   └── app.tsx
│   │
│   └── types/
│       └── index.ts
│
├── BUSINESS_LOGIC.md
├── ARCHITECTURE.md
├── DATA_MODELS.md
├── API_SPEC.md
└── ROADMAP.md
```

---

## 8. Technology Stack

### Frontend

- React Native 0.86.2
- Expo 57.0.16
- Expo Router 57.0.16
- TypeScript 6.0.3
- React 19.2.3

### State Management

- React Context API
- Custom Hooks

### UI/UX

- Design System (Colors, Typography, Spacing)
- 11 Reusable Components

### Future Backend

- Node.js + Express
- PostgreSQL
- Redis
- WebSocket (Socket.io)
- Firebase Cloud Messaging

---

**Версия:** 1.0  
**Последнее обновление:** 2024-09-02
