export type ExerciseType = 'strength' | 'bodyweight' | 'cardio' | 'other';

export type WorkoutCategory =
  | 'Strength'
  | 'Cardio'
  | 'Bodyweight'
  | 'Flexibility'
  | 'Sports'
  | 'Other';

export type Exercise = {
  id: string;
  name: string;
  category: string;
  primary_muscles: string[];
  secondary_muscles?: string[];
  equipment: string | null;
  exercise_type: ExerciseType;
  instructions: string | null;
  description?: string | null;
  met_value: number | null;
  is_system: boolean;
  user_id: string | null;
};

export type WorkoutListItem = {
  id: string;
  name: string;
  started_at: string;
  ended_at: string | null;
  estimated_calories: number;
  status?: string;
  active_duration_sec?: number | null;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  is_system: boolean;
  user_id: string | null;
};

export type WorkoutTemplateExercise = {
  id: string;
  template_id: string;
  exercise_id: string | null;
  position: number;
  exercise_name: string;
  exercise_type: ExerciseType;
  planned_sets: number | null;
  planned_reps: number | null;
  planned_weight_kg: number | null;
  notes: string | null;
};

export type WorkoutDetail = WorkoutListItem & {
  notes: string | null;
  source_template_id: string | null;
  exercises: {
    id: string;
    exercise_id: string | null;
    position: number;
    exercise_name: string;
    exercise_type: ExerciseType;
    notes: string | null;
    sets: {
      id: string;
      set_number: number;
      weight_kg: number | null;
      reps: number | null;
      duration_sec: number | null;
      distance_m: number | null;
      rest_sec: number | null;
      completed: boolean;
      notes: string | null;
    }[];
  }[];
};

export const WORKOUT_CATEGORIES: {
  id: WorkoutCategory;
  exerciseTypes: ExerciseType[];
  icon: 'dumbbell' | 'heart' | 'person' | 'wind' | 'trophy' | 'more';
}[] = [
  { id: 'Strength', exerciseTypes: ['strength'], icon: 'dumbbell' },
  { id: 'Cardio', exerciseTypes: ['cardio'], icon: 'heart' },
  { id: 'Bodyweight', exerciseTypes: ['bodyweight'], icon: 'person' },
  { id: 'Flexibility', exerciseTypes: ['other'], icon: 'wind' },
  { id: 'Sports', exerciseTypes: ['other', 'cardio'], icon: 'trophy' },
  { id: 'Other', exerciseTypes: ['other', 'strength', 'bodyweight', 'cardio'], icon: 'more' },
];

export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'core',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'full body',
] as const;
