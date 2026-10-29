import { getSupabase } from '@/lib/supabase/client';

import type { Goal, Profile } from './types';

const PROFILE_COLUMNS =
  'id, display_name, height_cm, sex, birth_date, units, activity_level, onboarding_completed_at, avatar_url';
const GOAL_COLUMNS =
  'id, goal_type, target_weight_kg, daily_calorie_target, weekly_change_kg, protein_g, carbs_g, fat_g, is_active';

const PROFILE_COLUMNS_WITHOUT_AVATAR =
  'id, display_name, height_cm, sex, birth_date, units, activity_level, onboarding_completed_at';

function isMissingAvatarColumn(error: { message?: string; code?: string } | null): boolean {
  const message = error?.message?.toLowerCase() ?? '';
  return message.includes('avatar_url') && (message.includes('column') || message.includes('does not exist'));
}

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

  if (!error) {
    return data;
  }

  // Hosted DB may not have applied the avatar migration yet.
  if (isMissingAvatarColumn(error)) {
    const fallback = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS_WITHOUT_AVATAR)
      .eq('id', userId)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    return fallback.data ? { ...fallback.data, avatar_url: null } : null;
  }

  throw error;
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
