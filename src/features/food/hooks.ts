import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import { scaleNutrition, sumMacros, type MacroTotals } from '@/features/diary/balance';
import { getSupabase } from '@/lib/supabase/client';

import { fetchFoodEntries } from './api';
import type { Food, FoodEntry, MealType } from './types';

export type { Food, FoodEntry, MealType };

export function useFoodEntries(dateKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['food-entries', userId, dateKey],
    enabled: Boolean(userId),
    queryFn: () => fetchFoodEntries(userId!, dateKey),
  });
}

export function useDayFoodTotals(dateKey: string) {
  const query = useFoodEntries(dateKey);
  const totals: MacroTotals = sumMacros(
    (query.data ?? []).map((entry) => ({
      calories: entry.calories,
      proteinG: entry.protein_g,
      carbsG: entry.carbs_g,
      fatG: entry.fat_g,
    })),
  );
  return { ...query, totals };
}

export function useSearchFoods(term: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const trimmed = term.trim();

  return useQuery({
    queryKey: ['foods', 'search', userId, trimmed],
    enabled: Boolean(userId) && trimmed.length >= 2,
    queryFn: async (): Promise<Food[]> => {
      const supabase = getSupabase();
      if (!supabase || !userId) return [];
      const { data, error } = await supabase
        .from('foods')
        .select(
          'id, name, brand, barcode, serving_label, serving_grams, calories, protein_g, carbs_g, fat_g, source',
        )
        .or(`name.ilike.%${trimmed}%,brand.ilike.%${trimmed}%`)
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRecentFoods() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['foods', 'recent', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<FoodEntry[]> => {
      const supabase = getSupabase();
      if (!supabase || !userId) return [];
      const { data, error } = await supabase
        .from('food_entries')
        .select(
          'id, logged_on, meal_type, quantity, food_name, brand, serving_label, calories, protein_g, carbs_g, fat_g',
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

type LogFoodInput = {
  dateKey: string;
  mealType: MealType;
  quantity: number;
  food: {
    id?: string | null;
    name: string;
    brand?: string | null;
    servingLabel: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
};

export function useLogFoodEntry() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogFoodInput) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in to log food.');

      const scaled = scaleNutrition(
        {
          calories: input.food.calories,
          proteinG: input.food.proteinG,
          carbsG: input.food.carbsG,
          fatG: input.food.fatG,
        },
        input.quantity,
      );

      const { error } = await supabase.from('food_entries').insert({
        user_id: userId,
        food_id: input.food.id ?? null,
        logged_on: input.dateKey,
        meal_type: input.mealType,
        quantity: input.quantity,
        food_name: input.food.name,
        brand: input.food.brand ?? null,
        serving_label: input.food.servingLabel,
        calories: scaled.calories,
        protein_g: scaled.proteinG,
        carbs_g: scaled.carbsG,
        fat_g: scaled.fatG,
      });
      if (error) throw error;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['food-entries', session?.user.id, variables.dateKey],
      });
      await queryClient.invalidateQueries({ queryKey: ['foods', 'recent', session?.user.id] });
    },
  });
}

export function useDeleteFoodEntry() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; dateKey: string }) => {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.from('food_entries').delete().eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['food-entries', session?.user.id, variables.dateKey],
      });
    },
  });
}

export function useCreateManualFood() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      brand?: string;
      servingLabel: string;
      calories: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      barcode?: string;
    }) => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');
      const { data, error } = await supabase
        .from('foods')
        .insert({
          user_id: userId,
          name: input.name,
          brand: input.brand ?? null,
          barcode: input.barcode ?? null,
          serving_label: input.servingLabel,
          calories: input.calories,
          protein_g: input.proteinG,
          carbs_g: input.carbsG,
          fat_g: input.fatG,
          source: input.barcode ? 'open_food_facts' : 'manual',
        })
        .select(
          'id, name, brand, barcode, serving_label, serving_grams, calories, protein_g, carbs_g, fat_g, source',
        )
        .single();
      if (error) throw error;
      return data as Food;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}
