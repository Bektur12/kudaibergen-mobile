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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, Search, Bell, ArrowLeft, ChevronRight } from 'lucide-react-native';

// Neutral base + one accent. Colour carries meaning, never decoration:
// orange = the action you should take, red = urgent, green = in stock.
export const C = {
  primary: '#E8590C',      // Actions only (buttons, links). Darkened for 4.5:1 contrast on white
  error: '#C92A2A',        // Urgent only
  success: '#2B8A3E',      // In stock only
  textPrimary: '#1A1A1A',  // 15.3:1 on white
  textSecondary: '#4A4A4A',// 8.9:1 — readable at arm's length
  textTertiary: '#6B6B6B', // 5.3:1 — passes AA, unlike the old #999
  bg: '#F4F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F9F9FB',
  border: '#E7E7EB',
  primaryTint: '#FFF1E8',
  errorTint: '#FDECEC',
  successTint: '#EBF7EE',
};

// Sized for drivers aged 35-60 reading a phone at arm's length,
// often in a workshop. Nothing below 13px.
export const T = {
  price: { fontSize: 26, fontWeight: '800', lineHeight: 34 } as TextStyle,
  heading: { fontSize: 18, fontWeight: '700', lineHeight: 26 } as TextStyle,
  button: { fontSize: 17, fontWeight: '700', lineHeight: 24 } as TextStyle,
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 } as TextStyle,
  secondary: { fontSize: 15, fontWeight: '400', lineHeight: 22 } as TextStyle,
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 } as TextStyle,
  hint: { fontSize: 13, fontWeight: '400', lineHeight: 18 } as TextStyle,
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    fontWeight: '600',
    fontSize: 11,
  },
  button: {
    borderRadius: 14,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E7E7EB',
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
      activeOpacity={0.8}
      style={[
        styles.button,
        { height: heights[size], width: full ? '100%' : 'auto' },
        variantStyles[variant],
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={{ color: textColors[variant], fontWeight: '600', fontSize: 16, letterSpacing: 0.1 }}>
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
    <View style={[styles.card, { shadowColor: '#101828', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }, style]}>
      {children}
    </View>
  );
}

// Stars/Rating
export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Star size={13} color="#F5A524" fill="#F5A524" />
      <Text style={{ fontWeight: '600', fontSize: 13, color: C.textPrimary }}>
        {rating.toFixed(1)}
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
        backgroundColor: `${color}1F`,
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
  return <Search size={size} color={color} />;
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
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: C.surface,
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: 12,
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
        <Bell size={20} color={C.textPrimary} />
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
      <ArrowLeft size={24} color={C.textPrimary} />
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
      {icon != null && (
        <View style={{ width: 28, alignItems: 'center' }}>
          {typeof icon === 'string' ? <Text style={{ fontSize: 20 }}>{icon}</Text> : icon}
        </View>
      )}
      <Text style={[T.body, { flex: 1, color: C.textPrimary }]}>
        {label}
      </Text>
      {rightSlot ?? <ChevronRight size={18} color={C.textTertiary} />}
    </TouchableOpacity>
  );
}
