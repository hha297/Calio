import { useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';

export function SafetyStep() {
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const [value, setValue] = useState<boolean | null>(answers.isPregnantOrBreastfeeding);
  const [manualCalories, setManualCalories] = useState(
    answers.manualDailyCalories != null ? String(answers.manualDailyCalories) : '',
  );
  const [touched, setTouched] = useState(false);

  const needsManual = value === true;
  const parsedManual = Number(manualCalories);
  const manualOk = !needsManual || (Number.isFinite(parsedManual) && parsedManual >= 1200);
  const showError = touched && (value === null || !manualOk);

  return (
    <SetupShell
      title="A quick health check"
      subtitle="We use this to avoid auto-assigning a standard adult cutting or bulking plan when it may not fit."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (value === null || !manualOk) return;
        void goNext({
          isPregnantOrBreastfeeding: value,
          manualDailyCalories: needsManual ? parsedManual : answers.manualDailyCalories,
        });
      }}
    >
      <View className="gap-3">
        <Text variant="label" tone="secondary">
          Are you pregnant or breastfeeding?
        </Text>
        <SelectionCard
          label="No"
          selected={value === false}
          onPress={() => setValue(false)}
        />
        <SelectionCard
          label="Yes"
          description="We’ll ask for a manual calorie target and skip aggressive auto plans."
          selected={value === true}
          onPress={() => setValue(true)}
        />

        {needsManual ? (
          <Input
            label="Daily calorie target"
            value={manualCalories}
            onChangeText={setManualCalories}
            keyboardType="number-pad"
            placeholder="e.g. 2000"
            error={
              touched && !manualOk ? 'Enter at least 1200 calories (or ask your clinician)' : undefined
            }
          />
        ) : null}

        {showError && value === null ? (
          <Text variant="caption" tone="error">
            Choose an option to continue
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
