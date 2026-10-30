import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/auth-provider';

import { deleteOwnAccount, exportUserData, updateProfile, type ProfileUpdate } from './api';

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

export function useDeleteAccount() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await deleteOwnAccount();
    },
    onSuccess: async () => {
      queryClient.clear();
      try {
        await signOut();
      } catch {
        // Session may already be invalid after Auth user deletion.
      }
    },
  });
}
