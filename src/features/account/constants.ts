import { MAX_USER_IMAGE_SIZE_BYTES } from '@/lib/media/image-upload-limits';

/** Max avatar file size (client gate) — aligned with food/custom exercise uploads. */
export const MAX_AVATAR_SIZE_BYTES = MAX_USER_IMAGE_SIZE_BYTES;

export const AVATAR_FOLDER = 'trackwise/avatars';

const DEFAULT_WEBSITE_URL = 'https://trackwise.one';
const DEFAULT_SUPPORT_CENTER_URL = 'https://trackwise.one/support';
const DEFAULT_FEEDBACK_URL = 'https://trackwise.one/feedback';
const DEFAULT_PRIVACY_URL = 'https://trackwise.one/privacy';
const DEFAULT_TERMS_URL = 'https://trackwise.one/terms';
const DEFAULT_SUPPORT_EMAIL = 'ha.dh290702@gmail.com';

function envOrDefault(envKey: string, fallback: string): string {
  const value = (process.env[envKey] ?? '').trim();
  return value || fallback;
}

/** Prefer EXPO_PUBLIC_* overrides when set. */
export function getWebsiteUrl(): string {
  return envOrDefault('EXPO_PUBLIC_WEBSITE_URL', DEFAULT_WEBSITE_URL);
}

export function getSupportCenterUrl(): string {
  return envOrDefault('EXPO_PUBLIC_SUPPORT_CENTER_URL', DEFAULT_SUPPORT_CENTER_URL);
}

export function getFeedbackUrl(): string {
  return envOrDefault('EXPO_PUBLIC_FEEDBACK_URL', DEFAULT_FEEDBACK_URL);
}

export function getPrivacyPolicyUrl(): string {
  return envOrDefault('EXPO_PUBLIC_PRIVACY_POLICY_URL', DEFAULT_PRIVACY_URL);
}

export function getTermsOfServiceUrl(): string {
  return envOrDefault('EXPO_PUBLIC_TERMS_OF_SERVICE_URL', DEFAULT_TERMS_URL);
}

export function getSupportEmail(): string {
  return envOrDefault('EXPO_PUBLIC_SUPPORT_EMAIL', DEFAULT_SUPPORT_EMAIL);
}
