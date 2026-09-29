import type { User } from '@supabase/supabase-js';

/**
 * Supabase is the source of truth for email ownership.
 * Prefer `email_confirmed_at` over any client-only flag.
 */
export function isEmailConfirmed(user: User | null | undefined): boolean {
  return Boolean(user?.email_confirmed_at);
}
