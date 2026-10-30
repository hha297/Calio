import { router } from 'expo-router';
import { Check, Pause, Play, Plus, TimerReset, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CompactInput } from '@/components/ui/compact-input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useLatestWeight } from '@/features/measurements/hooks';
import { totalVolumeKg } from '@/features/workout/calculations';
import { formatElapsed, useFinishWorkout } from '@/features/workout/hooks';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function ActiveWorkoutScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const store = useActiveWorkoutStore();
  const finish = useFinishWorkout();
  const weight = useLatestWeight();
  const [tick, setTick] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!store.startedAt) {
    return (
      <Screen>
        <Text variant="body">{t('workout.noActive')}</Text>
        <Button label={t('workout.back')} onPress={() => router.back()} />
      </Screen>
    );
  }

  void tick;
  const elapsed = store.getActiveDurationSec();
  const restLeft = store.restEndsAt
    ? Math.max(0, Math.ceil((new Date(store.restEndsAt).getTime() - Date.now()) / 1000))
    : 0;
  if (store.restEndsAt && restLeft <= 0) {
    store.clearRest();
  }

  const volume = totalVolumeKg(
    store.exercises.flatMap((exercise) =>
      exercise.sets
        .filter((set) => set.completed && set.weightKg && set.reps)
        .map((set) => ({ weightKg: Number(set.weightKg), reps: Number(set.reps) })),
    ),
  );

  async function onFinish() {
    try {
      const result = await finish.mutateAsync({
        name: store.name,
        startedAt: store.startedAt!,
        activeDurationSec: store.getActiveDurationSec(),
        notes: store.notes,
        sourceTemplateId: store.sourceTemplateId,
        exercises: store.exercises,
        bodyWeightKg: weight.weightKg ?? 70,
      });
      store.reset();
      router.replace({
        pathname: '/workout/summary',
        params: {
          id: result.workoutId,
          estimated: String(result.estimated),
          volume: String(result.volume),
          durationMin: String(result.durationMin),
        },
      });
    } catch (error) {
      Alert.alert(
        t('workout.saveFailed'),
        error instanceof Error ? error.message : t('workout.retry'),
      );
    }
  }

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="headingLarge" numberOfLines={1}>
              {store.name}
            </Text>
            <Text variant="headingSmall" tone="brand">
              {formatElapsed(elapsed)}
              {store.paused ? ` · ${t('workout.paused')}` : ''}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={store.paused ? t('workout.resume') : t('workout.paused')}
              onPress={() => (store.paused ? store.resume() : store.pause())}
              className="h-10 w-10 items-center justify-center"
              style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
            >
              {store.paused ? (
                <Play size={18} color={colors.primary} />
              ) : (
                <Pause size={18} color={colors.textPrimary} />
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('workout.discard')}
              onPress={() => setDiscardOpen(true)}
              className="h-10 w-10 items-center justify-center"
              style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
            >
              <X size={18} color={colors.error} />
            </Pressable>
          </View>
        </View>

        <ConfirmDialog
          visible={discardOpen}
          title={t('workout.discardTitle')}
          body={t('workout.discardBody')}
          cancelLabel={t('workout.keep')}
          confirmLabel={t('workout.discard')}
          confirmVariant="destructive"
          onCancel={() => setDiscardOpen(false)}
          onConfirm={() => {
            setDiscardOpen(false);
            store.reset();
            router.back();
          }}
        />

        <Text variant="caption" tone="secondary">
          {t('workout.volumeSoFar', { value: volume })}
        </Text>

        {restLeft > 0 ? (
          <Card className="flex-row items-center gap-3">
            <TimerReset size={18} color={colors.primary} />
            <View className="min-w-0 flex-1">
              <Text variant="bodyStrong">{t('workout.restTimer')}</Text>
              <Text variant="headingSmall" tone="brand">
                {formatElapsed(restLeft)}
              </Text>
            </View>
            <Pressable onPress={() => store.adjustRest(-15)}>
              <Text variant="caption" tone="secondary">
                −15s
              </Text>
            </Pressable>
            <Pressable onPress={() => store.adjustRest(15)}>
              <Text variant="caption" tone="secondary">
                +15s
              </Text>
            </Pressable>
            <Pressable onPress={() => store.clearRest()}>
              <Text variant="caption" tone="brand">
                {t('workout.skipRest')}
              </Text>
            </Pressable>
          </Card>
        ) : null}

        <Button
          label={t('workout.addExercise')}
          variant="secondary"
          onPress={() => router.push('/workout/exercises')}
        />

        {store.exercises.length === 0 ? (
          <Text variant="bodySmall" tone="muted">
            {t('workout.addExerciseHint')}
          </Text>
        ) : null}

        {store.exercises.map((exercise, index) => (
          <Card key={exercise.localId} className="gap-2">
            <View className="flex-row items-center justify-between gap-2">
              <View className="min-w-0 flex-1">
                <Text variant="headingSmall" numberOfLines={1}>
                  {exercise.name}
                </Text>
                <Text variant="caption" tone="secondary">
                  {t(`workout.type.${exercise.exerciseType}`)}
                </Text>
              </View>
              <Pressable onPress={() => store.reorderExercise(exercise.localId, 'up')}>
                <Text variant="caption" tone="secondary">
                  ↑
                </Text>
              </Pressable>
              <Pressable onPress={() => store.reorderExercise(exercise.localId, 'down')}>
                <Text variant="caption" tone="secondary">
                  ↓
                </Text>
              </Pressable>
              <Pressable onPress={() => store.removeExercise(exercise.localId)}>
                <Text variant="caption" tone="error">
                  {t('workout.remove')}
                </Text>
              </Pressable>
            </View>

            {exercise.sets.map((set) => (
              <View key={set.localId} className="flex-row items-center gap-2">
                <Text variant="caption" tone="secondary" className="w-6">
                  {set.setNumber}
                </Text>
                {(exercise.exerciseType === 'strength' ||
                  exercise.exerciseType === 'bodyweight') && (
                  <>
                    {exercise.exerciseType === 'strength' ? (
                      <CompactInput
                        value={set.weightKg}
                        placeholder={t('workout.kg')}
                        keyboardType="decimal-pad"
                        onChangeText={(value) =>
                          store.updateSet(exercise.localId, set.localId, { weightKg: value })
                        }
                      />
                    ) : null}
                    <CompactInput
                      value={set.reps}
                      placeholder={t('workout.reps')}
                      keyboardType="number-pad"
                      onChangeText={(value) =>
                        store.updateSet(exercise.localId, set.localId, { reps: value })
                      }
                    />
                  </>
                )}
                {(exercise.exerciseType === 'cardio' || exercise.exerciseType === 'other') && (
                  <>
                    <CompactInput
                      value={set.durationSec}
                      placeholder={t('workout.sec')}
                      keyboardType="number-pad"
                      onChangeText={(value) =>
                        store.updateSet(exercise.localId, set.localId, { durationSec: value })
                      }
                    />
                    {exercise.exerciseType === 'cardio' ? (
                      <CompactInput
                        value={set.distanceM}
                        placeholder={t('workout.meters')}
                        keyboardType="decimal-pad"
                        onChangeText={(value) =>
                          store.updateSet(exercise.localId, set.localId, { distanceM: value })
                        }
                      />
                    ) : null}
                  </>
                )}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => store.toggleSetCompleted(exercise.localId, set.localId)}
                  className="h-9 w-9 items-center justify-center"
                  style={{
                    borderRadius: radii.pill,
                    backgroundColor: set.completed ? colors.primary : colors.surfaceMuted,
                  }}
                >
                  <Check
                    size={16}
                    color={set.completed ? '#FFFFFF' : colors.textMuted}
                    strokeWidth={2.5}
                  />
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={() => store.addSet(exercise.localId)}
              className="flex-row items-center gap-1 py-1"
            >
              <Plus size={14} color={colors.primary} />
              <Text variant="caption" tone="brand">
                {t('workout.addSet')}
              </Text>
            </Pressable>
            {index === store.exercises.length - 1 ? null : null}
          </Card>
        ))}

        <Button
          label={t('workout.finish')}
          onPress={() => {
            void onFinish();
          }}
          loading={finish.isPending}
          disabled={finish.isPending || store.exercises.length === 0}
        />
      </View>
    </Screen>
  );
}
