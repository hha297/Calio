export type PasswordRuleId =
  | 'minLength'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special';

export type PasswordRule = {
  id: PasswordRuleId;
  label: string;
  test: (password: string) => boolean;
};

/** Composition rules for sign-up / update-password. Passwords are never trimmed. */
export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: 'minLength',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Contains an uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Contains a lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Contains a number',
    test: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    label: 'Contains a special character',
    // Align with Supabase Auth allowed symbols for required-character policies.
    test: (password) => /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/.test(password),
  },
] as const;

export function evaluatePasswordRules(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(password),
  }));
}

export function passwordMeetsRequirements(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
