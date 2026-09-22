# 📋 ТЗ: Quick Request для авто & Requests Dashboard для продавца

**Версия:** 1.0  
**Статус:** В разработке  
**Приоритет:** High  
**Дата:** Сентябрь 2026

---

## 🎯 Цель

Решить проблему "продавцы не успевают отвечать в WhatsApp/Instagram" путём централизации всех запросов в приложении.

**Проблема:** Продавцы получают запросы в WhatsApp, Instagram, Telegram одновременно и теряют их.

**Решение:** Система Quick Request позволяет:
- Покупателю отправить 1 запрос всем продавцам конкретной модели сразу
- Продавцу видеть все входящие запросы в одном месте

---

## 📊 User Stories

### **Story 1: Покупатель отправляет Quick Request**

```gherkin
Feature: Quick Request для авто

Scenario: Покупатель ищет Toyota Camry
  Given: Покупатель на главной странице
  When:  Кликает на кнопку "🚗 Авто"
  Then:  Открывается QuickRequestAutoScreen

Scenario: Выбрать марку авто
  Given:  QuickRequestAutoScreen открыт
  When:   Покупатель выбирает "Toyota" из 12 доступных брендов
  Then:   
    - Selected button подсвечивается оранжевым
    - Появляется Info card "5 продавцов готовы помочь"
    - Summary card обновляется

Scenario: Заполнить описание
  Given:  Марка выбрана
  When:   Покупатель пишет "Ищу Camry 2015-2020 не битую"
  Then:   
    - Текст сохраняется в state
    - Button "Отправить запрос" становится активным

Scenario: Указать бюджет (опционально)
  Given:  Description заполнен
  When:   Покупатель вводит "$15000-22000"
  Then:   
    - Текст сохраняется
    - Summary card показывает budget

Scenario: Отметить как срочно
  Given:  Форма заполнена
  When:   Кликает на toggle "СРОЧНО?"
  Then:   
    - Toggle становится красным (error color)
    - Summary card показывает "⚡ Запрос помечен как СРОЧНЫЙ"

Scenario: Отправить запрос
  Given:  Форма валидна (марка + описание обязательны)
  When:   Кликает "Отправить запрос"
  Then:   
    - Button показывает "Отправляем..." (loading state)
    - Запрос сохраняется в БД
    - Уведомление отправляется всем 5 продавцам
    - Alert: "Запрос отправлен 5 продавцам!\nВы получите предложения в течение часа."
    - Screen закрывается
    - Покупатель возвращается на главную
```

---

### **Story 2: Продавец видит входящие запросы**

```gherkin
Feature: Requests Dashboard для продавца

Scenario: Открыть Requests tab
  Given:  Продавец в приложении
  When:   Кликает на первую вкладку "Запросы"
  Then:   RequestsScreen открывается с 5+ запросами

Scenario: Просмотр списка запросов
  Given:  RequestsScreen открыт
  Then:   
    - Видит карточку с информацией:
      * 🚗 Toyota Camry (модель)
      * Описание ("Ищу в хорошем состоянии")
      * ⏰ "30м назад"
      * 💬 "4 предложений"
      * ⏱️ "5ч осталось"
    - Urgent запросы помечены красным "⚡ СРОЧНО"

Scenario: Фильтр "Срочные"
  Given:  RequestsScreen открыт
  When:   Кликает на фильтр "⚡ Срочные"
  Then:   
    - Показывает только запросы где isUrgent = true
    - Badge на вкладке обновляется (количество)

Scenario: Фильтр "Активные"
  Given:  RequestsScreen открыт
  When:   Кликает на фильтр "✓ Активные"
  Then:   
    - Показывает только запросы где status = 'active'
    - Исключает истекшие

Scenario: Развернуть карточку запроса
  Given:  Карточка запроса видна
  When:   Кликает на карточку
  Then:   
    - Карточка расширяется (animation 200ms)
    - Показывает дополнительно:
      * ОПИСАНИЕ: "Ищу Camry 2015-2020 в хорошем состоянии"
      * БЮДЖЕТ: "$15,000 - $22,000 USD"
      * ГОРОД: "📍 Бишкек"
      * ДЕЙСТВИТЕЛЕН: "5ч 30м осталось"
    - Показывает 2 action button'а:
      * "Отправить предложение" (primary, оранжевый)
      * "Написать" (secondary)

Scenario: Отправить предложение
  Given:  Запрос развёрнут
  When:   Кликает на "Отправить предложение"
  Then:   
    - Открывается модаль для создания оффера
    - Продавец может:
      * Выбрать товар из инвентаря
      * Указать цену
      * Добавить комментарий
      * Выбрать способ доставки
    - После отправки оффера:
      * Оффер сохраняется в БД
      * Открывается чат с покупателем
      * Counter "4 предложений" увеличивается

Scenario: Написать сообщение
  Given:  Запрос развёрнут
  When:   Кликает на "Написать"
  Then:   
    - Открывается чат/форма сообщения с покупателем
    - Контекст: запрос + модель авто видна
```

