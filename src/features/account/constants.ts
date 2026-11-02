import { MAX_USER_IMAGE_SIZE_BYTES } from '@/lib/media/image-upload-limits';

/** Max avatar file size (client gate) — aligned with food/custom exercise uploads. */
export const MAX_AVATAR_SIZE_BYTES = MAX_USER_IMAGE_SIZE_BYTES;

export const AVATAR_FOLDER = 'trackwise/avatars';

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

export { getAdminDashboardUrl } from './admin-access';
