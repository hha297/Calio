import {
  classifyExerciseActivity,
  classifyResistanceSession,
  type ActivityClass,
} from '@/features/workout/activity-classification';
import {
  estimateNetActiveCalories,
  WORKOUT_CALORIE_CALC_VERSION,
} from '@/features/workout/calorie-math';

export type EstimateMethod = 'direct' | 'allocated';

export type LoggedSetInput = {
  weightKg?: number | null;
  reps?: number | null;
  durationSec?: number | null;
  distanceM?: number | null;
  restSec?: number | null;
  completed?: boolean;
};

export type LoggedExerciseInput = {
  localId: string;
  name: string;
  exerciseType: string;
  metValue?: number | null;
  sets: LoggedSetInput[];
};

export type ExerciseCalorieEstimate = {
  localId: string;
  estimatedCalories: number;
  method: EstimateMethod;
  activityKey: string;
  activityLabelKey: ActivityClass['labelKey'];
  intensity: ActivityClass['intensity'];
  durationSec: number;
  bodyWeightKg: number;
  calcVersion: number;
};

export type WorkoutCalorieEstimate = {
  exercises: ExerciseCalorieEstimate[];
  totalEstimatedCalories: number;
  calcVersion: number;
  bodyWeightKg: number;
  intensity: ActivityClass['intensity'];
};

function completedSets(sets: LoggedSetInput[]): LoggedSetInput[] {
  const done = sets.filter((set) => set.completed !== false);
  return done.length ? done : sets;
}

function setDurationSec(sets: LoggedSetInput[]): number {
  return completedSets(sets).reduce((sum, set) => sum + (Number(set.durationSec) || 0), 0);
}

/** Mechanical volume proxy for allocating a resistance-session estimate. */
export function exerciseAllocationWeight(
  exercise: LoggedExerciseInput,
  bodyWeightKg: number,
): number {
  const sets = completedSets(exercise.sets);
  if (exercise.exerciseType === 'strength') {
    return sets.reduce((sum, set) => {
      const w = Number(set.weightKg) || 0;
      const r = Number(set.reps) || 0;
      return sum + Math.max(0, w * r);
    }, 0);
  }
  if (exercise.exerciseType === 'bodyweight') {
    return sets.reduce((sum, set) => {
      const r = Number(set.reps) || 0;
      // Body-weight moves: reps × body mass as a relative work proxy (not a direct EE formula).
      return sum + Math.max(0, bodyWeightKg * r);
    }, 0);
  }
  return 0;
}

function distributeWholeCalories(
  total: number,
  weights: number[],
): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const safeTotal = Math.max(0, Math.round(total));
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (safeTotal === 0) return weights.map(() => 0);
  if (sumW <= 0) {
    const base = Math.floor(safeTotal / n);
    const out = weights.map(() => base);
    let rem = safeTotal - base * n;
    for (let i = 0; rem > 0; i += 1, rem -= 1) out[i % n] += 1;
    return out;
  }
  const raw = weights.map((w) => (safeTotal * w) / sumW);
  const floors = raw.map((v) => Math.floor(v));
  let rem = safeTotal - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < rem; k += 1) out[order[k % n]!.i] += 1;
  return out;
}

/**
 * Exercise-level engine + session aggregator.
 * Session total = sum of non-overlapping exercise estimates (no second full-session pass).
 *
 * Strength/bodyweight shares a resistance-session model; per-lift kcal are **allocated**,
 * not claimed as unique direct measurements of that lift.
 */
