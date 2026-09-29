export type Profile = {
  id: string;
  display_name: string | null;
  height_cm: number | null;
  units: 'metric' | 'imperial';
  onboarding_completed_at: string | null;
};

export type Goal = {
  id: string;
  goal_type: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_weight_kg: number | null;
  daily_calorie_target: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  is_active: boolean;
};
