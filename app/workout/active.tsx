import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Check, Pause, Play, Plus, TimerReset, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CompactInput } from '@/components/ui/compact-input';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useLatestWeight } from '@/features/measurements/hooks';
import { totalVolumeKg } from '@/features/workout/calculations';
import {
  EXERCISE_IMAGE_PLACEHOLDER,
  resolveExerciseImage,
} from '@/features/workout/catalog/exercise-images';
import { estimateWorkoutCalories } from '@/features/workout/exercise-calorie-engine';
import { formatElapsed, useFinishWorkout } from '@/features/workout/hooks';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore, type DraftExercise } from '@/stores/active-workout-store';

export default function ActiveWorkoutScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const store = useActiveWorkoutStore();
  const finish = useFinishWorkout();
  const weight = useLatestWeight();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!store.restEndsAt) return;
    const left = Math.ceil((new Date(store.restEndsAt).getTime() - nowMs) / 1000);
    if (left <= 0) store.clearRest();
  }, [nowMs, store]);

  if (!store.startedAt) {
    return (
      <Screen>
        <Text variant="body">{t('workout.noActive')}</Text>
        <Button label={t('workout.back')} onPress={() => router.back()} />
      </Screen>
    );
  }

  const elapsed = store.getActiveDurationSec();
  const restLeft = store.restEndsAt
    ? Math.max(0, Math.ceil((new Date(store.restEndsAt).getTime() - nowMs) / 1000))
    : 0;

  const liveEstimate =
    weight.weightKg && weight.weightKg > 0
      ? estimateWorkoutCalories({
          activeDurationSec: elapsed,
          bodyWeightKg: weight.weightKg,
          exercises: store.exercises.map((exercise) => ({
            localId: exercise.localId,
            name: exercise.name,
            exerciseType: exercise.exerciseType,
            metValue: exercise.metValue,
            sets: exercise.sets.map((set) => ({
              weightKg: set.weightKg ? Number(set.weightKg) : null,
              reps: set.reps ? Number(set.reps) : null,
              durationSec: set.durationSec ? Number(set.durationSec) : null,
              distanceM: set.distanceM ? Number(set.distanceM) : null,
              restSec: set.restSec ? Number(set.restSec) : null,
              completed: set.completed,
            })),
          })),
        })
      : null;
  const liveById = new Map(
    (liveEstimate?.exercises ?? []).map((row) => [row.localId, row] as const),
  );

  const volume = totalVolumeKg(
    store.exercises.flatMap((exercise) =>
      exercise.sets
        .filter((set) => set.completed && set.weightKg && set.reps)
        .map((set) => ({ weightKg: Number(set.weightKg), reps: Number(set.reps) })),
    ),
  );

  async function onFinish() {
    if (!(weight.weightKg && weight.weightKg > 0)) {
      Alert.alert(t('workout.weightRequiredTitle'), t('workout.weightRequiredBody'));
      return;
    }
    try {
      const result = await finish.mutateAsync({
        name: store.name,
        startedAt: store.startedAt!,
        activeDurationSec: store.getActiveDurationSec(),
        notes: store.notes,
        sourceTemplateId: store.sourceTemplateId,
        exercises: store.exercises,
        bodyWeightKg: weight.weightKg,
      });
      store.reset();
      router.replace({
        pathname: '/workout/summary',
        params: {
          id: result.workoutId,
          estimated: String(result.estimated),
          volume: String(result.volume),
          durationMin: String(result.durationMin),
          intensity: result.intensity,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'BODY_WEIGHT_REQUIRED'
          ? t('workout.weightRequiredBody')
          : error instanceof Error
            ? error.message
            : t('workout.retry');
      Alert.alert(t('workout.saveFailed'), message);
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

        <DeleteConfirmDialog
          visible={discardOpen}
          title={t('workout.discardTitle')}
          body={t('workout.discardBody')}
          cancelLabel={t('workout.keep')}
          confirmLabel={t('workout.discard')}
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
          onPress={() =>
            router.push({ pathname: '/workout/exercises', params: { mode: 'pick' } })
          }
        />

        {store.exercises.length === 0 ? (
          <Text variant="bodySmall" tone="muted">
            {t('workout.addExerciseHint')}
          </Text>
        ) : null}

        {store.exercises.map((exercise, index) => (
          <Card key={exercise.localId} className="gap-2">
            <View className="flex-row items-center justify-between gap-2">
              <ActiveExerciseThumb exercise={exercise} />
              <View className="min-w-0 flex-1">
                <Text variant="headingSmall" numberOfLines={1}>
                  {exercise.name}
                </Text>
                <Text variant="caption" tone="secondary">
                  {t(`workout.type.${exercise.exerciseType}`)}
                  {liveById.get(exercise.localId)?.estimatedCalories
                    ? ` · ${t('workout.summaryCalories', {
                        value: liveById.get(exercise.localId)!.estimatedCalories,
                      })}`
                    : ''}
                </Text>
                {liveById.get(exercise.localId)?.method === 'allocated' ? (
                  <Text variant="caption" tone="muted">
                    {t('workout.estimateMethodAllocated')}
                  </Text>
                ) : null}
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

function ActiveExerciseThumb({ exercise }: { exercise: DraftExercise }) {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  const resolved = resolveExerciseImage({
    imageUrl: exercise.imageUrl,
    imageStoragePath: exercise.imageStoragePath,
    imageKey: exercise.imageKey,
    slug: exercise.slug,
    name: exercise.name,
  });
  const source = failed ? EXERCISE_IMAGE_PLACEHOLDER : resolved;

  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: radii.md,
        overflow: 'hidden',
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Image
        source={source}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        recyclingKey={exercise.localId}
        transition={0}
        cachePolicy="memory-disk"
        onError={() => setFailed(true)}
      />
    </View>
  );
}
