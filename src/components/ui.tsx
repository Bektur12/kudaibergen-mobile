import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';

// Design system colors (per design review)
export const C = {
  primary: '#FF6B35',      // PRIMARY CTA: buttons, prices, main actions
  secondary: '#F7931E',    // ACCENT: ratings, icons (not for CTAs)
  error: '#EF5350',        // SECONDARY: urgent, errors, warnings
  success: '#4CAF50',      // SUCCESS: in stock, active status
  verified: '#2F6FED',     // NEW: verified seller badge
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F9F9F9',
  border: '#E0E0E0',
  primaryTint: '#FFEDE3',  // NEW: light orange background for promo
  errorTint: '#FDEBEA',    // NEW: light red background
  successTint: '#E7F6ED',  // NEW: light green background
};

// Dark theme colors
export const CDark = {
  primary: '#FF6B35',      // PRIMARY stays same
  secondary: '#F7931E',
  error: '#EF5350',
  success: '#2F9E58',
  verified: '#2F6FED',
  textPrimary: '#F6F3EC',
  textSecondary: '#B6AE9E',
  textTertiary: '#857D6C',
  bg: '#14120E',           // Warm dark (garage at night)
  surface: '#1E1B16',
  surfaceAlt: '#262218',
  border: '#332E24',
  primaryTint: '#4D3A2A',  // Darker orange tint
  errorTint: '#4D2A28',
  successTint: '#2A3D2E',
};

// Typography helpers (per design system - 3 sizes max on screen)
export const T = {
  price: { fontSize: 24, fontWeight: '800', lineHeight: 32 } as TextStyle,     // BIG price
  heading: { fontSize: 17, fontWeight: '700', lineHeight: 24 } as TextStyle,   // Section titles
  button: { fontSize: 17, fontWeight: '700', lineHeight: 24 } as TextStyle,
  body: { fontSize: 15, fontWeight: '400', lineHeight: 24 } as TextStyle,      // Main text
  secondary: { fontSize: 13, fontWeight: '400', lineHeight: 20 } as TextStyle, // Characteristics
  label: { fontSize: 12, fontWeight: '700', lineHeight: 16 } as TextStyle,
  hint: { fontSize: 11, fontWeight: '400', lineHeight: 16 } as TextStyle,      // Meta info
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontWeight: '600',
    fontSize: 11,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: 20,
    fontWeight: '700',
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

// Badge
type BadgeVariant = 'success' | 'error' | 'accent' | 'default';
export function Badge({
  children,
  variant = 'default',
  style,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
}) {
  const variants: Record<BadgeVariant, { bg: string; color: string }> = {
    success: { bg: '#E8F5E9', color: '#2E7D32' },
    error: { bg: '#FFEBEE', color: '#C62828' },
    accent: { bg: '#FFF3EE', color: C.primary },
    default: { bg: '#F0F0F0', color: C.textSecondary },
  };
  const { bg, color } = variants[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={{ color, fontWeight: '600', fontSize: 11 }}>
        {children}
      </Text>
    </View>
  );
}

// Button
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type BtnSize = 'sm' | 'md' | 'lg';
export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  full?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  const heights: Record<BtnSize, number> = { sm: 40, md: 48, lg: 56 };
  const variantStyles: Record<BtnVariant, ViewStyle> = {
    primary: { backgroundColor: C.primary },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: C.primary,
    },
    ghost: { backgroundColor: 'transparent' },
    destructive: { backgroundColor: C.error },
  };

  const textColors: Record<BtnVariant, string> = {
    primary: '#fff',
    secondary: C.primary,
    ghost: C.textPrimary,
    destructive: '#fff',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { height: heights[size], width: full ? '100%' : 'auto' },
        variantStyles[variant],
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={{ color: textColors[variant], fontWeight: '700', fontSize: 15 }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// Input
export function Input({
  placeholder,
  value,
  onChange,
  icon,
  style,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: C.bg,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          height: 48,
          gap: 10,
        },
        style,
      ]}
    >
      {icon}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.textTertiary}
        style={{
          flex: 1,
          fontSize: 15,
          color: C.textPrimary,
          fontWeight: '500',
        }}
      />
    </View>
  );
}

// Card
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.card, { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6 }, style]}>
      {children}
    </View>
  );
}

// Stars/Rating
export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Text style={{ fontWeight: '600', fontSize: 13, color: C.textPrimary }}>
        ⭐ {rating.toFixed(1)}
      </Text>
      {count !== undefined && (
        <Text style={{ fontSize: 12, color: C.textTertiary }}>({count})</Text>
      )}
    </View>
  );
}

// Avatar
export function Avatar({
  initials,
  size = 40,
  color = C.primary,
}: {
  initials: string;
  size?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: `${color}22`,
        borderWidth: 1.5,
        borderColor: `${color}55`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          fontSize: size * 0.35,
          color,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

// Search Icon
export function SearchIcon({ size = 18, color = C.textTertiary }: { size?: number; color?: string }) {
  return (
    <Text style={{ fontSize: size * 1.2, color }}>
      🔍
    </Text>
  );
}

// Screen Header
export function ScreenHeader({
  title,
  subtitle,
  rightSlot,
  leftSlot,
  style,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: C.surface,
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        },
        style,
      ]}
    >
      {leftSlot}
      <View style={{ flex: 1 }}>
        <Text style={[T.heading, { color: C.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[T.hint, { color: C.textTertiary, marginTop: 1 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightSlot}
    </View>
  );
}

// Divider
export function Divider() {
  return <View style={{ height: 1, backgroundColor: C.border }} />;
}

// Section Label
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text style={[T.heading, { color: C.textPrimary, marginBottom: 12 }]}>
      {children}
    </Text>
  );
}

// Notification Bell
export function NotifBell({ count }: { count: number }) {
  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        style={{
          backgroundColor: C.bg,
          borderRadius: 10,
          width: 38,
          height: 38,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </TouchableOpacity>
      {count > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            backgroundColor: C.error,
            borderRadius: 999,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
}

// Back Button
export function BackBtn({ onBack }: { onBack?: () => void }) {
  return (
    <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
      <Text style={{ fontSize: 24, color: C.primary }}>←</Text>
    </TouchableOpacity>
  );
}

// List Row
export function ListRow({
  icon,
  label,
  rightSlot,
  onPress,
  style,
}: {
  icon?: React.ReactNode;
  label: string;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingHorizontal: 20,
          paddingVertical: 14,
        },
        style,
      ]}
    >
      {icon && (
        <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>
          {icon}
        </Text>
      )}
      <Text style={[T.body, { flex: 1, color: C.textPrimary }]}>
        {label}
      </Text>
      {rightSlot ?? <Text style={{ fontSize: 16, color: C.border }}>›</Text>}
    </TouchableOpacity>
  );
}
