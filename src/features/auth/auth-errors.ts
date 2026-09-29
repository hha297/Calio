import i18n from '@/i18n';

/** Map Supabase / network errors to localized auth copy. */
export function toAuthErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : '';
  const message = raw.toLowerCase();
  const t = (key: string) => i18n.t(key);

  if (message.includes('invalid login credentials')) {
    return t('auth.errors.invalidCredentials');
  }

  if (message.includes('email not confirmed')) {
    return t('auth.errors.emailNotConfirmed');
  }

  if (message.includes('already registered') || message.includes('already been registered')) {
    return t('auth.errors.alreadyRegistered');
  }

  if (message.includes('user already registered')) {
    return t('auth.errors.alreadyRegistered');
  }

  if (message.includes('password should be') || message.includes('password is known')) {
    return raw;
  }

  if (
    message.includes('token has expired') ||
    message.includes('otp_expired') ||
    message.includes('otp has expired')
  ) {
    return t('auth.errors.otpExpired');
  }

  if (
    message.includes('invalid') &&
    (message.includes('otp') || message.includes('token') || message.includes('email otp'))
  ) {
    return t('auth.errors.otpInvalid');
  }

  if (message.includes('same password')) {
    return t('auth.errors.samePassword');
  }

  if (
    message.includes('rate limit') ||
    message.includes('over_email_send_rate_limit') ||
    message.includes('for security purposes')
  ) {
    return t('auth.errors.rateLimit');
  }

  if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
    return t('auth.errors.network');
  }

  if (message.includes('not configured')) {
    return t('auth.errors.notConfigured');
  }

  if (raw) {
    return raw;
  }

  return t('auth.errors.generic');
}
