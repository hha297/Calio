/**
 * Must match Supabase Auth email OTP length
 * (Dashboard → Authentication → Sign In / Providers → Email → Email OTP length).
 * Used for signup confirmation and password recovery.
 */
export const EMAIL_OTP_LENGTH = 8;

/** @deprecated Prefer EMAIL_OTP_LENGTH — same value for recovery OTPs. */
export const RECOVERY_OTP_LENGTH = EMAIL_OTP_LENGTH;

export const RESEND_COOLDOWN_SECONDS = 60;
