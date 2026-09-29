/**
 * Must match Supabase Auth email OTP length
 * (Dashboard → Authentication → Sign In / Providers → Email → Email OTP length).
 * Supabase generates the code; Resend only delivers the email.
 */
export const RECOVERY_OTP_LENGTH = 8;

export const RESEND_COOLDOWN_SECONDS = 60;
