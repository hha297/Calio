/**
 * U.S. Navy body-fat estimation (circumference method).
 *
 * Published coefficients expect **inches**. Convert cm → inches with `/ 2.54`
 * before applying formulas. Do not use cm-based constant variants.
 *
 * Method version: `us_navy_v1`
 */

export const NAVY_COMPOSITION_METHOD = 'us_navy_v1' as const;

export type NavySex = 'male' | 'female';

export type NavyCircumferenceCm = {
  neckCm: number;
  waistCm: number;
  /** Required for female formula. */
  hipCm?: number | null;
  heightCm: number;
};

export type NavyUnavailableReason =
  | 'sex_unsupported'
  | 'missing_height'
  | 'missing_neck'
  | 'missing_waist'
  | 'missing_hip'
  | 'invalid_positive'
  | 'invalid_log_argument';

export type NavyBodyFatResult =
  | {
      ok: true;
      method: typeof NAVY_COMPOSITION_METHOD;
      sex: NavySex;
      bodyFatPercent: number;
      inputsInches: {
        neck: number;
        waist: number;
        hip: number | null;
        height: number;
      };
    }
  | {
      ok: false;
      reason: NavyUnavailableReason;
      missing?: ('height' | 'neck' | 'waist' | 'hip' | 'sex')[];
    };

export type BodyCompositionResult =
  | {
      ok: true;
      method: typeof NAVY_COMPOSITION_METHOD;
      bodyFatPercent: number;
      fatMassKg: number;
      leanMassKg: number;
      ffmi: number | null;
    }
  | {
      ok: false;
      reason: NavyUnavailableReason | 'missing_weight';
      missing?: ('height' | 'neck' | 'waist' | 'hip' | 'sex' | 'weight')[];
    };

const CM_PER_INCH = 2.54;

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

function isPositiveFinite(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Map profile sex to a Navy formula; unsupported sexes do not get a default. */
export function resolveNavySex(sex: string | null | undefined): NavySex | null {
  if (sex === 'male' || sex === 'female') return sex;
  return null;
}

/**
 * Estimate body fat % with the U.S. Navy method.
 * Inputs must be in centimeters; conversion to inches happens internally.
 */
export function estimateNavyBodyFatPercent(
  sex: string | null | undefined,
  input: NavyCircumferenceCm,
): NavyBodyFatResult {
  const navySex = resolveNavySex(sex);
  if (!navySex) {
    return { ok: false, reason: 'sex_unsupported', missing: ['sex'] };
  }

  const missing: ('height' | 'neck' | 'waist' | 'hip')[] = [];
  if (!isPositiveFinite(input.heightCm)) missing.push('height');
  if (!isPositiveFinite(input.neckCm)) missing.push('neck');
  if (!isPositiveFinite(input.waistCm)) missing.push('waist');
  if (navySex === 'female' && !isPositiveFinite(input.hipCm)) missing.push('hip');

  if (missing.length) {
    const reason =
      missing[0] === 'height'
        ? 'missing_height'
        : missing[0] === 'neck'
          ? 'missing_neck'
          : missing[0] === 'waist'
            ? 'missing_waist'
            : 'missing_hip';
    return { ok: false, reason, missing };
  }

  const neck = cmToInches(input.neckCm);
  const waist = cmToInches(input.waistCm);
  const height = cmToInches(input.heightCm);
  const hip = navySex === 'female' ? cmToInches(input.hipCm as number) : null;

  const logArg =
    navySex === 'male' ? waist - neck : (waist as number) + (hip as number) - neck;

  if (!(logArg > 0) || !(height > 0)) {
    return { ok: false, reason: 'invalid_log_argument' };
  }

  const log10 = Math.log10;
  const bodyFatPercent =
    navySex === 'male'
      ? 86.01 * log10(logArg) - 70.041 * log10(height) + 36.76
      : 163.205 * log10(logArg) - 97.684 * log10(height) - 78.387;

  if (!Number.isFinite(bodyFatPercent)) {
    return { ok: false, reason: 'invalid_log_argument' };
  }

  return {
    ok: true,
    method: NAVY_COMPOSITION_METHOD,
    sex: navySex,
    bodyFatPercent: round(bodyFatPercent, 2),
    inputsInches: { neck, waist, hip, height },
  };
}

export function deriveBodyComposition(input: {
  sex: string | null | undefined;
  heightCm: number | null | undefined;
  weightKg: number | null | undefined;
  neckCm: number | null | undefined;
  waistCm: number | null | undefined;
  hipCm?: number | null;
}): BodyCompositionResult {
  if (!isPositiveFinite(input.weightKg)) {
    return { ok: false, reason: 'missing_weight', missing: ['weight'] };
  }
  if (!isPositiveFinite(input.heightCm) || !isPositiveFinite(input.neckCm) || !isPositiveFinite(input.waistCm)) {
    const bf = estimateNavyBodyFatPercent(input.sex, {
      neckCm: input.neckCm ?? 0,
      waistCm: input.waistCm ?? 0,
      hipCm: input.hipCm,
      heightCm: input.heightCm ?? 0,
    });
    if (!bf.ok) {
      return {
        ok: false,
        reason: bf.reason,
        missing: [...(bf.missing ?? []), ...(isPositiveFinite(input.weightKg) ? [] : (['weight'] as const))],
      };
    }
  }

  const bf = estimateNavyBodyFatPercent(input.sex, {
    neckCm: input.neckCm as number,
    waistCm: input.waistCm as number,
    hipCm: input.hipCm,
    heightCm: input.heightCm as number,
  });

  if (!bf.ok) {
    return { ok: false, reason: bf.reason, missing: bf.missing };
  }

  const weightKg = input.weightKg as number;
  const fatMassKg = round((weightKg * bf.bodyFatPercent) / 100, 3);
  const leanMassKg = round(weightKg - fatMassKg, 3);
  const heightM = (input.heightCm as number) / 100;
  const ffmi =
    heightM > 0 && leanMassKg > 0 ? round(leanMassKg / (heightM * heightM), 2) : null;

  return {
    ok: true,
    method: NAVY_COMPOSITION_METHOD,
    bodyFatPercent: bf.bodyFatPercent,
    fatMassKg,
    leanMassKg,
    ffmi,
  };
}

/** Soft validation ranges in cm (guidance, not hard biological limits). */
export const MEASUREMENT_RANGES_CM = {
  neck: { min: 20, max: 50 },
  waist: { min: 50, max: 150 },
  hip: { min: 70, max: 150 },
  bicep: { min: 15, max: 60 },
  thigh: { min: 30, max: 100 },
  weightKg: { min: 25, max: 300 },
  heightCm: { min: 100, max: 250 },
} as const;

export function isWithinGuidanceRange(
  key: keyof typeof MEASUREMENT_RANGES_CM,
  valueCmOrKg: number,
): boolean {
  const range = MEASUREMENT_RANGES_CM[key];
  return valueCmOrKg >= range.min && valueCmOrKg <= range.max;
}
