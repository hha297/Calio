import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInMinutes, parseISO } from 'date-fns';

import { useAuth } from '@/features/auth/auth-provider';
import { estimateExerciseCalories, totalVolumeKg } from '@/features/workout/calculations';
import { getSupabase } from '@/lib/supabase/client';
import type { DraftExercise } from '@/stores/active-workout-store';

export type Exercise = {
  id: string;
  name: string;
  category: string;
  primary_muscles: string[];
  equipment: string | null;
  exercise_type: 'strength' | 'bodyweight' | 'cardio' | 'other';
  met_value: number | null;
};

export type WorkoutListItem = {
  id: string;
  name: string;
  started_at: string;
  ended_at: string | null;
  estimated_calories: number;
};

export function useExercises(search = '') {
  const trimmed = search.trim();
  return useQuery({
    queryKey: ['exercises', trimmed],
    queryFn: async (): Promise<Exercise[]> => {
      const supabase = getSupabase();
      if (!supabase) return [];
      let query = supabase
        .from('exercises')
        .select('id, name, category, primary_muscles, equipment, exercise_type, met_value')
        .order('name')
        .limit(50);
      if (trimmed) {
        query = query.ilike('name', `%${trimmed}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useWorkouts() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<WorkoutListItem[]> => {
      const supabase = getSupabase();
      if (!supabase || !userId) return [];
      const { data, error } = await supabase
        .from('workouts')
        .select('id, name, started_at, ended_at, estimated_calories')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDayWorkoutCalories(dateKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', 'day-calories', userId, dateKey],
    enabled: Boolean(userId),
    queryFn: async (): Promise<number> => {
      const supabase = getSupabase();
      if (!supabase || !userId) return 0;
      const start = `${dateKey}T00:00:00`;
      const end = `${dateKey}T23:59:59`;
      const { data, error } = await supabase
        .from('workouts')
        .select('estimated_calories')
        .eq('user_id', userId)
        .gte('started_at', start)
        .lte('started_at', end);
      if (error) throw error;
      return (data ?? []).reduce((sum, row) => sum + Number(row.estimated_calories ?? 0), 0);
    },
  });
}

export function useFinishWorkout() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      startedAt: string;
      exercises: DraftExercise[];
      bodyWeightKg: number;
    }) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in to save workouts.');

      const endedAt = new Date().toISOString();
      const durationMin = Math.max(
        1,
        differenceInMinutes(parseISO(endedAt), parseISO(input.startedAt)),
      );

      let estimated = 0;
      for (const exercise of input.exercises) {
        const durationFromSets = exercise.sets.reduce(
          (sum, set) => sum + (Number(set.durationSec) || 0),
          0,
        );
        const minutes =
          exercise.exerciseType === 'cardio' || exercise.exerciseType === 'other'
            ? Math.max(1, Math.round(durationFromSets / 60) || durationMin / Math.max(input.exercises.length, 1))
            : durationMin / Math.max(input.exercises.length, 1);
        estimated += estimateExerciseCalories({
          met: exercise.metValue ?? (exercise.exerciseType === 'cardio' ? 7 : 5),
          bodyWeightKg: input.bodyWeightKg || 70,
          durationMin: minutes,
        });
      }

      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: userId,
          name: input.name,
          started_at: input.startedAt,
          ended_at: endedAt,
          estimated_calories: estimated,
        })
        .select('id')
        .single();
      if (workoutError) throw workoutError;

      for (const [index, exercise] of input.exercises.entries()) {
        const { data: workoutExercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: workout.id,
            exercise_id: exercise.exerciseId,
            position: index,
            exercise_name: exercise.name,
            exercise_type: exercise.exerciseType,
          })
          .select('id')
          .single();
        if (exerciseError) throw exerciseError;

        const rows = exercise.sets.map((set) => ({
          workout_exercise_id: workoutExercise.id,
          set_number: set.setNumber,
          weight_kg: set.weightKg ? Number(set.weightKg) : null,
          reps: set.reps ? Number(set.reps) : null,
          duration_sec: set.durationSec ? Number(set.durationSec) : null,
          notes: set.notes || null,
        }));
        if (rows.length) {
          const { error: setsError } = await supabase.from('workout_sets').insert(rows);
          if (setsError) throw setsError;
        }
      }

      const volume = totalVolumeKg(
        input.exercises.flatMap((exercise) =>
          exercise.sets
            .filter((set) => set.weightKg && set.reps)
            .map((set) => ({
              weightKg: Number(set.weightKg),
              reps: Number(set.reps),
            })),
        ),
      );

      return { workoutId: workout.id as string, estimated, volume, durationMin };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
