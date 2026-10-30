import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';

import { useAuth } from '@/features/auth/auth-provider';
import {
  createCustomExercise,
  createWorkoutTemplate,
  deleteCustomExercise,
  deleteWorkout,
  deleteWorkoutTemplate,
  fetchExercises,
  fetchFavoriteExerciseIds,
  fetchTemplateExercises,
  fetchWorkoutDetail,
  fetchWorkoutTemplates,
  fetchWorkouts,
  finishWorkoutSession,
  toggleExerciseFavorite,
} from '@/features/workout/api';
import { estimateExerciseCalories, totalVolumeKg } from '@/features/workout/calculations';
import type { ExerciseType } from '@/features/workout/types';
import type { DraftExercise } from '@/stores/active-workout-store';

export type { Exercise, WorkoutListItem } from '@/features/workout/types';

export function useExercises(input: {
  search?: string;
  category?: string | null;
  exerciseType?: ExerciseType | null;
  muscle?: string | null;
} = {}) {
  return useQuery({
    queryKey: [
      'exercises',
      input.search ?? '',
      input.category ?? '',
      input.exerciseType ?? '',
      input.muscle ?? '',
    ],
    queryFn: () =>
      fetchExercises({
        search: input.search,
        category: input.category,
        exerciseType: input.exerciseType,
        muscle: input.muscle,
      }),
  });
}

export function useExerciseFavorites() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['exercise-favorites', userId],
    enabled: Boolean(userId),
    queryFn: () => fetchFavoriteExerciseIds(userId!),
  });
}

export function useToggleExerciseFavorite() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { exerciseId: string; favorite: boolean }) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      await toggleExerciseFavorite({ userId, ...input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercise-favorites'] });
    },
  });
}

export function useCreateCustomExercise() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      category: string;
      exerciseType: ExerciseType;
      primaryMuscles?: string[];
      equipment?: string | null;
      description?: string | null;
      instructions?: string | null;
    }) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      return createCustomExercise({ userId, ...input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useDeleteCustomExercise() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      await deleteCustomExercise(id, userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercises'] });
      await queryClient.invalidateQueries({ queryKey: ['exercise-favorites'] });
    },
  });
}

export function useWorkoutTemplates() {
  return useQuery({
    queryKey: ['workout-templates'],
    queryFn: fetchWorkoutTemplates,
  });
}

export function useTemplateExercises(templateId: string | null) {
  return useQuery({
    queryKey: ['workout-templates', templateId, 'exercises'],
    enabled: Boolean(templateId),
    queryFn: () => fetchTemplateExercises(templateId!),
  });
}

export function useCreateWorkoutTemplate() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      category: string;
      description?: string | null;
      exercises: {
        exerciseId: string | null;
        exerciseName: string;
        exerciseType: ExerciseType;
        plannedSets?: number | null;
        plannedReps?: number | null;
        notes?: string | null;
      }[];
    }) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      return createWorkoutTemplate({ userId, ...input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
  });
}

export function useDeleteWorkoutTemplate() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      await deleteWorkoutTemplate(id, userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workout-templates'] });
    },
  });
}

export function useWorkouts() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', userId],
    enabled: Boolean(userId),
    queryFn: () => fetchWorkouts(userId!),
  });
}

export function useWorkoutDetail(id: string | null) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', 'detail', userId, id],
    enabled: Boolean(userId && id),
    queryFn: () => fetchWorkoutDetail(id!, userId!),
  });
}

export function useDayWorkoutCalories(dateKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', 'day-calories', userId, dateKey],
    enabled: Boolean(userId),
    staleTime: 30_000,
    queryFn: async (): Promise<number> => {
      const list = await fetchWorkouts(userId!, 100);
      const start = `${dateKey}T00:00:00`;
      const end = `${dateKey}T23:59:59`;
      return list
        .filter((row) => row.started_at >= start && row.started_at <= end)
        .reduce((sum, row) => sum + Number(row.estimated_calories ?? 0), 0);
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
      activeDurationSec: number;
      notes?: string;
      sourceTemplateId?: string | null;
      exercises: DraftExercise[];
      bodyWeightKg: number;
    }) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in to save workouts.');

      const endedAt = new Date().toISOString();
      const durationMin = Math.max(1, Math.round(input.activeDurationSec / 60));

      let estimated = 0;
      for (const exercise of input.exercises) {
        const durationFromSets = exercise.sets.reduce(
          (sum, set) => sum + (Number(set.durationSec) || 0),
          0,
        );
        const minutes =
          exercise.exerciseType === 'cardio' || exercise.exerciseType === 'other'
            ? Math.max(
                1,
                Math.round(durationFromSets / 60) ||
                  durationMin / Math.max(input.exercises.length, 1),
              )
            : durationMin / Math.max(input.exercises.length, 1);
        estimated += estimateExerciseCalories({
          met: exercise.metValue ?? (exercise.exerciseType === 'cardio' ? 7 : 5),
          bodyWeightKg: input.bodyWeightKg || 70,
          durationMin: minutes,
        });
      }

      const { workoutId } = await finishWorkoutSession({
        userId,
        name: input.name,
        startedAt: input.startedAt,
        endedAt,
        activeDurationSec: input.activeDurationSec,
        notes: input.notes,
        sourceTemplateId: input.sourceTemplateId,
        estimatedCalories: estimated,
        exercises: input.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          exerciseType: exercise.exerciseType,
          notes: exercise.notes || null,
          sets: exercise.sets.map((set) => ({
            setNumber: set.setNumber,
            weightKg: set.weightKg ? Number(set.weightKg) : null,
            reps: set.reps ? Number(set.reps) : null,
            durationSec: set.durationSec ? Number(set.durationSec) : null,
            distanceM: set.distanceM ? Number(set.distanceM) : null,
            restSec: set.restSec ? Number(set.restSec) : null,
            completed: set.completed,
            notes: set.notes || null,
          })),
        })),
      });

      const volume = totalVolumeKg(
        input.exercises.flatMap((exercise) =>
          exercise.sets
            .filter((set) => set.completed && set.weightKg && set.reps)
            .map((set) => ({
              weightKg: Number(set.weightKg),
              reps: Number(set.reps),
            })),
        ),
      );

      return {
        workoutId,
        estimated: Math.round(estimated),
        volume,
        durationMin,
        endedAt,
        startedAt: input.startedAt,
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useDeleteWorkout() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      await deleteWorkout(id, userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function formatElapsed(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function sessionDayKey(iso: string) {
  return parseISO(iso).toISOString().slice(0, 10);
}
