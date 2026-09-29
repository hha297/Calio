import { Redirect, Stack, usePathname } from 'expo-router';

import { useAuth } from '@/features/auth/auth-provider';

export default function AuthLayout() {
  const { passwordRecovery } = useAuth();
  const pathname = usePathname();

  // After OTP verification, keep the user on reset-password until they finish.
  if (
    passwordRecovery &&
    !pathname.includes('reset-password') &&
    !pathname.includes('update-password')
  ) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