---

## 🏗️ Technical Architecture

### Data Models

```typescript
// Request (входящий запрос от покупателя)
interface Request {
  id: string                      // UUID
  buyerId: string                 // ID покупателя
  carModel: string                // "Toyota Camry"
  description: string             // "Ищу в хорошем состоянии"
  category: string                // "auto" | "parts" | "service"
  status: 'active' | 'completed' | 'cancelled'
  budget?: {
    min: number
    max: number
    currency: 'USD' | 'KZT'
  }
  city: string                    // "Бишкек"
  isUrgent: boolean               // true/false
  createdAt: Date
  expiresAt: Date                 // когда запрос истекает (default: createdAt + 24h)
  offerCount: number              // сколько продавцов ответили
  selectedOfferId?: string        // если выбран оффер
}

// Offer (предложение от продавца)
interface Offer {
  id: string
  requestId: string               // ссылка на Request
  sellerId: string                // ID продавца
  storeId: string                 // ID магазина
  productId?: string              // если из инвентаря
  price: number
  currency: 'USD' | 'KZT'
  description?: string
  estimatedDelivery?: number      // дни
  paymentMethods: ('cash' | 'card' | 'transfer')[]
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  updatedAt: Date
}

// Seller info for matching
interface SellerBrandMatch {
  sellerId: string
  storeId: string
  brands: string[]                // ["Toyota", "Honda", "Mazda"]
}
```

---

### API Endpoints (Backend)

#### **Requests**

**POST /api/requests** - Создать Quick Request
```json
Request:
{
  "carModel": "Toyota Camry",
  "description": "Ищу в хорошем состоянии",
  "budget": {
    "min": 15000,
    "max": 22000,
    "currency": "USD"
  },
  "city": "Бишкек",
  "isUrgent": false
}

Response:
{
  "id": "req-123",
  "sellersMatched": 5,
  "message": "Запрос успешно создан"
}
```

**GET /api/requests** - Получить список запросов для продавца
```json
Query params:
- sellerId: string (required)
- filter: 'all' | 'urgent' | 'active' (default: 'all')
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  "requests": [
    {
      "id": "req-1",
      "carModel": "Toyota Camry",
      "description": "Ищу в хорошем состоянии",
      "status": "active",
      "budget": { "min": 15000, "max": 22000, "currency": "USD" },
      "city": "Бишкек",
      "isUrgent": true,
      "createdAt": "2026-09-08T10:30:00Z",
      "expiresAt": "2026-09-09T10:30:00Z",
      "offerCount": 4
    }
  ],
  "total": 12,
  "page": 1
}
```

**GET /api/requests/:id** - Получить детали запроса
```json
Response:
{
  "id": "req-1",
  "buyerId": "buyer-1",
  "carModel": "Toyota Camry",
  "description": "Ищу Camry 2015-2020 в хорошем состоянии, не битую",
  "status": "active",
  "budget": { "min": 15000, "max": 22000, "currency": "USD" },
  "city": "Бишкек",
  "isUrgent": true,
  "createdAt": "2026-09-08T10:30:00Z",
  "expiresAt": "2026-09-09T10:30:00Z",
  "offerCount": 4,
  "offers": [
    {
      "id": "offer-1",
      "sellerId": "seller-1",
      "price": 18000,
      "description": "Есть в наличии",
      "createdAt": "2026-09-08T10:45:00Z"
    }
  ]
}
```

#### **Offers**

**POST /api/offers** - Создать оффер
```json
Request:
{
  "requestId": "req-1",
  "productId": "prod-123",
  "price": 18000,
  "currency": "USD",
  "description": "Есть в наличии, отличное состояние",
  "estimatedDelivery": 1,
  "paymentMethods": ["cash", "card"]
}

Response:
{
  "id": "offer-1",
  "status": "success",
  "chatId": "chat-xyz"  // новый чат создан
}
```

