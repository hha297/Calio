import { libraryPathsMatch } from '@/features/workout/catalog/library-path-aliases';
import type { ExerciseDifficulty } from '@/features/workout/catalog/library-taxonomy';
import type { ExerciseType } from '@/features/workout/types';

import raw from './system-exercises.json';

export type SystemExerciseSeed = {
  name: string;
  category: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  equipment: string | null;
  exercise_type: ExerciseType;
  movement_pattern: string | null;
  difficulty: ExerciseDifficulty;
  instructions: string;
  tips: string | null;
  description: string | null;
  common_mistakes?: string | null;
  safety_notes?: string | null;
  met_value: number | null;
  library_paths: string[];
  image_key: string | null;
  image_storage_path?: string | null;
  slug?: string | null;
  content_version?: number;
};

export const SYSTEM_EXERCISES = raw as SystemExerciseSeed[];

export function slugifyExerciseName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function localExerciseId(name: string): string {
  return `local:${slugifyExerciseName(name)}`;
}

export function isLocalExerciseId(id: string): boolean {
  return id.startsWith('local:');
}

export function findSystemExerciseByName(name: string): SystemExerciseSeed | undefined {
  const key = name.toLowerCase();
  return SYSTEM_EXERCISES.find((item) => item.name.toLowerCase() === key);
}

export function findSystemExerciseByLocalId(id: string): SystemExerciseSeed | undefined {
  if (!isLocalExerciseId(id)) return undefined;
  const slug = id.slice('local:'.length);
  return SYSTEM_EXERCISES.find((item) => slugifyExerciseName(item.name) === slug);
}

export function filterSystemExercises(input: {
  libraryPath?: string | null;
  search?: string;
  equipment?: string | null;
  difficulty?: string | null;
  muscle?: string | null;
}): SystemExerciseSeed[] {
  const search = input.search?.trim().toLowerCase() ?? '';
  return SYSTEM_EXERCISES.filter((item) => {
    if (input.libraryPath && !libraryPathsMatch(item.library_paths, input.libraryPath)) {
      return false;
    }
    if (search && !item.name.toLowerCase().includes(search)) return false;
    if (input.equipment && (item.equipment ?? 'none') !== input.equipment) return false;
    if (input.difficulty && item.difficulty !== input.difficulty) return false;
    if (input.muscle) {
      const muscles = [...item.primary_muscles, ...item.secondary_muscles];
      if (!muscles.includes(input.muscle)) return false;
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));
}
