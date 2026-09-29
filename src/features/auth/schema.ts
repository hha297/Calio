import { z } from 'zod';

import { passwordMeetsRequirements } from './password-rules';

const emailField = z
  .string()
  .trim()
  .min(1, 'Enter your email')
  .pipe(z.email('Enter a valid email'));

/** Sign-up / update password — never trim; all composition rules required. */
const signUpPasswordField = z
  .string()
  .min(1, 'Enter a password')
  .refine(passwordMeetsRequirements, {
    message: 'Password doesn’t meet all requirements',
  });

/** Sign in — password is not trimmed. */
export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password'),
  rememberMe: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;

/** Sign up — confirm password must match; passwords are not trimmed. */
export const signUpSchema = z
  .object({
    email: emailField,
    password: signUpPasswordField,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords don’t match',
    path: ['confirmPassword'],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

/** @deprecated Prefer signInSchema / signUpSchema */
export const authCredentialsSchema = z.object({
  email: emailField,
  password: z.string().min(8, 'At least 8 characters'),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

export const emailOnlySchema = z.object({
  email: emailField,
});

export type EmailOnly = z.infer<typeof emailOnlySchema>;

export const updatePasswordSchema = z
  .object({
    password: signUpPasswordField,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords don’t match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
