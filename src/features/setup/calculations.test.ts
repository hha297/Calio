import { describe, expect, it } from 'vitest';

import {
  buildMacros,
  estimatePlan,
  isTargetCompatibleWithGoal,
  macrosEnergyKcal,
  mifflinStJeorBmr,
  weeklyChangeForPace,
} from './calculations';

describe('mifflinStJeorBmr', () => {
  it('returns null when sex is not female/male', () => {
    expect(
      mifflinStJeorBmr({ sex: 'prefer_not_to_say', weightKg: 70, heightCm: 170, ageYears: 30 }),
    ).toBeNull();
  });

  it('estimates higher BMR for male than female at same stats', () => {
    const male = mifflinStJeorBmr({ sex: 'male', weightKg: 70, heightCm: 170, ageYears: 30 })!;
    const female = mifflinStJeorBmr({ sex: 'female', weightKg: 70, heightCm: 170, ageYears: 30 })!;
    expect(male).toBeGreaterThan(female);
  });
});

describe('estimatePlan', () => {
  it('builds a cut plan with deficit and consistent macros', () => {
    const plan = estimatePlan({
      goalType: 'lose_weight',
      sex: 'female',
      ageYears: 28,
      heightCm: 165,
      weightKg: 70,
      activityLevel: 'light',
      sessionsPerWeek: 3,
      exerciseType: 'strength',
      sessionMinutes: 45,
      intensity: 'moderate',
      targetWeightKg: 65,
      pace: 'moderate',
      requiresManualCalories: false,
    });

    expect(plan.canAutoEstimate).toBe(true);
    expect(plan.tdee).toBeGreaterThan(1000);
    expect(plan.dailyCalorieTarget).toBeLessThan(plan.tdee!);
    expect(plan.weeklyChangeKg).toBe(-0.5);
    const energy = macrosEnergyKcal(plan.macros);
    expect(Math.abs(energy - plan.dailyCalorieTarget)).toBeLessThan(40);
  });

  it('requires manual calories when flagged', () => {
    const plan = estimatePlan({
      goalType: 'maintain_weight',
      sex: 'prefer_not_to_say',
      ageYears: 30,
      heightCm: 170,
      weightKg: 70,
      activityLevel: 'sedentary',
      sessionsPerWeek: 0,
      exerciseType: 'none',
      sessionMinutes: 0,
      intensity: 'easy',
      targetWeightKg: 70,
      pace: null,
      requiresManualCalories: true,
      manualDailyCalories: 2100,
    });

    expect(plan.usedManualCalories).toBe(true);
    expect(plan.dailyCalorieTarget).toBe(2100);
  });
});

describe('weeklyChangeForPace', () => {
  it('signs change by goal', () => {
    expect(weeklyChangeForPace('lose_weight', 'slow')).toBe(-0.25);
    expect(weeklyChangeForPace('gain_weight', 'fast')).toBe(0.75);
    expect(weeklyChangeForPace('maintain_weight', 'moderate')).toBe(0);
  });
});

describe('isTargetCompatibleWithGoal', () => {
  it('validates direction', () => {
    expect(isTargetCompatibleWithGoal('lose_weight', 80, 75)).toBe(true);
    expect(isTargetCompatibleWithGoal('lose_weight', 80, 85)).toBe(false);
    expect(isTargetCompatibleWithGoal('maintain_weight', 80, 80.1)).toBe(true);
  });
});

describe('buildMacros', () => {
  it('keeps protein prioritized', () => {
    const macros = buildMacros({
      calories: 2000,
      weightKg: 70,
      leanKg: 55,
      goalType: 'lose_weight',
    });
    expect(macros.protein_g).toBeGreaterThan(100);
    expect(macros.fat_g).toBeGreaterThan(30);
    expect(macros.carbs_g).toBeGreaterThan(0);
  });
});
