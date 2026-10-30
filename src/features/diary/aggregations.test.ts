import { describe, expect, it } from 'vitest';

import {
  buildMonthlySummary,
  mealCalorieBreakdown,
  sumFoodQuantities,
  weekDateKeys,
} from '@/features/diary/aggregations';
import type { FoodEntryWithAmount } from '@/features/diary/api';

describe('weekDateKeys', () => {
  it('returns Monday–Sunday for a mid-week anchor', () => {
    expect(weekDateKeys('2026-10-29')).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });
});

describe('mealCalorieBreakdown', () => {
  it('sums by meal type', () => {
    expect(
      mealCalorieBreakdown([
        { meal_type: 'breakfast', calories: 100 },
        { meal_type: 'breakfast', calories: 50 },
        { meal_type: 'lunch', calories: 400 },
      ]),
    ).toEqual({ breakfast: 150, lunch: 400, dinner: 0, snacks: 0 });
  });
});

describe('sumFoodQuantities', () => {
  it('keeps g and ml separate', () => {
    const entries = [
      { amount: 120, amount_unit: 'g' },
      { amount: 250, amount_unit: 'ml' },
      { amount: 1, amount_unit: 'serving' },
      { amount: null, amount_unit: null },
    ] as FoodEntryWithAmount[];
    expect(sumFoodQuantities(entries)).toMatchObject({
      grams: 120,
      milliliters: 250,
      servings: 1,
      entryCount: 4,
      entriesWithAmount: 3,
    });
  });
});

describe('buildMonthlySummary', () => {
  it('ignores future days in planned totals', () => {
    const summary = buildMonthlySummary({
      monthKeys: ['2026-10-28', '2026-10-29', '2026-10-30'],
      todayKey: '2026-10-29',
      entriesByDate: new Map([
        [
          '2026-10-28',
          [
            {
              id: '1',
              logged_on: '2026-10-28',
              meal_type: 'lunch',
              quantity: 1,
              food_name: 'x',
              brand: null,
              serving_label: '1',
              calories: 2000,
              protein_g: 0,
              carbs_g: 0,
              fat_g: 0,
            },
          ],
        ],
      ]),
      workoutsByDate: new Map(),
      calorieTarget: 2000,
    });
    expect(summary.futureDays).toBe(1);
    expect(summary.elapsedDays).toBe(2);
    expect(summary.totalPlanned).toBe(4000);
    expect(summary.daysAchieved).toBe(1);
  });
});
