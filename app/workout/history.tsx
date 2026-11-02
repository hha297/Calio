import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { Text } from '@/components/ui/text';
import { formatElapsed, useWorkouts } from '@/features/workout/hooks';

export default function WorkoutHistoryScreen() {
  const { t } = useTranslation();
  const workouts = useWorkouts();

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="headingLarge">{t('workout.historyEntry')}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="brand">
              {t('workout.back')}
            </Text>
          </Pressable>
        </View>

        {workouts.isLoading ? <LoadingState /> : null}
        {workouts.error ? (
          <ErrorState
            title={t('workout.historyLoadError')}
            body={workouts.error instanceof Error ? workouts.error.message : t('workout.retry')}
            onRetry={() => void workouts.refetch()}
          />
        ) : null}
        {(workouts.data?.length ?? 0) === 0 && !workouts.isLoading && !workouts.error ? (
          <EmptyState title={t('workout.emptyHistory')} body={t('workout.emptyHistoryBody')} />
        ) : null}

        {(workouts.data ?? []).map((workout) => (
          <Pressable
            key={workout.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/workout/[id]', params: { id: workout.id } })
            }
          >
            <Card className="gap-1">
              <Text variant="bodyStrong">{workout.name}</Text>
              <Text variant="caption" tone="secondary">
                {formatDistanceToNow(new Date(workout.started_at), { addSuffix: true })}
                {workout.active_duration_sec
                  ? ` · ${formatElapsed(workout.active_duration_sec)}`
                  : ''}
                {` · ~${Math.round(workout.estimated_calories)} ${t('workout.kcalEst')}`}
              </Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
