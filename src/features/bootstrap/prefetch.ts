import type { QueryClient } from '@tanstack/react-query';

import { fetchFoodEntries } from '@/features/food/api';
import { ensureProfile, fetchActiveGoal } from '@/features/goals/api';
import { toDiaryDateKey } from '@/utils/date';

export type PrefetchAuthContext = {
  userId: string;
  email?: string | null;
};

/** Minimal diary-home data so Main opens without a second waterfall. */
export async function prefetchBootstrapData(
  queryClient: QueryClient,
  ctx: PrefetchAuthContext,
): Promise<void> {
  const { userId, email } = ctx;
  const dateKey = toDiaryDateKey();
  const displayName = email?.includes('@') ? email.split('@')[0] : null;

  await ensureProfile(userId, displayName);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['profile', userId],
      queryFn: () => ensureProfile(userId, displayName),
    }),
    queryClient.prefetchQuery({
      queryKey: ['goal', 'active', userId],
      queryFn: () => fetchActiveGoal(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['food-entries', userId, dateKey],
      queryFn: () => fetchFoodEntries(userId, dateKey),
    }),
  ]);
}

export function isAuthFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const status = 'status' in error ? Number(error.status) : NaN;
  if (status === 401 || status === 403) {
    return true;
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  if (code === 'PGRST301' || code === '42501') {
    return true;
  }

  const message =
    'message' in error && typeof error.message === 'string' ? error.message.toLowerCase() : '';

  return (
    message.includes('jwt expired') ||
    message.includes('invalid jwt') ||
    message.includes('not authenticated') ||
    message.includes('invalid claim')
  );
}

/** User-facing message when required tables were never migrated. */
export function toBootstrapErrorMessage(error: unknown): string {
  const message =
    error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
      ? error.message
      : error instanceof Error
        ? error.message
        : '';
  const code =
    error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
      ? error.code
      : '';

  if (
    code === 'PGRST205' ||
    message.toLowerCase().includes('could not find the table') ||
    message.toLowerCase().includes('schema cache')
  ) {
    return 'Database tables are missing. Open Supabase → SQL Editor and run supabase/migrations/20260929170000_calio_core_schema.sql, then tap Retry.';
  }

  if (message) {
    return message;
  }

  return 'Could not load your data. Check your connection and try again.';
}
