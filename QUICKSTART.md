# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies (already done)
npm install

# Start development server
npm start

# Choose platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser
```

## Test Accounts

### Buyer Account
- Email: `buyer@example.com`
- Password: `password`
- Role: Покупатель (Buyer)

### Seller Account
- Email: `seller@example.com`
- Password: `password`
- Role: Продавец (Seller)

## Quick Navigation Guide

### Buyer App Flow
1. **Login** → Select "Покупатель" (Buyer)
2. **Requests Tab** - View list of your requests
3. **Create Request** - Click "Новый" button to create new request
4. **Market Tab** - Browse available parts organized by category
5. **Chats Tab** - Messaging with sellers
6. **Profile Tab** - View your profile and statistics

### Seller App Flow
1. **Login** → Select "Продавец" (Seller)
2. **Terminal Tab** - See incoming buyer requests
3. **Make Offer** - Click request to make price offer with numeric keypad
4. **Prices Tab** - Manage your posted prices and inventory
5. **Analytics Tab** - View sales statistics and ratings
6. **Profile Tab** - Store information and seller rating

## Key Screens to Explore

### Buyer
- `/auth/login` - Authentication
- `/(buyer)` - Requests list
- `/(buyer)/create` - Create new request form
- `/(buyer)/[id]/detail` - View request with offers
- `/(buyer)/market` - Market grid view
- `/(buyer)/chats` - Chat list
- `/(buyer)/chats/[chatId]` - Chat conversation

### Seller
- `/(seller)/terminal` - Incoming requests feed
- `/(seller)/terminal/offer/[id]` - Numeric keypad for price entry
- `/(seller)/terminal/prices` - Your prices list
- `/(seller)/terminal/analytics` - Analytics dashboard

## Test Interactions

### Create Request (Buyer)
1. Go to Requests tab
2. Click "Новый" (New)
3. Fill in "Какая деталь нужна?" (Part details)
4. Toggle "Фото детали" (Add photo)
5. Toggle "Срочно" (Urgent)
6. Click "Отправить запрос" (Send request)

### Make Offer (Seller)
1. Go to Terminal tab
2. Click any request
3. Use numeric keypad to enter price
4. Select delivery time (1-4 days)
5. Add description (optional)
6. Click "Отправить предложение" (Send offer)

### Send Message
1. Go to Chats tab
2. Click any chat
3. Type message in input
4. Click send button (arrow icon)

## Styling Features

- **Dark Theme**: Automatically adapts to device dark mode
- **Accent Color**: Gold (#FFB020) used consistently
- **Responsive Layout**: Optimized for mobile (390px width reference)
- **Material Radius**: 12-14px border radius on most elements
- **Consistent Spacing**: Scale-based spacing system

## File Organization

Key files to customize:
- `src/constants/theme.ts` - Colors, spacing, fonts
- `src/components/ui/` - Reusable UI components
- `src/context/auth.tsx` - Authentication logic
- `src/app/(buyer)/` - Buyer screens
- `src/app/(seller)/` - Seller screens

## Troubleshooting

### App won't start
```bash
npm install
npm start
```

### Hot reload not working
- Clear Expo cache: Press 'c' in terminal
- Restart development server

### TypeScript errors
```bash
npm run lint
```

### Module not found errors
- Ensure path aliases in `tsconfig.json` are correct
- Check imports use `@/` prefix

## Development Tips

### Adding New Components
1. Create in `src/components/ui/ComponentName.tsx`
2. Export from index if needed
3. Import with `@/components/ui/ComponentName`

### Adding New Screens
1. Create in appropriate route group
2. Use `Header` component for navigation
3. Follow existing patterns for styling
4. Use mock data or API calls

### Updating Theme
1. Edit color values in `src/constants/theme.ts`
2. Changes apply globally via color scheme detection
3. Light/dark modes auto-support

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [expo-router Guide](https://docs.expo.dev/routing/introduction/)
- [TypeScript + React Native](https://www.typescriptlang.org/)
