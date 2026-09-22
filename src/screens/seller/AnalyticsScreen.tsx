import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { C, ScreenHeader } from '@/components/ui';
import { getPartCategoryInfo } from '@/data/parts';
import { toProductCategory } from '@/lib/store-api';
import { getMyAnalytics, type SellerAnalytics } from '@/lib/seller-api';

// /my-store/analytics only accepts these two — confirmed against the live
// OpenAPI enum (the mock UI had a third "Год" tab that has no backing value).
const PERIODS: { id: string; label: string }[] = [
  { id: 'WEEK', label: 'Неделя' },
  { id: 'MONTH', label: 'Месяц' },
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
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metricCard: {
    flex: 1,
    minWidth: '46%',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 12,
    marginTop: 12,
  },
  categoryRow: {
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
  },
  categoryStats: {
    fontSize: 12,
    color: C.textSecondary,
  },
  emptyText: {
    fontSize: 13,
    color: C.textTertiary,
  },
});

function money(n: number) {
  return `${n.toLocaleString('ru-RU')} с`;
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('WEEK');
  const [data, setData] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!cancelled) setLoading(true);
      try {
        const res = await getMyAnalytics(period);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Аналитика" />

      <View style={styles.periodSelector}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.periodButton, period === p.id && styles.periodButtonActive]}
            onPress={() => setPeriod(p.id)}
          >
            <Text style={[styles.periodText, period === p.id && styles.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : !data ? (
        <View style={styles.centerFill}>
          <Text style={styles.emptyText}>Не удалось загрузить статистику</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Получено запросов</Text>
                <Text style={styles.metricValue}>{data.requestsReceived}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Ответили</Text>
                <Text style={styles.metricValue}>{data.requestsAnswered}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>% ответов</Text>
                <Text style={styles.metricValue}>{Math.round(data.responseRate * 100)}%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Среднее время ответа</Text>
                <Text style={styles.metricValue}>{data.avgResponseMinutes}м</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Упущено запросов</Text>
                <Text style={styles.metricValue}>{data.requestsMissed}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Упущенная сумма</Text>
                <Text style={styles.metricValue}>{money(data.missedBudgetSum)}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Сделок закрыто</Text>
                <Text style={styles.metricValue}>{data.dealsClosed}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Спрос по категориям</Text>
            {data.topDemandedCategories.length === 0 ? (
              <Text style={styles.emptyText}>Пока нет данных</Text>
            ) : (
              data.topDemandedCategories.map((cat) => {
                const info = getPartCategoryInfo(toProductCategory(cat.category as never));
                return (
                  <View key={cat.category} style={styles.categoryRow}>
                    <Text style={styles.categoryName}>{info?.label ?? cat.category}</Text>
                    <Text style={styles.categoryStats}>
                      {cat.answered}/{cat.requests} отвечено
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
