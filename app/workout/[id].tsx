import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { formatElapsed, useDeleteWorkout, useWorkoutDetail } from '@/features/workout/hooks';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function WorkoutDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useWorkoutDetail(id ?? null);
  const remove = useDeleteWorkout();
  const start = useActiveWorkoutStore((state) => state.start);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (detail.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <Screen>
        <ErrorState
          title={t('workout.detailError')}
          body={detail.error instanceof Error ? detail.error.message : t('workout.retry')}
          onRetry={() => void detail.refetch()}
        />
      </Screen>
    );
  }

  const workout = detail.data;

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge" className="min-w-0 flex-1" numberOfLines={2}>
            {workout.name}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="brand">
              {t('workout.close')}
            </Text>
          </Pressable>
        </View>

        <Text variant="caption" tone="secondary">
          {format(new Date(workout.started_at), 'PPp')}
          {workout.active_duration_sec
            ? ` · ${formatElapsed(workout.active_duration_sec)}`
            : ''}
          {` · ~${Math.round(workout.estimated_calories)} ${t('workout.kcalEst')}`}
        </Text>

        <Card className="gap-2">
          <Text variant="label" tone="secondary">
            {t('workout.estimatedCalories')}
          </Text>
          <Text variant="headingLarge" tone="brand">
            {t('workout.summaryCalories', {
              value: Math.round(Number(workout.estimated_calories ?? 0)),
            })}
          </Text>
          <Text variant="caption" tone="muted">
            {t('workout.sessionCaloriesSumNote')}
          </Text>
        </Card>

        {workout.exercises.map((exercise) => (
          <Card key={exercise.id} className="gap-2">
            <View className="flex-row items-start justify-between gap-2">
              <View className="min-w-0 flex-1 gap-1">
                <Text variant="headingSmall">{exercise.exercise_name}</Text>
                <Text variant="caption" tone="secondary">
                  {t(`workout.type.${exercise.exercise_type}`)}
                </Text>
              </View>
              {exercise.estimated_calories != null && Number(exercise.estimated_calories) > 0 ? (
                <View className="items-end gap-0.5">
                  <Text variant="bodyStrong" tone="brand">
                    {t('workout.summaryCalories', {
                      value: Math.round(Number(exercise.estimated_calories)),
                    })}
                  </Text>
                  <Text variant="caption" tone="muted">
                    {exercise.estimate_method === 'allocated'
                      ? t('workout.estimateMethodAllocated')
                      : t('workout.estimateMethodDirect')}
                  </Text>
                </View>
              ) : null}
            </View>
            {exercise.sets.map((set) => (
              <Text key={set.id} variant="caption" tone="secondary">
                #{set.set_number}
                {set.weight_kg != null ? ` · ${set.weight_kg} kg` : ''}
                {set.reps != null ? ` · ${set.reps} reps` : ''}
                {set.duration_sec != null ? ` · ${set.duration_sec}s` : ''}
                {set.distance_m != null ? ` · ${set.distance_m} m` : ''}
                {set.completed ? '' : ` · ${t('workout.incompleteSet')}`}
              </Text>
            ))}
          </Card>
        ))}

        <Button
          label={t('workout.repeat')}
          onPress={() => {
            start({
              name: workout.name,
              exercises: workout.exercises.map((exercise) => ({
                exerciseId: exercise.exercise_id,
                name: exercise.exercise_name,
                exerciseType: exercise.exercise_type,
                metValue: null,
              })),
            });
            router.push('/workout/active');
          }}
        />
        <Button
          label={t('workout.delete')}
          variant="secondary"
          onPress={() => setDeleteOpen(true)}
        />
      </View>

      <DeleteConfirmDialog
        visible={deleteOpen}
        title={t('workout.deleteTitle')}
        body={t('workout.deleteBody')}
        cancelLabel={t('workout.keep')}
        confirmLabel={t('workout.delete')}
        loading={remove.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          void remove.mutateAsync(workout.id).then(() => {
            setDeleteOpen(false);
            router.back();
          });
        }}
      />
    </Screen>
  );
}
