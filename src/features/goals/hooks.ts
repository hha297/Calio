import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';

import { fetchActiveGoal, fetchProfile } from './api';
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
