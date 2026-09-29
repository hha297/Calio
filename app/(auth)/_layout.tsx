import { Redirect, Stack, usePathname } from 'expo-router';

import { useAuth } from '@/features/auth/auth-provider';

export default function AuthLayout() {
  const { passwordRecovery } = useAuth();
  const pathname = usePathname();

  if (passwordRecovery && !pathname.includes('update-password')) {
    return <Redirect href="/(auth)/update-password" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
