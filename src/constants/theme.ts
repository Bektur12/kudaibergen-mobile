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

// Typography based on design document
export const Typography = {
  // Price: 34px, 800 weight, -0.02em letter-spacing
  price: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 40,
    letterSpacing: -0.02,
  },
  // Heading: 24px, 700 weight
  heading: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 32,
  },
  // Button: 17px, 700 weight
  button: {
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 24,
  },
  // Body: 16px, 500 weight
  body: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 24,
  },
  // Secondary: 14px, 500 weight
  secondary: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },
  // Label: 12px, 700 weight, uppercase
  label: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  // Hint: 13px, 500 weight
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
