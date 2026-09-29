import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { SelectionCard } from '@/features/setup/selection-card';
import { SetupShell } from '@/features/setup/setup-shell';
import { useSetup } from '@/features/setup/setup-provider';
import type { GoalType } from '@/features/setup/calculations';

const OPTIONS: { value: GoalType; label: string; description: string }[] = [
  {
    value: 'lose_weight',
    label: 'Lose weight / cut',
    description: 'Create a calorie deficit while keeping protein high.',
  },
  {
    value: 'maintain_weight',
    label: 'Maintain weight',
    description: 'Hold your current weight with balanced intake.',
  },
  {
    value: 'gain_weight',
    label: 'Gain weight / bulk',
    description: 'Build with a controlled surplus.',
  },
];

export function GoalStep() {
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const [goalType, setGoalType] = useState<GoalType | null>(answers.goalType);
  const [touched, setTouched] = useState(false);
  const showError = touched && !goalType;

  const canContinue = Boolean(goalType);

  return (
    <SetupShell
      title="What would you like to achieve?"
      subtitle="Pick the primary goal for your Calio plan. You can change this later."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={progress.index > 0 ? () => void goBack() : undefined}
      continueDisabled={!canContinue || saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (!goalType) return;
        void goNext({ goalType });
      }}
    >
      <View className="gap-3">
        {OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={goalType === option.value}
            onPress={() => setGoalType(option.value)}
          />
        ))}
        {showError ? (
          <Text variant="caption" tone="error">
            Choose a goal to continue
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
