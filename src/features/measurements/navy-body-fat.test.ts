import { describe, expect, it } from 'vitest';

import {
  cmToInches,
  deriveBodyComposition,
  estimateNavyBodyFatPercent,
} from '@/features/measurements/navy-body-fat';

describe('cmToInches', () => {
  it('converts centimeters to inches', () => {
    expect(cmToInches(2.54)).toBeCloseTo(1, 6);
    expect(cmToInches(177.8)).toBeCloseTo(70, 5);
  });
});

describe('estimateNavyBodyFatPercent', () => {
  it('rejects unsupported sex without picking a formula', () => {
    const result = estimateNavyBodyFatPercent('prefer_not_to_say', {
      neckCm: 38,
      waistCm: 85,
      heightCm: 178,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('sex_unsupported');
  });

  it('requires hip for female formula', () => {
    const result = estimateNavyBodyFatPercent('female', {
      neckCm: 34,
      waistCm: 75,
      heightCm: 165,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('missing_hip');
      expect(result.missing).toContain('hip');
    }
  });

  it('rejects non-positive log arguments', () => {
    const result = estimateNavyBodyFatPercent('male', {
      neckCm: 40,
      waistCm: 40,
      heightCm: 180,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('invalid_log_argument');
  });

  it('computes male Navy BF using inch coefficients', () => {
    // Reference: male, height 70 in (177.8 cm), waist 33 in (83.82), neck 15 in (38.1)
    // BF% = 86.01*log10(33-15) - 70.041*log10(70) + 36.76
    const expected =
      86.01 * Math.log10(33 - 15) - 70.041 * Math.log10(70) + 36.76;

    const result = estimateNavyBodyFatPercent('male', {
      neckCm: 15 * 2.54,
      waistCm: 33 * 2.54,
      heightCm: 70 * 2.54,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.bodyFatPercent).toBeCloseTo(expected, 1);
      expect(result.method).toBe('us_navy_v1');
    }
  });

  it('computes female Navy BF using inch coefficients', () => {
    // height 65 in, waist 28 in, hip 38 in, neck 13 in
    const expected =
      163.205 * Math.log10(28 + 38 - 13) - 97.684 * Math.log10(65) - 78.387;

    const result = estimateNavyBodyFatPercent('female', {
      neckCm: 13 * 2.54,
      waistCm: 28 * 2.54,
      hipCm: 38 * 2.54,
      heightCm: 65 * 2.54,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.bodyFatPercent).toBeCloseTo(expected, 1);
    }
  });
});

describe('deriveBodyComposition', () => {
  it('does not invent zeros when weight is missing', () => {
    const result = deriveBodyComposition({
      sex: 'male',
      heightCm: 178,
      weightKg: null,
      neckCm: 38,
      waistCm: 85,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('missing_weight');
  });

  it('derives fat mass, lean mass, and FFMI', () => {
    const result = deriveBodyComposition({
      sex: 'male',
      heightCm: 70 * 2.54,
      weightKg: 80,
      neckCm: 15 * 2.54,
      waistCm: 33 * 2.54,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.fatMassKg).toBeCloseTo((80 * result.bodyFatPercent) / 100, 2);
      expect(result.leanMassKg).toBeCloseTo(80 - result.fatMassKg, 2);
      expect(result.ffmi).not.toBeNull();
      expect(result.ffmi!).toBeGreaterThan(0);
    }
  });
});
