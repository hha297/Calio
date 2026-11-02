import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { BarChart } from '@/features/diary/components/charts/bar-chart';
import type { WorkoutTrendSummary } from '@/features/progress/aggregations';
import { StatRow } from '@/features/progress/components/metric-tile';
import { spacing } from '@/theme';

type WorkoutProgressSectionProps = {
  summary: WorkoutTrendSummary;
};

export function WorkoutProgressSection({ summary }: WorkoutProgressSectionProps) {
  const { t } = useTranslation();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="headingSmall">{t('progress.workouts.title')}</Text>
        <Text variant="caption" tone="secondary">
          {t('progress.estimatesNote')}
        </Text>
      </View>

      <View style={styles.stats}>
        <StatRow label={t('progress.workouts.sessions')} value={String(summary.sessions)} />
        <StatRow
          label={t('progress.workouts.frequency')}
          value={
            summary.frequencyPerWeek != null
              ? t('progress.workouts.perWeek', { value: summary.frequencyPerWeek })
              : '—'
          }
        />
        <StatRow
          label={t('progress.workouts.estBurn')}
          value={summary.estBurnKcal != null ? `${summary.estBurnKcal} kcal` : '—'}
        />
        <StatRow
          label={t('progress.workouts.duration')}
          value={t('diary.workout.minutes', { value: summary.totalMinutes })}
        />
      </View>

      <View style={styles.chartBlock}>
        <Text variant="label" tone="secondary">
          {t('progress.workouts.sessionTrend')}
        </Text>
        <BarChart
          items={summary.sessionBars}
          height={148}
          emptyLabel={t('progress.workouts.noData')}
        />
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
  stats: {
    gap: spacing[2],
  },
  chartBlock: {
    gap: spacing[2],
  },
});
