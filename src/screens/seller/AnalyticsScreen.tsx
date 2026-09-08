import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C, T, ScreenHeader } from '@/components/ui';

const PERIODS = ['Неделя', 'Месяц', 'Год'];
const TOP_PRODUCTS = [
  { rank: 1, name: 'Тормоз. диски', views: 150, conversion: '18%' },
  { rank: 2, name: 'Фильтр масла', views: 120, conversion: '16%' },
  { rank: 3, name: 'Амортизаторы', views: 90, conversion: '14%' },
];
const TRAFFIC_SOURCES = [
  { source: 'Поиск', percent: 45, icon: '🔍' },
  { source: 'Рекоменда', percent: 30, icon: '💗' },
  { source: 'Карта', percent: 15, icon: '🗺️' },
  { source: 'Прямой', percent: 10, icon: '➤' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: C.bg,
  },
  periodButtonActive: {
    backgroundColor: C.primary,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  periodTextActive: {
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  metricLabel: {
    fontSize: 11,
    color: C.textTertiary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: C.primary,
    marginVertical: 4,
  },
  metricChange: {
    fontSize: 12,
    color: C.success,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 12,
    marginTop: 12,
  },
  productRow: {
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  productRank: {
    fontWeight: '700',
    fontSize: 16,
    color: C.primary,
    width: 24,
  },
  productName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
  },
  productStats: {
    fontSize: 12,
    color: C.textSecondary,
  },
  trafficRow: {
    backgroundColor: C.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  trafficHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  trafficIcon: {
    fontSize: 16,
  },
  trafficLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
  },
  trafficPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
  },
  trafficBar: {
    height: 6,
    backgroundColor: C.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trafficFill: {
    height: '100%',
    backgroundColor: C.primary,
  },
});

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('Месяц');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Аналитика" />

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Просмотров</Text>
              <Text style={styles.metricValue}>1,247</Text>
              <Text style={styles.metricChange}>+12%</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Контакты</Text>
              <Text style={styles.metricValue}>284</Text>
              <Text style={styles.metricChange}>+8%</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Конверсия</Text>
              <Text style={styles.metricValue}>22.8%</Text>
              <Text style={styles.metricChange}>+2%</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Доход</Text>
              <Text style={styles.metricValue}>45K с</Text>
              <Text style={styles.metricChange}>+18%</Text>
            </View>
          </View>

          {/* Top Products */}
          <Text style={styles.sectionTitle}>Топ товары</Text>
          {TOP_PRODUCTS.map((prod) => (
            <View key={prod.rank} style={styles.productRow}>
              <Text style={styles.productRank}>{prod.rank}</Text>
              <Text style={styles.productName}>{prod.name}</Text>
              <View>
                <Text style={styles.productStats}>👁️ {prod.views}</Text>
                <Text style={styles.productStats}>{prod.conversion}</Text>
              </View>
            </View>
          ))}

          {/* Traffic Sources */}
          <Text style={styles.sectionTitle}>Источники трафика</Text>
          {TRAFFIC_SOURCES.map((source) => (
            <View key={source.source} style={styles.trafficRow}>
              <View style={styles.trafficHeader}>
                <Text style={styles.trafficIcon}>{source.icon}</Text>
                <Text style={styles.trafficLabel}>{source.source}</Text>
                <Text style={styles.trafficPercent}>{source.percent}%</Text>
              </View>
              <View style={styles.trafficBar}>
                <View
                  style={[styles.trafficFill, { width: `${source.percent}%` }]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
