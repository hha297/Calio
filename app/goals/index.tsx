import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveGoal } from '@/features/goals/hooks';
import { getSupabase } from '@/lib/supabase/client';

const types = [
  { id: 'lose_weight', label: 'Lose weight' },
  { id: 'maintain_weight', label: 'Maintain' },
  { id: 'gain_weight', label: 'Gain weight' },
] as const;

export default function GoalsScreen() {
  const { session } = useAuth();
  const existing = useActiveGoal();
  const queryClient = useQueryClient();
  const [goalType, setGoalType] =
    useState<(typeof types)[number]['id']>('maintain_weight');
  const [calories, setCalories] = useState(
    String(existing.data?.daily_calorie_target ?? 2000),
  );
  const [targetWeight, setTargetWeight] = useState(
    existing.data?.target_weight_kg != null ? String(existing.data.target_weight_kg) : '',
  );
  const [protein, setProtein] = useState(String(existing.data?.protein_g ?? 120));
  const [carbs, setCarbs] = useState(String(existing.data?.carbs_g ?? 200));
  const [fat, setFat] = useState(String(existing.data?.fat_g ?? 70));
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      const supabase = getSupabase();
      const userId = session?.user.id;
      if (!supabase || !userId) throw new Error('Sign in required.');
      await supabase.from('goals').update({ is_active: false }).eq('user_id', userId).eq('is_active', true);
      const { error: insertError } = await supabase.from('goals').insert({
        user_id: userId,
        goal_type: goalType,
        daily_calorie_target: Number(calories) || 2000,
        target_weight_kg: targetWeight ? Number(targetWeight) : null,
        protein_g: Number(protein) || null,
        carbs_g: Number(carbs) || null,
        fat_g: Number(fat) || null,
        is_active: true,
      });
      if (insertError) throw insertError;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goal'] });
      router.back();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Could not save goal.'),
  });

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Goal</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="primary">
              Close
            </Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {types.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => setGoalType(type.id)}
              className={
                goalType === type.id
                  ? 'rounded-md bg-primary px-3 py-2'
                  : 'rounded-md border border-border bg-surface px-3 py-2'
              }
            >
              <Text
                variant="label"
                tone={goalType === type.id ? 'onPrimary' : 'primary'}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Input label="Daily calorie target" value={calories} onChangeText={setCalories} keyboardType="number-pad" />
        <Input label="Target weight (kg)" value={targetWeight} onChangeText={setTargetWeight} keyboardType="decimal-pad" />
        <Input label="Protein target (g)" value={protein} onChangeText={setProtein} keyboardType="number-pad" />
        <Input label="Carbs target (g)" value={carbs} onChangeText={setCarbs} keyboardType="number-pad" />
        <Input label="Fat target (g)" value={fat} onChangeText={setFat} keyboardType="number-pad" />
        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}
        <Button label="Save goal" loading={save.isPending} onPress={() => save.mutate()} />
      </View>
    </Screen>
  );
}
