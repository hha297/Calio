import type { ImageWorkoutCategory } from '@/features/workout/category-assets';

export type LibrarySubcategory = {
  id: string;
  /** i18n key suffix under workout.subcategory.* */
  labelKey: string;
};

export type LibraryTopCategory = ImageWorkoutCategory;

/** library_paths use `{top}/{sub}` lowercase, e.g. strength/chest */
export const LIBRARY_TAXONOMY: Record<LibraryTopCategory, LibrarySubcategory[]> = {
  Strength: [
    { id: 'chest', labelKey: 'chest' },
    { id: 'back', labelKey: 'back' },
    { id: 'shoulders', labelKey: 'shoulders' },
    { id: 'biceps', labelKey: 'biceps' },
    { id: 'triceps', labelKey: 'triceps' },
    { id: 'forearms', labelKey: 'forearms' },
    { id: 'quadriceps', labelKey: 'quadriceps' },
    { id: 'hamstrings', labelKey: 'hamstrings' },
    { id: 'glutes', labelKey: 'glutes' },
    { id: 'calves', labelKey: 'calves' },
    { id: 'core', labelKey: 'core' },
  ],
  Cardio: [
    { id: 'running', labelKey: 'running' },
    { id: 'walking', labelKey: 'walking' },
    { id: 'cycling', labelKey: 'cycling' },
    { id: 'rowing', labelKey: 'rowing' },
    { id: 'swimming', labelKey: 'swimming' },
    { id: 'machines', labelKey: 'machines' },
    { id: 'hiit', labelKey: 'hiit' },
    { id: 'jumping', labelKey: 'jumping' },
    { id: 'sports', labelKey: 'sports' },
  ],
  Flexibility: [
    { id: 'full-body', labelKey: 'fullBody' },
    { id: 'chest-shoulders', labelKey: 'chestShoulders' },
    { id: 'back-spine', labelKey: 'backSpine' },
    { id: 'hips', labelKey: 'hips' },
    { id: 'hamstrings-legs', labelKey: 'hamstringsLegs' },
    { id: 'ankles', labelKey: 'ankles' },
    { id: 'yoga', labelKey: 'yoga' },
    { id: 'stretching', labelKey: 'stretching' },
    { id: 'mobility', labelKey: 'mobility' },
  ],
  Bodyweight: [
    { id: 'chest', labelKey: 'chest' },
    { id: 'back', labelKey: 'back' },
    { id: 'shoulders', labelKey: 'shoulders' },
    { id: 'arms', labelKey: 'arms' },
    { id: 'quadriceps', labelKey: 'quadriceps' },
    { id: 'hamstrings-glutes', labelKey: 'hamstringsGlutes' },
    { id: 'calves', labelKey: 'calves' },
    { id: 'core', labelKey: 'core' },
    { id: 'full-body', labelKey: 'fullBody' },
    { id: 'calisthenics', labelKey: 'calisthenics' },
  ],
};

export function libraryPath(top: LibraryTopCategory, sub: string): string {
  return `${top.toLowerCase()}/${sub}`;
}

export function parseLibraryTop(value: string | undefined): LibraryTopCategory | null {
  if (value === 'Strength' || value === 'Cardio' || value === 'Flexibility' || value === 'Bodyweight') {
    return value;
  }
  return null;
}

export function isValidSubcategory(top: LibraryTopCategory, sub: string | undefined): boolean {
  if (!sub) return false;
  return LIBRARY_TAXONOMY[top].some((item) => item.id === sub);
}

export const EQUIPMENT_FILTERS = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'kettlebell',
  'bodyweight',
  'band',
  'none',
] as const;

export const DIFFICULTY_FILTERS = ['beginner', 'intermediate', 'advanced'] as const;

export type ExerciseDifficulty = (typeof DIFFICULTY_FILTERS)[number];
