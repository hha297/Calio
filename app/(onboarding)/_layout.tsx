import { Stack } from 'expo-router';

/** Route guards live in the root navigator — no duplicate redirects here. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
