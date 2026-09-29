import { Redirect, Stack, usePathname } from 'expo-router';

import { useAuth } from '@/features/auth/auth-provider';
import { isEmailConfirmed } from '@/features/auth/email-confirmed';

export default function AuthLayout() {
  const { passwordRecovery, session } = useAuth();
  const pathname = usePathname();
  const emailConfirmed = isEmailConfirmed(session?.user);
  const pendingEmail = session?.user.email?.trim();

  // After OTP verification, keep the user on reset-password until they finish.
  if (
    passwordRecovery &&
    !pathname.includes('reset-password') &&
    !pathname.includes('update-password')
  ) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  // Unverified session must stay on Verify Email (cannot reach setup/main).
  if (
    session &&
    !passwordRecovery &&
    !emailConfirmed &&
    !pathname.includes('verify-email')
  ) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/verify-email',
          params: pendingEmail ? { email: pendingEmail } : undefined,
        }}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
