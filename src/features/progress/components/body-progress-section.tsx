import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { LineChart } from '@/features/diary/components/charts/line-chart';
import { buildBodyMetricSeries } from '@/features/progress/aggregations';
import { StatRow } from '@/features/progress/components/metric-tile';
import { BODY_METRIC_KEYS, type BodyMetricKey } from '@/features/progress/types';
import type { BodyMeasurement } from '@/features/measurements/hooks';
import type { Profile } from '@/features/goals/types';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type BodyProgressSectionProps = {
  measurements: BodyMeasurement[];
  startKey: string;
  endKey: string;
  locale: string;
  profile: Profile | null | undefined;
};

function formatSigned(value: number, digits = 1): string {
  const abs = Math.abs(value).toFixed(digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

function unitFor(metric: BodyMetricKey): string {
  if (metric === 'body_fat_percent') return '%';
  if (metric.endsWith('_kg')) return 'kg';
  return 'cm';
}

export function BodyProgressSection({
  measurements,
  startKey,
  endKey,
  locale,
  profile,
}: BodyProgressSectionProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [metric, setMetric] = useState<BodyMetricKey>('weight_kg');

  const availableMetrics = useMemo(() => {
    return BODY_METRIC_KEYS.filter((key) => {
      const series = buildBodyMetricSeries({
        measurements,
        startKey,
        endKey,
        metric: key,
        profile: profile ? { sex: profile.sex, heightCm: profile.height_cm } : null,
      });
      return series.points.length > 0;
    });
  }, [measurements, startKey, endKey, profile]);

  const activeMetric = availableMetrics.includes(metric)
    ? metric
    : (availableMetrics[0] ?? 'weight_kg');

  const series = useMemo(
    () =>
      buildBodyMetricSeries({
        measurements,
        startKey,
        endKey,
        metric: activeMetric,
        profile: profile ? { sex: profile.sex, heightCm: profile.height_cm } : null,
      }),
    [measurements, startKey, endKey, activeMetric, profile],
  );

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }),
    [locale],
  );

  if (availableMetrics.length === 0) {
    return (
      <Card style={styles.card}>
        <Text variant="headingSmall">{t('progress.body.title')}</Text>
        <EmptyState title={t('progress.body.emptyTitle')} body={t('progress.body.emptyBody')} />
      </Card>
    );
  }

  const labels = series.points.map((p) => dateFmt.format(new Date(`${p.measuredOn}T12:00:00`)));
  const values = series.points.map((p) => p.value);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="headingSmall">{t('progress.body.title')}</Text>
        <Text variant="caption" tone="secondary">
          {t('progress.body.subtitle')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.metricChips}
      >
        {availableMetrics.map((key) => {
          const selected = key === activeMetric;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setMetric(key)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.surfaceMuted,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                variant="caption"
                numberOfLines={1}
                style={{
                  color: selected ? colors.textOnPrimary : colors.textSecondary,
                }}
              >
                {t(`progress.body.metrics.${key}`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <LineChart
        labels={labels}
        height={168}
        emptyLabel={t('progress.body.noData')}
        series={[
          {
            key: t(`progress.body.metrics.${activeMetric}`),
            color: colors.primary,
            values,
          },
        ]}
      />

      <View style={styles.stats}>
        <StatRow
          label={t('progress.body.change')}
          value={
            series.change != null
              ? `${formatSigned(series.change)} ${unitFor(activeMetric)}`
              : '—'
          }
        />
        <StatRow
          label={t('progress.body.latest')}
          value={
            series.points.length
              ? `${series.points[series.points.length - 1]!.value} ${unitFor(activeMetric)}`
              : '—'
          }
        />
      </View>

      <View style={styles.notes}>
        {series.hasEstimated ? (
          <Text variant="caption" tone="muted">
            {t('progress.body.estimatedNote')}
          </Text>
        ) : null}
        {series.hasMeasured ? (
          <Text variant="caption" tone="muted">
            {t('progress.body.measuredNote')}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[4],
  },
  header: {
    gap: spacing[1],
  },
  metricChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingRight: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 160,
  },
  stats: {
    gap: spacing[2],
  },
  notes: {
    gap: spacing[1],
  },
});
