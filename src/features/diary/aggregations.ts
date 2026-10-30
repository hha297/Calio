import { addDays, differenceInMinutes, format, parseISO, startOfMonth, startOfWeek } from 'date-fns';

import type { FoodEntryWithAmount } from '@/features/diary/api';
import { sumMacros, type MacroTotals } from '@/features/diary/balance';
import { classifyDayCalories, type DayCalorieStatus } from '@/features/diary/goal-status';
import type { FoodEntry, MealType } from '@/features/food/types';
import type { WorkoutListItem } from '@/features/workout/hooks';
import { parseDiaryDateKey, toDiaryDateKey } from '@/utils/date';

export const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export function entriesToMacros(entries: Pick<FoodEntry, 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'>[]): MacroTotals {
  return sumMacros(
    entries.map((entry) => ({
      calories: entry.calories,
      proteinG: entry.protein_g,
      carbsG: entry.carbs_g,
      fatG: entry.fat_g,
    })),
  );
}

export function groupEntriesByDate<T extends { logged_on: string }>(entries: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const entry of entries) {
    const list = map.get(entry.logged_on) ?? [];
    list.push(entry);
    map.set(entry.logged_on, list);
  }
  return map;
}

export function mealCalorieBreakdown(
  entries: Pick<FoodEntry, 'meal_type' | 'calories'>[],
): Record<MealType, number> {
  const result: Record<MealType, number> = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  };
  for (const entry of entries) {
    result[entry.meal_type] = Math.round((result[entry.meal_type] + entry.calories) * 10) / 10;
  }
  return result;
}

export function workoutDurationMinutes(workout: WorkoutListItem): number {
  if (!workout.ended_at) return 0;
  return Math.max(0, differenceInMinutes(parseISO(workout.ended_at), parseISO(workout.started_at)));
}

export function groupWorkoutsByDate(workouts: WorkoutListItem[]): Map<string, WorkoutListItem[]> {
  const map = new Map<string, WorkoutListItem[]>();
  for (const workout of workouts) {
    const key = toDiaryDateKey(parseISO(workout.started_at));
    const list = map.get(key) ?? [];
    list.push(workout);
    map.set(key, list);
  }
  return map;
}

export function weekDateKeys(anchorKey: string): string[] {
  const start = startOfWeek(parseDiaryDateKey(anchorKey), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => toDiaryDateKey(addDays(start, index)));
}

export function monthDateKeys(monthKey: string): string[] {
  const start = startOfMonth(parseDiaryDateKey(`${monthKey}-01`));
  const keys: string[] = [];
  let cursor = start;
  const month = start.getMonth();
  while (cursor.getMonth() === month) {
    keys.push(toDiaryDateKey(cursor));
    cursor = addDays(cursor, 1);
  }
  return keys;
}

export function toMonthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return format(date, 'yyyy-MM');
}

export type FoodQuantityTotals = {
  grams: number;
  milliliters: number;
  servings: number;
  entryCount: number;
  entriesWithAmount: number;
};

export function sumFoodQuantities(entries: FoodEntryWithAmount[]): FoodQuantityTotals {
  let grams = 0;
  let milliliters = 0;
  let servings = 0;
  let entriesWithAmount = 0;
  for (const entry of entries) {
    if (entry.amount == null || !entry.amount_unit) continue;
    entriesWithAmount += 1;
    if (entry.amount_unit === 'g') grams += entry.amount;
    else if (entry.amount_unit === 'ml') milliliters += entry.amount;
    else if (entry.amount_unit === 'serving') servings += entry.amount;
  }
  return {
    grams: Math.round(grams),
    milliliters: Math.round(milliliters),
    servings: Math.round(servings * 10) / 10,
    entryCount: entries.length,
    entriesWithAmount,
  };
}

export type DayNutritionSnapshot = {
  dateKey: string;
  macros: MacroTotals;
  hasFoodLogs: boolean;
  entryCount: number;
  mealCalories: Record<MealType, number>;
  workouts: WorkoutListItem[];
  workoutMinutes: number;
  workoutCalories: number;
  status: DayCalorieStatus;
};

export function buildDaySnapshot(input: {
  dateKey: string;
  todayKey: string;
  entries: FoodEntry[];
  workouts: WorkoutListItem[];
  calorieTarget: number;
}): DayNutritionSnapshot {
  const macros = entriesToMacros(input.entries);
  const workoutMinutes = input.workouts.reduce((sum, w) => sum + workoutDurationMinutes(w), 0);
  const workoutCalories = input.workouts.reduce(
    (sum, w) => sum + Number(w.estimated_calories ?? 0),
    0,
  );
  return {
    dateKey: input.dateKey,
    macros,
    hasFoodLogs: input.entries.length > 0,
    entryCount: input.entries.length,
    mealCalories: mealCalorieBreakdown(input.entries),
    workouts: input.workouts,
    workoutMinutes,
    workoutCalories,
    status: classifyDayCalories({
      consumed: input.entries.length > 0 ? macros.calories : null,
      target: input.calorieTarget,
      dateKey: input.dateKey,
      todayKey: input.todayKey,
      hasFoodLogs: input.entries.length > 0,
    }),
  };
}

