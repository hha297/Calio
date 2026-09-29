import { useState } from 'react';
import { View } from 'react-native';

import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';
import { useThemeColors } from '@/theme/theme-provider';

const PATTERNS = [
  { value: 'none', label: 'No specific pattern' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'high_protein', label: 'High protein focus' },
];

const MEAL_OPTIONS = [
  { value: '1', label: '1 meal / day' },
  { value: '2', label: '2 meals / day' },
  { value: '3', label: '3 meals / day' },
  { value: '4', label: '4 meals / day' },
  { value: '5', label: '5 meals / day' },
  { value: '6', label: '6+ meals / day' },
];

/**
 * Optional preferences. Allergies / “foods to avoid” are deferred until food
 * filtering exists in the diary — we don’t collect data we can’t use yet.
 */
export function DietaryStep() {
  const colors = useThemeColors();
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const [pattern, setPattern] = useState<string | null>(answers.dietaryPattern);
  const [meals, setMeals] = useState(
    answers.mealsPerDay != null ? String(Math.min(6, answers.mealsPerDay)) : null,
  );

  return (
    <SetupShell
      title="Dietary preferences"
      subtitle="Optional — skip anytime. We only ask what Calio can use today."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueLabel="Continue"
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        const mealsNum = meals == null ? null : Number(meals);
        void goNext({
          dietaryPattern: pattern === 'none' ? null : pattern,
          mealsPerDay: Number.isFinite(mealsNum as number) ? (mealsNum as number) : null,
        });
      }}
      footer={
        <Text
          variant="bodyStrong"
          style={{ color: colors.primary }}
          onPress={() => {
            void goNext({ dietaryPattern: null, mealsPerDay: null });
          }}
        >
          Skip for now
        </Text>
      }
    >
      <View className="gap-3">
        <Text variant="label" tone="secondary">
          Eating pattern (optional)
        </Text>
        {PATTERNS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={pattern === option.value}
            onPress={() => setPattern(option.value)}
          />
        ))}
        <Select
          label="Typical meals per day (optional)"
          value={meals}
          options={MEAL_OPTIONS}
          placeholder="Select if you want"
          onChange={setMeals}
        />
        <Text variant="caption" tone="muted">
          Allergy and “foods to avoid” lists will arrive when food filtering ships — not collected
          here.
        </Text>
        {error ? (
          <Text variant="caption" tone="error">
            {error}
          </Text>
        ) : null}
      </View>
    </SetupShell>
  );
}
