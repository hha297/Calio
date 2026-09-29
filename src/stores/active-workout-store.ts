import { create } from 'zustand';

export type DraftSet = {
  localId: string;
  setNumber: number;
  weightKg: string;
  reps: string;
  durationSec: string;
  notes: string;
};

export type DraftExercise = {
  localId: string;
  exerciseId: string | null;
  name: string;
  exerciseType: 'strength' | 'bodyweight' | 'cardio' | 'other';
  metValue: number | null;
  sets: DraftSet[];
};

type ActiveWorkoutState = {
  startedAt: string | null;
  name: string;
  exercises: DraftExercise[];
  start: (name?: string) => void;
  reset: () => void;
  setName: (name: string) => void;
  addExercise: (exercise: Omit<DraftExercise, 'localId' | 'sets'>) => void;
  removeExercise: (localId: string) => void;
  addSet: (exerciseLocalId: string) => void;
  updateSet: (
    exerciseLocalId: string,
    setLocalId: string,
    patch: Partial<Omit<DraftSet, 'localId' | 'setNumber'>>,
  ) => void;
  removeSet: (exerciseLocalId: string, setLocalId: string) => void;
};

function id(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  startedAt: null,
  name: 'Workout',
  exercises: [],
  start: (name = 'Workout') =>
    set({
      startedAt: new Date().toISOString(),
      name,
      exercises: [],
    }),
  reset: () => set({ startedAt: null, name: 'Workout', exercises: [] }),
  setName: (name) => set({ name }),
  addExercise: (exercise) =>
    set({
      exercises: [
        ...get().exercises,
        {
          ...exercise,
          localId: id(),
          sets: [
            {
              localId: id(),
              setNumber: 1,
              weightKg: '',
              reps: '',
              durationSec: '',
              notes: '',
            },
          ],
        },
      ],
    }),
  removeExercise: (localId) =>
    set({ exercises: get().exercises.filter((item) => item.localId !== localId) }),
  addSet: (exerciseLocalId) =>
    set({
      exercises: get().exercises.map((exercise) => {
        if (exercise.localId !== exerciseLocalId) return exercise;
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              localId: id(),
              setNumber: exercise.sets.length + 1,
              weightKg: '',
              reps: '',
              durationSec: '',
              notes: '',
            },
          ],
        };
      }),
    }),
  updateSet: (exerciseLocalId, setLocalId, patch) =>
    set({
      exercises: get().exercises.map((exercise) => {
        if (exercise.localId !== exerciseLocalId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((draftSet) =>
            draftSet.localId === setLocalId ? { ...draftSet, ...patch } : draftSet,
          ),
        };
      }),
    }),
  removeSet: (exerciseLocalId, setLocalId) =>
    set({
      exercises: get().exercises.map((exercise) => {
        if (exercise.localId !== exerciseLocalId) return exercise;
        const next = exercise.sets
          .filter((draftSet) => draftSet.localId !== setLocalId)
          .map((draftSet, index) => ({ ...draftSet, setNumber: index + 1 }));
        return { ...exercise, sets: next };
      }),
    }),
}));
