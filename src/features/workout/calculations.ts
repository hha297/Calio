import {
  classifyExerciseActivity,
  type ActivityClass,
  type ActivityEvidence,
} from '@/features/workout/activity-classification';
import {
  estimateGrossCalories,
  estimateNetActiveCalories,
} from '@/features/workout/calorie-math';
import { estimateWorkoutCalories } from '@/features/workout/exercise-calorie-engine';

export {
  estimateGrossCalories,
  estimateNetActiveCalories,
  WORKOUT_CALORIE_CALC_VERSION,
} from '@/features/workout/calorie-math';

export type StrengthSetInput = {
  weightKg: number;
  reps: number;
};

/** @deprecated Prefer COMPENDIUM / classifyExerciseActivity — kept for older imports. */
export const ACTIVITY_MET = {
  resistanceGeneral: 3.5,
  resistanceVigorous: 6.0,
  calisthenicsVigorous: 7.5,
  cardioModerate: 7.0,
  cardioVigorous: 10.0,
  mobilityLight: 2.3,
} as const;

export type SessionCalorieEstimate = {
  estimatedCalories: number;
  activityMet: number;
  activityKey: string;
  intensity: 'light' | 'moderate' | 'vigorous';
  durationMin: number;
  bodyWeightKg: number;
  calcVersion: number;
};

/**
 * Estimate template variation duration from planned structure.
 * Uses working time + rest + a small transition buffer per exercise.
 * Not tied to training level — Advanced can be shorter than Beginner.
 */
export function estimateTemplateDurationMinutes(
  exercises: {
    plannedSets?: number | null;
    plannedReps?: number | null;
    plannedRestSec?: number | null;
  }[],
): number | null {
  if (!exercises.length) return null;
  const transitionSec = 45;
  const totalSec = exercises.reduce((sum, item) => {
    const sets = Math.max(1, item.plannedSets ?? 3);
    const rest = Math.max(0, item.plannedRestSec ?? 60);
    // Timed holds / cardio blocks often omit reps; give them a longer work window.
    const workSec = item.plannedReps == null && rest <= 15 ? 75 : 40;
    return sum + sets * (workSec + rest) + transitionSec;
  }, 0);
  return Math.max(10, Math.round(totalSec / 60));
}

/** Volume for a weighted set: weight × reps. */
export function setVolumeKg(set: StrengthSetInput): number {
  if (set.weightKg <= 0 || set.reps <= 0) return 0;
  return Math.round(set.weightKg * set.reps * 10) / 10;
}

export function totalVolumeKg(sets: StrengthSetInput[]): number {
  return Math.round(sets.reduce((sum, set) => sum + setVolumeKg(set), 0) * 10) / 10;
}

/** @deprecated Use estimateGrossCalories / estimateNetActiveCalories. */
export function estimateExerciseCalories(input: {
  met: number;
  bodyWeightKg: number;
  durationMin: number;
}): number {
  return estimateGrossCalories(input);
}

/** Reference window for list/detail preview estimates (not a logged duration). */
export const EXERCISE_PREVIEW_DURATION_MIN = 30;

export type ExercisePreviewEstimate = {
  estimatedCalories: number;
  durationMin: number;
  intensity: 'light' | 'moderate' | 'vigorous';
  activityKey: string;
  /** workout.activityClass.* i18n suffix */
  activityLabelKey: ActivityClass['labelKey'];
  evidence: ActivityEvidence;
};

/** Resolve internal activity class for a catalog exercise (MET never shown in UI). */
export function resolveExercisePreviewMet(input: {
  exerciseType: string;
  metValue?: number | null;
  name?: string | null;
}): ActivityClass {
  return classifyExerciseActivity(input);
}

/**
 * Net active kcal preview for list/detail (requires real body weight).
 * Returns null when weight is missing — never invent a default kg.
 */
export function estimateExercisePreviewCalories(input: {
  exerciseType: string;
  metValue?: number | null;
  name?: string | null;
  bodyWeightKg: number;
  durationMin?: number;
}): ExercisePreviewEstimate | null {
  if (!(input.bodyWeightKg > 0)) return null;
  const durationMin = Math.max(1, input.durationMin ?? EXERCISE_PREVIEW_DURATION_MIN);
  const resolved = classifyExerciseActivity({
    exerciseType: input.exerciseType,
    metValue: input.metValue,
    name: input.name,
  });
  return {
    estimatedCalories: estimateNetActiveCalories({
      met: resolved.met,
      bodyWeightKg: input.bodyWeightKg,
      durationMin,
    }),
    durationMin,
    intensity: resolved.intensity,
    activityKey: resolved.key,
    activityLabelKey: resolved.labelKey,
    evidence: resolved.evidence,
  };
}

type SessionExerciseInput = {
  exerciseType: string;
  metValue?: number | null;
  name?: string | null;
  sets: {
    durationSec?: number | string | null;
    weightKg?: number | string | null;
    reps?: number | string | null;
    restSec?: number | string | null;
    completed?: boolean;
  }[];
};

/**
 * Session total via exercise-level aggregation (no double full-session pass).
 * Prefer `estimateWorkoutCalories` from exercise-calorie-engine for new call sites.
 */
export function estimateWorkoutSessionCalories(input: {
  exercises: SessionExerciseInput[];
  activeDurationSec: number;
  bodyWeightKg: number;
}): SessionCalorieEstimate {
  const result = estimateWorkoutCalories({
    activeDurationSec: input.activeDurationSec,
    bodyWeightKg: input.bodyWeightKg,
    exercises: input.exercises.map((exercise, index) => ({
      localId: `legacy-${index}`,
      name: exercise.name ?? `Exercise ${index + 1}`,
      exerciseType: exercise.exerciseType,
      metValue: exercise.metValue,
      sets: exercise.sets.map((set) => ({
        weightKg: set.weightKg != null ? Number(set.weightKg) : null,
        reps: set.reps != null ? Number(set.reps) : null,
        durationSec: set.durationSec != null ? Number(set.durationSec) : null,
        restSec: set.restSec != null ? Number(set.restSec) : null,
        completed: set.completed,
      })),
    })),
  });

  const primary = result.exercises[0];
  return {
    estimatedCalories: result.totalEstimatedCalories,
    activityMet: 0,
    activityKey: primary?.activityKey ?? 'aggregated',
    intensity: result.intensity,
    durationMin: Math.max(1, Math.round(input.activeDurationSec / 60)),
    bodyWeightKg: input.bodyWeightKg,
    calcVersion: result.calcVersion,
  };
}
