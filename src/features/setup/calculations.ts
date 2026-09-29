/**
 * Energy estimation for Calio setup.
 *
 * Method: Mifflin–St Jeor BMR × lifestyle activity factor, then add an
 * estimated daily share of workout expenditure (sessions × duration × MET × weight / 7).
 * Lifestyle and workout are combined carefully so walking-at-work is not double-counted
 * with dedicated cardio sessions — lifestyle covers non-workout movement only.
 *
 * Macros: protein g/kg lean or total mass, fat ~25–30% of calories, carbs fill remainder.
 * Energy density: protein/carbs 4 kcal/g, fat 9 kcal/g.
 */

export type GoalType = 'lose_weight' | 'maintain_weight' | 'gain_weight';
export type SexForEstimate = 'female' | 'male' | 'prefer_not_to_say' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'demanding';
export type ExerciseType = 'strength' | 'cardio' | 'sports' | 'mixed' | 'other' | 'none';
export type Intensity = 'easy' | 'moderate' | 'hard';
export type Pace = 'slow' | 'moderate' | 'fast';

export type PlanInputs = {
  goalType: GoalType;
  sex: SexForEstimate;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  bodyFatPercent?: number | null;
  activityLevel: ActivityLevel;
  averageDailySteps?: number | null;
  sessionsPerWeek: number;
  exerciseType: ExerciseType;
  sessionMinutes: number;
  intensity: Intensity;
  targetWeightKg: number;
  pace: Pace | null;
  /** When true (under 18 / pregnant / breastfeeding), never auto-assign aggressive plans. */
  requiresManualCalories: boolean;
  manualDailyCalories?: number | null;
};

export type MacroTargets = {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type PlanEstimate = {
  bmr: number | null;
  tdee: number | null;
  dailyCalorieTarget: number;
  macros: MacroTargets;
  weeklyChangeKg: number;
  estimatedWeeks: number | null;
  usedManualCalories: boolean;
  canAutoEstimate: boolean;
  explanation: string;
  suggestedPace: Pace | null;
};

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  demanding: 1.725,
};

const INTENSITY_MET: Record<Intensity, number> = {
  easy: 4,
  moderate: 6,
  hard: 8,
};

const PACE_KG_PER_WEEK: Record<Pace, number> = {
  slow: 0.25,
  moderate: 0.5,
  fast: 0.75,
};

const KCAL_PER_KG = 7700;

export function mifflinStJeorBmr(input: {
  sex: SexForEstimate;
  weightKg: number;
  heightCm: number;
  ageYears: number;
}): number | null {
  if (input.sex === 'prefer_not_to_say' || input.sex === 'other') {
    return null;
  }
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.ageYears;
  return Math.round(input.sex === 'male' ? base + 5 : base - 161);
}

export function estimateWorkoutKcalPerDay(input: {
  sessionsPerWeek: number;
  sessionMinutes: number;
  intensity: Intensity;
  weightKg: number;
  exerciseType: ExerciseType;
}): number {
  if (input.exerciseType === 'none' || input.sessionsPerWeek <= 0 || input.sessionMinutes <= 0) {
    return 0;
  }
  const met = INTENSITY_MET[input.intensity];
  const hours = input.sessionMinutes / 60;
  const perSession = met * input.weightKg * hours;
  return Math.round((perSession * input.sessionsPerWeek) / 7);
}

/** Small bump when average steps are high beyond sedentary lifestyle factor. */
export function stepsAdjustmentKcal(averageDailySteps: number | null | undefined): number {
  if (!averageDailySteps || averageDailySteps < 7500) {
    return 0;
  }
  if (averageDailySteps < 10000) {
    return 50;
  }
  return 100;
}

export function leanMassKg(weightKg: number, bodyFatPercent: number | null | undefined): number {
  if (bodyFatPercent == null || bodyFatPercent <= 0 || bodyFatPercent >= 60) {
    return weightKg;
  }
  return weightKg * (1 - bodyFatPercent / 100);
}

export function suggestedPaceForGoal(goalType: GoalType): Pace | null {
  if (goalType === 'maintain_weight') {
    return null;
  }
  return 'moderate';
}

export function weeklyChangeForPace(goalType: GoalType, pace: Pace | null): number {
  if (goalType === 'maintain_weight' || !pace) {
    return 0;
  }
  const magnitude = PACE_KG_PER_WEEK[pace];
  return goalType === 'lose_weight' ? -magnitude : magnitude;
}

export function estimatedWeeksToGoal(
  currentKg: number,
  targetKg: number,
  weeklyChangeKg: number,
): number | null {
  if (weeklyChangeKg === 0) {
    return null;
  }
  const delta = targetKg - currentKg;
  if (Math.sign(delta) !== Math.sign(weeklyChangeKg)) {
    return null;
  }
  return Math.max(1, Math.ceil(Math.abs(delta / weeklyChangeKg)));
}

