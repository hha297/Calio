import type { DietPresetId } from '@/features/diary/diet-presets';

export type Profile = {
  id: string;
  display_name: string | null;
  height_cm: number | null;
  sex: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null;
  birth_date: string | null;
  units: 'metric' | 'imperial';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'demanding' | null;
  onboarding_completed_at: string | null;
  avatar_url?: string | null;
};

export type Goal = {
  id: string;
  goal_type: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_weight_kg: number | null;
  daily_calorie_target: number;
  weekly_change_kg: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  diet_preset: DietPresetId | null;
  carbs_pct: number | null;
  protein_pct: number | null;
  fat_pct: number | null;
  is_active: boolean;
};
