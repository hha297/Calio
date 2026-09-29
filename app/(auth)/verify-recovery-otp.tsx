import { Redirect, useLocalSearchParams } from 'expo-router';

/** @deprecated Use `/(auth)/reset-password` — kept for deep links / old navigations. */
export default function VerifyRecoveryOtpRedirect() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : undefined;

  return (
    <Redirect
      href={{
        pathname: '/(auth)/reset-password',
        params: email ? { email } : undefined,
      }}
    />
  );
}
