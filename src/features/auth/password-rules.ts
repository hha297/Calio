export type PasswordRuleId =
  | 'minLength'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special';

export type PasswordRule = {
  id: PasswordRuleId;
  labelKey: string;
  test: (password: string) => boolean;
};

/** Composition rules for sign-up / update-password. Passwords are never trimmed. */
export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: 'minLength',
    labelKey: 'auth.ruleMinLength',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    labelKey: 'auth.ruleUppercase',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    labelKey: 'auth.ruleLowercase',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    labelKey: 'auth.ruleNumber',
    test: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    labelKey: 'auth.ruleSpecial',
    // Align with Supabase Auth allowed symbols for required-character policies.
    test: (password) => /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/.test(password),
  },
] as const;

export function evaluatePasswordRules(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    labelKey: rule.labelKey,
    met: rule.test(password),
  }));
}

export function passwordMeetsRequirements(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
