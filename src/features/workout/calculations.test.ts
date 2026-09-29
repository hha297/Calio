import { describe, expect, it } from 'vitest';

import { estimateExerciseCalories, setVolumeKg, totalVolumeKg } from './calculations';

describe('workout volume', () => {
  it('computes weight × reps', () => {
    expect(setVolumeKg({ weightKg: 60, reps: 10 })).toBe(600);
  });

  it('sums the classic three-set example', () => {
    expect(
      totalVolumeKg([
        { weightKg: 60, reps: 10 },
        { weightKg: 60, reps: 10 },
        { weightKg: 65, reps: 8 },
      ]),
    ).toBe(1720);
  });
});

describe('estimateExerciseCalories', () => {
  it('returns a rounded MET estimate', () => {
    expect(
      estimateExerciseCalories({ met: 8, bodyWeightKg: 70, durationMin: 30 }),
    ).toBe(280);
  });
});
