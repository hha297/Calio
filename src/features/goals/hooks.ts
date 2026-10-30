import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';

import {
  fetchActiveGoal,
  fetchProfile,
  updateActiveGoalDiet,
  type UpdateGoalDietInput,
} from './api';
import type { Goal, Profile } from './types';

export type { Goal, Profile };

export function useProfile() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: () => fetchProfile(userId!),
  });
}

export function useActiveGoal() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['goal', 'active', userId],
    enabled: Boolean(userId),
    queryFn: () => fetchActiveGoal(userId!),
  });
}

export function useUpdateActiveGoalDiet() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: (input: UpdateGoalDietInput) => {
      if (!userId) throw new Error('Sign in required.');
      return updateActiveGoalDiet(userId, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goal', 'active', userId] });
    },
  });
}
