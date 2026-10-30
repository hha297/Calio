import { getSupabase } from '@/lib/supabase/client';

import type { Profile } from '@/features/goals/types';

const PROFILE_COLUMNS =
  'id, display_name, height_cm, sex, birth_date, units, activity_level, onboarding_completed_at, avatar_url';

export type ProfileUpdate = {
  display_name?: string | null;
  height_cm?: number | null;
  sex?: Profile['sex'];
  birth_date?: string | null;
  units?: Profile['units'];
  activity_level?: Profile['activity_level'];
  avatar_url?: string | null;
};

export async function updateProfile(userId: string, patch: ProfileUpdate): Promise<Profile> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select(PROFILE_COLUMNS)
    .single();

  if (!error) {
    return data as Profile;
  }

  const message = error.message?.toLowerCase() ?? '';
  if (
    patch.avatar_url !== undefined &&
    message.includes('avatar_url') &&
    (message.includes('column') || message.includes('does not exist'))
  ) {
    throw new Error(
      'Avatar column is missing in the database. Apply migration 20261029210000_profile_avatar.sql (supabase db push).',
    );
  }

  throw error;
}

export type UserDataExport = {
  exportedAt: string;
  userId: string;
  email: string | null;
  profile: unknown;
  goals: unknown[];
  bodyMeasurements: unknown[];
  foodEntries: unknown[];
  workouts: unknown[];
};

/** Export the authenticated user's own rows (RLS-scoped). */
export async function exportUserData(userId: string, email: string | null): Promise<UserDataExport> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const [profile, goals, measurements, foodEntries, workouts] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', userId)
      .order('measured_on', { ascending: false }),
    supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', userId)
      .order('logged_on', { ascending: false })
      .limit(5000),
    supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(1000),
  ]);

  for (const result of [profile, goals, measurements, foodEntries, workouts]) {
    if (result.error) throw result.error;
  }

  return {
    exportedAt: new Date().toISOString(),
    userId,
    email,
    profile: profile.data,
    goals: goals.data ?? [],
    bodyMeasurements: measurements.data ?? [],
    foodEntries: foodEntries.data ?? [],
    workouts: workouts.data ?? [],
  };
}

/** Calls the delete-account Edge Function with the user JWT. */
export async function deleteOwnAccount(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  });

  if (error) {
    throw new Error(error.message || 'Could not delete account.');
  }

  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }
}
