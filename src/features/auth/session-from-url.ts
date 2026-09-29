import * as QueryParams from 'expo-auth-session/build/QueryParams';
import type { Session } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase/client';

export type SessionFromUrlResult = {
  session: Session | null;
  isPasswordRecovery: boolean;
};

/**
 * Completes auth when the app opens from an email confirm / reset link.
 * Supports both PKCE `code` and implicit `access_token` + `refresh_token`.
 */
export async function createSessionFromUrl(url: string): Promise<SessionFromUrlResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { session: null, isPasswordRecovery: false };
  }

  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }

  const isPasswordRecovery = params.type === 'recovery';

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      throw error;
    }
    return { session: data.session, isPasswordRecovery };
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (!accessToken || !refreshToken) {
    return { session: null, isPasswordRecovery };
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) {
    throw error;
  }

  return { session: data.session, isPasswordRecovery };
}
