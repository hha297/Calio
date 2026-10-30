import { describe, expect, it } from 'vitest';

import {
  assertMacroTotal,
  DIET_PRESET_PERCENTS,
  DIET_PRESET_ORDER,
  gramsFromPercents,
  macroBalanceWarning,
  matchDietPreset,
  normalizePercents,
  resolveFiberTarget,
  setMacroPercent,
} from '@/features/diary/diet-presets';

describe('diet presets', () => {
  it('every fixed preset totals 100%', () => {
    for (const id of DIET_PRESET_ORDER) {
      if (id === 'custom') continue;
      expect(assertMacroTotal(DIET_PRESET_PERCENTS[id])).toBe(true);
    }
  });

  it('converts 2000 kcal 50/20/30 into expected grams', () => {
    expect(gramsFromPercents(2000, { carbs: 50, protein: 20, fat: 30 })).toEqual({
      carbsG: 250,
      proteinG: 100,
      fatG: 67,
    });
  });

  it('redistributes other macros when one changes', () => {
    const next = setMacroPercent({ carbs: 40, protein: 30, fat: 30 }, 'carbs', 50);
    expect(next.carbs).toBe(50);
    expect(next.protein + next.fat).toBe(50);
    expect(assertMacroTotal(next)).toBe(true);
  });

  it('switches to custom when percentages leave a preset', () => {
    expect(matchDietPreset({ carbs: 50, protein: 20, fat: 30 })).toBe('balanced');
    expect(matchDietPreset({ carbs: 51, protein: 20, fat: 29 })).toBe('custom');
  });

  it('normalizes rounding drift to 100%', () => {
    expect(normalizePercents({ carbs: 33, protein: 33, fat: 33 })).toEqual({
      carbs: 33,
      protein: 33,
      fat: 34,
    });
  });
});

describe('macroBalanceWarning', () => {
  it('ignores named presets', () => {
    expect(macroBalanceWarning(DIET_PRESET_PERCENTS.keto, 'keto')).toBeNull();
  });

  it('flags missing macros on custom splits', () => {
    expect(macroBalanceWarning({ carbs: 100, protein: 0, fat: 0 }, 'custom')).toBe('two_zero');
    expect(macroBalanceWarning({ carbs: 50, protein: 0, fat: 50 }, 'custom')).toBe(
      'zero_protein',
    );
    expect(macroBalanceWarning({ carbs: 0, protein: 50, fat: 50 }, 'custom')).toBe('zero_carbs');
    expect(macroBalanceWarning({ carbs: 95, protein: 5, fat: 0 }, 'custom')).toBe('zero_fat');
  });

  it('flags extreme single-macro custom splits', () => {
    expect(macroBalanceWarning({ carbs: 92, protein: 4, fat: 4 }, 'custom')).toBe(
      'extreme_single',
    );
    expect(macroBalanceWarning({ carbs: 50, protein: 8, fat: 42 }, 'custom')).toBe('low_protein');
  });
});

describe('resolveFiberTarget', () => {
  it('prefers stored fiber', () => {
    expect(
      resolveFiberTarget({ storedFiberG: 32, calorieTarget: 2000, sex: 'male' }),
    ).toBe(32);
  });

  it('uses sex-based AI when available', () => {
    expect(
      resolveFiberTarget({ storedFiberG: null, calorieTarget: 2000, sex: 'female' }),
    ).toBe(25);
    expect(
      resolveFiberTarget({ storedFiberG: null, calorieTarget: 2000, sex: 'male' }),
    ).toBe(38);
  });
});