export function estimateWorkoutCalories(input: {
  exercises: LoggedExerciseInput[];
  activeDurationSec: number;
  bodyWeightKg: number;
}): WorkoutCalorieEstimate {
  const bodyWeightKg = input.bodyWeightKg;
  const calcVersion = WORKOUT_CALORIE_CALC_VERSION;
  if (!(bodyWeightKg > 0) || input.exercises.length === 0) {
    return {
      exercises: input.exercises.map((exercise) => ({
        localId: exercise.localId,
        estimatedCalories: 0,
        method: 'direct',
        activityKey: 'none',
        activityLabelKey: 'mixed',
        intensity: 'light',
        durationSec: 0,
        bodyWeightKg,
        calcVersion,
      })),
      totalEstimatedCalories: 0,
      calcVersion,
      bodyWeightKg,
      intensity: 'light',
    };
  }

  const activeSec = Math.max(0, Math.round(input.activeDurationSec));
  const results = new Map<string, ExerciseCalorieEstimate>();

  const resistance = input.exercises.filter(
    (e) => e.exerciseType === 'strength' || e.exerciseType === 'bodyweight',
  );
  const cardio = input.exercises.filter((e) => e.exerciseType === 'cardio');
  const flexibility = input.exercises.filter((e) => e.exerciseType === 'other');

  // --- Direct: cardio & flexibility with (or without) logged duration ---
  let usedSec = 0;
  const untimedDirect: LoggedExerciseInput[] = [];

  for (const exercise of [...cardio, ...flexibility]) {
    const durationSec = setDurationSec(exercise.sets);
    if (durationSec > 0) {
      const cls = classifyExerciseActivity({
        exerciseType: exercise.exerciseType,
        metValue: exercise.metValue,
        name: exercise.name,
      });
      const minutes = Math.max(1 / 60, durationSec / 60);
      const kcal = estimateNetActiveCalories({
        met: cls.met,
        bodyWeightKg,
        durationMin: minutes,
      });
      usedSec += durationSec;
      results.set(exercise.localId, {
        localId: exercise.localId,
        estimatedCalories: kcal,
        method: 'direct',
        activityKey: cls.key,
        activityLabelKey: cls.labelKey,
        intensity: cls.intensity,
        durationSec,
        bodyWeightKg,
        calcVersion,
      });
    } else {
      untimedDirect.push(exercise);
    }
  }

  const remainingSec = Math.max(0, activeSec - usedSec);

  // --- Resistance block: one session model, allocated to lifts ---
  let resistanceSec = 0;
  if (resistance.length) {
    // Prefer leftover active time (includes rest/transitions for the block).
    // If nothing left (all time logged on cardio), give a minimal 60s/exercise floor
    // so allocation still reflects work without inventing a second full session.
    resistanceSec =
      remainingSec > 0
        ? remainingSec
        : Math.max(60, resistance.length * 60);
    // When untimed direct also need a share of remaining, split.
    if (untimedDirect.length && remainingSec > 0) {
      const parts = resistance.length + untimedDirect.length;
      resistanceSec = Math.round((remainingSec * resistance.length) / parts);
    }

    const session = classifyResistanceSession({ exercises: resistance });
    const blockKcal = estimateNetActiveCalories({
      met: session.met,
      bodyWeightKg,
      durationMin: Math.max(1 / 60, resistanceSec / 60),
    });
    const weights = resistance.map((e) => exerciseAllocationWeight(e, bodyWeightKg));
    const shares = distributeWholeCalories(blockKcal, weights);
    const durationShares = distributeWholeCalories(resistanceSec, weights.map((w) => (w > 0 ? w : 1)));

    resistance.forEach((exercise, index) => {
      results.set(exercise.localId, {
        localId: exercise.localId,
        estimatedCalories: shares[index] ?? 0,
        method: 'allocated',
        activityKey: session.key,
        activityLabelKey: session.labelKey,
        intensity: session.intensity,
        durationSec: durationShares[index] ?? 0,
        bodyWeightKg,
        calcVersion,
      });
    });
  }

  // Untimed cardio/flexibility share leftover after resistance allocation.
  const leftoverForUntimed = Math.max(
    0,
    remainingSec - (resistance.length ? resistanceSec : 0),
  );
  if (untimedDirect.length) {
    const pool = leftoverForUntimed > 0 ? leftoverForUntimed : untimedDirect.length * 60;
    const eachSec = Math.max(1, Math.round(pool / untimedDirect.length));
    for (const exercise of untimedDirect) {
      const cls = classifyExerciseActivity({
        exerciseType: exercise.exerciseType,
        metValue: exercise.metValue,
        name: exercise.name,
      });
      const kcal = estimateNetActiveCalories({
        met: cls.met,
        bodyWeightKg,
        durationMin: eachSec / 60,
      });
      results.set(exercise.localId, {
        localId: exercise.localId,
        estimatedCalories: kcal,
        method: 'direct',
        activityKey: cls.key,
        activityLabelKey: cls.labelKey,
        intensity: cls.intensity,
        durationSec: eachSec,
        bodyWeightKg,
        calcVersion,
      });
    }
  }

  const exercises = input.exercises.map((exercise) => {
    const hit = results.get(exercise.localId);
    if (hit) return hit;
    return {
      localId: exercise.localId,
      estimatedCalories: 0,
      method: 'direct' as const,
      activityKey: 'none',
      activityLabelKey: 'mixed' as const,
      intensity: 'light' as const,
      durationSec: 0,
      bodyWeightKg,
      calcVersion,
    };
  });

  const totalEstimatedCalories = exercises.reduce((sum, e) => sum + e.estimatedCalories, 0);
  const intensity =
    exercises.find((e) => e.intensity === 'vigorous')?.intensity ??
    exercises.find((e) => e.intensity === 'moderate')?.intensity ??
    'light';

  return {
    exercises,
    totalEstimatedCalories,
    calcVersion,
    bodyWeightKg,
    intensity,
  };
}
