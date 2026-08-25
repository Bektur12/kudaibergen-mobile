# Кудайберген - Design System Guide

## Цветовая палитра

### Light Mode
- Background: #F4F6F8
- Surface: #FFFFFF
- Surface Alt: #F0F2F5
- Text: #0F1115
- Text Secondary: #5A616B
- Text Tertiary: #7A828C
- Border: #D3D9E0
- Accent: #FFB020
- Success: #22C55E
- Error: #EF4444
- Warning: #3B82F6

### Dark Mode
- Background: #0F1115
- Surface: #1A1D23
- Surface Alt: #141821
- Text: #F5F7FA
- Text Secondary: #8A929E
- Text Tertiary: #C7CDD6
- Border: #2E333D
- Accent: #FFB020
- Success: #22C55E
- Error: #EF4444
- Warning: #3B82F6

## Типография

```typescript
// Price: 34px, 800 weight, -0.02em letter-spacing
Typography.price

// Heading: 24px, 700 weight
Typography.heading

// Button: 17px, 700 weight
Typography.button

// Body: 16px, 500 weight
Typography.body

// Secondary: 14px, 500 weight
Typography.secondary

// Label: 12px, 700 weight, uppercase
Typography.label

// Hint: 13px, 500 weight
Typography.hint
```

## Spacing System

```typescript
Spacing.half  // 2px
Spacing.one   // 4px
Spacing.two   // 8px
Spacing.three // 16px
Spacing.four  // 24px
Spacing.five  // 32px
Spacing.six   // 48px
Spacing.seven // 64px
```

## Border Radius

```typescript
BorderRadius.small   // 8px
BorderRadius.medium  // 12px
BorderRadius.large   // 14px
BorderRadius.xl      // 16px
BorderRadius.full    // 999px (полный круг)
```

## Компоненты

### Button

```tsx
import { Button } from '@/components'

<Button
  title="Нажми меня"
  onPress={() => {}}
  variant="primary"          // primary | secondary | ghost | destructive
  size="large"               // small | medium | large
  disabled={false}
/>
```

### Card

```tsx
import { Card } from '@/components'

<Card
  variant="outlined"         // default | outlined | accent | elevated
  onPress={() => {}}
>
  <Text>Контент</Text>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components'

<Badge
  label="Новое"
  variant="accent"           // accent | success | warning | error | gray | outline
  size="medium"              // small | medium | large
/>
```

### Input

```tsx
import { Input } from '@/components'

<Input
  placeholder="Введите текст"
  value={text}
  onChangeText={setText}
  label="Поле ввода"
  error={errorMessage}
  icon={<Icon />}
  rightIcon={<Icon />}
  multiline={false}
  numberOfLines={3}
/>
```

### Header

```tsx
import { Header } from '@/components'

<Header
  title="Заголовок"
  subtitle="Подзаголовок"
  onBack={() => router.back()}
  rightAction={{
    label: "Сохранить",
    icon: <Icon />,
    onPress: () => {}
  }}
/>
```

### StarRating

```tsx
import { StarRating } from '@/components'

<StarRating
  rating={4}
  maxRating={5}
  size="medium"              // small | medium | large
  readonly={true}
  showLabel={true}
  onRatingChange={(rating) => {}}
/>
```

### PriceDisplay

```tsx
import { PriceDisplay } from '@/components'

<PriceDisplay
  amount={5000}
  currency="KZT"             // KZT | USD
  size="medium"              // small | medium | large
  showLabel={true}
/>
```

### SellerCard

```tsx
import { SellerCard } from '@/components'

<SellerCard
  name="Авто Сервис"
  rating={4.5}
  reviewCount={24}
  responseTime="< 1 часа"
  distance="5 км"
  onPress={() => {}}
/>
```

### Checkbox

```tsx
import { Checkbox } from '@/components'

<Checkbox
  checked={isChecked}
  onToggle={(checked) => setIsChecked(checked)}
  label="Согласен с условиями"
  disabled={false}
/>
```

### Divider

```tsx
import { Divider } from '@/components'

<Divider variant="horizontal" />
<Divider variant="vertical" />
```

### TabBar

```tsx
import { TabBar } from '@/components'

const tabs = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
]

<TabBar
  tabs={tabs}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
/>
```

## Использование Theme

```tsx
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/theme'

export function MyComponent() {
  const colorScheme = useColorScheme() ?? 'dark'
  const isDark = colorScheme === 'dark'
  const colors = isDark ? Colors.dark : Colors.light

  return (
    <View style={{ backgroundColor: colors.surface }}>
      <Text style={{ color: colors.text }}>Текст</Text>
    </View>
  )
}
```

## Context для State Management

### useAuth

```tsx
import { useAuth } from '@/context/auth'

const { user, loading, login, logout } = useAuth()

// user: { id, name, email, role, phone?, avatar? }
// role: 'buyer' | 'seller'
```

### useApp

```tsx
import { useApp } from '@/context/app'

const {
  requests,
  createRequest,
  getRequest,
  updateRequest,
  
  offers,
  createOffer,
  getOffersByRequest,
  
  chats,
  getOrCreateChat,
  getChat,
  
  messages,
  sendMessage,
  getMessagesByChat,
} = useApp()
```

## Примеры использования

### Создание новой формы

```tsx
import { useState } from 'react'
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Input, Button, Header } from '@/components'
import { Colors, Spacing } from '@/constants/theme'
import { useColorScheme } from 'react-native'

export default function MyForm() {
  const [value, setValue] = useState('')
  const colorScheme = useColorScheme() ?? 'dark'
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <Header title="Новая форма" />
        
        <ScrollView style={{ padding: Spacing.four }}>
          <Input
            placeholder="Введите значение"
            value={value}
            onChangeText={setValue}
            label="Мое поле"
          />
          
          <Button
            title="Отправить"
            onPress={() => {}}
            style={{ marginTop: Spacing.four }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
```

## Theme Colors API

```typescript
import { Colors, BorderRadius, ShadowSize, Spacing, Typography } from '@/constants/theme'

// Цвета - всегда используются вместе с theme detection
const colors = isDark ? Colors.dark : Colors.light
const bgColor = colors.surface
const textColor = colors.text

// Border radius
const radius = BorderRadius.large // 14px

// Shadows
const shadow = ShadowSize.medium

// Spacing
const padding = Spacing.three // 16px

// Typography
const fontSize = Typography.heading.fontSize // 24px
const fontWeight = Typography.heading.fontWeight // '700'
```
