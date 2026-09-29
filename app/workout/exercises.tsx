import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { useExercises } from '@/features/workout/hooks';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function ExercisePickerScreen() {
  const [term, setTerm] = useState('');
  const exercises = useExercises(term);
  const addExercise = useActiveWorkoutStore((state) => state.addExercise);

  return (
    <Screen scroll keyboard>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Exercises</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="primary">
              Done
            </Text>
          </Pressable>
        </View>
        <Input label="Search" value={term} onChangeText={setTerm} autoCapitalize="none" />
        {exercises.isLoading ? <LoadingState /> : null}
        {exercises.error ? (
          <ErrorState
            title="Catalog unavailable"
            body={
              exercises.error instanceof Error
                ? exercises.error.message
                : 'Apply the Supabase migration, then retry.'
            }
            onRetry={() => void exercises.refetch()}
          />
        ) : null}
        {(exercises.data ?? []).map((exercise) => (
          <Pressable
            key={exercise.id}
            className="border-b border-border py-3"
            onPress={() => {
              addExercise({
                exerciseId: exercise.id,
                name: exercise.name,
                exerciseType: exercise.exercise_type,
                metValue: exercise.met_value,
              });
              router.back();
            }}
          >
            <Text variant="bodyStrong">{exercise.name}</Text>
            <Text variant="caption" tone="secondary">
              {exercise.category}
              {exercise.equipment ? ` · ${exercise.equipment}` : ''} · {exercise.exercise_type}
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
