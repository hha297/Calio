/**
 * UI taxonomy paths ↔ on-disk / catalog folder names that drifted.
 * When filtering by a library path, match any alias in the set.
 */
const LIBRARY_PATH_ALIAS_GROUPS: string[][] = [
  ['cardio/sports', 'cardio/sports-cardio'],
  ['cardio/machines', 'cardio/cardio-machines'],
  ['flexibility/chest-shoulders', 'flexibility/chest-shoulder'],
];

const PATH_TO_GROUP = new Map<string, string[]>();
for (const group of LIBRARY_PATH_ALIAS_GROUPS) {
  for (const path of group) {
    PATH_TO_GROUP.set(path, group);
  }
}

/** All path strings that should match a UI/library filter value. */
export function expandLibraryPaths(libraryPath: string | null | undefined): string[] {
  if (!libraryPath) return [];
  return PATH_TO_GROUP.get(libraryPath) ?? [libraryPath];
}

export function libraryPathsMatch(
  exercisePaths: string[] | null | undefined,
  libraryPath: string | null | undefined,
): boolean {
  if (!libraryPath) return true;
  const wanted = expandLibraryPaths(libraryPath);
  const have = exercisePaths ?? [];
  return wanted.some((path) => have.includes(path));
}
