import type { GoalType, ActivityLevel, ExerciseType, Intensity, Pace, SexForEstimate } from './calculations';
import type { UnitSystem } from './units';

export type SetupStepId =
  | 'goal'
  | 'safety'
  | 'body'
  | 'activity'
  | 'exercise'
  | 'target'
  | 'dietary'
  | 'summary';

export const SETUP_STEPS: SetupStepId[] = [
  'goal',
  'safety',
  'body',
  'activity',
  'exercise',
  'target',
  'dietary',
  'summary',
];

export type SetupAnswers = {
  goalType: GoalType | null;
  isPregnantOrBreastfeeding: boolean | null;
  units: UnitSystem;
  ageYears: number | null;
  sex: SexForEstimate | null;
  heightCm: number | null;
  weightKg: number | null;
  bodyFatPercent: number | null;
  activityLevel: ActivityLevel | null;
  averageDailySteps: number | null;
  sessionsPerWeek: number | null;
  exerciseType: ExerciseType | null;
  sessionMinutes: number | null;
  intensity: Intensity | null;
  targetWeightKg: number | null;
  pace: Pace | null;
  manualDailyCalories: number | null;
  /** Optional — stored in preferences jsonb; not used by diary yet. */
  dietaryPattern: string | null;
  mealsPerDay: number | null;
  /** Manual overrides on summary (preserved until user recalculates). */
  overrideCalories: number | null;
  overrideProteinG: number | null;
  overrideCarbsG: number | null;
  overrideFatG: number | null;
};

export const EMPTY_SETUP_ANSWERS: SetupAnswers = {
  goalType: null,
  isPregnantOrBreastfeeding: null,
  units: 'metric',
  ageYears: null,
  sex: null,
  heightCm: null,
  weightKg: null,
  bodyFatPercent: null,
  activityLevel: null,
  averageDailySteps: null,
  sessionsPerWeek: null,
  exerciseType: null,
  sessionMinutes: null,
  intensity: null,
  targetWeightKg: null,
  pace: null,
  manualDailyCalories: null,
  dietaryPattern: null,
  mealsPerDay: null,
  overrideCalories: null,
  overrideProteinG: null,
  overrideCarbsG: null,
  overrideFatG: null,
};

export type SetupProgress = {
  currentStep: SetupStepId;
  answers: SetupAnswers;
  updatedAt: string | null;
};

export function requiresManualCalories(answers: SetupAnswers): boolean {
  if (answers.isPregnantOrBreastfeeding === true) {
    return true;
  }
  if (answers.ageYears != null && answers.ageYears < 18) {
    return true;
  }
  if (answers.sex === 'prefer_not_to_say' || answers.sex === 'other') {
    return true;
  }
  return false;
}

export function nextStep(current: SetupStepId, answers: SetupAnswers): SetupStepId | null {
  const idx = SETUP_STEPS.indexOf(current);
  for (let i = idx + 1; i < SETUP_STEPS.length; i += 1) {
    const step = SETUP_STEPS[i];
    if (step === 'target' && answers.goalType === 'maintain_weight') {
      continue;
    }
    if (step === 'exercise' && (answers.sessionsPerWeek === 0 || answers.exerciseType === 'none')) {
      // Still show exercise step to confirm "none", but if already none with 0 sessions, can skip details via UI
    }
    return step;
  }
  return null;
}

export function previousStep(current: SetupStepId, answers: SetupAnswers): SetupStepId | null {
  const idx = SETUP_STEPS.indexOf(current);
  for (let i = idx - 1; i >= 0; i -= 1) {
    const step = SETUP_STEPS[i];
    if (step === 'target' && answers.goalType === 'maintain_weight') {
      continue;
    }
    return step;
  }
  return null;
}

export function stepIndex(step: SetupStepId, answers: SetupAnswers): { index: number; total: number } {
  const visible = SETUP_STEPS.filter((s) => {
    if (s === 'target' && answers.goalType === 'maintain_weight') {
      return false;
    }
    return true;
  });
  return { index: Math.max(0, visible.indexOf(step)), total: visible.length };
}
