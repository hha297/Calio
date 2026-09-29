import { makeRedirectUri } from 'expo-auth-session';

/** Deep-link target for email confirm and password reset. */
export function getAuthRedirectUri(): string {
  return makeRedirectUri({
    scheme: 'calio',
    path: 'auth/callback',
  });
}
