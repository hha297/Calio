import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import { fetchProfile } from '@/features/goals/api';
import { getSupabase } from '@/lib/supabase/client';

import {
  deriveBodyComposition,
  NAVY_COMPOSITION_METHOD,
} from './navy-body-fat';

const MEASUREMENT_COLUMNS =
  'id, measured_on, weight_kg, body_fat_percent, waist_cm, neck_cm, hip_cm, bicep_cm, thigh_cm, composition_method, fat_mass_kg, lean_mass_kg, ffmi, notes';

const HISTORY_LIMIT = 365;

export type CompositionMethod = 'manual' | typeof NAVY_COMPOSITION_METHOD;

export type BodyMeasurement = {
  id: string;
  measured_on: string;
  weight_kg: number | null;
  body_fat_percent: number | null;
  waist_cm: number | null;
  neck_cm: number | null;
  hip_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  composition_method: CompositionMethod | null;
  fat_mass_kg: number | null;
  lean_mass_kg: number | null;
  ffmi: number | null;
  notes: string | null;
};

/** Partial write input. `undefined` omits a field; `null` clears it. */
export type BodyMeasurementWriteInput = {
  measuredOn: string;
  weightKg?: number | null;
  /** Manual body-fat entry when Navy inputs are incomplete. */
  bodyFatPercent?: number | null;
  waistCm?: number | null;
  neckCm?: number | null;
  hipCm?: number | null;
  bicepCm?: number | null;
  thighCm?: number | null;
  notes?: string | null;
};

type MeasurementMetricFields = {
  weight_kg: number | null;
  body_fat_percent: number | null;
  waist_cm: number | null;
  neck_cm: number | null;
  hip_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  notes: string | null;
  composition_method: CompositionMethod | null;
};

type CompositionSnapshot = {
  body_fat_percent: number | null;
  fat_mass_kg: number | null;
  lean_mass_kg: number | null;
  ffmi: number | null;
  composition_method: CompositionMethod | null;
};

function emptyMetricFields(): MeasurementMetricFields {
  return {
    weight_kg: null,
    body_fat_percent: null,
    waist_cm: null,
    neck_cm: null,
    hip_cm: null,
    bicep_cm: null,
    thigh_cm: null,
    notes: null,
    composition_method: null,
  };
}

function fromRow(row: BodyMeasurement): MeasurementMetricFields {
  return {
    weight_kg: row.weight_kg,
    body_fat_percent: row.body_fat_percent,
    waist_cm: row.waist_cm,
    neck_cm: row.neck_cm,
    hip_cm: row.hip_cm,
    bicep_cm: row.bicep_cm,
    thigh_cm: row.thigh_cm,
    notes: row.notes,
    composition_method: row.composition_method,
  };
}

function mergeWriteInput(
  base: MeasurementMetricFields,
  input: Omit<BodyMeasurementWriteInput, 'measuredOn'>,
): MeasurementMetricFields {
  const next = { ...base };
  if (input.weightKg !== undefined) next.weight_kg = input.weightKg;
  if (input.bodyFatPercent !== undefined) next.body_fat_percent = input.bodyFatPercent;
  if (input.waistCm !== undefined) next.waist_cm = input.waistCm;
  if (input.neckCm !== undefined) next.neck_cm = input.neckCm;
  if (input.hipCm !== undefined) next.hip_cm = input.hipCm;
  if (input.bicepCm !== undefined) next.bicep_cm = input.bicepCm;
  if (input.thighCm !== undefined) next.thigh_cm = input.thighCm;
  if (input.notes !== undefined) next.notes = input.notes;
  return next;
}

function resolveCompositionSnapshot(
  fields: MeasurementMetricFields,
  profile: { height_cm: number | null; sex: string | null } | null,
  options: { manualBodyFatProvided: boolean },
): CompositionSnapshot {
  const navy = deriveBodyComposition({
    sex: profile?.sex,
    heightCm: profile?.height_cm,
    weightKg: fields.weight_kg,
    neckCm: fields.neck_cm,
    waistCm: fields.waist_cm,
    hipCm: fields.hip_cm,
  });

  if (navy.ok) {
    return {
      body_fat_percent: navy.bodyFatPercent,
      fat_mass_kg: navy.fatMassKg,
      lean_mass_kg: navy.leanMassKg,
      ffmi: navy.ffmi,
      composition_method: NAVY_COMPOSITION_METHOD,
    };
  }

  const manualBf =
    options.manualBodyFatProvided || fields.composition_method === 'manual'
      ? fields.body_fat_percent
      : null;

  if (manualBf != null && Number.isFinite(manualBf) && manualBf > 0) {
    return {
      body_fat_percent: manualBf,
      fat_mass_kg: null,
      lean_mass_kg: null,
      ffmi: null,
      composition_method: 'manual',
    };
  }

  return {
    body_fat_percent: null,
    fat_mass_kg: null,
    lean_mass_kg: null,
    ffmi: null,
    composition_method: null,
  };
}

