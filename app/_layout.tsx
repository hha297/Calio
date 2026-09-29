import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import '@/i18n';

import { AuthProvider } from '@/features/auth/auth-provider';
import { BootstrapProvider, useBootstrap } from '@/features/bootstrap/bootstrap-provider';
import { BootstrapScreen } from '@/features/bootstrap/bootstrap-screen';
import { reportError } from '@/lib/errors/report-error';
import { queryClient } from '@/lib/query/query-client';
import { brand } from '@/theme';
import { useAppFonts } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/theme-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BootstrapProvider>
              <RootNavigator />
            </BootstrapProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { isBootstrapping, destination, error, retry } = useBootstrap();
  const { scheme } = useTheme();

  useEffect(() => {
    const bg = scheme === 'dark' ? brand.darkBackground : brand.lightBackground;
    SystemUI.setBackgroundColorAsync(bg).catch((err: unknown) => {
      reportError(err, { area: 'system-ui' });
    });
  }, [scheme]);

  useEffect(() => {
    SplashScreen.hideAsync().catch((err: unknown) => {
      reportError(err, { area: 'splash' });
    });
  }, []);

  if (error) {
    return (
      <>
        <StatusBar style="light" />
        <BootstrapScreen error={error} onRetry={retry} />
      </>
    );
  }

  if (isBootstrapping || !destination) {
    return (
      <>
        <StatusBar style="light" />
        <BootstrapScreen />
      </>
    );
  }

  const showOnboarding = destination === 'onboarding';
  const showSetup = destination === 'setup';
  const showMain = destination === 'main';
  const showAuth = destination === 'auth' || destination === 'update-password';
  const statusStyle =
    showAuth || showMain
      ? scheme === 'dark'
        ? 'light'
        : 'dark'
      : 'light';

  return (
    <>
      <StatusBar style={statusStyle} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Protected guard={showOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected guard={showSetup}>
          <Stack.Screen name="(setup)" />
        </Stack.Protected>

        <Stack.Protected guard={showMain}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="food" options={{ presentation: 'modal' }} />
          <Stack.Screen name="workout" />
          <Stack.Screen name="goals" options={{ presentation: 'modal' }} />
          <Stack.Screen name="measurements" options={{ presentation: 'modal' }} />
        </Stack.Protected>

        <Stack.Protected guard={showAuth}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Screen name="auth/callback" options={{ animation: 'none' }} />
      </Stack>
    </>
  );
}
