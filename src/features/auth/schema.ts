import { z } from 'zod';

import { passwordMeetsRequirements } from './password-rules';
import { RECOVERY_OTP_LENGTH } from './recovery-constants';

export type AuthTranslate = (key: string, options?: Record<string, unknown>) => string;

const enMessages: AuthTranslate = (key, options) => {
  const count = typeof options?.count === 'number' ? options.count : RECOVERY_OTP_LENGTH;
  const map: Record<string, string> = {
    'auth.errors.enterEmail': 'Enter your email',
    'auth.errors.validEmail': 'Enter a valid email',
    'auth.errors.enterPassword': 'Enter your password',
    'auth.errors.enterAPassword': 'Enter a password',
    'auth.errors.passwordRequirements': 'Password doesn’t meet all requirements',
    'auth.errors.confirmPassword': 'Confirm your password',
    'auth.passwordsDontMatch': 'Passwords don’t match',
    'auth.errors.enterCode': 'Enter the code from your email',
    'auth.errors.numbersOnly': 'Enter numbers only',
    'auth.errors.codeLength': `Enter the ${count}-digit code`,
    'auth.ruleMinLength': 'At least 8 characters',
  };
  return map[key] ?? key;
};

function emailField(t: AuthTranslate) {
  return z
    .string()
    .trim()
    .min(1, t('auth.errors.enterEmail'))
    .pipe(z.email(t('auth.errors.validEmail')));
}

function signUpPasswordField(t: AuthTranslate) {
  return z
    .string()
    .min(1, t('auth.errors.enterAPassword'))
    .refine(passwordMeetsRequirements, {
      message: t('auth.errors.passwordRequirements'),
    });
}

export function createSignInSchema(t: AuthTranslate = enMessages) {
  return z.object({
    email: emailField(t),
    password: z.string().min(1, t('auth.errors.enterPassword')),
    rememberMe: z.boolean(),
  });
}

export function createSignUpSchema(t: AuthTranslate = enMessages) {
  return z
    .object({
      email: emailField(t),
      password: signUpPasswordField(t),
      confirmPassword: z.string().min(1, t('auth.errors.confirmPassword')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('auth.passwordsDontMatch'),
      path: ['confirmPassword'],
    });
}

export function createEmailOnlySchema(t: AuthTranslate = enMessages) {
  return z.object({
    email: emailField(t),
  });
}

export function createRecoveryOtpSchema(t: AuthTranslate = enMessages) {
  return z.object({
    code: z
      .string()
      .min(1, t('auth.errors.enterCode'))
      .regex(/^\d+$/, t('auth.errors.numbersOnly'))
      .length(
        RECOVERY_OTP_LENGTH,
        t('auth.errors.codeLength', { count: RECOVERY_OTP_LENGTH }),
      ),
  });
}

export function createUpdatePasswordSchema(t: AuthTranslate = enMessages) {
  return z
    .object({
      password: signUpPasswordField(t),
      confirmPassword: z.string().min(1, t('auth.errors.confirmPassword')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('auth.passwordsDontMatch'),
      path: ['confirmPassword'],
    });
}

/** Default English schemas — tests and fallbacks. Prefer create*Schema(t) in UI. */
export const signInSchema = createSignInSchema();
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = createSignUpSchema();
export type SignUpValues = z.infer<typeof signUpSchema>;

/** @deprecated Prefer signInSchema / signUpSchema */
export const authCredentialsSchema = z.object({
  email: emailField(enMessages),
  password: z.string().min(8, enMessages('auth.ruleMinLength')),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

export const emailOnlySchema = createEmailOnlySchema();
export type EmailOnly = z.infer<typeof emailOnlySchema>;

export const recoveryOtpSchema = createRecoveryOtpSchema();
export type RecoveryOtpValues = z.infer<typeof recoveryOtpSchema>;

export const updatePasswordSchema = createUpdatePasswordSchema();
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
