import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

import {
  deleteOwnAccount,
  exportUserData,
  updateProfile,
  wipeOwnUserData,
  type ProfileUpdate,
} from './api';
import type { CalioBackup } from './backup';
import { importUserData, type ImportMode } from './import-user-data';

export function useUpdateProfile() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async (patch: ProfileUpdate) => {
      if (!userId) throw new Error('Sign in required.');
      return updateProfile(userId, patch);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}

export function useExportUserData() {
  const { session } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const userId = session?.user.id;
      if (!userId) throw new Error('Sign in required.');
      return exportUserData(userId, session?.user.email ?? null);
    },
  });
}

async function clearLocalUserCaches(
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> {
  useActiveWorkoutStore.getState().reset();
  queryClient.clear();
}

export function useWipeUserData() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Sign in required.');
      await wipeOwnUserData();
    },
    onSuccess: async () => {
      // Stay signed in; drop React Query + active workout draft so UI matches emptied account.
      await clearLocalUserCaches(queryClient);
      // Re-seed profile query key after clear so bootstrap can pick up reset onboarding.
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
    },
  });
}

export function useImportUserData() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async (input: { backup: CalioBackup; mode: ImportMode }) => {
      if (!userId) throw new Error('Sign in required.');
      return importUserData(userId, input.backup, input.mode);
    },
    onSuccess: async () => {
      await clearLocalUserCaches(queryClient);
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
    },
  });
}

export function useDeleteAccount() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await deleteOwnAccount();
    },
    onSuccess: async () => {
      useActiveWorkoutStore.getState().reset();
      queryClient.clear();
      try {
        await signOut();
      } catch {
        // Session may already be invalid after Auth user deletion.
      }
    },
  });
}
