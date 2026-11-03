import { MAX_USER_IMAGE_SIZE_BYTES } from '@/lib/media/image-upload-limits';

/** Max avatar file size (client gate) — aligned with food/custom exercise uploads. */
export const MAX_AVATAR_SIZE_BYTES = MAX_USER_IMAGE_SIZE_BYTES;

export const AVATAR_FOLDER = 'trackwise/avatars';

const DEFAULT_PRIVACY_URL = 'https://trackwise.one/privacy';
const DEFAULT_TERMS_URL = 'https://trackwise.one/terms';
const DEFAULT_SUPPORT_EMAIL = 'ha.dh290702@gmail.com';

/** Prefer EXPO_PUBLIC_* overrides when set. */
export function getPrivacyPolicyUrl(): string | null {
  const value = (process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '').trim();
  return value || DEFAULT_PRIVACY_URL;
}

export function getTermsOfServiceUrl(): string | null {
  const value = (process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL ?? '').trim();
  return value || DEFAULT_TERMS_URL;
}

export function getSupportEmail(): string | null {
  const value = (process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '').trim();
  return value || DEFAULT_SUPPORT_EMAIL;
}
