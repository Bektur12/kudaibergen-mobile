import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { MessageSquare, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { C, CDark, T } from './ui';

interface QuickRequestCardProps {
  onPress: () => void;
}

export default function QuickRequestCard({ onPress }: QuickRequestCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? CDark : C;

  // Pulse animations
  const pulse1Scale = useSharedValue(0.6);
  const pulse1Opacity = useSharedValue(1);

  const pulse2Scale = useSharedValue(0.6);
  const pulse2Opacity = useSharedValue(0.6);

  useEffect(() => {
    // First pulse ring: 0.6 → 1.9, opacity 1 → 0, duration 2.4s
    pulse1Scale.value = withRepeat(
      withTiming(1.9, {
        duration: 2400,
        easing: Easing.out(Easing.cubic),
      }),
      -1
    );

    pulse1Opacity.value = withRepeat(
      withTiming(0, {
        duration: 2400,
        easing: Easing.linear,
      }),
      -1
    );

    // Second pulse ring: offset by 1.2s
    setTimeout(() => {
      pulse2Scale.value = withRepeat(
        withTiming(1.9, {
          duration: 2400,
          easing: Easing.out(Easing.cubic),
        }),
        -1
      );

      pulse2Opacity.value = withRepeat(
        withTiming(0, {
          duration: 2400,
          easing: Easing.linear,
        }),
        -1
      );
    }, 1200);
  }, []);

  const pulse1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1Scale.value }],
    opacity: pulse1Opacity.value,
  }));

  const pulse2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2Scale.value }],
    opacity: pulse2Opacity.value,
  }));

  // Gradient background simulation (orange to lighter)
  const gradientColor1 = colors.primary; // #FF6B35
  const gradientColor2 = colors.primary + 'CC'; // Slightly lighter

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: colors.primary,
            opacity: 0.95,
          },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Left: Icon with pulse rings */}
        <View style={styles.iconContainer}>
          {/* Pulse Rings */}
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: colors.surface },
              pulse1AnimatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: colors.surface },
              pulse2AnimatedStyle,
            ]}
          />

          {/* Main Icon */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surface + '20' },
            ]}
          >
            <MessageSquare size={24} color={colors.surface} strokeWidth={2} />
          </View>
        </View>

        {/* Center: Text */}
        <View style={styles.textBox}>
          <Text
            style={[
              T.hint,
              {
                color: colors.surface,
                opacity: 0.8,
                marginBottom: 2,
              },
            ]}
          >
            НЕ НАШЛИ НУЖНОЕ ОБЪЯВЛЕНИЕ?
          </Text>
          <Text
            style={[
              T.heading,
              {
                color: colors.surface,
                marginBottom: 4,
              },
            ]}
          >
            Спросите у продавцов напрямую
          </Text>
          <Text
            style={[
              T.secondary,
              {
                color: colors.surface,
                opacity: 0.8,
                lineHeight: 18,
              },
            ]}
          >
            Опишите, что ищете — предложения придут вам в чат
          </Text>
        </View>

        {/* Right: Chevron */}
        <View style={styles.chevronBox}>
          <ChevronRight size={20} color={colors.surface} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  pulseRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  chevronBox: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
