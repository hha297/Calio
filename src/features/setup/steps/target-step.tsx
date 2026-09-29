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

export function TargetStep() {
  const colors = useThemeColors();
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const units = answers.units;
  const currentKg = answers.weightKg ?? 0;
  const suggested = suggestedPaceForGoal(answers.goalType ?? 'lose_weight');

  const [targetDisplay, setTargetDisplay] = useState(() => {
    const kg = answers.targetWeightKg ?? currentKg;
    return units === 'metric'
      ? String(Math.round(kg * 10) / 10)
      : String(Math.round(kgToLb(kg) * 10) / 10);
  });
  const [pace, setPace] = useState<Pace | null>(answers.pace ?? suggested);
  const [touched, setTouched] = useState(false);

  const targetKg = useMemo(() => {
    const n = Number(targetDisplay);
    if (!Number.isFinite(n)) return null;
    return units === 'metric' ? n : lbToKg(n);
  }, [targetDisplay, units]);

  const weekly = answers.goalType && pace ? weeklyChangeForPace(answers.goalType, pace) : 0;
  const weeks =
    targetKg != null && weekly !== 0 ? estimatedWeeksToGoal(currentKg, targetKg, weekly) : null;

  const compatible =
    targetKg != null &&
    answers.goalType != null &&
    isTargetCompatibleWithGoal(answers.goalType, currentKg, targetKg);
  const safe = targetKg != null && isTargetWithinSafeRange(currentKg, targetKg);
  const valid = targetKg != null && pace != null && compatible && safe;

  return (
    <SetupShell
      title="Target weight & pace"
      subtitle={`Current weight: ${formatWeight(currentKg, units)}. Timelines are estimates.`}
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (!valid || targetKg == null || !pace) return;
        void goNext({ targetWeightKg: targetKg, pace });
      }}
    >
      <View className="gap-4">
        <Input
          label={units === 'metric' ? 'Target weight (kg)' : 'Target weight (lb)'}
          value={targetDisplay}
          onChangeText={setTargetDisplay}
          keyboardType="decimal-pad"
          placeholder={units === 'metric' ? 'e.g. 65' : 'e.g. 143'}
          error={
            touched && targetKg != null && !compatible
              ? 'Target should match your goal (lower to cut, higher to bulk)'
              : touched && targetKg != null && !safe
                ? 'That change looks extreme — pick a closer target'
                : undefined
          }
        />

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

        {weeks != null ? (
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: colors.primaryMuted }}>
            <Text variant="bodySmall" tone="secondary">
              Estimated timeline: about {weeks} week{weeks === 1 ? '' : 's'} (rough guide only).
            </Text>
          </View>
        ) : null}

        {touched && !valid ? (
          <Text variant="caption" tone="error">
            Fix the target and pace to continue
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
