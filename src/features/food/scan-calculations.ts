import type { NutritionBasis } from './open-food-facts';

export type NullableNutrition = {
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
};

export function parsePositiveAmount(value: string) {
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function scaleNutritionForAmount(
  nutrition: NullableNutrition,
  basis: NutritionBasis,
  amount: number,
  amountUnit: 'g' | 'ml' | 'serving',
  servingConversion?: { amount: number; unit: 'g' | 'ml' } | null,
): NullableNutrition {
  let factor: number;
  if (basis.kind === 'per100') {
    if (amountUnit === basis.unit) {
      factor = amount / 100;
    } else if (amountUnit === 'serving' && servingConversion?.unit === basis.unit) {
      factor = (amount * servingConversion.amount) / 100;
    } else {
      throw new Error('Amount unit does not match nutrition basis.');
    }
  } else if (amountUnit === 'serving') {
    factor = amount;
  } else {
    if (!basis.amount || basis.unit !== amountUnit) {
      throw new Error('This serving cannot be converted to the selected unit.');
    }
    factor = amount / basis.amount;
  }

  const scale = (value: number | null) => (value === null ? null : value * factor);
  return {
    calories: scale(nutrition.calories),
    proteinG: scale(nutrition.proteinG),
    carbsG: scale(nutrition.carbsG),
    fatG: scale(nutrition.fatG),
  };
}

export function suggestedMealForDate(dateKey: string, todayKey: string, hour: number) {
  if (dateKey !== todayKey) return null;
  if (hour < 11) return 'breakfast' as const;
  if (hour < 15) return 'lunch' as const;
  if (hour < 21) return 'dinner' as const;
  return 'snacks' as const;
}
