import { ZxcvbnFactory, type ZxcvbnResult } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

import { colors } from '@/theme/colors';

export type StrengthTier = 'empty' | 'weak' | 'medium' | 'strong' | 'veryStrong';

export type PasswordStrength = {
  tier: StrengthTier;
  /** 0–1 fill for the meter track. */
  fill: number;
  label: string;
  color: string;
  hint: string | null;
  /** Raw zxcvbn score 0–4 when password is non-empty. */
  score: number | null;
};

const HINT_DEFAULT = 'Try a longer password and avoid common or predictable patterns';

let factory: ZxcvbnFactory | null = null;

function getFactory() {
  if (!factory) {
    factory = new ZxcvbnFactory({
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    });
  }
  return factory;
}

function tierFromScore(score: number): Exclude<StrengthTier, 'empty'> {
  if (score <= 1) return 'weak';
  if (score === 2) return 'medium';
  if (score === 3) return 'strong';
  return 'veryStrong';
}

const TIER_META: Record<
  Exclude<StrengthTier, 'empty'>,
  { label: string; color: string; fill: number }
> = {
  weak: { label: 'Weak', color: colors.error, fill: 0.25 },
  medium: { label: 'Medium', color: '#E8913A', fill: 0.5 },
  strong: { label: 'Strong', color: colors.success, fill: 0.75 },
  veryStrong: { label: 'Very strong', color: colors.secondary, fill: 1 },
};

function hintForResult(result: ZxcvbnResult, tier: Exclude<StrengthTier, 'empty'>) {
  if (tier === 'veryStrong' || tier === 'strong') {
    return null;
  }

  const suggestion = result.feedback.suggestions[0];
  if (suggestion) {
    return HINT_DEFAULT;
  }

  return HINT_DEFAULT;
}

/**
 * Local-only strength estimate (zxcvbn). Does not call external APIs.
 * Strength guidance is separate from registration checklist rules.
 */
export function assessPasswordStrength(
  password: string,
  userInputs: string[] = [],
): PasswordStrength {
  if (password.length === 0) {
    return {
      tier: 'empty',
      fill: 0,
      label: '',
      color: colors.border,
      hint: null,
      score: null,
    };
  }

  const result = getFactory().check(password, userInputs.filter(Boolean));
  const tier = tierFromScore(result.score);
  const meta = TIER_META[tier];

  return {
    tier,
    fill: meta.fill,
    label: meta.label,
    color: meta.color,
    hint: hintForResult(result, tier),
    score: result.score,
  };
}
