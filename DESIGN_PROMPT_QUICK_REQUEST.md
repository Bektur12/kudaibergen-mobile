# 🎨 Design Prompt: Quick Request & Requests Dashboard

## 📋 Обзор

Проектируем два ключевых экрана для решения проблемы "продавцы не успевают отвечать":

1. **QuickRequestAutoScreen** - где покупатель отправляет запрос авто
2. **RequestsScreen** - где продавец видит входящие запросы

---

## 🎯 QuickRequestAutoScreen Design

### Концепция
Пошаговая форма, которая направляет пользователя через 4 шага:
1. Выбрать марку авто
2. Описать что нужно
3. Указать бюджет (опционально)
4. Отправить запрос всем продавцам

### Визуальная структура

#### **Header (высота: 56px)**
- Левая сторона: Close button (X) - Ionicons
- Центр: Текст "Найти авто" - жирный, 16px
- Правая сторона: пусто

Цвет фона: `surface` (белый в light mode, #1A1A1A в dark mode)
Граница снизу: 1px `border`

#### **Content Area (scrollable)**

**ШАГ 1: ВЫБРАТЬ МАРКУ**
- Label сверху: "ШАГ 1: ВЫБЕРИТЕ МАРКУ" (11px, uppercase, textTertiary)
- Grid с брендами (3 колонки, 2 в ряд на узких телефонах):
  - Каждый button: 12px padding, 8px border-radius
  - Фон неактивного: `surfaceAlt`
  - Фон активного: `primary` (оранжевый) + текст белый
  - Граница: 1px `border`
  - Gap между: 8px
  - Бренды: Toyota, BMW, Mercedes, Audi, Honda, Mazda, Nissan, VW, Hyundai, Kia, Chevrolet, Ford

**After Selection - Info Card:**
- Background: `surfaceAlt`
- Border: 1px `border`
- Border-radius: 8px
- Padding: 12px
- Flex row с icon (checkmark-circle) + text
  - Icon: `primary` цвет
  - Title: "Toyota" (14px, bold, textPrimary)
  - Subtitle: "5 продавцов готовы помочь" (13px, textSecondary)

---

**ШАГ 2: ЧТО ВАМ НУЖНО?**
- Label: "ШАГ 2: ЧТО ВАМ НУЖНО?" (11px, uppercase, textTertiary)
- TextArea Input:
  - Placeholder: "Пример: Ищу Camry 2015-2020 в отличном состоянии, не битую"
  - Height: 80px minimum
  - Background: `surface`
  - Border: 1px `border`
  - Border-radius: 8px
  - Padding: 12px
  - Font: 14px, textPrimary

---

**ШАГ 3: БЮДЖЕТ (ОПЦИОНАЛЬНО)**
- Label: "ШАГ 3: БЮДЖЕТ (ОПЦИОНАЛЬНО)" (11px, uppercase, textTertiary)
- Input:
  - Placeholder: "Пример: $15000-22000"
  - Height: 48px
  - Background: `surface`
  - Border: 1px `border`
  - Border-radius: 8px
  - Padding: 12px

---

**ШАГ 4: СРОЧНО?**
- Row layout: Text слева, Toggle button справа
- Title: "СРОЧНО?" (11px, uppercase, textTertiary)
- Subtitle: "Продавцы будут отвечать быстрее" (13px, textSecondary)
- Toggle button:
  - Width: 48px, Height: 48px
  - Background неактивное: `surfaceAlt`
  - Background активное: `error` (красный)
  - Border-radius: 12px
  - Icon: flash (активный - белый, неактивный - textPrimary)

---

**Summary Card (показывается после выбора марки)**
- Background: `primaryTint` или #FFEDE3 (светлый оранжевый)
- Border: 1px `primary`
- Border-radius: 8px
- Padding: 12px
- Margin-bottom: 20px

Содержимое:
```
📊 Краткая информация
───────────────────
Марка:                    Toyota
Продавцов получат запрос: 5
⚡ Запрос помечен как СРОЧНЫЙ  (если выбрано)
```

Стили:
- Title: "📊 Краткая информация" (13px, bold, primary)
- Rows: flex-row, justify-between
- Label: 13px, textPrimary
- Value: 14px, bold, primary

---

#### **Footer (высота: 60px)**
- Background: `surface`
- Border-top: 1px `border`
- Padding: 12px 16px
- Full-width button "Отправить запрос" или "Отправляем..." (disabled state - opacity 0.5)
- Button стиль: Primary (оранжевый фон, белый текст)

---

## 🎯 RequestsScreen Design

### Концепция
Список входящих запросов в cardе, которые раскрываются для показа подробностей.

### Визуальная структура

#### **Header (высота: 56px)**
- Левая сторона: Title "Запросы покупателей" (17px, bold, textPrimary)
- Правая сторона: Badge с количеством запросов
  - Background: `primaryTint` или #FFEDE3
  - Border-radius: 16px
  - Min-width: 32px, Height: 32px
  - Text: количество (13px, bold, primary)

Цвет фона: `surface`
Граница снизу: 1px `border`

---

#### **Filter Bar (высота: 44px)**
- Horizontal scrollable view
- Gap между кнопками: 8px
- Padding horizontal: 16px

**Filter buttons:**
- Неактивная: background `bg`, border 1px `border`, textPrimary
- Активная: background `primary`, text белый, fontWeight 700
- Padding: 12px horizontal, 6px vertical
- Border-radius: 20px
- Font: 13px

Фильтры:
1. 📋 Все
2. ⚡ Срочные
3. ✓ Активные

---

#### **Request Card (Collapsed state)**

Margin: 12px horizontal, 12px vertical gap между картами
Border: 1px `border`
Border-radius: 12px
Background: `surface`
Overflow: hidden

**Card Header (padding: 12px)**
- Flex row, align center, gap 8px

Левая часть (flex 1):
1. **Title row:**
   - Emoji + Car Model: "🚗 Toyota Camry" (15px, bold, textPrimary)
   - Срочный badge справа (если isUrgent):
     - Background: `error` (красный)
     - Padding: 8px horizontal, 4px vertical
     - Border-radius: 4px
     - Flex row: flash icon (12px) + текст "СРОЧНО" (11px, bold, white)

2. **Description:** "Ищу в хорошем состоянии" (13px, textSecondary, numberOfLines 1)

Правая часть:
- Chevron icon (down/up) - textTertiary

**Stats Row (padding: 0 12px 12px 12px)**
- Flex row, gap 12px
- Каждый stat: flex row, gap 4px

Stat items:
1. ⏰ "30м назад" (textTertiary, 12px)
2. 💬 "4 предложений" (primary, 12px)
3. ⏱️ "5ч осталось" (error, 12px)

---

#### **Request Card (Expanded state)**

**Divider:** border-top 1px `border` над деталями

**Details Section (padding: 12px, gap 12px между sections)**

**1. Description block:**
- Label: "ОПИСАНИЕ" (11px, uppercase, textTertiary, letterSpacing 0.5)
- Text: "Ищу Camry 2015-2020 в хорошем состоянии" (14px, textPrimary, lineHeight 20)

**2. Budget block (если есть):**
- Label: "БЮДЖЕТ" (11px, uppercase, textTertiary)
- Text: "$15,000 - $22,000 USD" (14px, bold, primary)

**3. City block:**
- Label: "ГОРОД" (11px, uppercase, textTertiary)
- Text: "📍 Бишкек" (14px, textPrimary)

**4. Expires block:**
- Label: "ДЕЙСТВИТЕЛЕН" (11px, uppercase, textTertiary)
- Text: "5ч 30м осталось" (14px, textPrimary)

**Action Buttons (flex row, gap 8px):**

Button 1 - Primary:
- Background: `primary`
- Flex 1
- Padding: 10px vertical
- Border-radius: 8px
- Flex row: send icon (16px) + text "Отправить предложение" (12px, bold, white)
- Align center, justify center

Button 2 - Secondary:
- Background: `surfaceAlt`
- Border: 1px `border`
- Flex 1
- Padding: 10px vertical
- Border-radius: 8px
- Flex row: mail-outline icon (16px) + text "Написать" (12px, textPrimary)
- Align center, justify center

---

#### **Empty State**

Когда нет запросов по фильтру:
- Flex column center
- Icon: 📭 (48px)
- Text: "Нет запросов по этому фильтру" (14px, textTertiary)
- Gap: 8px

---

## 🎨 Design System

### Цвета (из design spec)

**Light Mode:**
- Primary/Accent: `#FF6B35` (оранжевый)
- Error: `#EF5350` (красный)
- Success: `#4CAF50` (зелёный)
- Background: `#F5F5F5`
- Surface: `#FFFFFF`
- SurfaceAlt: `#F9F9F9`
- Border: `#E0E0E0`
- TextPrimary: `#1A1A1A`
- TextSecondary: `#666666`
- TextTertiary: `#999999`

**Dark Mode:**
- Primary: `#FF6B35` (same)
- Background: `#0A0A0A`
- Surface: `#1A1A1A`
- SurfaceAlt: `#2A2A2A`
- Border: `#333333`
- TextPrimary: `#FFFFFF`
- TextSecondary: `#B0B0B0`
- TextTertiary: `#808080`

### Typography
- Heading/Title: 17px, 700
- Body: 15px, 400
- Secondary: 13px, 400
- Label: 12px, 600 (uppercase)
- Hint: 11px, 400 (uppercase)

### Spacing
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 14px
- Full: 999px

---

## 🎬 Animations & Interactions

### QuickRequestAutoScreen
1. **Brand selection:** Scale 0.95x on press, snap back
2. **Button press:** Opacity feedback
3. **Form validation:** Info card slides in when brand selected
4. **Submit:** Loading spinner, then success message

### RequestsScreen
1. **Card expand/collapse:** Smooth height animation (200ms)
2. **Urgent badge:** Slight pulse animation (optional)
3. **Filter change:** FlatList refresh with animation
4. **Button press:** Scale feedback (0.95x)

---

## 📱 Responsive Design

### Breakpoints
- Small phones (280-384px): 1 column, full padding reduction
- Regular phones (384-640px): Standard design as specified
- Tablets (640px+): 2 column layouts for RequestsScreen (optional)

### Specific sizes
- **QuickRequestAutoScreen:**
  - Brand grid: 3 columns on regular, 2 on small
  
- **RequestsScreen:**
  - FlatList width: 100%, padding 16px horizontal
  - Cards: full width with padding

---

## ✅ Design Checklist

- [ ] QuickRequestAutoScreen full flow (4 шага)
- [ ] All form states (empty, filled, loading, error)
- [ ] RequestsScreen with filters
- [ ] Card collapsed state
- [ ] Card expanded state
- [ ] Empty states
- [ ] Dark mode for both screens
- [ ] Light mode for both screens
- [ ] All component hover/press states
- [ ] Badge animations
- [ ] Button interactions
- [ ] Responsive layouts (mobile, tablet)
- [ ] Micro-interactions (expand/collapse, transitions)
- [ ] Icons placement and sizing
- [ ] Typography hierarchy
- [ ] Spacing consistency

---

## 🎯 Success Criteria

1. **QuickRequestAutoScreen:**
   - Clear 4-step journey
   - Easy to select from 12 brands
   - Summary shows before submit
   - Accessible inputs
   - Mobile-first design

2. **RequestsScreen:**
   - Urgent requests stand out visually
   - Filters work smoothly
   - Card expansion is intuitive
   - Action buttons are obvious
   - Time-sensitive info is highlighted
   - Dark mode supports both screens

---

## 📎 Files to Design
- `src/screens/buyer/QuickRequestAutoScreen.tsx` - 1 screen
- `src/screens/seller/RequestsScreen.tsx` - 1 screen

**Total:** 2 main screens + states + dark mode = ~10-15 design comps
