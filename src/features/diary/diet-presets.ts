/**
 * Diet presets and macro percentage → gram conversion.
 *
 * Energy factors: carbs 4 kcal/g, protein 4 kcal/g, fat 9 kcal/g.
 * Fiber is NOT part of the 100% C/P/F distribution.
 *
 * Preset ratios are Calio application defaults / starting points.
 * Paleo, Mediterranean, and DASH values are suggested configurations —
 * those patterns are not defined by a single official macro split.
 */

export type DietPresetId =
  | 'balanced'
  | 'low_carb'
  | 'high_protein'
  | 'keto'
  | 'atkins'
  | 'paleo'
  | 'mediterranean'
  | 'dash'
  | 'custom';

export type MacroPercents = {
  carbs: number;
  protein: number;
  fat: number;
};

export type MacroGrams = {
  carbsG: number;
  proteinG: number;
  fatG: number;
};

export const DIET_PRESET_ORDER: DietPresetId[] = [
  'balanced',
  'low_carb',
  'high_protein',
  'keto',
  'atkins',
  'paleo',
  'mediterranean',
  'dash',
  'custom',
];

/** Presets with fixed ratios (Custom has none). */
export const DIET_PRESET_PERCENTS: Record<Exclude<DietPresetId, 'custom'>, MacroPercents> = {
  balanced: { carbs: 50, protein: 20, fat: 30 },
  low_carb: { carbs: 25, protein: 30, fat: 45 },
  high_protein: { carbs: 40, protein: 35, fat: 25 },
  keto: { carbs: 5, protein: 20, fat: 75 },
  atkins: { carbs: 10, protein: 30, fat: 60 },
  paleo: { carbs: 35, protein: 25, fat: 40 },
  mediterranean: { carbs: 45, protein: 20, fat: 35 },
  dash: { carbs: 55, protein: 20, fat: 25 },
};

export const PRESETS_WITH_VARIABILITY_NOTE: DietPresetId[] = [
  'atkins',
  'paleo',
  'mediterranean',
  'dash',
  'keto',
];

export function assertMacroTotal(p: MacroPercents): boolean {
  return p.carbs + p.protein + p.fat === 100;
}

export function percentsFromGrams(
  calories: number,
  grams: { carbsG: number; proteinG: number; fatG: number },
): MacroPercents {
  if (calories <= 0) return { ...DIET_PRESET_PERCENTS.balanced };
  const carbs = Math.round(((grams.carbsG * 4) / calories) * 100);
  const protein = Math.round(((grams.proteinG * 4) / calories) * 100);
  let fat = 100 - carbs - protein;
  if (fat < 0) {
    return normalizePercents({ carbs, protein, fat: 0 });
  }
  return normalizePercents({ carbs, protein, fat });
}

/** Force exact 100% with non-negative integers. */
export function normalizePercents(input: MacroPercents): MacroPercents {
  let carbs = Math.max(0, Math.round(input.carbs));
  let protein = Math.max(0, Math.round(input.protein));
  let fat = Math.max(0, Math.round(input.fat));
  let total = carbs + protein + fat;
  if (total === 0) return { ...DIET_PRESET_PERCENTS.balanced };
  if (total !== 100) {
    carbs = Math.round((carbs / total) * 100);
    protein = Math.round((protein / total) * 100);
    fat = 100 - carbs - protein;
    if (fat < 0) {
      protein = Math.max(0, protein + fat);
      fat = 0;
      carbs = 100 - protein;
    }
  }
  return { carbs, protein, fat };
}

/**
 * Edit one macro; redistribute the remainder proportionally across the other two.
 */
export function setMacroPercent(
  current: MacroPercents,
  key: keyof MacroPercents,
  nextValue: number,
): MacroPercents {
  const clamped = Math.max(0, Math.min(100, Math.round(nextValue)));
  const others = (['carbs', 'protein', 'fat'] as const).filter((k) => k !== key);
  const remaining = 100 - clamped;
  const aKey = others[0]!;
  const bKey = others[1]!;
  const aPrev = current[aKey];
  const bPrev = current[bKey];
  const otherSum = aPrev + bPrev;

  let a: number;
  let b: number;
  if (otherSum <= 0) {
    a = Math.floor(remaining / 2);
    b = remaining - a;
  } else {
    a = Math.round((remaining * aPrev) / otherSum);
    b = remaining - a;
  }

  if (a < 0) {
    b += a;
    a = 0;
  }
  if (b < 0) {
    a += b;
    b = 0;
  }

  return { carbs: 0, protein: 0, fat: 0, [key]: clamped, [aKey]: a, [bKey]: b };
}

