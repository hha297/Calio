import { z } from 'zod';

export const goalStepSchema = z.object({
  goalType: z.enum(['lose_weight', 'maintain_weight', 'gain_weight']),
});

export const safetyStepSchema = z.object({
  isPregnantOrBreastfeeding: z.boolean(),
});

export const bodyStepSchema = z
  .object({
    units: z.enum(['metric', 'imperial']),
    ageYears: z.number().int().min(13, 'Enter an age of 13 or older').max(100, 'Enter a valid age'),
    sex: z.enum(['female', 'male', 'other', 'prefer_not_to_say']),
    heightCm: z.number().min(120, 'Height looks too low').max(230, 'Height looks too high'),
    weightKg: z.number().min(35, 'Weight looks too low').max(250, 'Weight looks too high'),
    bodyFatPercent: z.number().min(3).max(60).nullable().optional(),
    manualDailyCalories: z.number().int().min(1200).max(6000).nullable().optional(),
  })
  .superRefine((values, ctx) => {
    const needsManual =
      values.sex === 'prefer_not_to_say' ||
      values.sex === 'other' ||
      values.ageYears < 18;
    if (needsManual && (values.manualDailyCalories == null || values.manualDailyCalories < 1200)) {
      ctx.addIssue({
        code: 'custom',
        path: ['manualDailyCalories'],
        message: 'Enter a daily calorie target (we can’t auto-estimate without this)',
      });
    }
  });

export const activityStepSchema = z.object({
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'demanding']),
  averageDailySteps: z.number().int().min(0).max(40000).nullable().optional(),
});

export const exerciseStepSchema = z
  .object({
    sessionsPerWeek: z.number().int().min(0).max(14),
    exerciseType: z.enum(['strength', 'cardio', 'sports', 'mixed', 'other', 'none']),
    sessionMinutes: z.number().int().min(0).max(240).nullable(),
    intensity: z.enum(['easy', 'moderate', 'hard']).nullable(),
  })
  .superRefine((values, ctx) => {
    if (values.sessionsPerWeek === 0 || values.exerciseType === 'none') {
      return;
    }
    if (!values.sessionMinutes || values.sessionMinutes < 10) {
      ctx.addIssue({
        code: 'custom',
        path: ['sessionMinutes'],
        message: 'Enter average session length',
      });
    }
    if (!values.intensity) {
      ctx.addIssue({
        code: 'custom',
        path: ['intensity'],
        message: 'Pick a typical intensity',
      });
    }
  });

export const targetStepSchema = z.object({
  targetWeightKg: z.number().min(40).max(250),
  pace: z.enum(['slow', 'moderate', 'fast']),
});

export const dietaryStepSchema = z.object({
  dietaryPattern: z.string().max(80).nullable().optional(),
  mealsPerDay: z.number().int().min(1).max(8).nullable().optional(),
});
