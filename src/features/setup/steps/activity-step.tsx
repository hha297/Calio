import { useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { ActivityLevel } from '@/features/setup/calculations';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';

const OPTIONS: { value: ActivityLevel; label: string; description: string }[] = [
  {
    value: 'sedentary',
    label: 'Mostly sitting',
    description: 'Desk work, little walking outside workouts.',
  },
  {
    value: 'light',
    label: 'Light activity',
    description: 'Occasional walking or light chores.',
  },
  {
    value: 'moderate',
    label: 'On your feet often',
    description: 'Frequent walking or standing through the day.',
  },
  {
    value: 'demanding',
    label: 'Physically demanding work',
    description: 'Manual labor or being very active most of the day.',
  },
];

export function ActivityStep() {
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const [level, setLevel] = useState<ActivityLevel | null>(answers.activityLevel);
  const [steps, setSteps] = useState(
    answers.averageDailySteps != null ? String(answers.averageDailySteps) : '',
  );
  const [touched, setTouched] = useState(false);

  return (
    <SetupShell
      title="Daily activity"
      subtitle="Outside of workouts — how active is a typical day?"
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (!level) return;
        const parsed = steps.trim() === '' ? null : Number(steps);
        void goNext({
          activityLevel: level,
          averageDailySteps: Number.isFinite(parsed as number) ? (parsed as number) : null,
        });
      }}
    >
      <View className="gap-3">
        {OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={level === option.value}
            onPress={() => setLevel(option.value)}
          />
        ))}
        <Input
          label="Average daily steps (optional)"
          value={steps}
          onChangeText={setSteps}
          keyboardType="number-pad"
          placeholder="e.g. 8000"
        />
        {touched && !level ? (
          <Text variant="caption" tone="error">
            Choose an activity level
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
