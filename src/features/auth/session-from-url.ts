import * as QueryParams from 'expo-auth-session/build/QueryParams';
import type { Session } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase/client';

/**
 * Completes auth when the app opens from an email confirm / reset link.
 * Supports both PKCE `code` and implicit `access_token` + `refresh_token`.
 */
export async function createSessionFromUrl(url: string): Promise<Session | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      throw error;
    }
    return data.session;
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) {
    throw error;
  }

  return data.session;
}
