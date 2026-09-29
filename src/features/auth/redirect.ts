import * as Linking from 'expo-linking';

/**
 * Deep-link target for email confirm and password reset.
 * Expo Go → exp://…/--/auth/callback (must be allowlisted in Supabase).
 * Dev/production build → calio://auth/callback.
 */
export function getAuthRedirectUri(): string {
  return Linking.createURL('auth/callback');
}
