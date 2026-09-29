import { Stack } from 'expo-router';

import { SetupProvider } from '@/features/setup/setup-provider';

export default function SetupLayout() {
  return (
    <SetupProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </SetupProvider>
  );
}
