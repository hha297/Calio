import { Redirect, useLocalSearchParams } from 'expo-router';

/** @deprecated Prefer `/(auth)/verify-email` — kept for older navigations. */
export default function CheckEmailRedirect() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : undefined;

  return (
    <Redirect
      href={{
        pathname: '/(auth)/verify-email',
        params: email ? { email } : undefined,
      }}
    />
  );
}
