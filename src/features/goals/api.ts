import { getSupabase } from '@/lib/supabase/client';

import type { Goal, Profile } from './types';

const PROFILE_COLUMNS =
  'id, display_name, height_cm, sex, birth_date, units, activity_level, onboarding_completed_at';
const GOAL_COLUMNS =
  'id, goal_type, target_weight_kg, daily_calorie_target, weekly_change_kg, protein_g, carbs_g, fat_g, is_active';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/** Create profile if the auth trigger did not run; safe under concurrent retries. */
export async function ensureProfile(
  userId: string,
  displayName?: string | null,
): Promise<Profile | null> {
  const existing = await fetchProfile(userId);
  if (existing) {
    return existing;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      display_name: displayName?.trim() || null,
    })
    .select(PROFILE_COLUMNS)
    .single();

  if (!error) {
    return data;
  }

  if (error.code === '23505') {
    return fetchProfile(userId);
  }

  throw error;
}

export async function fetchActiveGoal(userId: string): Promise<Goal | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('goals')
    .select(GOAL_COLUMNS)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
