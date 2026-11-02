import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import type { ProgressOverview } from '@/features/progress/aggregations';
import { MetricTile, MetricTileRow } from '@/features/progress/components/metric-tile';
import type { Goal } from '@/features/goals/types';
import { spacing } from '@/theme';

type OverviewSectionProps = {
  overview: ProgressOverview;
  goal: Goal | null | undefined;
};

function formatSigned(value: number, digits = 1): string {
  const abs = Math.abs(value).toFixed(digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

export function OverviewSection({ overview, goal }: OverviewSectionProps) {
  const { t } = useTranslation();
  const hasAny =
    overview.daysWithFood > 0 ||
    overview.workoutSessions > 0 ||
    overview.weightChangeKg != null ||
    overview.bodyFatChangePct != null;

  if (!hasAny) {
    return (
      <Card>
        <EmptyState title={t('progress.empty.title')} body={t('progress.empty.body')} />
      </Card>
    );
  }

  const calorieHint =
    overview.avgCalories != null && goal?.daily_calorie_target != null
      ? t('progress.overview.vsGoal', { goal: Math.round(goal.daily_calorie_target) })
      : null;
  const proteinHint =
    overview.avgProtein != null && goal?.protein_g != null
      ? t('progress.overview.vsGoalG', { goal: Math.round(goal.protein_g) })
      : null;

  return (
    <Card style={styles.card}>
      <Text variant="headingSmall">{t('progress.overview.title')}</Text>

      <View style={styles.grid}>
        <MetricTileRow>
          <MetricTile
            label={t('progress.overview.avgCalories')}
            value={overview.avgCalories != null ? `${overview.avgCalories}` : '—'}
            hint={calorieHint}
          />
          <MetricTile
            label={t('progress.overview.avgProtein')}
            value={overview.avgProtein != null ? `${overview.avgProtein} g` : '—'}
            hint={proteinHint}
          />
        </MetricTileRow>
        <MetricTileRow>
          <MetricTile
            label={t('progress.overview.sessions')}
            value={String(overview.workoutSessions)}
            hint={t('progress.overview.workoutDays', { count: overview.workoutDays })}
          />
          <MetricTile
            label={t('progress.overview.estBurn')}
            value={overview.estWorkoutKcal != null ? `${overview.estWorkoutKcal}` : '—'}
            hint={t('progress.estimatesNote')}
          />
        </MetricTileRow>
        <MetricTileRow>
          <MetricTile
            label={t('progress.overview.weightChange')}
            value={
              overview.weightChangeKg != null
                ? `${formatSigned(overview.weightChangeKg)} kg`
                : '—'
            }
            hint={
              overview.weightChangeKg == null ? t('progress.overview.needTwoPoints') : null
            }
          />
          <MetricTile
            label={t('progress.overview.bodyFatChange')}
            value={
              overview.bodyFatChangePct != null
                ? `${formatSigned(overview.bodyFatChangePct)} pp`
                : '—'
            }
            hint={
              overview.bodyFatChangePct == null ? t('progress.overview.needTwoPoints') : null
            }
          />
        </MetricTileRow>
      </View>

      {overview.goalAdherencePct != null ? (
        <View style={styles.adherence}>
          <Text variant="label" tone="secondary">
            {t('progress.overview.adherence')}
          </Text>
          <Text variant="headingLarge">{overview.goalAdherencePct}%</Text>
          <Text variant="caption" tone="muted">
            {t('progress.overview.adherenceHint', {
              onTarget: overview.daysOnTarget,
              days: overview.completedFoodDays,
            })}
          </Text>
        </View>
      ) : goal?.daily_calorie_target != null ? (
        <Text variant="caption" tone="muted">
          {t('progress.overview.adherenceUnavailable')}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[3],
  },
  grid: {
    gap: spacing[2],
  },
  adherence: {
    gap: spacing[1],
    paddingTop: spacing[1],
  },
});
