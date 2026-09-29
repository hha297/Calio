import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { useWorkouts } from '@/features/workout/hooks';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { format } from 'date-fns';

export default function WorkoutHomeScreen() {
  const workouts = useWorkouts();
  const active = useActiveWorkoutStore();

  return (
    <Screen scroll>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Workouts</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="primary">
              Close
            </Text>
          </Pressable>
        </View>
        {active.startedAt ? (
          <Button label="Resume active workout" onPress={() => router.push('/workout/active')} />
        ) : (
          <Button
            label="Start workout"
            onPress={() => {
              active.start();
              router.push('/workout/active');
            }}
          />
        )}

        {workouts.isLoading ? <LoadingState /> : null}
        {workouts.error ? (
          <ErrorState
            title="Could not load history"
            body={workouts.error instanceof Error ? workouts.error.message : 'Try again.'}
            onRetry={() => void workouts.refetch()}
          />
        ) : null}

        {(workouts.data?.length ?? 0) === 0 && !workouts.isLoading ? (
          <EmptyState
            title="No workouts yet"
            body="Start a session, add exercises, and finish when you are done."
          />
        ) : null}

        {(workouts.data ?? []).map((workout) => (
          <View key={workout.id} className="border-b border-border py-3">
            <Text variant="bodyStrong">{workout.name}</Text>
            <Text variant="caption" tone="secondary">
              {format(new Date(workout.started_at), 'MMM d · HH:mm')}
              {workout.ended_at ? ' · finished' : ' · open'}
              {` · ~${Math.round(workout.estimated_calories)} kcal est.`}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