export type MonthlySummary = {
  daysWithFood: number;
  daysAchieved: number;
  daysBelow: number;
  daysAbove: number;
  daysInProgress: number;
  daysNoData: number;
  workoutDays: number;
  totalWorkoutMinutes: number;
  totalConsumed: number;
  /** Uses current active goal for each elapsed day — historical targets are not stored. */
  totalPlanned: number;
  averageConsumed: number | null;
  averageTarget: number | null;
  elapsedDays: number;
  futureDays: number;
};

export function buildMonthlySummary(input: {
  monthKeys: string[];
  todayKey: string;
  entriesByDate: Map<string, FoodEntry[]>;
  workoutsByDate: Map<string, WorkoutListItem[]>;
  calorieTarget: number;
}): MonthlySummary {
  let daysWithFood = 0;
  let daysAchieved = 0;
  let daysBelow = 0;
  let daysAbove = 0;
  let daysInProgress = 0;
  let daysNoData = 0;
  let workoutDays = 0;
  let totalWorkoutMinutes = 0;
  let totalConsumed = 0;
  let totalPlanned = 0;
  let elapsedDays = 0;
  let futureDays = 0;
  let consumedDays = 0;

  for (const key of input.monthKeys) {
    if (key > input.todayKey) {
      futureDays += 1;
      continue;
    }
    elapsedDays += 1;
    totalPlanned += input.calorieTarget;
    const dayEntries = input.entriesByDate.get(key) ?? [];
    const dayWorkouts = input.workoutsByDate.get(key) ?? [];
    if (dayWorkouts.length > 0) {
      workoutDays += 1;
      totalWorkoutMinutes += dayWorkouts.reduce((sum, w) => sum + workoutDurationMinutes(w), 0);
    }
    const snapshot = buildDaySnapshot({
      dateKey: key,
      todayKey: input.todayKey,
      entries: dayEntries,
      workouts: dayWorkouts,
      calorieTarget: input.calorieTarget,
    });
    if (snapshot.hasFoodLogs) {
      daysWithFood += 1;
      totalConsumed += snapshot.macros.calories;
      consumedDays += 1;
    }
    switch (snapshot.status) {
      case 'achieved':
        daysAchieved += 1;
        break;
      case 'below':
        daysBelow += 1;
        break;
      case 'above':
        daysAbove += 1;
        break;
      case 'in_progress':
        daysInProgress += 1;
        break;
      default:
        daysNoData += 1;
        break;
    }
  }

  return {
    daysWithFood,
    daysAchieved,
    daysBelow,
    daysAbove,
    daysInProgress,
    daysNoData,
    workoutDays,
    totalWorkoutMinutes,
    totalConsumed: Math.round(totalConsumed),
    totalPlanned: Math.round(totalPlanned),
    averageConsumed: consumedDays > 0 ? Math.round(totalConsumed / consumedDays) : null,
    averageTarget: elapsedDays > 0 ? Math.round(totalPlanned / elapsedDays) : null,
    elapsedDays,
    futureDays,
  };
}

export type WeeklyAverages = {
  avgCalories: number | null;
  avgProtein: number | null;
  avgCarbs: number | null;
  avgFat: number | null;
  daysWithFood: number;
  workoutDays: number;
  totalWorkoutMinutes: number;
  totalWorkoutCalories: number;
  daysOnTarget: number;
};

export function buildWeeklyAverages(input: {
  weekKeys: string[];
  todayKey: string;
  entriesByDate: Map<string, FoodEntry[]>;
  workoutsByDate: Map<string, WorkoutListItem[]>;
  calorieTarget: number;
}): WeeklyAverages {
  let daysWithFood = 0;
  let sumCal = 0;
  let sumP = 0;
  let sumC = 0;
  let sumF = 0;
  let workoutDays = 0;
  let totalWorkoutMinutes = 0;
  let totalWorkoutCalories = 0;
  let daysOnTarget = 0;

  for (const key of input.weekKeys) {
    if (key > input.todayKey) continue;
    const dayEntries = input.entriesByDate.get(key) ?? [];
    const dayWorkouts = input.workoutsByDate.get(key) ?? [];
    if (dayWorkouts.length) {
      workoutDays += 1;
      totalWorkoutMinutes += dayWorkouts.reduce((sum, w) => sum + workoutDurationMinutes(w), 0);
      totalWorkoutCalories += dayWorkouts.reduce(
        (sum, w) => sum + Number(w.estimated_calories ?? 0),
        0,
      );
    }
    if (!dayEntries.length) continue;
    daysWithFood += 1;
    const macros = entriesToMacros(dayEntries);
    sumCal += macros.calories;
    sumP += macros.proteinG;
    sumC += macros.carbsG;
    sumF += macros.fatG;
    const status = classifyDayCalories({
      consumed: macros.calories,
      target: input.calorieTarget,
      dateKey: key,
      todayKey: input.todayKey,
      hasFoodLogs: true,
    });
    if (status === 'achieved') daysOnTarget += 1;
  }

  const n = daysWithFood;
  return {
    avgCalories: n > 0 ? Math.round(sumCal / n) : null,
    avgProtein: n > 0 ? Math.round(sumP / n) : null,
    avgCarbs: n > 0 ? Math.round(sumC / n) : null,
    avgFat: n > 0 ? Math.round(sumF / n) : null,
    daysWithFood,
    workoutDays,
    totalWorkoutMinutes,
    totalWorkoutCalories: Math.round(totalWorkoutCalories),
    daysOnTarget,
  };
}