function toPersistPayload(
  fields: MeasurementMetricFields,
  snapshot: CompositionSnapshot,
): Record<string, number | string | null> {
  return {
    weight_kg: fields.weight_kg,
    waist_cm: fields.waist_cm,
    neck_cm: fields.neck_cm,
    hip_cm: fields.hip_cm,
    bicep_cm: fields.bicep_cm,
    thigh_cm: fields.thigh_cm,
    notes: fields.notes,
    body_fat_percent: snapshot.body_fat_percent,
    fat_mass_kg: snapshot.fat_mass_kg,
    lean_mass_kg: snapshot.lean_mass_kg,
    ffmi: snapshot.ffmi,
    composition_method: snapshot.composition_method,
  };
}

function mapRow(row: Record<string, unknown>): BodyMeasurement {
  return {
    id: String(row.id),
    measured_on: String(row.measured_on),
    weight_kg: (row.weight_kg as number | null | undefined) ?? null,
    body_fat_percent: (row.body_fat_percent as number | null | undefined) ?? null,
    waist_cm: (row.waist_cm as number | null | undefined) ?? null,
    neck_cm: (row.neck_cm as number | null | undefined) ?? null,
    hip_cm: (row.hip_cm as number | null | undefined) ?? null,
    bicep_cm: (row.bicep_cm as number | null | undefined) ?? null,
    thigh_cm: (row.thigh_cm as number | null | undefined) ?? null,
    composition_method: (row.composition_method as CompositionMethod | null | undefined) ?? null,
    fat_mass_kg: (row.fat_mass_kg as number | null | undefined) ?? null,
    lean_mass_kg: (row.lean_mass_kg as number | null | undefined) ?? null,
    ffmi: (row.ffmi as number | null | undefined) ?? null,
    notes: (row.notes as string | null | undefined) ?? null,
  };
}

export function useBodyMeasurements() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['body-measurements', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<BodyMeasurement[]> => {
      const supabase = getSupabase();
      if (!supabase || !userId) return [];
      const { data, error } = await supabase
        .from('body_measurements')
        .select(MEASUREMENT_COLUMNS)
        .eq('user_id', userId)
        .order('measured_on', { ascending: false })
        .limit(HISTORY_LIMIT);
      if (error) throw error;
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
    },
  });
}

export function useLatestWeight() {
  const query = useBodyMeasurements();
  const latest = query.data?.find((row) => row.weight_kg != null) ?? null;
  return { ...query, weightKg: latest?.weight_kg ?? null };
}

export function useAddBodyMeasurement() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BodyMeasurementWriteInput) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');

      const profile = await fetchProfile(userId);

      const { data: existing, error: lookupError } = await supabase
        .from('body_measurements')
        .select(MEASUREMENT_COLUMNS)
        .eq('user_id', userId)
        .eq('measured_on', input.measuredOn)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lookupError) throw lookupError;

      const base = existing
        ? fromRow(mapRow(existing as Record<string, unknown>))
        : emptyMetricFields();
      const merged = mergeWriteInput(base, input);
      const snapshot = resolveCompositionSnapshot(merged, profile, {
        manualBodyFatProvided: input.bodyFatPercent !== undefined,
      });
      const payload = toPersistPayload(merged, snapshot);

      if (existing && (existing as { id?: string }).id) {
        const { error: updateError } = await supabase
          .from('body_measurements')
          .update(payload)
          .eq('id', (existing as { id: string }).id)
          .eq('user_id', userId);
        if (updateError) throw updateError;
        return;
      }

      const { error: insertError } = await supabase.from('body_measurements').insert({
        user_id: userId,
        measured_on: input.measuredOn,
        ...payload,
      });
      if (insertError) throw insertError;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
    },
  });
}

export function useUpdateBodyMeasurement() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BodyMeasurementWriteInput & { id: string }) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');

      const profile = await fetchProfile(userId);

      const { data: existing, error: lookupError } = await supabase
        .from('body_measurements')
        .select(MEASUREMENT_COLUMNS)
        .eq('id', input.id)
        .eq('user_id', userId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) throw new Error('Measurement not found.');

      const base = fromRow(mapRow(existing as Record<string, unknown>));
      const merged = mergeWriteInput(base, input);
      const snapshot = resolveCompositionSnapshot(merged, profile, {
        manualBodyFatProvided: input.bodyFatPercent !== undefined,
      });
      const payload = toPersistPayload(merged, snapshot);

      const { error: updateError } = await supabase
        .from('body_measurements')
        .update({
          ...payload,
          measured_on: input.measuredOn,
        })
        .eq('id', input.id)
        .eq('user_id', userId);
      if (updateError) throw updateError;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
    },
  });
}

export function useDeleteBodyMeasurement() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');
      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
    },
  });
}

export function calculateBmi(weightKg: number, heightCm: number): number | null {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const meters = heightCm / 100;
  return Math.round((weightKg / (meters * meters)) * 10) / 10;
}
