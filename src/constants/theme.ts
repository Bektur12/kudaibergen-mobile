import '@/global.css';
import { Platform } from 'react-native';

// Same values as the `C` palette in components/ui.tsx — the two systems must
// not drift, or the tab bar ends up a different shade than the buttons.
const palette = {
  background: '#F4F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F9F9FB',
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textTertiary: '#6B6B6B',
  border: '#E7E7EB',
  accent: '#E8590C',
  accentHover: '#D04E08',
  success: '#2B8A3E',
  error: '#C92A2A',
  warning: '#E8A400',
  disabled: '#9E9E9E',
} as const;

// The app ships light-only: a single look is cheaper to design and test, and
// most screens hardcode the light palette anyway. `dark` is an alias so any
// `isDark ? Colors.dark : Colors.light` call site stays consistent.
export const Colors = {
  light: palette,
  dark: palette,
} as const;

export type ThemeColor = keyof typeof Colors.light;

// Must stay in step with the `T` scale in components/ui.tsx — the two used to
// disagree (heading 24 here vs 18 there, price 34 vs 26), so a screen's title
// changed size depending on which system it happened to import.
// Sized for drivers aged 35-60 reading a phone at arm's length: nothing below 13px.
export const Typography = {
  price: {
    fontSize: 26,
    fontWeight: 800,
    lineHeight: 34,
    letterSpacing: -0.02,
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 26,
  },
  button: {
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
  },
  secondary: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 18,
    textTransform: 'uppercase' as const,
  },
  hint: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 18,
  },
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui' },
  android: { sans: '-apple-system' },
  default: { sans: 'Inter' },
  web: { sans: 'Inter, -apple-system, system-ui, sans-serif' },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 14,
  xl: 16,
  full: 999,
} as const;

export const ShadowSize = {
  small: {
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 6,
  },
  large: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 40,
    elevation: 8,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 390;

/**
 * Layout constants every screen shares. `gutter` exists because screens used
 * to hardcode their own edge padding — 16 on Home/Search/Requests, 20 on the
 * profiles, Spacing.four (24) on the detail screens — so content edges visibly
 * jumped when switching tabs. One value, one alignment.
 */
export const Layout = {
  gutter: 16,
  // 12 is what the great majority of cards across the app already use — the two
  // Card components were the odd ones out at 14 and 16.
  cardRadius: 12,
  cardGap: 12,
} as const;

/**
 * Card lift. Android ignores shadowColor/Opacity/Radius entirely and needs
 * `elevation`; iOS without a shadowOffset paints an even halo instead of a
 * drop shadow. Both were missing from the ui.tsx Card, so cards were flat on
 * Android and slightly smudged on iOS.
 */
export const CardShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 2,
} as const;
