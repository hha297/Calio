import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import {
  estimatedWeeksToGoal,
  isTargetCompatibleWithGoal,
  isTargetWithinSafeRange,
  suggestedPaceForGoal,
  weeklyChangeForPace,
  type Pace,
} from '@/features/setup/calculations';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';
import { formatWeight, kgToLb, lbToKg } from '@/features/setup/units';
import { useThemeColors } from '@/theme/theme-provider';

const PACES: { value: Pace; label: string; kg: number }[] = [
  { value: 'slow', label: 'Slow', kg: 0.25 },
  { value: 'moderate', label: 'Moderate', kg: 0.5 },
  { value: 'fast', label: 'Fast', kg: 0.75 },
];

function goalDirectionHint(goalType: string | null | undefined): string {
  if (goalType === 'lose_weight') return 'lower than your current weight';
  if (goalType === 'gain_weight') return 'higher than your current weight';
  return 'close to your current weight';
}

export function TargetStep() {
  const colors = useThemeColors();
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const units = answers.units;
  const currentKg = answers.weightKg ?? 0;
  const suggested = suggestedPaceForGoal(answers.goalType ?? 'lose_weight');

  // Empty by default so the user types their own target (no pre-filled current kg).
  const [targetDisplay, setTargetDisplay] = useState(() => {
    if (answers.targetWeightKg == null) return '';
    const kg = answers.targetWeightKg;
    return units === 'metric'
      ? String(Math.round(kg * 10) / 10)
      : String(Math.round(kgToLb(kg) * 10) / 10);
  });
  const [pace, setPace] = useState<Pace | null>(answers.pace ?? suggested);
  const [touched, setTouched] = useState(false);

  const targetKg = useMemo(() => {
    const trimmed = targetDisplay.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return null;
    return units === 'metric' ? n : lbToKg(n);
  }, [targetDisplay, units]);

  const weekly = answers.goalType && pace ? weeklyChangeForPace(answers.goalType, pace) : 0;
  const weeks =
    targetKg != null && weekly !== 0 ? estimatedWeeksToGoal(currentKg, targetKg, weekly) : null;

  const compatible =
    targetKg == null ||
    answers.goalType == null ||
    isTargetCompatibleWithGoal(answers.goalType, currentKg, targetKg);
  const safe = targetKg == null || isTargetWithinSafeRange(currentKg, targetKg);

  // Hard requirements only — direction mismatch is a warning, not a blocker.
  const canContinue =
    targetKg != null &&
    pace != null &&
    targetKg >= 40 &&
    targetKg <= 250;

  const directionWarning =
    targetKg != null && answers.goalType != null && !compatible
      ? answers.goalType === 'lose_weight'
        ? `You chose cut, but ${formatWeight(targetKg, units)} is above your current weight (${formatWeight(currentKg, units)}). Double-check that isn’t a typo — you can still continue if it’s intentional.`
        : answers.goalType === 'gain_weight'
          ? `You chose bulk, but ${formatWeight(targetKg, units)} is below your current weight (${formatWeight(currentKg, units)}). Double-check that isn’t a typo — you can still continue if it’s intentional.`
          : `That target isn’t close to your current weight. For maintain, a target ${goalDirectionHint(answers.goalType)} usually fits better.`
      : null;

  const rangeWarning =
    targetKg != null && !safe && compatible
      ? 'That’s a large jump from your current weight. You can still continue — consider a nearer target if this was accidental.'
      : null;

  return (
    <SetupShell
      title="Target weight & pace"
      subtitle={`Current weight: ${formatWeight(currentKg, units)}. Enter the weight you want to aim for.`}
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (!canContinue || targetKg == null || !pace) return;
        void goNext({ targetWeightKg: targetKg, pace });
      }}
    >
      <View className="gap-4">
        <Input
          label={units === 'metric' ? 'Target weight (kg)' : 'Target weight (lb)'}
          value={targetDisplay}
          onChangeText={setTargetDisplay}
          keyboardType="decimal-pad"
          placeholder={units === 'metric' ? 'Enter target in kg' : 'Enter target in lb'}
          error={
            touched && targetDisplay.trim() === ''
              ? 'Enter a target weight'
              : touched && targetKg != null && (targetKg < 40 || targetKg > 250)
                ? 'Enter a realistic target weight'
                : undefined
          }
        />

        {directionWarning ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.secondaryMuted }}
          >
            <Text variant="bodySmall" style={{ color: colors.secondaryPressed }}>
              {directionWarning}
            </Text>
          </View>
        ) : null}

        {rangeWarning ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.secondaryMuted }}
          >
            <Text variant="bodySmall" style={{ color: colors.secondaryPressed }}>
              {rangeWarning}
            </Text>
          </View>
        ) : null}

        <Text variant="label" tone="secondary">
          Pace {suggested ? `(suggested: ${suggested})` : ''}
        </Text>
        {PACES.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={`About ${option.kg} kg (${(option.kg * 2.2).toFixed(1)} lb) per week`}
            selected={pace === option.value}
            onPress={() => setPace(option.value)}
          />
        ))}

        {weeks != null && compatible ? (
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: colors.primaryMuted }}>
            <Text variant="bodySmall" tone="muted">
              Estimated timeline: about {weeks} week{weeks === 1 ? '' : 's'} (rough guide only).
            </Text>
          </View>
        ) : null}

        {touched && !canContinue ? (
          <Text variant="caption" tone="error">
            Enter a target weight and choose a pace to continue
          </Text>
        ) : null}
        {error ? (
          <Text variant="caption" tone="error">
            {error}
          </Text>
        ) : null}
      </View>
    </SetupShell>
  );
}
