import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { estimatePlan } from '@/features/setup/calculations';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';
import { setupCardShadow } from '@/features/setup/setup-shadows';
import { requiresManualCalories } from '@/features/setup/types';
import { formatHeight, formatWeight } from '@/features/setup/units';
import { brand } from '@/theme/themes';
import { useThemeColors } from '@/theme/theme-provider';

function StatTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
      ]}
    >
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="headingSmall" style={{ color: colors.textPrimary }}>
        {value}
        {unit ? (
          <Text variant="caption" tone="muted">
            {' '}
            {unit}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

/**
 * Final review — system estimates are read-only.
 * No recalculate / edit-earlier (use Back). Daily calories & macros locked.
 */
export function SummaryStep() {
  const colors = useThemeColors();
  const { answers, progress, goBack, finish, completing, error } = useSetup();
  const [busy, setBusy] = useState(false);

  const plan = useMemo(() => {
    if (
      !answers.goalType ||
      !answers.sex ||
      answers.ageYears == null ||
      answers.heightCm == null ||
      answers.weightKg == null ||
      !answers.activityLevel
    ) {
      return null;
    }
    const sessions = answers.sessionsPerWeek ?? 0;
    return estimatePlan({
      goalType: answers.goalType,
      sex: answers.sex,
      ageYears: answers.ageYears,
      heightCm: answers.heightCm,
      weightKg: answers.weightKg,
      bodyFatPercent: answers.bodyFatPercent,
      activityLevel: answers.activityLevel,
      averageDailySteps: answers.averageDailySteps,
      sessionsPerWeek: sessions,
      exerciseType: sessions === 0 ? 'none' : (answers.exerciseType ?? 'mixed'),
      sessionMinutes: answers.sessionMinutes ?? 0,
      intensity: answers.intensity ?? 'moderate',
      targetWeightKg:
        answers.goalType === 'maintain_weight'
          ? answers.weightKg
          : (answers.targetWeightKg ?? answers.weightKg),
      pace: answers.goalType === 'maintain_weight' ? null : answers.pace,
      requiresManualCalories: requiresManualCalories(answers),
      manualDailyCalories: answers.manualDailyCalories,
    });
  }, [answers]);

  const calories = plan?.dailyCalorieTarget ?? 0;
  const protein = plan?.macros.protein_g ?? 0;
  const carbs = plan?.macros.carbs_g ?? 0;
  const fat = plan?.macros.fat_g ?? 0;

  const goalLabel =
    answers.goalType === 'lose_weight'
      ? 'Lose weight / cut'
      : answers.goalType === 'gain_weight'
        ? 'Gain weight / bulk'
        : 'Maintain weight';

  const exerciseLabel =
    answers.sessionsPerWeek === 0 || answers.exerciseType === 'none'
      ? 'No structured sessions'
      : answers.exerciseType === 'other' && answers.exerciseTypeOther
        ? answers.exerciseTypeOther
        : answers.exerciseType
          ? answers.exerciseType.replace('_', ' ')
          : '—';

  return (
    <SetupShell
      title="Your plan"
      subtitle="Here’s your starting estimate from the answers you gave. Use Back if something looks off."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueLabel="Start using Calio"
      continueDisabled={completing || busy || !plan || calories < 1200}
      continueLoading={completing || busy}
      onContinue={() => {
        setBusy(true);
        void finish()
          .catch(() => undefined)
          .finally(() => setBusy(false));
      }}
    >
      <View style={styles.stack}>
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
            },
            setupCardShadow(brand.darkBackground),
          ]}
        >
          <Text variant="label" tone="muted">
            Profile & goal
          </Text>
          <Text variant="bodyStrong" style={{ color: colors.textPrimary }}>
            {goalLabel}
            {answers.ageYears != null ? ` · age ${answers.ageYears}` : ''}
          </Text>
          <Text variant="bodySmall" tone="muted">
            {answers.heightCm != null ? formatHeight(answers.heightCm, answers.units) : '—'}
            {' · '}
            {answers.weightKg != null ? formatWeight(answers.weightKg, answers.units) : '—'}
            {answers.targetWeightKg != null && answers.goalType !== 'maintain_weight'
              ? ` → ${formatWeight(answers.targetWeightKg, answers.units)}`
              : ''}
          </Text>
          <Text variant="bodySmall" tone="muted">
            Exercise: {exerciseLabel}
            {answers.sessionsPerWeek != null && answers.sessionsPerWeek > 0
              ? ` · ${answers.sessionsPerWeek}/week`
              : ''}
          </Text>
        </View>

        {plan?.tdee != null ? (
          <Text variant="bodySmall" tone="muted">
            Estimated maintenance: {plan.tdee} kcal/day
            {plan.bmr != null ? ` (BMR ~${plan.bmr})` : ''}
          </Text>
        ) : null}

        <View style={styles.statsGrid}>
          <View style={styles.statWide}>
            <StatTile label="Daily calories" value={calories} unit="kcal" />
          </View>
          <StatTile label="Protein" value={protein} unit="g" />
          <StatTile label="Carbs" value={carbs} unit="g" />
          <StatTile label="Fat" value={fat} unit="g" />
        </View>

        {plan && plan.weeklyChangeKg !== 0 ? (
          <Text variant="bodySmall" tone="muted">
            Weekly change: {plan.weeklyChangeKg > 0 ? '+' : ''}
            {plan.weeklyChangeKg} kg
            {plan.estimatedWeeks != null ? ` · ~${plan.estimatedWeeks} weeks (estimate)` : ''}
          </Text>
        ) : null}

        {plan?.explanation ? (
          <Text variant="caption" tone="muted">
            {plan.explanation}
          </Text>
        ) : null}

        <Text variant="caption" tone="muted">
          Targets are locked to Calio’s estimate for a consistent start. You can adjust goals later
          from Account once you’re in the app.
        </Text>

        {error ? (
          <View
            style={[styles.errorBox, { backgroundColor: colors.errorMuted }]}
          >
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          </View>
        ) : null}
      </View>
    </SetupShell>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statWide: {
    width: '100%',
  },
  tile: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 96,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  errorBox: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
