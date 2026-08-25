# Kudaibergen Marketplace - React Native Implementation Guide

## Overview
Complete React Native + Expo implementation of the Kudaibergen marketplace with buyer and seller flows.

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx              # Root navigation with AuthProvider
│   ├── index.tsx                # Auth redirect logic
│   ├── auth/
│   │   ├── _layout.tsx          # Auth stack
│   │   ├── login.tsx            # Login screen (buyer/seller selection)
│   │   └── register.tsx         # Registration screen
│   ├── (buyer)/                 # Buyer role group
│   │   ├── _layout.tsx          # Buyer bottom tab navigation
│   │   ├── index.tsx            # Requests list
│   │   ├── create.tsx           # Create new request
│   │   ├── [id]/
│   │   │   ├── _layout.tsx
│   │   │   ├── detail.tsx       # Request detail with offers
│   │   │   └── summary.tsx      # Price summary
│   │   ├── market/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx        # Market grid view
│   │   │   └── [rowId].tsx      # Market item detail
│   │   ├── chats/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx        # Chats list
│   │   │   └── [chatId].tsx     # Chat conversation
│   │   └── profile.tsx          # Buyer profile
│   └── (seller)/                # Seller role group
│       ├── _layout.tsx          # Seller bottom tab navigation
│       ├── terminal/
│       │   ├── _layout.tsx
│       │   ├── index.tsx        # Terminal (requests feed)
│       │   ├── prices.tsx       # Seller prices list
│       │   ├── analytics.tsx    # Sales analytics
│       │   └── offer/[id].tsx   # Make offer with numeric keypad
│       └── profile.tsx          # Seller profile
│
├── components/
│   └── ui/
│       ├── Button.tsx           # Reusable button (3 variants)
│       ├── Input.tsx            # Text input field
│       ├── Card.tsx             # Container component
│       ├── Header.tsx           # Screen header with back button
│       └── Badge.tsx            # Label badges
│
├── context/
│   └── auth.tsx                 # Auth context + hooks
│
├── constants/
│   └── theme.ts                 # Colors, spacing, typography
│
└── types/
    └── index.ts                 # TypeScript interfaces
```

## Key Features Implemented

### Authentication
- **Login Screen**: Role selection (Buyer/Seller) with email/password
- **Register Screen**: New account creation with role selection
- **Auth Context**: Manages user state and login/logout

### Buyer Flow
1. **Requests List**: View active and completed requests
2. **Create Request**: 
   - Auto-filled car selection
   - Part details input (multiline)
   - Photo and urgent options
   - Market scope settings
   - Live countdown timer while waiting for responses

3. **Request Detail**: 
   - Shows received offers from sellers
   - Price comparison
   - Seller ratings and delivery info
   - Contact seller button

4. **Market Browsing**:
   - Grid layout of available parts
   - Organized by categories/rows
   - Item detail view with seller info
   - Message seller directly

5. **Chat System**:
   - List of ongoing chats
   - Real-time messaging
   - Unread count badges
   - Last message preview

6. **Profile**:
   - User info and rating
   - Transaction history
   - Statistics (requests, completed, rating)

### Seller Flow
1. **Terminal** (Main Feed):
   - New incoming requests
   - Status indicators
   - Seller count information
   - Quick access to make offer

2. **Make Offer** (Numeric Keypad):
   - Price entry with numeric keypad
   - Delivery time selection (1-4 days)
   - Optional description
   - Live price preview

3. **Prices List**:
   - Manage posted prices
   - Part numbers and descriptions
   - Stock quantity
   - Last updated timestamps

4. **Analytics Dashboard**:
   - Weekly statistics (offers, views, contacts, sales)
   - Monthly revenue and deal count
   - Rating and reviews breakdown
   - Visual rating bars

5. **Seller Profile**:
   - Store information
   - Contact and hours
   - Transaction statistics
   - Rating display

## Design System

### Colors (Dark Theme)
- **Background**: `#0F1115`
- **Surface**: `#1A1D23`
- **Accent**: `#FFB020` (Gold)
- **Text**: `#F5F7FA`
- **Text Secondary**: `#8A929E`
- **Text Tertiary**: `#C7CDD6`

### Typography
- **Font**: Inter family (iOS: system-ui, Android: -apple-system)
- **Sizes**: Standard React Native font hierarchy
- **Weights**: 400, 500, 600, 700, 800

### Spacing Scale
- `half`: 2px
- `one`: 4px
- `two`: 8px
- `three`: 16px
- `four`: 24px
- `five`: 32px
- `six`: 48px
- `seven`: 64px

### Component Variants

**Button**
- `variant`: primary (gold), secondary (outlined), tertiary (text)
- `size`: small, medium, large
- Auto-disable on invalid state

**Input**
- Styled with border and background
- Support for multiline text
- Optional icon support
- Adaptive height

**Card**
- Default with border
- Highlighted variant (accent border)
- Consistent padding and radius

**Badge**
- 4 variants: default, success, warning, error
- 2 sizes: small, medium
- Auto-sizing

## Navigation Structure

### Auth Stack
- Login → Register (with back navigation)
- Auth state determines redirect

### Buyer Tabs
- Requests (home)
- Market (map/grid)
- Chats
- Profile

### Seller Tabs
- Terminal (requests)
- Prices (inventory)
- Analytics (stats)
- Profile

## State Management
- **Auth Context**: User authentication state
- **Local State**: Component-level with useState
- **Mock Data**: Pre-populated data structures

## Mock Data Sets
- 2-3 sample requests
- Multiple offers per request
- 3+ sample chats with messages
- Market inventory (rows with boxes)
- Seller analytics data

## Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development
```bash
npm start          # Expo development server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

### Build Features
- Hot reloading with Expo
- TypeScript support
- ESLint configuration
- React Native Web compatible

## Navigation Patterns

### Dynamic Routes
- `/(buyer)/[id]/detail` - Request details by ID
- `/(buyer)/chats/[chatId]` - Chat conversations
- `/(buyer)/market/[rowId]` - Market item details
- `/(seller)/terminal/offer/[id]` - Make offer for request

### Screen Transitions
- All screens support back navigation with Header
- Tab navigation for main flows
- Modal-like offers flow from terminal

## Customization Points

### Add New Screens
1. Create file in appropriate route group
2. Import UI components
3. Use Header component for navigation
4. Follow theme colors from constants/theme.ts

### Modify Styling
- Edit `constants/theme.ts` for global colors/spacing
- Component-level styles use theme values
- Responsive to light/dark color scheme

### Update Mock Data
- Edit arrays in respective screen files
- Add new properties to type definitions
- Update TypeScript interfaces

## Known Limitations

- Authentication is mock-based (no real API)
- Chat messages stored in local state
- Prices/offers not persisted
- Analytics use mock data
- No actual payment processing

## Next Steps for Production

1. **Backend Integration**
   - Replace mock auth with real API
   - Add database for persistence
   - Implement real-time chat (WebSocket/Firebase)

2. **State Management**
   - Migrate to Redux/Zustand for complex state
   - Add async thunks for API calls
   - Implement proper loading/error states

3. **Testing**
   - Unit tests for components
   - Integration tests for flows
   - E2E tests with Detox

4. **Performance**
   - Add image optimization
   - Implement lazy loading
   - Add caching strategies

5. **Deployment**
   - Build for iOS (TestFlight/App Store)
   - Build for Android (Play Store)
   - Web deployment (Vercel/Netlify)
