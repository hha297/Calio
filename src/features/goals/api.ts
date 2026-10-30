import { getSupabase } from '@/lib/supabase/client';

import type { Goal, Profile } from './types';

const PROFILE_COLUMNS =
  'id, display_name, height_cm, sex, birth_date, units, activity_level, onboarding_completed_at, avatar_url';
const GOAL_COLUMNS =
  'id, goal_type, target_weight_kg, daily_calorie_target, weekly_change_kg, protein_g, carbs_g, fat_g, fiber_g, diet_preset, carbs_pct, protein_pct, fat_pct, is_active';

const GOAL_COLUMNS_LEGACY =
  'id, goal_type, target_weight_kg, daily_calorie_target, weekly_change_kg, protein_g, carbs_g, fat_g, is_active';

function isMissingDietColumns(error: { message?: string; code?: string } | null): boolean {
  const message = error?.message?.toLowerCase() ?? '';
  return (
    (message.includes('diet_preset') ||
      message.includes('fiber_g') ||
      message.includes('carbs_pct') ||
      message.includes('protein_pct') ||
      message.includes('fat_pct')) &&
    (message.includes('column') || message.includes('does not exist'))
  );
}

function withDietDefaults(row: Record<string, unknown>): Goal {
  return {
    ...(row as Goal),
    fiber_g: (row.fiber_g as number | null | undefined) ?? null,
    diet_preset: (row.diet_preset as Goal['diet_preset'] | undefined) ?? null,
    carbs_pct: (row.carbs_pct as number | null | undefined) ?? null,
    protein_pct: (row.protein_pct as number | null | undefined) ?? null,
    fat_pct: (row.fat_pct as number | null | undefined) ?? null,
  };
}

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

  if (!error) {
    return data ? withDietDefaults(data) : null;
  }

  if (isMissingDietColumns(error)) {
    const fallback = await supabase
      .from('goals')
      .select(GOAL_COLUMNS_LEGACY)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    return fallback.data ? withDietDefaults(fallback.data) : null;
  }

  throw error;
}

export type UpdateGoalDietInput = {
  dietPreset: Goal['diet_preset'];
  carbsPct: number;
  proteinPct: number;
  fatPct: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  fiberG: number;
};

/** Update macro targets on the active goal without rewriting food history. */
export async function updateActiveGoalDiet(
  userId: string,
  input: UpdateGoalDietInput,
): Promise<Goal> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const active = await fetchActiveGoal(userId);
  if (!active) throw new Error('No active goal to update.');

  const payload = {
    diet_preset: input.dietPreset,
    carbs_pct: input.carbsPct,
    protein_pct: input.proteinPct,
    fat_pct: input.fatPct,
    carbs_g: input.carbsG,
    protein_g: input.proteinG,
    fat_g: input.fatG,
    fiber_g: input.fiberG,
  };

  const { data, error } = await supabase
    .from('goals')
    .update(payload)
    .eq('id', active.id)
    .eq('user_id', userId)
    .select(GOAL_COLUMNS)
    .single();

  if (!error) {
    return withDietDefaults(data);
  }

  if (isMissingDietColumns(error)) {
    const legacy = await supabase
      .from('goals')
      .update({
        carbs_g: input.carbsG,
        protein_g: input.proteinG,
        fat_g: input.fatG,
      })
      .eq('id', active.id)
      .eq('user_id', userId)
      .select(GOAL_COLUMNS_LEGACY)
      .single();
    if (legacy.error) throw legacy.error;
    return withDietDefaults({
      ...legacy.data,
      ...payload,
    });
  }

  throw error;
}
