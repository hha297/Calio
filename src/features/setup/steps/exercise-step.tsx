import { useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { ExerciseType, Intensity } from '@/features/setup/calculations';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';

const SESSION_OPTIONS = [0, 1, 2, 3, 4, 5, 6];

const TYPES: { value: ExerciseType; label: string }[] = [
  { value: 'strength', label: 'Strength training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'sports', label: 'Sports' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'other', label: 'Other' },
];

const INTENSITIES: { value: Intensity; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Conversational pace' },
  { value: 'moderate', label: 'Moderate', description: 'Working but sustainable' },
  { value: 'hard', label: 'Hard', description: 'Breathing heavy, tough sets' },
];

export function ExerciseStep() {
  const { answers, progress, goNext, goBack, saving, error } = useSetup();
  const [sessions, setSessions] = useState<number | null>(answers.sessionsPerWeek);
  const [type, setType] = useState<ExerciseType | null>(
    answers.sessionsPerWeek === 0 ? 'none' : answers.exerciseType,
  );
  const [minutes, setMinutes] = useState(
    answers.sessionMinutes != null ? String(answers.sessionMinutes) : '',
  );
  const [intensity, setIntensity] = useState<Intensity | null>(answers.intensity);
  const [touched, setTouched] = useState(false);

  const noExercise = sessions === 0 || type === 'none';
  const minutesNum = Number(minutes);
  const detailsOk =
    type != null &&
    Number.isFinite(minutesNum) &&
    minutesNum >= 10 &&
    intensity != null;
  const valid = sessions != null && (noExercise || detailsOk);

  return (
    <SetupShell
      title="Exercise habits"
      subtitle="We’ll add a share of workout energy on top of daily activity — not double-count steps at work."
      stepIndex={progress.index}
      stepTotal={progress.total}
      onBack={() => void goBack()}
      continueDisabled={saving}
      continueLoading={saving}
      onContinue={() => {
        setTouched(true);
        if (!valid || sessions == null) return;
        const none = sessions === 0 || type === 'none';
        void goNext({
          sessionsPerWeek: sessions,
          exerciseType: none ? 'none' : type,
          sessionMinutes: none ? 0 : minutesNum,
          intensity: none ? null : intensity,
        });
      }}
    >
      <View className="gap-4">
        <Text variant="label" tone="secondary">
          Sessions per week
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {SESSION_OPTIONS.map((count) => (
            <View key={count} style={{ width: '30%' }}>
              <SelectionCard
                label={count === 0 ? 'None' : String(count)}
                selected={sessions === count}
                onPress={() => {
                  setSessions(count);
                  if (count === 0) {
                    setType('none');
                  } else if (type === 'none') {
                    setType('mixed');
                  }
                }}
              />
            </View>
          ))}
        </View>

        {!noExercise ? (
          <>
            <Text variant="label" tone="secondary">
              Main activity type
            </Text>
            {TYPES.map((option) => (
              <SelectionCard
                key={option.value}
                label={option.label}
                selected={type === option.value}
                onPress={() => setType(option.value)}
              />
            ))}
            <Input
              label="Average session length (minutes)"
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              placeholder="e.g. 45"
            />
            <Text variant="label" tone="secondary">
              Typical intensity
            </Text>
            {INTENSITIES.map((option) => (
              <SelectionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={intensity === option.value}
                onPress={() => setIntensity(option.value)}
              />
            ))}
          </>
        ) : (
          <Text variant="bodySmall" tone="secondary">
            No problem — your plan will focus on daily activity and food.
          </Text>
        )}

        {touched && !valid ? (
          <Text variant="caption" tone="error">
            Complete the exercise details to continue
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
