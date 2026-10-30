/**
 * Calendar day classification vs personalized calorie target.
 * Tolerance is intentional — exact equality is not required.
 */
export const CALORIE_GOAL_TOLERANCE_RATIO = 0.08;
export const CALORIE_GOAL_TOLERANCE_MIN = 80;

export type DayCalorieStatus =
  | 'achieved'
  | 'below'
  | 'above'
  | 'no_data'
  | 'future'
  | 'in_progress';

export function calorieGoalTolerance(target: number): number {
  return Math.max(CALORIE_GOAL_TOLERANCE_MIN, Math.round(target * CALORIE_GOAL_TOLERANCE_RATIO));
}

export function classifyDayCalories(input: {
  consumed: number | null;
  target: number;
  dateKey: string;
  todayKey: string;
  hasFoodLogs: boolean;
}): DayCalorieStatus {
  const { consumed, target, dateKey, todayKey, hasFoodLogs } = input;
  if (dateKey > todayKey) return 'future';
  if (!hasFoodLogs || consumed == null) return 'no_data';
  if (dateKey === todayKey) {
    // Current day stays "in progress" until end of day — avoid premature failure labels.
    const tolerance = calorieGoalTolerance(target);
    if (Math.abs(consumed - target) <= tolerance) return 'achieved';
    return 'in_progress';
  }
  const tolerance = calorieGoalTolerance(target);
  const delta = consumed - target;
  if (Math.abs(delta) <= tolerance) return 'achieved';
  if (delta < 0) return 'below';
  return 'above';
}
