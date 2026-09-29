import { getSupabase } from '@/lib/supabase/client';

import { estimatePlan } from './calculations';
import {
  EMPTY_SETUP_ANSWERS,
  requiresManualCalories,
  type SetupAnswers,
  type SetupProgress,
  type SetupStepId,
} from './types';
import { birthDateFromAge } from './units';

function mergeAnswers(raw: unknown): SetupAnswers {
  if (!raw || typeof raw !== 'object') {
    return { ...EMPTY_SETUP_ANSWERS };
  }
  return { ...EMPTY_SETUP_ANSWERS, ...(raw as Partial<SetupAnswers>) };
}

export async function fetchSetupProgress(userId: string): Promise<SetupProgress | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('onboarding_progress')
    .select('current_step, answers, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return {
    currentStep: data.current_step as SetupStepId,
    answers: mergeAnswers(data.answers),
    updatedAt: data.updated_at,
  };
}

export async function saveSetupProgress(
  userId: string,
  currentStep: SetupStepId,
  answers: SetupAnswers,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('onboarding_progress').upsert(
    {
      user_id: userId,
      current_step: currentStep,
      answers,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw error;
  }
}

export type CompleteSetupResult = {
  calorieTarget: number;
};

/**
 * Persists profile, active goal, and initial weight. Retry-safe:
 * - profile upsert by id
 * - deactivates prior goals then inserts one active goal
 * - weight upsert on (user_id, measured_on)
 * - deletes draft progress and sets onboarding_completed_at last
 */
export async function completeSetup(userId: string, answers: SetupAnswers): Promise<CompleteSetupResult> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (
    !answers.goalType ||
    !answers.sex ||
    answers.ageYears == null ||
    answers.heightCm == null ||
    answers.weightKg == null ||
    !answers.activityLevel
  ) {
    throw new Error('Setup is incomplete. Go back and fill required fields.');
  }

  const sessions = answers.sessionsPerWeek ?? 0;
  const exerciseType =
    sessions === 0 ? 'none' : (answers.exerciseType ?? 'mixed');

  const plan = estimatePlan({
    goalType: answers.goalType,
    sex: answers.sex,
    ageYears: answers.ageYears,
    heightCm: answers.heightCm,
    weightKg: answers.weightKg,
    bodyFatPercent: answers.bodyFatPercent,
    activityLevel: answers.activityLevel,
    averageDailySteps: answers.averageDailySteps,
    sessionsPerWeek: sessions,
    exerciseType,
    sessionMinutes: answers.sessionMinutes ?? 0,
    intensity: answers.intensity ?? 'moderate',
    targetWeightKg:
      answers.goalType === 'maintain_weight'
        ? answers.weightKg
        : (answers.targetWeightKg ?? answers.weightKg),
    pace: answers.goalType === 'maintain_weight' ? null : answers.pace,
    requiresManualCalories: requiresManualCalories(answers),
    manualDailyCalories: answers.manualDailyCalories,
  });

  const dailyCalorieTarget = answers.overrideCalories ?? plan.dailyCalorieTarget;
  if (!dailyCalorieTarget || dailyCalorieTarget < 1200) {
    throw new Error('Set a valid daily calorie target before continuing.');
  }

  const protein_g = answers.overrideProteinG ?? plan.macros.protein_g;
  const carbs_g = answers.overrideCarbsG ?? plan.macros.carbs_g;
  const fat_g = answers.overrideFatG ?? plan.macros.fat_g;

  const birthDate = birthDateFromAge(answers.ageYears);
  const today = new Date().toISOString().slice(0, 10);

  const preferences = {
    dietary_pattern: answers.dietaryPattern,
    meals_per_day: answers.mealsPerDay,
    average_daily_steps: answers.averageDailySteps,
    sessions_per_week: sessions,
    exercise_type: exerciseType,
    session_minutes: answers.sessionMinutes,
    intensity: answers.intensity,
    is_pregnant_or_breastfeeding: answers.isPregnantOrBreastfeeding,
    setup_explanation: plan.explanation,
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      height_cm: answers.heightCm,
      sex: answers.sex,
      birth_date: birthDate,
      units: answers.units,
      activity_level: answers.activityLevel,
      preferences,
    })
    .eq('id', userId);

  if (profileError) {
    throw profileError;
  }

  const { error: deactivateError } = await supabase
    .from('goals')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true);

  if (deactivateError) {
    throw deactivateError;
  }

  const { error: goalError } = await supabase.from('goals').insert({
    user_id: userId,
    goal_type: answers.goalType,
    target_weight_kg:
      answers.goalType === 'maintain_weight'
        ? answers.weightKg
        : answers.targetWeightKg,
    daily_calorie_target: Math.round(dailyCalorieTarget),
    weekly_change_kg: plan.weeklyChangeKg,
    protein_g,
    carbs_g,
    fat_g,
    is_active: true,
  });

  if (goalError) {
    throw goalError;
  }

  const { error: weightError } = await supabase.from('body_measurements').upsert(
    {
      user_id: userId,
      measured_on: today,
      weight_kg: answers.weightKg,
      body_fat_percent: answers.bodyFatPercent,
      notes: 'Initial weight from setup',
    },
    { onConflict: 'user_id,measured_on' },
  );

  if (weightError) {
    throw weightError;
  }

  const { error: completeError } = await supabase
    .from('profiles')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', userId);

  if (completeError) {
    throw completeError;
  }

  const { error: draftError } = await supabase
    .from('onboarding_progress')
    .delete()
    .eq('user_id', userId);

  if (draftError) {
    throw draftError;
  }

  return { calorieTarget: Math.round(dailyCalorieTarget) };
}
