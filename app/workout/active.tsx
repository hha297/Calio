import { router } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CompactInput } from '@/components/ui/compact-input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useLatestWeight } from '@/features/measurements/hooks';
import { useFinishWorkout } from '@/features/workout/hooks';
import { totalVolumeKg } from '@/features/workout/calculations';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function ActiveWorkoutScreen() {
  const store = useActiveWorkoutStore();
  const finish = useFinishWorkout();
  const weight = useLatestWeight();

  if (!store.startedAt) {
    return (
      <Screen>
        <Text variant="body">No active workout.</Text>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const volume = totalVolumeKg(
    store.exercises.flatMap((exercise) =>
      exercise.sets
        .filter((set) => set.weightKg && set.reps)
        .map((set) => ({ weightKg: Number(set.weightKg), reps: Number(set.reps) })),
    ),
  );

  async function onFinish() {
    try {
      const result = await finish.mutateAsync({
        name: store.name,
        startedAt: store.startedAt!,
        exercises: store.exercises,
        bodyWeightKg: weight.weightKg ?? 70,
      });
      store.reset();
      Alert.alert(
        'Workout saved',
        `~${result.estimated} kcal estimated · ${result.volume} kg volume · ${result.durationMin} min`,
      );
      router.replace('/workout/index');
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : 'Try again.');
    }
  }

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Active workout</Text>
          <Pressable
            onPress={() => {
              Alert.alert('Discard workout?', 'This cannot be undone.', [
                { text: 'Keep', style: 'cancel' },
                {
                  text: 'Discard',
                  style: 'destructive',
                  onPress: () => {
                    store.reset();
                    router.back();
                  },
                },
              ]);
            }}
          >
            <Text variant="bodyStrong" tone="error">
              Discard
            </Text>
          </Pressable>
        </View>
        <Text variant="bodySmall" tone="secondary">
          Volume so far: {volume} kg · calorie burn is an estimate
        </Text>
        <Button label="Add exercise" variant="secondary" onPress={() => router.push('/workout/exercises')} />

        {store.exercises.map((exercise) => (
          <View key={exercise.localId} className="gap-2 rounded-lg border border-border bg-surface p-3">
            <View className="flex-row items-center justify-between">
              <Text variant="headingSmall">{exercise.name}</Text>
              <Pressable onPress={() => store.removeExercise(exercise.localId)}>
                <Text variant="caption" tone="error">
                  Remove
                </Text>
              </Pressable>
            </View>
            {exercise.sets.map((set) => (
              <View key={set.localId} className="flex-row items-center gap-2">
                <Text variant="caption" tone="secondary" className="w-8">
                  {set.setNumber}
                </Text>
                {(exercise.exerciseType === 'strength' || exercise.exerciseType === 'bodyweight') && (
                  <>
                    <CompactInput
                      value={set.weightKg}
                      placeholder="kg"
                      keyboardType="decimal-pad"
                      onChangeText={(value) =>
                        store.updateSet(exercise.localId, set.localId, { weightKg: value })
                      }
                    />
                    <CompactInput
                      value={set.reps}
                      placeholder="reps"
                      keyboardType="decimal-pad"
                      onChangeText={(value) =>
                        store.updateSet(exercise.localId, set.localId, { reps: value })
                      }
                    />
                  </>
                )}
                {(exercise.exerciseType === 'cardio' || exercise.exerciseType === 'other') && (
                  <CompactInput
                    value={set.durationSec}
                    placeholder="sec"
                    keyboardType="decimal-pad"
                    onChangeText={(value) =>
                      store.updateSet(exercise.localId, set.localId, { durationSec: value })
                    }
                  />
                )}
                <Pressable onPress={() => store.removeSet(exercise.localId, set.localId)}>
                  <Text variant="caption" tone="muted">
                    ✕
                  </Text>
                </Pressable>
              </View>
            ))}
            <Button label="Add set" variant="ghost" onPress={() => store.addSet(exercise.localId)} />
          </View>
        ))}

        <Button
          label="Finish workout"
          loading={finish.isPending}
          onPress={() => {
            void onFinish();
          }}
        />
      </View>
    </Screen>
  );
}

