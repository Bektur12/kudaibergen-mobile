# Кудайберген - Быстрый Старт

## Установка

```bash
# Установить зависимости
npm install

# или с yarn
yarn install
```

## Запуск

### Разработка
```bash
npm start
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## Тестовые данные

Используйте любые учетные данные:
- **Email:** test@example.com (или любой другой)
- **Password:** любой пароль

После входа выберите роль:
- **Покупатель** - Просмотр запросов, создание новых
- **Продавец** - Просмотр доступных запросов, отправка предложений

## Структура Приложения

```
src/
├── app/                    # Screens и navigation (Expo Router)
│   ├── _layout.tsx        # Root layout с providers
│   ├── index.tsx          # Root index с редиректом
│   ├── auth/              # Экраны аутентификации
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (buyer)/           # Экраны покупателя с bottom tabs
│   │   ├── _layout.tsx    # Tabs layout
│   │   ├── index.tsx      # Домашняя страница
│   │   ├── messages.tsx   # Чат
│   │   ├── profile.tsx    # Профиль
│   │   ├── create-request.tsx  # Создание запроса
│   │   └── request/[id].tsx    # Детали запроса
│   └── (seller)/          # Экраны продавца с bottom tabs
│       ├── _layout.tsx    # Tabs layout
│       ├── index.tsx      # Домашняя страница
│       ├── messages.tsx   # Чат
│       ├── inventory.tsx  # Товары
│       ├── profile.tsx    # Профиль
│       └── request/[id].tsx    # Отправка предложения
│
├── components/            # UI компоненты
│   └── ui/               # Переиспользуемые компоненты
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Header.tsx
│       ├── StarRating.tsx
│       ├── PriceDisplay.tsx
│       ├── SellerCard.tsx
│       ├── Checkbox.tsx
│       ├── Divider.tsx
│       ├── TabBar.tsx
│       └── index.ts
│
├── constants/
│   └── theme.ts          # Design System: Цвета, Типография, Spacing
│
├── context/              # State Management
│   ├── auth.tsx         # Аутентификация
│   └── app.tsx          # App State (Requests, Offers, Chats)
│
└── types/
    └── index.ts         # TypeScript типы
```

## Основные Концепции

### Theme System

Приложение автоматически поддерживает light и dark mode:

```tsx
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'react-native'

const colorScheme = useColorScheme() ?? 'dark'
const colors = colorScheme === 'dark' ? Colors.dark : Colors.light
```

### Navigation

- **Root** → Проверка аутентификации
  - Если не авторизован → `/auth/login`
  - Если авторизован → `/(buyer)` или `/(seller)`
- **Buyer** → Tabs: Запросы | Чат | Профиль
- **Seller** → Tabs: Запросы | Чат | Товары | Профиль

### State Management

- **AuthContext** → Управление пользователем и сессией
- **AppContext** → Управление запросами, предложениями, чатами

## Основные Экраны

### Покупатель

1. **Home (Запросы)**
   - Список активных запросов
   - Кнопка для создания нового запроса
   - Информация о количестве предложений

2. **Create Request**
   - Форма для создания новогозапроса
   - Поля: Модель авто, Год, Объем двигателя, Описание

3. **Request Detail**
   - Детали запроса
   - Список предложений от продавцов

4. **Messages**
   - Чаты с продавцами (заготовка)

5. **Profile**
   - Информация пользователя
   - Кнопка выхода

### Продавец

1. **Home (Запросы)**
   - Список доступных запросов
   - Статистика (активные предложения, конверсия)
   - Информация о срочности

2. **Request Detail**
   - Форма для отправки предложения
   - Поля: Цена, Описание

3. **Messages**
   - Чаты с покупателями (заготовка)

4. **Inventory**
   - Управление товарами (заготовка)

5. **Profile**
   - Информация пользователя
   - Кнопка выхода

## API Компонентов

Все компоненты используют одинаковый паттерн:
- Поддержка light/dark theme
- Полная поддержка TypeScript
- Props для стилизации

Подробную документацию смотрите в [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

## Линтинг

```bash
npm run lint
```

## Производство

Приложение готово для build и развёртывания:
- Использует Expo для кросс-платформенной разработки
- Полная поддержка TypeScript
- Design System обеспечивает консистентность UI

Для продакшена интегрируйте с вашим backend API через контексты.
