import { describe, expect, it } from 'vitest';

import { passwordMeetsRequirements } from './password-rules';
import { assessPasswordStrength } from './password-strength';
import { authCredentialsSchema, signInSchema, signUpSchema } from './schema';

describe('authCredentialsSchema', () => {
  it('accepts a trimmed email and an 8 character password', () => {
    const result = authCredentialsSchema.safeParse({
      email: '  person@example.com  ',
      password: 'longenough',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('person@example.com');
      expect(result.data.password).toBe('longenough');
    }
  });

  it('does not trim passwords', () => {
    const result = authCredentialsSchema.safeParse({
      email: 'person@example.com',
      password: '  spaced1',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.password).toBe('  spaced1');
    }
  });

  it('rejects a short password', () => {
    const result = authCredentialsSchema.safeParse({
      email: 'person@example.com',
      password: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = authCredentialsSchema.safeParse({
      email: 'not-an-email',
      password: 'longenough',
    });

    expect(result.success).toBe(false);
  });
});

describe('passwordMeetsRequirements', () => {
  it('requires length, casing, digit, and special character', () => {
    expect(passwordMeetsRequirements('Short1!')).toBe(false);
    expect(passwordMeetsRequirements('alllower1!')).toBe(false);
    expect(passwordMeetsRequirements('ALLUPPER1!')).toBe(false);
    expect(passwordMeetsRequirements('NoDigit!!')).toBe(false);
    expect(passwordMeetsRequirements('NoSpecial1')).toBe(false);
    expect(passwordMeetsRequirements('ValidPass1!')).toBe(true);
  });

  it('does not trim before evaluating', () => {
    expect(passwordMeetsRequirements('  Valid1!')).toBe(true);
  });
});

describe('assessPasswordStrength', () => {
  it('returns empty tier for blank input', () => {
    expect(assessPasswordStrength('').tier).toBe('empty');
  });

  it('scores common passwords as weak', () => {
    expect(assessPasswordStrength('password').tier).toBe('weak');
  });
});

describe('signUpSchema', () => {
  it('requires matching passwords that meet composition rules', () => {
    const mismatch = signUpSchema.safeParse({
      email: 'person@example.com',
      password: 'ValidPass1!',
      confirmPassword: 'Different1!',
    });
    expect(mismatch.success).toBe(false);

    const weak = signUpSchema.safeParse({
      email: 'person@example.com',
      password: 'longenough',
      confirmPassword: 'longenough',
    });
    expect(weak.success).toBe(false);

    const match = signUpSchema.safeParse({
      email: 'person@example.com',
      password: 'ValidPass1!',
      confirmPassword: 'ValidPass1!',
    });
    expect(match.success).toBe(true);
  });

  it('does not trim passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'person@example.com',
      password: ' ValidPass1!',
      confirmPassword: ' ValidPass1!',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.password).toBe(' ValidPass1!');
    }
  });
});

describe('signInSchema', () => {
  it('accepts rememberMe and a non-empty password', () => {
    const result = signInSchema.safeParse({
      email: 'person@example.com',
      password: 'x',
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });
});
