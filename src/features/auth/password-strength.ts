import { ZxcvbnFactory, type ZxcvbnResult } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

import { brand } from '@/theme/themes';

export type StrengthTier = 'empty' | 'weak' | 'medium' | 'strong' | 'veryStrong';

export type PasswordStrength = {
  tier: StrengthTier;
  /** 0–1 fill for the meter track. */
  fill: number;
  labelKey: string | null;
  color: string;
  hintKey: string | null;
  /** Raw zxcvbn score 0–4 when password is non-empty. */
  score: number | null;
};

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

/** Traffic-light meter: red → amber → green → deep green. */
const TIER_META: Record<
  Exclude<StrengthTier, 'empty'>,
  { labelKey: string; color: string; fill: number }
> = {
  weak: { labelKey: 'auth.strengthWeak', color: '#C44B4B', fill: 0.25 },
  medium: { labelKey: 'auth.strengthMedium', color: '#E5A100', fill: 0.5 },
  strong: { labelKey: 'auth.strengthStrong', color: brand.primary, fill: 0.75 },
  veryStrong: { labelKey: 'auth.strengthVeryStrong', color: brand.primaryPressed, fill: 1 },
};

function hintForResult(result: ZxcvbnResult, tier: Exclude<StrengthTier, 'empty'>) {
  if (tier === 'veryStrong' || tier === 'strong') {
    return null;
  }

  // Keep a single localized hint; zxcvbn English suggestions are not translated.
  void result;
  return 'auth.strengthHint';
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
      labelKey: null,
      color: brand.lightBorder,
      hintKey: null,
      score: null,
    };
  }

  const result = getFactory().check(password, userInputs.filter(Boolean));
  const tier = tierFromScore(result.score);
  const meta = TIER_META[tier];

  return {
    tier,
    fill: meta.fill,
    labelKey: meta.labelKey,
    color: meta.color,
    hintKey: hintForResult(result, tier),
    score: result.score,
  };
}