**GET /api/requests/:id/offers** - Получить все офферы для запроса
```json
Response:
{
  "offers": [
    {
      "id": "offer-1",
      "sellerId": "seller-1",
      "storeName": "АвтоПрофи",
      "price": 18000,
      "description": "Есть в наличии",
      "createdAt": "2026-09-08T10:45:00Z",
      "status": "active"
    }
  ]
}
```

#### **Sellers & Brands**

**GET /api/sellers/brands/:brand** - Получить продавцов по марке авто
```json
Query params:
- brand: string (required) - "Toyota", "BMW", etc.
- city: string (optional) - "Бишкек"

Response:
{
  "brand": "Toyota",
  "sellers": [
    {
      "id": "seller-1",
      "storeId": "store-1",
      "storeName": "АвтоПрофи",
      "rating": 4.8,
      "reviewCount": 124
    }
  ],
  "count": 5
}
```

---

## 🔄 User Flow Diagrams

### Buyer Flow

```
Home Screen
    ↓
Click "🚗 Авто"
    ↓
QuickRequestAutoScreen
    ├─ Step 1: Select Brand (Toyota)
    ├─ Step 2: Write Description
    ├─ Step 3: Set Budget (optional)
    ├─ Step 4: Mark Urgent (optional)
    ├─ Summary Card Preview
    └─ Submit
        ↓
    API: POST /api/requests
        ↓
    Success Alert
        ↓
    Back to Home
        ↓
    Chats Tab → See seller responses in messages
```

### Seller Flow

```
Seller App
    ↓
Click "Запросы" Tab (first tab)
    ↓
RequestsScreen
    ├─ Filter Bar: All / Urgent / Active
    ├─ Request Cards List
    └─ Click on Card
        ├─ Expand Details
        └─ Action Buttons:
            ├─ "Отправить предложение"
            │   ↓
            │   API: POST /api/offers
            │   ↓
            │   Create Offer + Chat
            │
            └─ "Написать"
                ↓
                Open Chat Modal
```

---

## ✅ Acceptance Criteria

### QuickRequestAutoScreen

- [ ] **UI렌더링**
  - [ ] Header (close + title) отображается корректно
  - [ ] 12 brand buttons видны и нажимаются
  - [ ] Selected button подсвечивается оранжевым
  - [ ] Info card появляется после выбора
  - [ ] Summary card обновляется при изменении данных
  - [ ] Dark mode работает

- [ ] **Функционал**
  - [ ] Выбор марки сохраняется в state
  - [ ] Описание принимается (min 4 символа)
  - [ ] Budget field опционален
  - [ ] Toggle "СРОЧНО" работает
  - [ ] Summary показывает точное количество продавцов
  - [ ] Button "Отправить запрос" отключена пока не заполнена марка + описание

- [ ] **Валидация**
  - [ ] Если марка не выбрана → alert
  - [ ] Если описание < 4 символов → alert
  - [ ] Если описание пусто → button disabled

- [ ] **API Integration**
  - [ ] POST /api/requests отправляется с правильными данными
  - [ ] Успешный ответ → alert + back
  - [ ] Ошибка API → error alert + retry
  - [ ] Loading state показывается

- [ ] **Навигация**
  - [ ] Close button закрывает screen
  - [ ] Back gesture работает
  - [ ] После отправки возвращается на home

### RequestsScreen

- [ ] **UI렌더링**
  - [ ] Header с title + badge количества
  - [ ] Filter bar с 3 кнопками
  - [ ] Request cards видны корректно
  - [ ] Urgent badge красный и заметен
  - [ ] Stats (время, предложения, осталось) видны
  - [ ] Dark mode работает
  - [ ] Empty state отображается когда нет запросов

- [ ] **Функционал**
  - [ ] Фильтр "Все" показывает все запросы
  - [ ] Фильтр "Срочные" показывает только urgent=true
  - [ ] Фильтр "Активные" показывает только active запросы
  - [ ] Card может раскрываться/складываться
  - [ ] Развёрнутая карта показывает все детали
  - [ ] Action buttons видны в expanded state

- [ ] **Интеграция**
  - [ ] GET /api/requests возвращает список
  - [ ] Данные отображаются корректно
  - [ ] Time remaining (expiresAt) вычисляется правильно
  - [ ] OfferCount отображается корректно
  - [ ] Badge количества обновляется

