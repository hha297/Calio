import { useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import type { ExerciseType, Intensity } from '@/features/setup/calculations';
import { SelectionCard } from '@/features/setup/selection-card';
import { useSetup } from '@/features/setup/setup-provider';
import { SetupShell } from '@/features/setup/setup-shell';

const SESSION_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '1', label: '1 session / week' },
  { value: '2', label: '2 sessions / week' },
  { value: '3', label: '3 sessions / week' },
  { value: '4', label: '4 sessions / week' },
  { value: '5', label: '5 sessions / week' },
  { value: '6', label: '6+ sessions / week' },
];

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
  const [typeOther, setTypeOther] = useState(answers.exerciseTypeOther ?? '');
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
          exerciseTypeOther:
            !none && type === 'other' ? typeOther.trim() || null : null,
          sessionMinutes: none ? 0 : minutesNum,
          intensity: none ? null : intensity,
        });
      }}
    >
      <View className="gap-4">
        <Select
          label="Sessions per week"
          value={sessions == null ? null : String(sessions)}
          options={SESSION_OPTIONS}
          placeholder="Select how often you train"
          onChange={(value) => {
            const count = Number(value);
            setSessions(count);
            if (count === 0) {
              setType('none');
            } else if (type === 'none') {
              setType('mixed');
            }
          }}
          error={touched && sessions == null ? 'Choose sessions per week' : undefined}
        />

        {!noExercise ? (
          <>
            <View className="gap-2">
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
            </View>

            {type === 'other' ? (
              <Input
                label="Describe your activity (optional)"
                value={typeOther}
                onChangeText={setTypeOther}
                placeholder="e.g. climbing, dance, martial arts"
                autoCapitalize="sentences"
              />
            ) : null}

            <Input
              label="Average session length (minutes)"
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="number-pad"
              placeholder="e.g. 45"
            />

            <View className="gap-2">
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
            </View>
          </>
        ) : (
          <Text variant="bodySmall" tone="muted">
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