export function buildMacros(input: {
  calories: number;
  weightKg: number;
  leanKg: number;
  goalType: GoalType;
}): MacroTargets {
  const proteinPerKg = input.goalType === 'lose_weight' ? 2.0 : input.goalType === 'gain_weight' ? 1.8 : 1.6;
  const protein_g = Math.round(Math.min(input.leanKg, input.weightKg) * proteinPerKg);
  const fatKcalShare = input.goalType === 'lose_weight' ? 0.25 : 0.28;
  let fat_g = Math.round((input.calories * fatKcalShare) / 9);
  fat_g = Math.max(40, fat_g);

  let remaining = input.calories - protein_g * 4 - fat_g * 9;
  if (remaining < 0) {
    fat_g = Math.max(35, Math.round((input.calories * 0.2) / 9));
    remaining = Math.max(0, input.calories - protein_g * 4 - fat_g * 9);
  }
  const carbs_g = Math.max(0, Math.round(remaining / 4));

  return { protein_g, carbs_g, fat_g };
}

export function macrosEnergyKcal(macros: MacroTargets): number {
  return macros.protein_g * 4 + macros.carbs_g * 4 + macros.fat_g * 9;
}

export function estimatePlan(input: PlanInputs): PlanEstimate {
  const suggested = suggestedPaceForGoal(input.goalType);
  const pace = input.goalType === 'maintain_weight' ? null : (input.pace ?? suggested);
  const weeklyChangeKg = weeklyChangeForPace(input.goalType, pace);
  const weeks = estimatedWeeksToGoal(input.weightKg, input.targetWeightKg, weeklyChangeKg);

  const canAutoEstimate =
    !input.requiresManualCalories &&
    (input.sex === 'female' || input.sex === 'male') &&
    input.ageYears >= 18 &&
    input.heightCm > 0 &&
    input.weightKg > 0;

  if (!canAutoEstimate) {
    const manual = input.manualDailyCalories;
    if (!manual || manual < 1200) {
      return {
        bmr: null,
        tdee: null,
        dailyCalorieTarget: manual && manual > 0 ? Math.round(manual) : 0,
        macros: { protein_g: 0, carbs_g: 0, fat_g: 0 },
        weeklyChangeKg,
        estimatedWeeks: weeks,
        usedManualCalories: true,
        canAutoEstimate: false,
        explanation:
          'We need sex and adult age for automatic estimates, or a manual daily calorie target. This is a starting point you can edit.',
        suggestedPace: suggested,
      };
    }
    const macros = buildMacros({
      calories: manual,
      weightKg: input.weightKg,
      leanKg: leanMassKg(input.weightKg, input.bodyFatPercent),
      goalType: input.goalType,
    });
    return {
      bmr: null,
      tdee: null,
      dailyCalorieTarget: Math.round(manual),
      macros,
      weeklyChangeKg,
      estimatedWeeks: weeks,
      usedManualCalories: true,
      canAutoEstimate: false,
      explanation:
        'Using your manual calorie target. Macros are a starting split (protein prioritized; carbs fill the rest).',
      suggestedPace: suggested,
    };
  }

  const bmr = mifflinStJeorBmr({
    sex: input.sex,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    ageYears: input.ageYears,
  })!;

  const lifestyle = Math.round(bmr * ACTIVITY_FACTOR[input.activityLevel]);
  const workout = estimateWorkoutKcalPerDay({
    sessionsPerWeek: input.sessionsPerWeek,
    sessionMinutes: input.sessionMinutes,
    intensity: input.intensity,
    weightKg: input.weightKg,
    exerciseType: input.exerciseType,
  });
  const steps = stepsAdjustmentKcal(input.averageDailySteps);
  const tdee = lifestyle + workout + steps;

  const deltaPerDay = Math.round((weeklyChangeKg * KCAL_PER_KG) / 7);
  let daily = tdee + deltaPerDay;

  // Soft floors / ceilings for safety on auto plans.
  const floor = input.sex === 'female' ? 1400 : 1600;
  const ceiling = Math.round(tdee + 750);
  daily = Math.min(ceiling, Math.max(floor, daily));

  const macros = buildMacros({
    calories: daily,
    weightKg: input.weightKg,
    leanKg: leanMassKg(input.weightKg, input.bodyFatPercent),
    goalType: input.goalType,
  });

  return {
    bmr,
    tdee,
    dailyCalorieTarget: daily,
    macros,
    weeklyChangeKg,
    estimatedWeeks: weeks,
    usedManualCalories: false,
    canAutoEstimate: true,
    explanation:
      'Maintenance uses Mifflin–St Jeor BMR × daily lifestyle activity, plus an average of your workout energy. Your calorie target then applies the chosen weekly pace (~7,700 kcal per kg). Figures are estimates — adjust freely.',
    suggestedPace: suggested,
  };
}

export function isTargetCompatibleWithGoal(
  goalType: GoalType,
  currentKg: number,
  targetKg: number,
): boolean {
  const epsilon = 0.3;
  if (goalType === 'maintain_weight') {
    return Math.abs(targetKg - currentKg) <= epsilon;
  }
  if (goalType === 'lose_weight') {
    return targetKg < currentKg - epsilon;
  }
  return targetKg > currentKg + epsilon;
}

/** Reject extreme relative changes (e.g. >35% body weight). */
export function isTargetWithinSafeRange(currentKg: number, targetKg: number): boolean {
  if (currentKg <= 0 || targetKg <= 0) {
    return false;
  }
  const ratio = Math.abs(targetKg - currentKg) / currentKg;
  return ratio <= 0.35 && targetKg >= 40 && targetKg <= 250;
}