- [ ] **Action Buttons**
  - [ ] "Отправить предложение" открывает модаль
  - [ ] "Написать" открывает чат
  - [ ] После действия запрос обновляется (if needed)

---

## 🔒 Error Handling

### Scenarios

1. **Network Error при создании Request**
   - Show: "Ошибка соединения. Проверьте интернет."
   - Retry button активна
   - Data сохраняется локально

2. **Timeout (> 5 сек)**
   - Show: "Запрос занял слишком долго"
   - Retry option

3. **Server Error (5xx)**
   - Show: "Ошибка на сервере. Попробуйте позже"
   - Log error to Sentry

4. **Validation Error (400)**
   - Show specific field error
   - Highlight field

5. **Unauthorized (401)**
   - Redirect to login

---

## 📊 Performance Requirements

- QuickRequestAutoScreen: < 500ms load time
- RequestsScreen: < 1s load time
- Brand grid: 60fps scrolling
- Request list: 60fps scrolling
- API response: < 2s

---

## 🧪 Testing Checklist

### Unit Tests

```typescript
// QuickRequestAutoScreen tests
- getSellersForBrand("Toyota") returns 5 sellers
- Budget validation (min/max/format)
- Description length validation (min 4 chars)
- Request state management

// RequestsScreen tests
- Filter requests by urgency
- Filter requests by status
- Calculate time remaining
- Format budget display
```

### Integration Tests

```typescript
- Create request → API call → Success response
- Get requests → API call → Display list
- Submit offer → Create chat → Redirect
```

### E2E Tests

```gherkin
Scenario: End-to-end buyer flow
  Given: Buyer is logged in
  When: User completes full Quick Request flow
  Then: Sellers receive notification + can see it in Requests tab

Scenario: End-to-end seller flow
  Given: Seller is logged in
  When: New request arrives + Seller submits offer
  Then: Chat created + Buyer notified
```

---

## 📝 Implementation Checklist

### Phase 1: Core Functionality (Week 1)

- [ ] QuickRequestAutoScreen component
  - [ ] UI layout + styling
  - [ ] State management (brand, description, budget, urgent)
  - [ ] Form validation
  - [ ] API integration (POST /api/requests)
  - [ ] Loading + error states

- [ ] RequestsScreen component
  - [ ] UI layout + styling (collapsed + expanded)
  - [ ] FlatList rendering
  - [ ] Filter logic
  - [ ] API integration (GET /api/requests)
  - [ ] Time calculations (createdAt, expiresAt)

- [ ] Routes + Navigation
  - [ ] `/buyer/quick-request-auto` route
  - [ ] Seller tab updated to show RequestsScreen
  - [ ] Navigation flow working

### Phase 2: Actions & Integration (Week 2)

- [ ] Offer creation flow
  - [ ] Modal для создания offer
  - [ ] Product selection from inventory
  - [ ] API: POST /api/offers
  - [ ] Chat creation after offer

- [ ] Chat integration
  - [ ] Message history in context of request
  - [ ] Seller can message from request card

- [ ] Notifications
  - [ ] Seller gets notified of new request
  - [ ] Buyer gets notified of new offer

### Phase 3: Polish & Testing (Week 3)

- [ ] Dark mode testing
- [ ] Responsive design testing (small/regular/tablet)
- [ ] Performance optimization
- [ ] Error handling
- [ ] E2E testing
- [ ] Bug fixes

---

## 📚 Dependencies

- React Native: 0.86.2
- Expo Router: 57.0.16
- TypeScript: 6.0.3
- Existing UI components (Button, Card, Input, etc.)

---

## 🎯 Success Metrics

1. **Adoption Rate:** > 30% покупателей используют Quick Request за месяц
2. **Response Time:** Sellers ответят на 50% запросов в течение 1 часа
3. **Satisfaction:** > 4.5 rating на функцию
4. **Error Rate:** < 1% failed requests
5. **Performance:** < 1s load time на обоих экранах

---

## 📞 Contacts

- Product Owner: [name]
- Designer: [name]
- QA: [name]
- Backend Lead: [name]

---

## 📌 Notes

- Mock data используется для dev/testing
- В production будут реальные данные из БД
- API endpoints могут изменяться по мере разработки
- Уведомления (push) могут быть добавлены позже (Phase 2)
- Статистика (analytics) для продавца - Phase 3
