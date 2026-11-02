/** Callback path shared by Expo Go (`/--/auth/callback`) and native schemes. */
export const AUTH_CALLBACK_PATH = 'auth/callback';

/** Native scheme from app.json — used by development and store builds. */
export const AUTH_NATIVE_SCHEME = 'trackwise';

/** Build the Expo Go redirect for a resolved Metro host (tunnel or LAN). */
export function buildExpoGoRedirectUri(host: string): string {
  const normalized = host.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `exp://${normalized}/--/${AUTH_CALLBACK_PATH}`;
}

export function buildNativeRedirectUri(): string {
  return `${AUTH_NATIVE_SCHEME}://${AUTH_CALLBACK_PATH}`;
}
