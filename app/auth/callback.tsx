import * as Linking from 'expo-linking';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { LoadingState } from '@/components/ui/states';
import { useAuth } from '@/features/auth/auth-provider';
import { createSessionFromUrl } from '@/features/auth/session-from-url';
import { reportError } from '@/lib/errors/report-error';

/**
 * Landing route for Supabase email redirects (confirm + password recovery).
 * AuthProvider also listens globally; this screen covers cold-start via Expo Router.
 */
export default function AuthCallbackScreen() {
  const url = Linking.useURL();
  const { session, passwordRecovery, isReady } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (!url || handled) {
      return;
    }

    let active = true;
    void (async () => {
      try {
        await createSessionFromUrl(url);
      } catch (err) {
        reportError(err, { area: 'auth', action: 'callback-screen' });
        if (active) {
          setError(err instanceof Error ? err.message : 'Could not finish sign-in from this link.');
        }
      } finally {
        if (active) {
          setHandled(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [url, handled]);

  if (error) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <View className="flex-1 justify-center gap-4">
          <BrandMark />
          <Text variant="headingSmall">Link could not be opened</Text>
          <Text variant="body" tone="secondary">
            {error}
          </Text>
          <Button label="Go to sign in" onPress={() => router.replace('/(auth)/sign-in')} />
        </View>
      </Screen>
    );
  }

  if (!isReady || (!handled && url)) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <View className="flex-1 justify-center gap-6">
          <BrandMark />
          <LoadingState label="Finishing sign-in…" />
        </View>
      </Screen>
    );
  }

  if (passwordRecovery) {
    return <Redirect href="/(auth)/update-password" />;
  }

  if (session) {
    return <Redirect href="/(tabs)/index" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
