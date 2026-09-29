import { addDays } from 'date-fns';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { calculateDailyBalance } from '@/features/diary/balance';
import { useDayFoodTotals, useDeleteFoodEntry, useFoodEntries, type MealType } from '@/features/food/hooks';
import { useActiveGoal } from '@/features/goals/hooks';
import { useDayWorkoutCalories } from '@/features/workout/hooks';
import { colors } from '@/theme';
import { formatDiaryHeading, parseDiaryDateKey, toDiaryDateKey } from '@/utils/date';
import { useState } from 'react';

const meals: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

export default function DiaryScreen() {
  const [dateKey, setDateKey] = useState(toDiaryDateKey());
  const goalQuery = useActiveGoal();
  const foodQuery = useFoodEntries(dateKey);
  const totalsQuery = useDayFoodTotals(dateKey);
  const burnQuery = useDayWorkoutCalories(dateKey);
  const deleteEntry = useDeleteFoodEntry();

  const target = goalQuery.data?.daily_calorie_target ?? 2000;
  const balance = calculateDailyBalance({
    consumed: totalsQuery.totals.calories,
    burned: burnQuery.data ?? 0,
    target,
  });

  const isLoading = foodQuery.isLoading || goalQuery.isLoading;
  const error = foodQuery.error ?? goalQuery.error ?? burnQuery.error;

  return (
    <Screen scroll>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            onPress={() => setDateKey(toDiaryDateKey(addDays(parseDiaryDateKey(dateKey), -1)))}
            className="h-11 min-w-11 items-center justify-center"
          >
            <Text variant="bodyStrong">‹</Text>
          </Pressable>
          <View className="items-center">
            <Text variant="headingLarge">Diary</Text>
            <Text variant="caption" tone="secondary">
              {formatDiaryHeading(dateKey)}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDateKey(toDiaryDateKey(addDays(parseDiaryDateKey(dateKey), 1)))}
            className="h-11 min-w-11 items-center justify-center"
          >
            <Text variant="bodyStrong">›</Text>
          </Pressable>
        </View>

        <Card className="gap-3">
          <Text variant="label" tone="secondary">
            Daily balance
          </Text>
          <Text variant="display">{balance.remaining}</Text>
          <Text variant="bodySmall" tone="secondary">
            {balance.status === 'over'
              ? 'Over target for the day'
              : balance.status === 'under'
                ? 'Calories remaining (estimates)'
                : 'Around your target'}
          </Text>
          <View className="flex-row justify-between">
            <Metric label="Eaten" value={balance.consumed} />
            <Metric label="Activity" value={balance.burned} />
            <Metric label="Target" value={balance.target} />
          </View>
          <ProgressBar
            label="Calories"
            value={balance.consumed}
            max={balance.target}
            color={colors.macroCalories}
          />
          <ProgressBar
            label="Protein"
            value={totalsQuery.totals.proteinG}
            max={goalQuery.data?.protein_g ?? 120}
            color={colors.macroProtein}
          />
          <ProgressBar
            label="Carbs"
            value={totalsQuery.totals.carbsG}
            max={goalQuery.data?.carbs_g ?? 200}
            color={colors.macroCarbs}
          />
          <ProgressBar
            label="Fat"
            value={totalsQuery.totals.fatG}
            max={goalQuery.data?.fat_g ?? 70}
            color={colors.macroFat}
          />
        </Card>

        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button
              label="Add food"
              onPress={() =>
                router.push({ pathname: '/food/add', params: { date: dateKey, meal: 'lunch' } })
              }
            />
          </View>
          <View className="flex-1">
            <Button label="Workout" variant="secondary" onPress={() => router.push('/workout/index')} />
          </View>
        </View>

        {isLoading ? <LoadingState /> : null}
        {error ? (
          <ErrorState
            title="Could not load diary"
            body={error instanceof Error ? error.message : 'Try again.'}
            onRetry={() => {
              void foodQuery.refetch();
              void goalQuery.refetch();
              void burnQuery.refetch();
            }}
          />
        ) : null}

        {!isLoading && !error
          ? meals.map((meal) => {
              const entries = (foodQuery.data ?? []).filter((entry) => entry.meal_type === meal.key);
              const mealCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
              return (
                <View key={meal.key} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text variant="headingSmall">{meal.label}</Text>
                    <View className="flex-row items-center gap-3">
                      <Text variant="caption" tone="secondary">
                        {Math.round(mealCalories)} kcal
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                          router.push({
                            pathname: '/food/add',
                            params: { date: dateKey, meal: meal.key },
                          })
                        }
                      >
                        <Text variant="label" tone="primary">
                          Add
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  {entries.length === 0 ? (
                    <Text variant="bodySmall" tone="muted">
                      Nothing logged yet
                    </Text>
                  ) : (
                    entries.map((entry) => (
                      <Pressable
                        key={entry.id}
                        className="flex-row items-center justify-between border-b border-border py-3"
                        onLongPress={() => {
                          void deleteEntry.mutateAsync({ id: entry.id, dateKey });
                        }}
                      >
                        <View className="flex-1 pr-3">
                          <Text variant="bodyStrong">{entry.food_name}</Text>
                          <Text variant="caption" tone="secondary">
                            {entry.quantity} × {entry.serving_label}
                            {entry.brand ? ` · ${entry.brand}` : ''}
                          </Text>
                        </View>
                        <Text variant="body">{Math.round(entry.calories)}</Text>
                      </Pressable>
                    ))
                  )}
                </View>
              );
            })
          : null}

        {!isLoading && (foodQuery.data?.length ?? 0) === 0 ? (
          <EmptyState
            title="Your day is empty"
            body="Add a meal or start a workout. Long-press a food row to delete it."
          />
        ) : null}
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text variant="headingMedium">{value}</Text>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
    </View>
  );
}
