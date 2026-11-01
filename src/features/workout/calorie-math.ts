/** Bump when formula / activity mapping changes — stored estimates stay historical. */
export const WORKOUT_CALORIE_CALC_VERSION = 3;

/**
 * Gross calories (includes resting metabolism for that period).
 * ACSM: kcal = MET × 3.5 × bodyWeightKg / 200 × durationMinutes
 */
export function estimateGrossCalories(input: {
  met: number;
  bodyWeightKg: number;
  durationMin: number;
}): number {
  if (input.met <= 0 || input.bodyWeightKg <= 0 || input.durationMin <= 0) {
    return 0;
  }
  return Math.round((input.met * 3.5 * input.bodyWeightKg * input.durationMin) / 200);
}

/**
 * Net active calories (additional energy above rest).
 * Prefer this when daily targets already include BMR / lifestyle TDEE.
 */
export function estimateNetActiveCalories(input: {
  met: number;
  bodyWeightKg: number;
  durationMin: number;
}): number {
  if (input.met <= 1 || input.bodyWeightKg <= 0 || input.durationMin <= 0) {
    return 0;
  }
  return estimateGrossCalories({
    met: input.met - 1,
    bodyWeightKg: input.bodyWeightKg,
    durationMin: input.durationMin,
  });
}
