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

import { isEmailConfirmed } from './email-confirmed';
import { getRememberMe, setRememberMe } from './remember-me';
import { createSessionFromUrl } from './session-from-url';

type SignUpResult = {
  /** True when the user must enter the signup email OTP before continuing. */
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
  /** Resends the signup confirmation email (OTP when Confirm signup template uses {{ .Token }}). */
  resendConfirmationEmail: (email: string) => Promise<void>;
  /** Verifies the signup email OTP (`type: 'signup'`). */
  verifySignupOtp: (email: string, token: string) => Promise<void>;
  /** Sends a recovery email (OTP when the Reset Password template uses {{ .Token }}). */
  resetPasswordForEmail: (email: string) => Promise<void>;
  /** Verifies the recovery OTP and marks the session as password-recovery. */
  verifyRecoveryOtp: (email: string, token: string) => Promise<void>;
  /**
   * Sets a new password during recovery, then signs out so the user can
   * sign in fresh. Keeps passwordRecovery true until sign-out completes.
   */
  completePasswordReset: (password: string) => Promise<void>;
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
  /** True while verifyOtp(recovery) is in flight — blocks dashboard routing on SIGNED_IN. */
  const recoveryOtpInFlight = useRef(false);

  const handleIncomingUrl = useCallback(async (url: string | null) => {
    if (!url || handledUrls.current.has(url)) {
      return;
    }

    // Email confirm / OAuth callbacks only — password reset uses in-app OTP.
    if (!url.includes('auth/callback') && !url.includes('access_token') && !url.includes('code=')) {
      return;
    }

    handledUrls.current.add(url);

    try {
      const result = await createSessionFromUrl(url);
      if (result.isPasswordRecovery) {
        setPasswordRecovery(true);
      }
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
        // launch is finishing an email confirm deep link.
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

      if (
        event === 'PASSWORD_RECOVERY' ||
        (event === 'SIGNED_IN' && recoveryOtpInFlight.current)
      ) {
        setPasswordRecovery(true);
      }

      if (event === 'SIGNED_IN' && next?.user.id && !recoveryOtpInFlight.current) {
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

    // No emailRedirectTo — confirmation uses in-app OTP ({{ .Token }} in the email template).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }

    await setRememberMe(true);

    const identityCount = data.user?.identities?.length ?? 0;
    if (!data.user || identityCount === 0) {
      throw new Error('An account with that email already exists. Sign in instead.');
    }

    if (isEmailConfirmed(data.user) && data.session) {
      analytics.track('auth_sign_up_succeeded');
      return { needsEmailConfirmation: false };
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

    // No redirectTo — signup confirmation uses in-app OTP.
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) {
      throw error;
    }

    analytics.track('auth_confirmation_resent');
  }, []);

  const verifySignupOtp = useCallback(async (email: string, token: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    if (error) {
      throw error;
    }

    const confirmedUser = data.user ?? data.session?.user ?? null;
    if (!isEmailConfirmed(confirmedUser)) {
      const { data: fresh, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw userError;
      }
      if (!isEmailConfirmed(fresh.user)) {
        throw new Error('Email verification did not complete.');
      }
    }

    await setRememberMe(true);
    analytics.track('auth_signup_otp_verified');
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    // No redirectTo — recovery uses in-app OTP ({{ .Token }} in the email template).
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }

    analytics.track('auth_password_reset_requested');
  }, []);

  const verifyRecoveryOtp = useCallback(async (email: string, token: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    recoveryOtpInFlight.current = true;
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });
      if (error) {
        throw error;
      }
      // Keep recovery lock for update-password; do not navigate to Main.
      setPasswordRecovery(true);
      analytics.track('auth_recovery_otp_verified');
    } finally {
      recoveryOtpInFlight.current = false;
    }
  }, []);

  const completePasswordReset = useCallback(async (password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      throw updateError;
    }

    analytics.track('auth_password_updated');

    // Stay in recovery until sign-out finishes so guards never send the user to Main.
    const { error: signOutError } = await supabase.auth.signOut();
    clearUserLocalState();
    setPasswordRecovery(false);

    if (signOutError) {
      throw signOutError;
    }
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
      verifySignupOtp,
      resetPasswordForEmail,
      verifyRecoveryOtp,
      completePasswordReset,
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
      verifySignupOtp,
      resetPasswordForEmail,
      verifyRecoveryOtp,
      completePasswordReset,
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
