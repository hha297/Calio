import type { ImageSourcePropType } from 'react-native';

import type { ExerciseType, WorkoutCategory } from './types';

/** Visual hub categories that have local artwork under `assets/images/workout/categories/`. */
export type ImageWorkoutCategory = Extract<
  WorkoutCategory,
  'Strength' | 'Cardio' | 'Flexibility' | 'Bodyweight'
>;

/**
 * Exact local assets (verified as `.jpg` in `assets/images/workout/categories/`).
 * Static require() only — do not build paths dynamically.
 */
export const WORKOUT_CATEGORY_IMAGES: Record<ImageWorkoutCategory, ImageSourcePropType> = {
  Strength: require('../../../assets/images/workout/categories/strength.jpg'),
  Cardio: require('../../../assets/images/workout/categories/cardio.jpg'),
  Flexibility: require('../../../assets/images/workout/categories/flexibility.jpg'),
  Bodyweight: require('../../../assets/images/workout/categories/bodyweight.jpg'),
};

/**
 * Hub category → catalog `exercise_type` (DB `category` is body-part labels like Legs/Chest).
 */
export const WORKOUT_CATEGORY_TO_TYPE: Record<ImageWorkoutCategory, ExerciseType> = {
  Strength: 'strength',
  Cardio: 'cardio',
  Bodyweight: 'bodyweight',
  Flexibility: 'other',
};

/** Secondary filter chips shown only inside that category (values match catalog data). */
export const WORKOUT_CATEGORY_TAGS: Record<
  ImageWorkoutCategory,
  { kind: 'muscle' | 'equipment'; values: string[] }
> = {
  Strength: {
    kind: 'muscle',
    values: ['chest', 'lats', 'shoulders', 'quadriceps', 'hamstrings', 'glutes', 'back'],
  },
  Cardio: {
    kind: 'equipment',
    values: ['none', 'bike', 'rope', 'rower'],
  },
  Bodyweight: {
    kind: 'muscle',
    values: ['chest', 'lats', 'shoulders', 'core', 'abs', 'quadriceps', 'glutes'],
  },
  Flexibility: {
    kind: 'muscle',
    values: ['full body', 'hamstrings', 'shoulders'],
  },
};

export const WORKOUT_IMAGE_CATEGORIES: ImageWorkoutCategory[] = [
  'Strength',
  'Cardio',
  'Flexibility',
  'Bodyweight',
];
