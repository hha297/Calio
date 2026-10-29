import { describe, expect, it } from 'vitest';

import { scaleNutritionForAmount, suggestedMealForDate } from './scan-calculations';

const nutrition = { calories: 200, proteinG: 10, carbsG: null, fatG: 4 };

describe('scaleNutritionForAmount', () => {
  it('scales per-100 g without replacing missing values', () => {
    expect(scaleNutritionForAmount(nutrition, { kind: 'per100', unit: 'g' }, 35, 'g')).toEqual({
      calories: 70,
      proteinG: 3.5,
      carbsG: null,
      fatG: 1.4,
    });
  });

  it('scales servings once', () => {
    expect(
      scaleNutritionForAmount(
        nutrition,
        { kind: 'serving', label: '30 g', amount: 30, unit: 'g' },
        2,
        'serving',
      ),
    ).toEqual({ calories: 400, proteinG: 20, carbsG: null, fatG: 8 });
  });

  it('uses a trusted serving conversion with per-100 nutrition', () => {
    expect(
      scaleNutritionForAmount(nutrition, { kind: 'per100', unit: 'g' }, 2, 'serving', {
        amount: 30,
        unit: 'g',
      }),
    ).toEqual({ calories: 120, proteinG: 6, carbsG: null, fatG: 2.4 });
  });

  it('does not invent a gram conversion for an unknown serving', () => {
    expect(() =>
      scaleNutritionForAmount(
        nutrition,
        { kind: 'serving', label: '1 package', amount: null, unit: null },
        50,
        'g',
      ),
    ).toThrow();
  });
});

describe('suggestedMealForDate', () => {
  it('suggests by local hour only for today', () => {
    expect(suggestedMealForDate('2026-10-29', '2026-10-29', 8)).toBe('breakfast');
    expect(suggestedMealForDate('2026-10-29', '2026-10-29', 16)).toBe('dinner');
    expect(suggestedMealForDate('2026-10-28', '2026-10-29', 8)).toBeNull();
  });
});
