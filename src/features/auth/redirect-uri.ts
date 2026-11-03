/** Callback path shared by Expo Go (`/--/auth/callback`) and native schemes. */
export const AUTH_CALLBACK_PATH = 'auth/callback';

/** Native scheme from app.json — used by development and store builds. */
export const AUTH_NATIVE_SCHEME = 'trackwise';

/** Canonical native OAuth callback. */
export const AUTH_NATIVE_REDIRECT_URI = `${AUTH_NATIVE_SCHEME}://${AUTH_CALLBACK_PATH}`;

/** Build the Expo Go redirect for a resolved Metro host (tunnel or LAN). */
export function buildExpoGoRedirectUri(host: string): string {
  const normalized = host.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `exp://${normalized}/--/${AUTH_CALLBACK_PATH}`;
}

export function buildNativeRedirectUri(): string {
  return AUTH_NATIVE_REDIRECT_URI;
}

/** Valid Expo Go callback: exp://<host>/--/auth/callback (host required). */
export function isValidExpoGoRedirectUri(uri: string): boolean {
  return /^exp:\/\/[^/]+\/--\/auth\/callback$/.test(uri);
}

/** Exact native callback only — rejects trackwise:/auth/callback and query-bearing bases. */
export function isCanonicalNativeRedirectUri(uri: string): boolean {
  return uri === AUTH_NATIVE_REDIRECT_URI;
}

export function isValidAuthRedirectUri(uri: string): boolean {
  return isCanonicalNativeRedirectUri(uri) || isValidExpoGoRedirectUri(uri);
}

/** Read redirect_to from a Supabase authorize URL without logging secrets. */
export function getRedirectToFromAuthorizeUrl(authUrl: string): string | null {
  try {
    const url = new URL(authUrl);
    return url.searchParams.get('redirect_to');
  } catch {
    return null;
  }
}
