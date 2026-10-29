import { router, useLocalSearchParams } from 'expo-router';
import {
  Beef,
  ChevronLeft,
  Droplets,
  Flame,
  ScanLine,
  Search,
  Sparkles,
  Wheat,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { Text } from '@/components/ui/text';
import {
  useCreateManualFood,
  useLogFoodEntry,
  useRecentFoods,
  useSearchFoods,
  type MealType,
} from '@/features/food/hooks';
import { FoodLogContextPicker } from '@/features/food/scan-result-modal';
import { useThemeColors } from '@/theme/theme-provider';
import { toDiaryDateKey } from '@/utils/date';

type AddMode = 'search' | 'manual';

const mealLabels: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export default function AddFoodScreen() {
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ date?: string; meal?: string; mode?: string }>();
  const [dateKey, setDateKey] = useState(params.date ?? toDiaryDateKey());
  const [mealType, setMealType] = useState<MealType>(
    params.meal === 'breakfast' ||
      params.meal === 'lunch' ||
      params.meal === 'dinner' ||
      params.meal === 'snacks'
      ? params.meal
      : 'lunch',
  );
  const [mode, setMode] = useState<AddMode>(params.mode === 'manual' ? 'manual' : 'search');
  const [term, setTerm] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [serving, setServing] = useState('100');
  const [manualUnit, setManualUnit] = useState<'g' | 'ml'>('g');
  const [error, setError] = useState<string | null>(null);

  const search = useSearchFoods(term);
  const recent = useRecentFoods();
  const logFood = useLogFoodEntry();
  const createFood = useCreateManualFood();
  const results = useMemo(() => search.data ?? [], [search.data]);
  const summary = useMemo(() => {
    if (![serving, calories, protein, carbs, fat].every((value) => value.trim())) return null;
    const servingGrams = Number(serving.replace(',', '.'));
    const values = [calories, protein, carbs, fat].map((value) => Number(value.replace(',', '.')));
    if (
      !Number.isFinite(servingGrams) ||
      servingGrams <= 0 ||
      values.some((value) => !Number.isFinite(value) || value < 0)
    ) {
      return null;
    }
    const factor = servingGrams / 100;
    return {
      servingGrams,
      unit: manualUnit,
      calories: values[0] * factor,
      protein: values[1] * factor,
      carbs: values[2] * factor,
      fat: values[3] * factor,
    };
  }, [calories, carbs, fat, manualUnit, protein, serving]);

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

  function parseNutrition(value: string, label: string) {
    const parsed = Number(value.replace(',', '.'));
    if (!value.trim()) throw new Error(`${label} is required.`);
    if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${label} must be zero or more.`);
    return parsed;
  }

  async function saveManual() {
    setError(null);
    try {
      if (!name.trim()) throw new Error('Add a food name to continue.');
      const servingGrams = parseNutrition(serving, 'Serving');
      if (servingGrams <= 0) throw new Error('Serving must be greater than zero.');
      const factor = servingGrams / 100;
      const food = await createFood.mutateAsync({
        name: name.trim(),
        brand: brand.trim() || undefined,
        servingLabel: `${servingGrams} ${manualUnit}`,
        servingGrams: manualUnit === 'g' ? servingGrams : undefined,
        source: 'manual',
        nutritionBasis: 'per100',
        basisUnit: manualUnit,
        basisAmount: 100,
        nutritionUserEdited: true,
        calories: parseNutrition(calories, 'Calories') * factor,
        proteinG: parseNutrition(protein, 'Protein') * factor,
        carbsG: parseNutrition(carbs, 'Carbs') * factor,
        fatG: parseNutrition(fat, 'Fat') * factor,
      });
      await logFood.mutateAsync({
        dateKey,
        mealType,
        quantity: 1,
        amount: servingGrams,
        amountUnit: manualUnit,
        nutritionBasis: 'per100',
        basisAmount: 100,
        nutritionUserEdited: true,
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
      router.dismissTo({ pathname: '/', params: { date: dateKey } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save food.');
    }
  }

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-5">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <ChevronLeft color={colors.textPrimary} size={22} />
          </Pressable>
          <View className="flex-1">
            <Text variant="headingLarge">Add food</Text>
            <Text variant="caption" tone="secondary">
              {mealLabels[mealType]} · {dateKey}
            </Text>
          </View>
        </View>

        <View style={[styles.modeSwitch, { backgroundColor: colors.surfaceMuted }]}>
          <ModeButton
            active={mode === 'search'}
            icon={
              <Search
                size={18}
                color={mode === 'search' ? colors.textOnPrimary : colors.textSecondary}
              />
            }
            label="Search"
            onPress={() => {
              setError(null);
              setMode('search');
            }}
          />
          <ModeButton
            active={mode === 'manual'}
            icon={
              <Sparkles
                size={18}
                color={mode === 'manual' ? colors.textOnPrimary : colors.textSecondary}
              />
            }
            label="Create food"
            onPress={() => {
              setError(null);
              setMode('manual');
            }}
          />
        </View>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorMuted }]}>
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          </View>
        ) : null}

        {mode === 'manual' ? (
          <View className="gap-4">
            <View>
              <Text variant="headingSmall">Create your own food</Text>
              <Text variant="bodySmall" tone="secondary">
                Enter nutrition per 100 g or 100 ml, then the amount you actually consumed.
              </Text>
            </View>

            <Card className="gap-4">
              <View>
                <Text variant="headingSmall">Food details</Text>
                <Text variant="caption" tone="secondary">
                  Give this food a name you will recognize later.
                </Text>
              </View>
              <Input
                label="Food name *"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Chicken rice bowl"
              />
              <Input
                label="Brand (optional)"
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Homemade"
              />
              <UnitSwitch value={manualUnit} onChange={setManualUnit} />
              <ServingField unit={manualUnit} value={serving} onChangeText={setServing} />
            </Card>

            <Card className="gap-4">
              <View>
                <Text variant="headingSmall">Nutrition per 100 {manualUnit}</Text>
                <Text variant="bodySmall" tone="secondary">
                  Enter the values shown on the food label.
                </Text>
              </View>
              <MacroField
                color={colors.macroCalories}
                icon={<Flame color={colors.macroCalories} size={20} />}
                label="Calories"
                unit="kcal"
                value={calories}
                onChangeText={setCalories}
              />
              <MacroField
                color={colors.macroProtein}
                icon={<Beef color={colors.macroProtein} size={20} />}
                label="Protein"
                unit="g"
                value={protein}
                onChangeText={setProtein}
              />
              <MacroField
                color={colors.macroCarbs}
                icon={<Wheat color={colors.macroCarbs} size={20} />}
                label="Carbs"
                unit="g"
                value={carbs}
                onChangeText={setCarbs}
              />
              <MacroField
                color={colors.macroFat}
                icon={<Droplets color={colors.macroFat} size={19} />}
                label="Fat"
                unit="g"
                value={fat}
                onChangeText={setFat}
              />
            </Card>

            {summary ? <NutritionSummary {...summary} /> : null}

            <FoodLogContextPicker
              dateKey={dateKey}
              mealType={mealType}
              onDate={setDateKey}
              onMeal={setMealType}
            />

            <Button
              label="Save & add to meal"
              size="lg"
              disabled={!name.trim()}
              loading={createFood.isPending || logFood.isPending}
              onPress={() => void saveManual()}
            />
          </View>
        ) : (
          <View className="gap-4">
            <Input
              label="Search foods"
              value={term}
              onChangeText={setTerm}
              autoCapitalize="none"
              placeholder="Name or brand"
            />
            <Button
              label="Scan a barcode"
              variant="secondary"
              iconStart={(color) => <ScanLine color={color} size={20} />}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/scan',
                  params: { date: dateKey, meal: mealType, source: 'meal', nonce: Date.now() },
                })
              }
            />

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
                <Card className="items-center gap-3 py-6">
                  <Search color={colors.textMuted} size={28} />
                  <View className="items-center">
                    <Text variant="bodyStrong">No foods found</Text>
                    <Text variant="bodySmall" tone="secondary">
                      Create it once, then find it here next time.
                    </Text>
                  </View>
                  <Button
                    label="Create this food"
                    variant="text"
                    onPress={() => {
                      setName(term.trim());
                      setMode('manual');
                    }}
                  />
                </Card>
              ) : (
                results.map((food) => (
                  <FoodRow
                    key={food.id}
                    name={food.name}
                    detail={`${food.brand ? `${food.brand} · ` : ''}${Math.round(food.calories)} kcal / ${food.serving_label}`}
                    onPress={() => void logExisting(food)}
                  />
                ))
              )
            ) : (
              <View className="gap-2">
                <Text variant="headingSmall">Recently added</Text>
                {(recent.data ?? []).map((entry) => (
                  <FoodRow
                    key={entry.id}
                    name={entry.food_name}
                    detail={`${Math.round(entry.calories)} kcal · ${entry.serving_label}`}
                    onPress={() =>
                      void logExisting({
                        name: entry.food_name,
                        brand: entry.brand,
                        serving_label: entry.serving_label,
                        calories: entry.calories / Math.max(entry.quantity, 1),
                        protein_g: entry.protein_g / Math.max(entry.quantity, 1),
                        carbs_g: entry.carbs_g / Math.max(entry.quantity, 1),
                        fat_g: entry.fat_g / Math.max(entry.quantity, 1),
                      })
                    }
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.modeButton, active && { backgroundColor: colors.primary }]}
    >
      {icon}
      <Text
        variant="bodyStrong"
        style={{ color: active ? colors.textOnPrimary : colors.textSecondary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function UnitSwitch({
  value,
  onChange,
}: {
  value: 'g' | 'ml';
  onChange: (value: 'g' | 'ml') => void;
}) {
  const colors = useThemeColors();
  return (
    <View style={[styles.unitSwitch, { backgroundColor: colors.surfaceMuted }]}>
      {(['g', 'ml'] as const).map((unit) => (
        <Pressable
          key={unit}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === unit }}
          onPress={() => onChange(unit)}
          style={[
            styles.unitOption,
            value === unit && {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text variant="bodyStrong" tone={value === unit ? 'primary' : 'secondary'}>
            {unit}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ServingField({
  unit,
  value,
  onChangeText,
}: {
  unit: 'g' | 'ml';
  value: string;
  onChangeText: (value: string) => void;
}) {
  const colors = useThemeColors();
  return (
    <View className="gap-1.5">
      <Text variant="label" tone="secondary">
        Amount consumed ({unit})
      </Text>
      <View
        style={[
          styles.servingField,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          accessibilityLabel="Serving size in grams"
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="100"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={[styles.servingInput, { color: colors.textPrimary }]}
        />
      </View>
    </View>
  );
}

function MacroField({
  color,
  icon,
  label,
  unit,
  value,
  onChangeText,
}: {
  color: string;
  icon: ReactNode;
  label: string;
  unit: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const colors = useThemeColors();
  return (
    <View style={[styles.macroField, { borderBottomColor: colors.border }]}>
      <View className="flex-row items-center gap-3">
        <View style={[styles.macroIcon, { backgroundColor: `${color}18` }]}>{icon}</View>
        <Text variant="bodyStrong">{label}</Text>
      </View>
      <View style={styles.macroValue}>
        <View style={[styles.macroInputWrap, { backgroundColor: colors.surfaceMuted }]}>
          <TextInput
            accessibilityLabel={`${label} in ${unit}`}
            value={value}
            onChangeText={onChangeText}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            style={[styles.macroInput, { color: colors.textPrimary }]}
          />
        </View>
        <Text variant="bodySmall" tone="secondary" style={styles.macroUnit}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

function NutritionSummary({
  servingGrams,
  unit,
  calories,
  protein,
  carbs,
  fat,
}: {
  servingGrams: number;
  unit: 'g' | 'ml';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  const colors = useThemeColors();
  const format = (value: number) => (value < 10 ? value.toFixed(1) : Math.round(value).toString());

  return (
    <View
      style={[
        styles.summaryCard,
        { backgroundColor: colors.surface, borderColor: colors.borderStrong },
      ]}
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text variant="headingSmall">Serving summary</Text>
        <View
          style={[
            styles.summaryServingBadge,
            { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
          ]}
        >
          <Text variant="bodyStrong" tone="primary">
            {format(servingGrams)} {unit}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.summaryCaloriesRow,
          { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
        ]}
      >
        <View>
          <Text variant="caption" tone="primary">
            TOTAL ENERGY
          </Text>
          <View className="flex-row items-end gap-2">
            <Text style={[styles.summaryCalories, { color: colors.textPrimary }]}>
              {format(calories)}
            </Text>
            <Text variant="bodyStrong" tone="secondary" style={styles.summaryCaloriesUnit}>
              kcal
            </Text>
          </View>
        </View>
        <Flame color={colors.primary} size={28} strokeWidth={2.2} />
      </View>
      <View className="flex-row gap-2">
        <SummaryMacro label="Protein" value={`${format(protein)} g`} />
        <SummaryMacro label="Carbs" value={`${format(carbs)} g`} />
        <SummaryMacro label="Fat" value={`${format(fat)} g`} />
      </View>
    </View>
  );
}

function SummaryMacro({ label, value }: { label: string; value: string }) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.summaryMacro,
        { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
      ]}
    >
      <View className="flex-row items-center gap-1.5">
        <View style={[styles.summaryDot, { backgroundColor: colors.primary }]} />
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
      </View>
      <Text variant="bodyStrong" style={{ color: colors.textPrimary }}>
        {value}
      </Text>
    </View>
  );
}

function FoodRow({ name, detail, onPress }: { name: string; detail: string; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.foodRow,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View className="flex-1">
        <Text variant="bodyStrong">{name}</Text>
        <Text variant="caption" tone="secondary">
          {detail}
        </Text>
      </View>
      <View style={[styles.addBadge, { backgroundColor: colors.primaryMuted }]}>
        <Text variant="headingSmall" tone="primary">
          +
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  modeSwitch: { flexDirection: 'row', gap: 4, borderRadius: 14, padding: 4 },
  modeButton: {
    minHeight: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 11,
    paddingHorizontal: 12,
  },
  errorBanner: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  unitSwitch: { minHeight: 48, flexDirection: 'row', gap: 4, borderRadius: 14, padding: 4 },
  unitOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  servingField: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  servingInput: { minHeight: 48, flex: 1, fontSize: 18, lineHeight: 24, textAlign: 'left' },
  macroField: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
  },
  macroIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  macroInput: {
    minHeight: 44,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'right',
  },
  macroInputWrap: { width: 104, borderRadius: 12, overflow: 'hidden' },
  macroValue: {
    width: 148,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  macroUnit: { width: 34, textAlign: 'right' },
  summaryCard: { gap: 14, borderWidth: 1, borderRadius: 20, padding: 16 },
  summaryServingBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  summaryCaloriesRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryCalories: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  summaryCaloriesUnit: { paddingBottom: 5 },
  summaryMacro: { flex: 1, gap: 5, borderWidth: 1, borderRadius: 12, padding: 10 },
  summaryDot: { width: 7, height: 7, borderRadius: 4 },
  foodRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  addBadge: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
});
