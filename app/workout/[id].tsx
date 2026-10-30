import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

        {workout.exercises.map((exercise) => (
          <Card key={exercise.id} className="gap-2">
            <Text variant="headingSmall">{exercise.exercise_name}</Text>
            <Text variant="caption" tone="secondary">
              {t(`workout.type.${exercise.exercise_type}`)}
            </Text>
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
          onPress={() => {
            Alert.alert(t('workout.deleteTitle'), t('workout.deleteBody'), [
              { text: t('workout.keep'), style: 'cancel' },
              {
                text: t('workout.delete'),
                style: 'destructive',
                onPress: () => {
                  void remove.mutateAsync(workout.id).then(() => router.back());
                },
              },
            ]);
          }}
        />
      </View>
    </Screen>
  );
}
