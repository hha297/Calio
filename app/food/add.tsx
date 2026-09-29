import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ErrorState, LoadingState } from '@/components/ui/states';
import {
  useCreateManualFood,
  useLogFoodEntry,
  useRecentFoods,
  useSearchFoods,
  type MealType,
} from '@/features/food/hooks';
import { toDiaryDateKey } from '@/utils/date';

export default function AddFoodScreen() {
  const params = useLocalSearchParams<{ date?: string; meal?: string }>();
  const dateKey = params.date ?? toDiaryDateKey();
  const mealType = (params.meal as MealType) || 'lunch';
  const [term, setTerm] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [serving, setServing] = useState('1 serving');
  const [error, setError] = useState<string | null>(null);

  const search = useSearchFoods(term);
  const recent = useRecentFoods();
  const logFood = useLogFoodEntry();
  const createFood = useCreateManualFood();

  const results = useMemo(() => search.data ?? [], [search.data]);

  async function logExisting(food: {
    id?: string;
    name: string;
    brand?: string | null;
    serving_label: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }) {
    setError(null);
    try {
      await logFood.mutateAsync({
        dateKey,
        mealType,
        quantity: 1,
        food: {
          id: food.id,
          name: food.name,
          brand: food.brand,
          servingLabel: food.serving_label,
          calories: food.calories,
          proteinG: food.protein_g,
          carbsG: food.carbs_g,
          fatG: food.fat_g,
        },
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log food.');
    }
  }

  async function saveManual() {
    setError(null);
    try {
      const food = await createFood.mutateAsync({
        name: name.trim(),
        servingLabel: serving.trim() || 'serving',
        calories: Number(calories) || 0,
        proteinG: Number(protein) || 0,
        carbsG: Number(carbs) || 0,
        fatG: Number(fat) || 0,
      });
      await logFood.mutateAsync({
        dateKey,
        mealType,
        quantity: 1,
        food: {
          id: food.id,
          name: food.name,
          brand: food.brand,
          servingLabel: food.serving_label,
          calories: food.calories,
          proteinG: food.protein_g,
          carbsG: food.carbs_g,
          fatG: food.fat_g,
        },
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save food.');
    }
  }

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Add food</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="primary">
              Close
            </Text>
          </Pressable>
        </View>
        <Text variant="bodySmall" tone="secondary">
          Logging to {mealType} · {dateKey}
        </Text>
        <Input label="Search" value={term} onChangeText={setTerm} autoCapitalize="none" />
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button label="Scan barcode" variant="secondary" onPress={() => router.push('/(tabs)/scan')} />
          </View>
          <View className="flex-1">
            <Button label="Manual" variant="ghost" onPress={() => setManualOpen((value) => !value)} />
          </View>
        </View>

        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}

        {manualOpen ? (
          <View className="gap-3">
            <Input label="Name" value={name} onChangeText={setName} />
            <Input label="Serving label" value={serving} onChangeText={setServing} />
            <Input label="Calories" value={calories} onChangeText={setCalories} keyboardType="decimal-pad" />
            <Input label="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="decimal-pad" />
            <Input label="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" />
            <Input label="Fat (g)" value={fat} onChangeText={setFat} keyboardType="decimal-pad" />
            <Button
              label="Save & log"
              loading={createFood.isPending || logFood.isPending}
              onPress={() => {
                void saveManual();
              }}
            />
          </View>
        ) : null}

        {term.trim().length >= 2 ? (
          search.isLoading ? (
            <LoadingState label="Searching…" />
          ) : search.error ? (
            <ErrorState
              title="Search failed"
              body={search.error instanceof Error ? search.error.message : 'Try again.'}
              onRetry={() => void search.refetch()}
            />
          ) : results.length === 0 ? (
            <Text variant="bodySmall" tone="secondary">
              No foods found. Create one manually.
            </Text>
          ) : (
            results.map((food) => (
              <Pressable
                key={food.id}
                className="border-b border-border py-3"
                onPress={() => {
                  void logExisting(food);
                }}
              >
                <Text variant="bodyStrong">{food.name}</Text>
                <Text variant="caption" tone="secondary">
                  {food.brand ? `${food.brand} · ` : ''}
                  {Math.round(food.calories)} kcal / {food.serving_label}
                </Text>
              </Pressable>
            ))
          )
        ) : (
          <View className="gap-2">
            <Text variant="headingSmall">Recent</Text>
            {(recent.data ?? []).map((entry) => (
              <Pressable
                key={entry.id}
                className="border-b border-border py-3"
                onPress={() => {
                  void logExisting({
                    name: entry.food_name,
                    brand: entry.brand,
                    serving_label: entry.serving_label,
                    calories: entry.calories / Math.max(entry.quantity, 1),
                    protein_g: entry.protein_g / Math.max(entry.quantity, 1),
                    carbs_g: entry.carbs_g / Math.max(entry.quantity, 1),
                    fat_g: entry.fat_g / Math.max(entry.quantity, 1),
                  });
                }}
              >
                <Text variant="bodyStrong">{entry.food_name}</Text>
                <Text variant="caption" tone="secondary">
                  {Math.round(entry.calories)} kcal
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
