import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import { getSupabase } from '@/lib/supabase/client';

export type BodyMeasurement = {
  id: string;
  measured_on: string;
  weight_kg: number | null;
  body_fat_percent: number | null;
  waist_cm: number | null;
  notes: string | null;
};

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
        .select('id, measured_on, weight_kg, body_fat_percent, waist_cm, notes')
        .eq('user_id', userId)
        .order('measured_on', { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
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
    mutationFn: async (input: {
      measuredOn: string;
      weightKg?: number;
      bodyFatPercent?: number;
      waistCm?: number;
      notes?: string;
    }) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');
      const { error } = await supabase.from('body_measurements').insert({
        user_id: userId,
        measured_on: input.measuredOn,
        weight_kg: input.weightKg ?? null,
        body_fat_percent: input.bodyFatPercent ?? null,
        waist_cm: input.waistCm ?? null,
        notes: input.notes ?? null,
      });
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
