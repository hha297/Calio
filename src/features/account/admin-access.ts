import Constants from 'expo-constants';

import { getSupabase } from '@/lib/supabase/client';

type Extra = {
  adminUrl?: string;
};

export function getAdminDashboardUrl(): string | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  const value = (
    process.env.EXPO_PUBLIC_ADMIN_URL ||
    extra.adminUrl ||
    ''
  ).trim();
  return value || null;
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) return false;
  return data?.role === 'admin';
}
