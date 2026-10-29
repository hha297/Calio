import type { Session } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase/client';

export { isAuthCallbackUrl } from './auth-callback-url';

export type SessionFromUrlResult = {
  session: Session | null;
  isPasswordRecovery: boolean;
};

/** Parse search + hash params from an auth callback URL (SDK 58 no longer exports QueryParams). */
function getQueryParams(input: string): {
  errorCode: string | null;
  params: Record<string, string>;
} {
  const url = new URL(input, 'https://phony.example');
  const errorCode = url.searchParams.get('errorCode');
  url.searchParams.delete('errorCode');
  const params = Object.fromEntries(url.searchParams.entries());
  if (url.hash) {
    new URLSearchParams(url.hash.replace(/^#/, '')).forEach((value, key) => {
      params[key] = value;
    });
  }
  return { errorCode, params };
}

/**
 * Completes auth when the app opens from an email confirm / reset link.
 * Supports both PKCE `code` and implicit `access_token` + `refresh_token`.
 */
export async function createSessionFromUrl(url: string): Promise<SessionFromUrlResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { session: null, isPasswordRecovery: false };
  }

  const { params, errorCode } = getQueryParams(url);
  if (errorCode) {
    throw new Error(params.error_description || params.error || errorCode);
  }
  if (params.error) {
    throw new Error(params.error_description || params.error);
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
