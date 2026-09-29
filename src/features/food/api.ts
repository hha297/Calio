import { getSupabase } from '@/lib/supabase/client';

import type { FoodEntry } from './types';

const ENTRY_COLUMNS =
  'id, logged_on, meal_type, quantity, food_name, brand, serving_label, calories, protein_g, carbs_g, fat_g';

export async function fetchFoodEntries(userId: string, dateKey: string): Promise<FoodEntry[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('food_entries')
    .select(ENTRY_COLUMNS)
    .eq('user_id', userId)
    .eq('logged_on', dateKey)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