export function matchDietPreset(percents: MacroPercents): DietPresetId {
  const normalized = normalizePercents(percents);
  for (const id of DIET_PRESET_ORDER) {
    if (id === 'custom') continue;
    const preset = DIET_PRESET_PERCENTS[id];
    if (
      preset.carbs === normalized.carbs &&
      preset.protein === normalized.protein &&
      preset.fat === normalized.fat
    ) {
      return id;
    }
  }
  return 'custom';
}

export function gramsFromPercents(
  calorieTarget: number,
  percents: MacroPercents,
): MacroGrams {
  const p = normalizePercents(percents);
  const carbsG = Math.round((calorieTarget * p.carbs) / 100 / 4);
  const proteinG = Math.round((calorieTarget * p.protein) / 100 / 4);
  const fatG = Math.round((calorieTarget * p.fat) / 100 / 9);
  return { carbsG, proteinG, fatG };
}

/**
 * Adult fiber Adequate Intake–style reference when sex is known (US AI approx.):
 * female 25 g/day, male 38 g/day. Otherwise 14 g per 1000 kcal of the calorie target,
 * clamped to 25–38 g. Stored goal.fiber_g always wins when present.
 */
export function resolveFiberTarget(input: {
  storedFiberG: number | null | undefined;
  calorieTarget: number;
  sex: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null | undefined;
}): number {
  if (input.storedFiberG != null && input.storedFiberG > 0) {
    return Math.round(input.storedFiberG);
  }
  if (input.sex === 'female') return 25;
  if (input.sex === 'male') return 38;
  const fromCalories = Math.round((input.calorieTarget * 14) / 1000);
  return Math.min(38, Math.max(25, fromCalories || 25));
}

/** Gentle informational band vs body weight (g/kg). Not a medical prescription. */
export function proteinDensityWarning(
  proteinG: number,
  weightKg: number | null | undefined,
): 'low' | 'high' | null {
  if (weightKg == null || weightKg <= 0 || proteinG <= 0) return null;
  const density = proteinG / weightKg;
  if (density < 0.8) return 'low';
  if (density > 2.2) return 'high';
  return null;
}

/**
 * Informational only — flags clearly unbalanced custom splits
 * (e.g. 100/0/0 or missing an entire macro). Does not block save.
 * Known presets are skipped; intentional low-carb patterns use small carb % already.
 */
export type MacroBalanceWarningId =
  | 'zero_protein'
  | 'zero_fat'
  | 'zero_carbs'
  | 'extreme_single'
  | 'low_protein'
  | 'two_zero';

export function macroBalanceWarning(
  percents: MacroPercents,
  preset: DietPresetId,
): MacroBalanceWarningId | null {
  if (preset !== 'custom') return null;
  const { carbs, protein, fat } = percents;
  const zeroCount = [carbs, protein, fat].filter((v) => v === 0).length;
  if (zeroCount >= 2) return 'two_zero';
  if (protein === 0) return 'zero_protein';
  if (fat === 0) return 'zero_fat';
  if (carbs === 0) return 'zero_carbs';
  if (carbs >= 90 || protein >= 90 || fat >= 90) return 'extreme_single';
  if (protein > 0 && protein < 10) return 'low_protein';
  return null;
}

export function resolveDietFromGoal(input: {
  dailyCalorieTarget: number;
  carbsG: number | null | undefined;
  proteinG: number | null | undefined;
  fatG: number | null | undefined;
  carbsPct: number | null | undefined;
  proteinPct: number | null | undefined;
  fatPct: number | null | undefined;
  dietPreset: DietPresetId | null | undefined;
}): { preset: DietPresetId; percents: MacroPercents; grams: MacroGrams } {
  if (
    input.carbsPct != null &&
    input.proteinPct != null &&
    input.fatPct != null &&
    input.carbsPct + input.proteinPct + input.fatPct === 100
  ) {
    const percents = {
      carbs: input.carbsPct,
      protein: input.proteinPct,
      fat: input.fatPct,
    };
    return {
      preset: input.dietPreset ?? matchDietPreset(percents),
      percents,
      grams: gramsFromPercents(input.dailyCalorieTarget, percents),
    };
  }

  if (input.carbsG != null && input.proteinG != null && input.fatG != null) {
    const percents = percentsFromGrams(input.dailyCalorieTarget, {
      carbsG: input.carbsG,
      proteinG: input.proteinG,
      fatG: input.fatG,
    });
    return {
      preset: input.dietPreset ?? matchDietPreset(percents),
      percents,
      grams: {
        carbsG: Math.round(input.carbsG),
        proteinG: Math.round(input.proteinG),
        fatG: Math.round(input.fatG),
      },
    };
  }

  const percents = { ...DIET_PRESET_PERCENTS.balanced };
  return {
    preset: 'balanced',
    percents,
    grams: gramsFromPercents(input.dailyCalorieTarget, percents),
  };
}
