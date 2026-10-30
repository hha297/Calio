/** Max avatar file size (client gate). */
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export const AVATAR_FOLDER = 'calio/avatars';

/**
 * Optional legal URLs — leave empty until product supplies real documents.
 * Prefer EXPO_PUBLIC_* overrides when set.
 */
export function getPrivacyPolicyUrl(): string | null {
  const value = (process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '').trim();
  return value || null;
}

export function getTermsOfServiceUrl(): string | null {
  const value = (process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL ?? '').trim();
  return value || null;
}

export function getSupportEmail(): string | null {
  const value = (process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '').trim();
  return value || null;
}
