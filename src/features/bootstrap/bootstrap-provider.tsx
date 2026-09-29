import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import type { Profile } from '@/features/goals/types';
import { getOnboardingCompleted, setOnboardingCompleted } from '@/features/onboarding/storage';
import { reportError } from '@/lib/errors/report-error';
import { queryClient } from '@/lib/query/query-client';

import { isAuthFailure, prefetchBootstrapData, toBootstrapErrorMessage } from './prefetch';

export type AppDestination =
  | 'onboarding'
  | 'auth'
  | 'setup'
  | 'main'
  | 'update-password';

type BootstrapContextValue = {
  /** True while restoring session / reading onboarding / prefetching required Main data. */
  isBootstrapping: boolean;
  destination: AppDestination | null;
  error: string | null;
  retry: () => void;
  completeOnboarding: () => Promise<void>;
};

const BootstrapContext = createContext<BootstrapContextValue | null>(null);

export function BootstrapProvider({ children }: { children: ReactNode }) {
  const { isReady, session, passwordRecovery, signOut } = useAuth();
  const [welcomeDone, setWelcomeDone] = useState<boolean | null>(null);
  const userId = passwordRecovery ? undefined : session?.user.id;
  const email = session?.user.email;

  useEffect(() => {
    let active = true;
    getOnboardingCompleted()
      .then((value) => {
        if (active) {
          setWelcomeDone(value);
        }
      })
      .catch((err: unknown) => {
        reportError(err, { area: 'onboarding', action: 'read-flag' });
        if (active) {
          setWelcomeDone(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const bootstrapQuery = useQuery({
    queryKey: ['bootstrap', userId],
    enabled: Boolean(isReady && welcomeDone !== null && userId),
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      try {
        await prefetchBootstrapData(queryClient, { userId, email });
        return userId;
      } catch (err) {
        reportError(err, { area: 'bootstrap', action: 'prefetch' });

        if (isAuthFailure(err)) {
          try {
            await signOut();
          } catch (signOutError) {
            reportError(signOutError, { area: 'bootstrap', action: 'auth-failure-sign-out' });
          }
          return null;
        }

        throw new Error(toBootstrapErrorMessage(err));
      }
    },
  });

  const retry = useCallback(() => {
    void bootstrapQuery.refetch();
  }, [bootstrapQuery]);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingCompleted();
    setWelcomeDone(true);
  }, []);

  const prefetchReady = Boolean(userId && bootstrapQuery.isSuccess && bootstrapQuery.data === userId);
  const prefetchError =
    userId && bootstrapQuery.isError && !bootstrapQuery.isFetching
      ? bootstrapQuery.error instanceof Error && bootstrapQuery.error.message
        ? bootstrapQuery.error.message
        : 'Could not load your data. Check your connection and try again.'
      : null;

  const profile = userId
    ? queryClient.getQueryData<Profile | null>(['profile', userId])
    : null;
  const setupComplete = Boolean(profile?.onboarding_completed_at);

  const destination = useMemo((): AppDestination | null => {
    if (!isReady || welcomeDone === null) {
      return null;
    }

    if (passwordRecovery) {
      return 'update-password';
    }

    if (session) {
      if (!prefetchReady || prefetchError) {
        return null;
      }
      if (!setupComplete) {
        return 'setup';
      }
      return 'main';
    }

    return welcomeDone ? 'auth' : 'onboarding';
  }, [
    isReady,
    welcomeDone,
    passwordRecovery,
    session,
    prefetchReady,
    prefetchError,
    setupComplete,
  ]);

  const isBootstrapping =
    !isReady ||
    welcomeDone === null ||
    (Boolean(userId) && !prefetchReady && !prefetchError);

  const value = useMemo(
    () => ({
      isBootstrapping,
      destination,
      error: prefetchError,
      retry,
      completeOnboarding,
    }),
    [isBootstrapping, destination, prefetchError, retry, completeOnboarding],
  );

  return <BootstrapContext.Provider value={value}>{children}</BootstrapContext.Provider>;
}

export function useBootstrap(): BootstrapContextValue {
  const value = useContext(BootstrapContext);
  if (!value) {
    throw new Error('useBootstrap must be used within BootstrapProvider');
  }
  return value;
}
