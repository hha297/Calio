export type MacroTotals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type DailyBalanceInput = {
  consumed: number;
  burned: number;
  target: number;
};

export type DailyBalance = {
  consumed: number;
  burned: number;
  target: number;
  remaining: number;
  net: number;
  status: 'under' | 'on_track' | 'over';
};

export function scaleNutrition(
  perServing: MacroTotals,
  quantity: number,
): MacroTotals {
  return {
    calories: round1(perServing.calories * quantity),
    proteinG: round1(perServing.proteinG * quantity),
    carbsG: round1(perServing.carbsG * quantity),
    fatG: round1(perServing.fatG * quantity),
  };
}

export function sumMacros(entries: MacroTotals[]): MacroTotals {
  return entries.reduce(
    (acc, item) => ({
      calories: round1(acc.calories + item.calories),
      proteinG: round1(acc.proteinG + item.proteinG),
      carbsG: round1(acc.carbsG + item.carbsG),
      fatG: round1(acc.fatG + item.fatG),
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

/**
 * Remaining = target - consumed + burned (estimate).
 * Burned calories are estimates, not exact expenditure.
 */
export function calculateDailyBalance(input: DailyBalanceInput): DailyBalance {
  const remaining = Math.round(input.target - input.consumed + input.burned);
  const net = Math.round(input.consumed - input.burned);
  let status: DailyBalance['status'] = 'on_track';
  if (remaining > 50) status = 'under';
  if (remaining < -50) status = 'over';
  return {
    consumed: Math.round(input.consumed),
    burned: Math.round(input.burned),
    target: Math.round(input.target),
    remaining,
    net,
    status,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
