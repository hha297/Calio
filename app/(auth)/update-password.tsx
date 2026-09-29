import { Redirect } from 'expo-router';

/** @deprecated Use `/(auth)/reset-password` — kept for recovery-guard redirects. */
export default function UpdatePasswordRedirect() {
  return <Redirect href="/(auth)/reset-password" />;
}
