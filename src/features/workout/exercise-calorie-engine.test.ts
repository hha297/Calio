import { describe, expect, it } from 'vitest';

import { estimateWorkoutCalories, exerciseAllocationWeight } from './exercise-calorie-engine';

describe('exerciseAllocationWeight', () => {
  it('uses load × reps for strength', () => {
    expect(
      exerciseAllocationWeight(
        {
          localId: '1',
          name: 'Bench Press',
          exerciseType: 'strength',
          sets: [
            { weightKg: 60, reps: 10, completed: true },
            { weightKg: 60, reps: 8, completed: true },
          ],
        },
        80,
      ),
    ).toBe(60 * 10 + 60 * 8);
  });
});

describe('estimateWorkoutCalories', () => {
  it('allocates a shared resistance-session estimate across lifts (not unique per-lift research)', () => {
    const result = estimateWorkoutCalories({
      bodyWeightKg: 80,
      activeDurationSec: 60 * 60,
      exercises: [
        {
          localId: 'bench',
          name: 'Bench Press',
          exerciseType: 'strength',
          sets: [
            { weightKg: 80, reps: 8, completed: true },
            { weightKg: 80, reps: 8, completed: true },
            { weightKg: 80, reps: 8, completed: true },
          ],
        },
        {
          localId: 'curl',
          name: 'Biceps Curl',
          exerciseType: 'strength',
          sets: [
            { weightKg: 20, reps: 12, completed: true },
            { weightKg: 20, reps: 12, completed: true },
          ],
        },
        {
          localId: 'pulldown',
          name: 'Lat Pulldown',
          exerciseType: 'strength',
          sets: [
            { weightKg: 50, reps: 10, completed: true },
            { weightKg: 50, reps: 10, completed: true },
          ],
        },
      ],
    });

    expect(result.exercises.every((e) => e.method === 'allocated')).toBe(true);
    expect(result.totalEstimatedCalories).toBe(
      result.exercises.reduce((sum, e) => sum + e.estimatedCalories, 0),
    );
    // Bench has more volume → more allocated kcal than curls.
    const bench = result.exercises.find((e) => e.localId === 'bench')!;
    const curl = result.exercises.find((e) => e.localId === 'curl')!;
    expect(bench.estimatedCalories).toBeGreaterThan(curl.estimatedCalories);
    // Session block ≈ resistance 3.5 MET net for 60 min @ 80 kg → 210
    expect(result.totalEstimatedCalories).toBe(210);
  });

  it('uses direct estimates for timed cardio and does not double-count with resistance leftover', () => {
    const result = estimateWorkoutCalories({
      bodyWeightKg: 70,
      activeDurationSec: 40 * 60,
      exercises: [
        {
          localId: 'run',
          name: 'Running',
          exerciseType: 'cardio',
          metValue: 9.8,
          sets: [{ durationSec: 25 * 60, completed: true }],
        },
        {
          localId: 'curl',
          name: 'Biceps Curl',
          exerciseType: 'strength',
          sets: [{ weightKg: 15, reps: 12, completed: true }],
        },
      ],
    });

    const run = result.exercises.find((e) => e.localId === 'run')!;
    const curl = result.exercises.find((e) => e.localId === 'curl')!;
    expect(run.method).toBe('direct');
    expect(curl.method).toBe('allocated');
    expect(result.totalEstimatedCalories).toBe(run.estimatedCalories + curl.estimatedCalories);
    // Faster/harder run should not equal a slower same-distance placeholder — duration drives EE.
    expect(run.estimatedCalories).toBeGreaterThan(curl.estimatedCalories);
  });

  it('does not invent body weight', () => {
    const result = estimateWorkoutCalories({
      bodyWeightKg: 0,
      activeDurationSec: 1800,
      exercises: [
        {
          localId: 'a',
          name: 'Easy Jog',
          exerciseType: 'cardio',
          metValue: 7,
          sets: [{ durationSec: 1800, completed: true }],
        },
      ],
    });
    expect(result.totalEstimatedCalories).toBe(0);
  });
});
