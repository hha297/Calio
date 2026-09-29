export type StrengthSetInput = {
  weightKg: number;
  reps: number;
};

/** Volume for a weighted set: weight × reps. */
export function setVolumeKg(set: StrengthSetInput): number {
  if (set.weightKg <= 0 || set.reps <= 0) return 0;
  return Math.round(set.weightKg * set.reps * 10) / 10;
}

export function totalVolumeKg(sets: StrengthSetInput[]): number {
  return Math.round(sets.reduce((sum, set) => sum + setVolumeKg(set), 0) * 10) / 10;
}

/**
 * Rough MET-based estimate.
 * kcal ≈ MET × bodyKg × hours
 * Presented as an estimate only.
 */
export function estimateExerciseCalories(input: {
  met: number;
  bodyWeightKg: number;
  durationMin: number;
}): number {
  if (input.met <= 0 || input.bodyWeightKg <= 0 || input.durationMin <= 0) {
    return 0;
  }
  const hours = input.durationMin / 60;
  return Math.round(input.met * input.bodyWeightKg * hours);
}
