import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import {
  fetchDayWorkouts,
  fetchFoodEntriesInRange,
  fetchWorkoutsInRange,
} from '@/features/diary/api';
import { weekDateKeys } from '@/features/diary/aggregations';

export function useFoodEntriesInRange(startKey: string, endKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['food-entries', 'range', userId, startKey, endKey],
    enabled: Boolean(userId) && Boolean(startKey) && Boolean(endKey) && startKey <= endKey,
    queryFn: () => fetchFoodEntriesInRange(userId!, startKey, endKey),
  });
}

export function useWorkoutsInRange(startKey: string, endKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', 'range', userId, startKey, endKey],
    enabled: Boolean(userId) && Boolean(startKey) && Boolean(endKey) && startKey <= endKey,
    queryFn: () => fetchWorkoutsInRange(userId!, startKey, endKey),
  });
}

export function useDayWorkouts(dateKey: string) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['workouts', 'day', userId, dateKey],
    enabled: Boolean(userId) && Boolean(dateKey),
    queryFn: () => fetchDayWorkouts(userId!, dateKey),
    staleTime: 30_000,
  });
}

export function useWeekFoodAndWorkouts(anchorKey: string) {
  const keys = weekDateKeys(anchorKey);
  const startKey = keys[0]!;
  const endKey = keys[keys.length - 1]!;
  const food = useFoodEntriesInRange(startKey, endKey);
  const workouts = useWorkoutsInRange(startKey, endKey);
  return { keys, startKey, endKey, food, workouts };
}
