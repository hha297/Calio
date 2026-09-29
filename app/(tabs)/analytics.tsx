import { format, parseISO, subDays } from 'date-fns';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveGoal } from '@/features/goals/hooks';
import { useBodyMeasurements } from '@/features/measurements/hooks';
import { useWorkouts } from '@/features/workout/hooks';
import { getSupabase } from '@/lib/supabase/client';
import { colors } from '@/theme';
import { toDiaryDateKey } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';

export default function AnalyticsScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const goal = useActiveGoal();
  const workouts = useWorkouts();
  const measurements = useBodyMeasurements();

  const intake = useQuery({
    queryKey: ['analytics', 'intake', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const supabase = getSupabase();
      if (!supabase || !userId) return [] as { logged_on: string; calories: number }[];
      const from = toDiaryDateKey(subDays(new Date(), 6));
      const { data, error } = await supabase
        .from('food_entries')
        .select('logged_on, calories')
        .eq('user_id', userId)
        .gte('logged_on', from);
      if (error) throw error;
      const map = new Map<string, number>();
      for (const row of data ?? []) {
        map.set(row.logged_on, (map.get(row.logged_on) ?? 0) + Number(row.calories));
      }
      return [...map.entries()]
        .map(([logged_on, calories]) => ({ logged_on, calories }))
        .sort((a, b) => a.logged_on.localeCompare(b.logged_on));
    },
  });

  const maxIntake = Math.max(1, ...(intake.data ?? []).map((row) => row.calories));
  const weights = (measurements.data ?? [])
    .filter((row) => row.weight_kg != null)
    .slice(0, 14)
    .reverse();

  return (
    <Screen scroll>
      <View className="gap-4">
        <Text variant="headingLarge">Analytics</Text>
        <Text variant="bodySmall" tone="secondary">
          Trends from your logged data. Activity calories are estimates.
        </Text>

        <Card className="gap-3">
          <Text variant="headingSmall">Calories · last 7 days</Text>
          {intake.isLoading ? <LoadingState /> : null}
          {intake.error ? (
            <ErrorState
              title="Could not load intake"
              body={intake.error instanceof Error ? intake.error.message : 'Try again.'}
              onRetry={() => void intake.refetch()}
            />
          ) : null}
          {(intake.data?.length ?? 0) === 0 && !intake.isLoading ? (
            <EmptyState title="Not enough data" body="Log food for a few days to see a trend." />
          ) : (
            <View className="h-36 flex-row items-end gap-2">
              {(intake.data ?? []).map((row) => (
                <View key={row.logged_on} className="flex-1 items-center gap-1">
                  <View
                    className="w-full rounded-sm"
                    style={{
                      height: `${Math.max(8, (row.calories / maxIntake) * 100)}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                  <Text variant="caption" tone="muted">
                    {format(parseISO(row.logged_on), 'EEEEE')}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <Text variant="caption" tone="secondary">
            Target {goal.data?.daily_calorie_target ?? 2000} kcal/day
          </Text>
        </Card>

        <Card className="gap-2">
          <Text variant="headingSmall">Workouts</Text>
          <Text variant="display">{workouts.data?.length ?? 0}</Text>
          <Text variant="bodySmall" tone="secondary">
            Sessions saved · est. burn{' '}
            {Math.round(
              (workouts.data ?? []).reduce((sum, item) => sum + Number(item.estimated_calories), 0),
            )}{' '}
            kcal
          </Text>
        </Card>

        <Card className="gap-3">
          <Text variant="headingSmall">Weight</Text>
          {weights.length === 0 ? (
            <EmptyState title="No weight history" body="Add a measurement from Account." />
          ) : (
            weights.map((row) => (
              <View key={row.id} className="flex-row justify-between border-b border-border py-2">
                <Text variant="body">{row.measured_on}</Text>
                <Text variant="bodyStrong">{row.weight_kg} kg</Text>
              </View>
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
}
