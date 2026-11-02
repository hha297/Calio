export type ProgressPeriod = 7 | 30 | 90;

export const PROGRESS_PERIODS: ProgressPeriod[] = [7, 30, 90];

export type BodyMetricKey =
  | 'weight_kg'
  | 'body_fat_percent'
  | 'fat_mass_kg'
  | 'lean_mass_kg'
  | 'waist_cm'
  | 'neck_cm'
  | 'hip_cm'
  | 'bicep_cm'
  | 'thigh_cm';

export const BODY_METRIC_KEYS: BodyMetricKey[] = [
  'weight_kg',
  'body_fat_percent',
  'fat_mass_kg',
  'lean_mass_kg',
  'waist_cm',
  'neck_cm',
  'hip_cm',
  'bicep_cm',
  'thigh_cm',
];
