import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { analytics } from '@/lib/analytics/analytics';
import { reportError } from '@/lib/errors/report-error';
import { queryClient } from '@/lib/query/query-client';
import { getSupabase } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

import { getAuthRedirectUri } from './redirect';
import { getRememberMe, setRememberMe } from './remember-me';
import { createSessionFromUrl } from './session-from-url';

type SignUpResult = {
  needsEmailConfirmation: boolean;
};

type AuthContextValue = {
  isConfigured: boolean;
  isReady: boolean;
  session: Session | null;
  passwordRecovery: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearPasswordRecovery: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function clearUserLocalState() {
  queryClient.clear();
  useActiveWorkoutStore.getState().reset();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(!configured);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const handledUrls = useRef(new Set<string>());

  const handleIncomingUrl = useCallback(async (url: string | null) => {
    if (!url || handledUrls.current.has(url)) {
      return;
    }

    // Only consume Calio/auth callback URLs — ignore unrelated deep links.
    if (!url.includes('auth/callback') && !url.includes('access_token') && !url.includes('code=')) {
      return;
    }

    handledUrls.current.add(url);

    try {
      await createSessionFromUrl(url);
    } catch (error) {
      handledUrls.current.delete(url);
      reportError(error, { area: 'auth', action: 'deep-link' });
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const remember = await getRememberMe();
        const initialUrl = await Linking.getInitialURL();
        const fromAuthLink = Boolean(
          initialUrl &&
            (initialUrl.includes('auth/callback') ||
              initialUrl.includes('access_token') ||
              initialUrl.includes('code=')),
        );

        const { data, error } = await supabase.auth.getSession();
        if (!active) {
          return;
        }
        if (error) {
          reportError(error, { area: 'auth', action: 'restore-session' });
        }

        // Ephemeral sign-in: drop persisted session on cold start, unless this
        // launch is finishing an email/reset deep link.
        if (!remember && data.session && !fromAuthLink) {
          await supabase.auth.signOut({ scope: 'local' });
          clearUserLocalState();
          if (active) {
            setSession(null);
            setIsReady(true);
          }
          return;
        }

        setSession(data.session);
        setIsReady(true);
      } catch (error: unknown) {
        if (!active) {
          return;
        }
        reportError(error, { area: 'auth', action: 'restore-session' });
        setIsReady(true);
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);

      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
      }

      if (event === 'SIGNED_IN' && next?.user.id) {
        analytics.identify(next.user.id);
      }

      if (event === 'SIGNED_OUT') {
        setPasswordRecovery(false);
        analytics.reset();
      }
    });

    void Linking.getInitialURL().then((url) => {
      void handleIncomingUrl(url);
    });

    const linkingSub = Linking.addEventListener('url', ({ url }) => {
      void handleIncomingUrl(url);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
      linkingSub.remove();
    };
  }, [handleIncomingUrl]);

  const signIn = useCallback(async (email: string, password: string, rememberMe = true) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    await setRememberMe(rememberMe);
    analytics.track('auth_sign_in_succeeded');
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUri(),
      },
    });
    if (error) {
      throw error;
    }

    // New accounts stay signed in across launches by default.
    await setRememberMe(true);

    // Autoconfirm projects return a session. No session usually means either
    // email confirmation is required OR the email is already registered
    // (Supabase returns an empty identities array for the duplicate case).
    if (data.session) {
      analytics.track('auth_sign_up_succeeded');
      return { needsEmailConfirmation: false };
    }

    const identityCount = data.user?.identities?.length ?? 0;
    if (!data.user || identityCount === 0) {
      throw new Error('An account with that email already exists. Sign in instead.');
    }

    analytics.track('auth_sign_up_confirmation_required');
    return { needsEmailConfirmation: true };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.signOut();
    // Always drop local user data so the next account cannot see prior cache.
    clearUserLocalState();
    setPasswordRecovery(false);

    if (error) {
      throw error;
    }

    analytics.track('auth_sign_out_succeeded');
  }, []);

  const resendConfirmationEmail = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getAuthRedirectUri(),
      },
    });
    if (error) {
      throw error;
    }

    analytics.track('auth_confirmation_resent');
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUri(),
    });
    if (error) {
      throw error;
    }

    analytics.track('auth_password_reset_requested');
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw error;
    }

    setPasswordRecovery(false);
    analytics.track('auth_password_updated');
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    setPasswordRecovery(false);
  }, []);

  const value = useMemo(
    () => ({
      isConfigured: configured,
      isReady,
      session,
      passwordRecovery,
      signIn,
      signUp,
      signOut,
      resendConfirmationEmail,
      resetPasswordForEmail,
      updatePassword,
      clearPasswordRecovery,
    }),
    [
      configured,
      isReady,
      session,
      passwordRecovery,
      signIn,
      signUp,
      signOut,
      resendConfirmationEmail,
      resetPasswordForEmail,
      updatePassword,
      clearPasswordRecovery,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
