import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { estimatePlan } from '@/features/setup/calculations';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';
import { requiresManualCalories } from '@/features/setup/types';
import { formatHeight, formatWeight } from '@/features/setup/units';
import { useThemeColors } from '@/theme/theme-provider';

export function SummaryStep() {
  const colors = useThemeColors();
  const { answers, progress, goBack, goToStep, finish, completing, error, patchAnswers } =
    useSetup();
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

  const calories = answers.overrideCalories ?? plan?.dailyCalorieTarget ?? 0;
  const protein = answers.overrideProteinG ?? plan?.macros.protein_g ?? 0;
  const carbs = answers.overrideCarbsG ?? plan?.macros.carbs_g ?? 0;
  const fat = answers.overrideFatG ?? plan?.macros.fat_g ?? 0;

  const [calStr, setCalStr] = useState(String(calories || ''));
  const [pStr, setPStr] = useState(String(protein || ''));
  const [cStr, setCStr] = useState(String(carbs || ''));
  const [fStr, setFStr] = useState(String(fat || ''));

  function applyOverridesFromFields() {
    const c = Number(calStr);
    const p = Number(pStr);
    const cb = Number(cStr);
    const f = Number(fStr);
    patchAnswers({
      overrideCalories: Number.isFinite(c) && c >= 1200 ? c : answers.overrideCalories,
      overrideProteinG: Number.isFinite(p) && p > 0 ? p : answers.overrideProteinG,
      overrideCarbsG: Number.isFinite(cb) && cb >= 0 ? cb : answers.overrideCarbsG,
      overrideFatG: Number.isFinite(f) && f > 0 ? f : answers.overrideFatG,
    });
  }

  function recalculate() {
    patchAnswers({
      overrideCalories: null,
      overrideProteinG: null,
      overrideCarbsG: null,
      overrideFatG: null,
    });
    if (plan) {
      setCalStr(String(plan.dailyCalorieTarget));
      setPStr(String(plan.macros.protein_g));
      setCStr(String(plan.macros.carbs_g));
      setFStr(String(plan.macros.fat_g));
    }
  }

  const goalLabel =
    answers.goalType === 'lose_weight'
      ? 'Lose weight / cut'
      : answers.goalType === 'gain_weight'
        ? 'Gain weight / bulk'
        : 'Maintain weight';

  return (
    <SetupShell
      title="Your plan"
      subtitle="Starting estimates — edit anything before you begin."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueLabel="Start using Calio"
      continueDisabled={completing || busy || !plan || calories < 1200}
      continueLoading={completing || busy}
      onContinue={() => {
        applyOverridesFromFields();
        setBusy(true);
        void finish()
          .catch(() => undefined)
          .finally(() => setBusy(false));
      }}
    >
      <View className="gap-4">
        <View className="gap-1">
          <Text variant="label" tone="secondary">
            Profile & goal
          </Text>
          <Text variant="body">
            {goalLabel}
            {answers.ageYears != null ? ` · age ${answers.ageYears}` : ''}
          </Text>
          <Text variant="bodySmall" tone="secondary">
            {answers.heightCm != null ? formatHeight(answers.heightCm, answers.units) : '—'}
            {' · '}
            {answers.weightKg != null ? formatWeight(answers.weightKg, answers.units) : '—'}
            {answers.targetWeightKg != null && answers.goalType !== 'maintain_weight'
              ? ` → ${formatWeight(answers.targetWeightKg, answers.units)}`
              : ''}
          </Text>
          <Pressable onPress={() => void goToStep('goal')} hitSlop={8}>
            <Text variant="bodyStrong" style={{ color: colors.primary }}>
              Edit earlier answers
            </Text>
          </Pressable>
        </View>

        {plan?.tdee != null ? (
          <Text variant="bodySmall" tone="secondary">
            Estimated maintenance: {plan.tdee} kcal/day
            {plan.bmr != null ? ` (BMR ~${plan.bmr})` : ''}
          </Text>
        ) : null}

        <Input
          label="Daily calorie target"
          value={calStr}
          onChangeText={setCalStr}
          onBlur={applyOverridesFromFields}
          keyboardType="number-pad"
        />
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              label="Protein (g)"
              value={pStr}
              onChangeText={setPStr}
              onBlur={applyOverridesFromFields}
              keyboardType="number-pad"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Carbs (g)"
              value={cStr}
              onChangeText={setCStr}
              onBlur={applyOverridesFromFields}
              keyboardType="number-pad"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Fat (g)"
              value={fStr}
              onChangeText={setFStr}
              onBlur={applyOverridesFromFields}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {plan && plan.weeklyChangeKg !== 0 ? (
          <Text variant="bodySmall" tone="secondary">
            Weekly change: {plan.weeklyChangeKg > 0 ? '+' : ''}
            {plan.weeklyChangeKg} kg
            {plan.estimatedWeeks != null ? ` · ~${plan.estimatedWeeks} weeks (estimate)` : ''}
          </Text>
        ) : null}

        <Text variant="caption" tone="muted">
          {plan?.explanation}
        </Text>

        <Pressable onPress={recalculate} hitSlop={8}>
          <Text variant="bodyStrong" style={{ color: colors.primary }}>
            Recalculate from answers
          </Text>
        </Pressable>

        {error ? (
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: colors.errorMuted }}>
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          </View>
        ) : null}
      </View>
    </SetupShell>
  );
}
