import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './ui';

interface QuickRequestCardProps {
  onPress: () => void;
}

export default function QuickRequestCard({ onPress }: QuickRequestCardProps) {
  const colors = C;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[T.heading, { color: colors.textPrimary }]}>
        Не нашли нужную запчасть?
      </Text>
      <Text
        style={[T.secondary, { color: colors.textSecondary, marginTop: 6 }]}
      >
        Опишите что ищете — продавцы сами напишут вам с ценой
      </Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Ionicons name="search" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Спросить у продавцов</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  button: {
    marginTop: 14,
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
