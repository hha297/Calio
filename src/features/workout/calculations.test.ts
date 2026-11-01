import { describe, expect, it } from 'vitest';

import { classifyExerciseActivity } from './activity-classification';
import {
  estimateExercisePreviewCalories,
  estimateGrossCalories,
  estimateNetActiveCalories,
  estimateWorkoutSessionCalories,
  setVolumeKg,
  totalVolumeKg,
} from './calculations';

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

describe('ACSM calorie formula', () => {
  it('computes gross kcal = MET × 3.5 × kg / 200 × minutes', () => {
    expect(estimateGrossCalories({ met: 5, bodyWeightKg: 70, durationMin: 30 })).toBe(184);
  });

  it('computes net active kcal with (MET - 1)', () => {
    expect(estimateNetActiveCalories({ met: 5, bodyWeightKg: 70, durationMin: 30 })).toBe(147);
  });
});

describe('classifyExerciseActivity', () => {
  it('maps individual strength lifts to resistance category 02054 — ignores fabricated met hints', () => {
    const curl = classifyExerciseActivity({
      exerciseType: 'strength',
      name: 'Barbell Curl',
      metValue: 99,
    });
    expect(curl.met).toBe(3.5);
    expect(curl.compendiumCode).toBe('02054');
    expect(curl.evidence).toBe('compendium_category_proxy');
  });

  it('maps squat/deadlift names to resistance category 02052', () => {
    const squat = classifyExerciseActivity({
      exerciseType: 'strength',
      name: 'Back Squat',
      metValue: 6,
    });
    expect(squat.met).toBe(5.0);
    expect(squat.compendiumCode).toBe('02052');
  });

  it('bands bodyweight into Compendium calisthenics intensities', () => {
    const plank = classifyExerciseActivity({
      exerciseType: 'bodyweight',
      name: 'Plank Hold',
    });
    expect(plank.met).toBe(2.8);
    expect(plank.compendiumCode).toBe('02024');

    const burpee = classifyExerciseActivity({
      exerciseType: 'bodyweight',
      name: 'Burpees',
      metValue: 10,
    });
    expect(burpee.met).toBe(7.5);
    expect(burpee.compendiumCode).toBe('02020');
  });

  it('uses catalog cardio met when present', () => {
    const run = classifyExerciseActivity({
      exerciseType: 'cardio',
      name: 'Running',
      metValue: 9.8,
    });
    expect(run.met).toBe(9.8);
    expect(run.evidence).toBe('compendium_activity');
  });
});

describe('estimateExercisePreviewCalories', () => {
  it('explains why many strength cards share the same kcal at fixed weight/duration', () => {
    const a = estimateExercisePreviewCalories({
      exerciseType: 'strength',
      name: 'Bench Press',
      bodyWeightKg: 80,
      durationMin: 30,
    });
    const b = estimateExercisePreviewCalories({
      exerciseType: 'strength',
      name: 'Biceps Curl',
      bodyWeightKg: 80,
      durationMin: 30,
    });
    // Net (3.5-1)×3.5×80/200×30 = 105
    expect(a?.estimatedCalories).toBe(105);
    expect(b?.estimatedCalories).toBe(105);
    expect(a?.evidence).toBe('compendium_category_proxy');
  });

  it('does not force every bodyweight move to vigorous 7.5', () => {
    const light = estimateExercisePreviewCalories({
      exerciseType: 'bodyweight',
      name: 'Plank',
      bodyWeightKg: 80,
      durationMin: 30,
    });
    const vigorous = estimateExercisePreviewCalories({
      exerciseType: 'bodyweight',
      name: 'Burpees',
      bodyWeightKg: 80,
      durationMin: 30,
    });
    // light 2.8 → net 1.8×3.5×80/200×30 = 75.6 → 76
    expect(light?.estimatedCalories).toBe(76);
    // vigorous 7.5 → net 6.5×3.5×80/200×30 = 273
    expect(vigorous?.estimatedCalories).toBe(273);
  });

  it('returns null without body weight', () => {
    expect(
      estimateExercisePreviewCalories({
        exerciseType: 'cardio',
        metValue: 8,
        bodyWeightKg: 0,
      }),
    ).toBeNull();
  });
});

describe('estimateWorkoutSessionCalories', () => {
  it('aggregates allocated strength estimates without multiplying duration per lift', () => {
    const result = estimateWorkoutSessionCalories({
      bodyWeightKg: 70,
      activeDurationSec: 60 * 60,
      exercises: [
        {
          exerciseType: 'strength',
          name: 'Bench Press',
          sets: [{ weightKg: 60, reps: 10, completed: true }],
        },
        {
          exerciseType: 'strength',
          name: 'Curl',
          sets: [{ weightKg: 20, reps: 12, completed: true }],
        },
        {
          exerciseType: 'strength',
          name: 'Extension',
          sets: [{ weightKg: 25, reps: 12, completed: true }],
        },
      ],
    });
    // Resistance session 3.5 MET net × 70 kg × 60 min → 184; shared across lifts.
    expect(result.estimatedCalories).toBe(184);
    expect(result.calcVersion).toBe(3);
  });

  it('estimates stretching from activity duration, not resistance mappings', () => {
    const result = estimateWorkoutSessionCalories({
      bodyWeightKg: 70,
      activeDurationSec: 30 * 60,
      exercises: [
        {
          exerciseType: 'other',
          name: '90/90 Hip Stretch',
          sets: [{ durationSec: 30 * 60, completed: true }],
        },
      ],
    });
    // 2.3 MET stretch → net 1.3×3.5×70/200×30 = 48
    expect(result.estimatedCalories).toBe(48);
  });

  it('does not invent a body-weight fallback inside the estimator', () => {
    const result = estimateWorkoutSessionCalories({
      bodyWeightKg: 0,
      activeDurationSec: 1800,
      exercises: [{ exerciseType: 'cardio', metValue: 8, sets: [{ durationSec: 1800 }] }],
    });
    expect(result.estimatedCalories).toBe(0);
  });
});
