import type { FoodEntry } from '@/features/food/types';
import type { WorkoutListItem } from '@/features/workout/hooks';
import { getSupabase } from '@/lib/supabase/client';

const ENTRY_COLUMNS =
  'id, logged_on, meal_type, quantity, food_name, brand, serving_label, calories, protein_g, carbs_g, fat_g, amount, amount_unit';

export type FoodEntryWithAmount = FoodEntry & {
  amount: number | null;
  amount_unit: string | null;
};

export async function fetchFoodEntriesInRange(
  userId: string,
  startKey: string,
  endKey: string,
): Promise<FoodEntryWithAmount[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('food_entries')
    .select(ENTRY_COLUMNS)
    .eq('user_id', userId)
    .gte('logged_on', startKey)
    .lte('logged_on', endKey)
    .order('logged_on', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as FoodEntryWithAmount[];
}

export async function fetchWorkoutsInRange(
  userId: string,
  startKey: string,
  endKey: string,
): Promise<WorkoutListItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const start = `${startKey}T00:00:00`;
  const end = `${endKey}T23:59:59`;
  const { data, error } = await supabase
    .from('workouts')
    .select('id, name, started_at, ended_at, estimated_calories, status, active_duration_sec')
    .eq('user_id', userId)
    .gte('started_at', start)
    .lte('started_at', end)
    .order('started_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchDayWorkouts(
  userId: string,
  dateKey: string,
): Promise<WorkoutListItem[]> {
  return fetchWorkoutsInRange(userId, dateKey, dateKey);
}
