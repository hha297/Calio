import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveGoal } from '@/features/goals/hooks';
import { useLatestWeight } from '@/features/measurements/hooks';
import { reportError } from '@/lib/errors/report-error';

export default function AccountScreen() {
  const { session, signOut } = useAuth();
  const goal = useActiveGoal();
  const weight = useLatestWeight();
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (signOutError) {
      reportError(signOutError, { area: 'auth', action: 'sign-out' });
      setError(toAuthErrorMessage(signOutError));
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Screen scroll>
      <View className="gap-4">
        <BrandMark />
        <Text variant="headingLarge">Account</Text>

        {session ? (
          <Card className="gap-1">
            <Text variant="label" tone="secondary">
              Signed in
            </Text>
            <Text variant="bodyStrong">{session.user.email ?? 'Signed in'}</Text>
          </Card>
        ) : (
          <Card className="gap-2">
            <Text variant="headingSmall">Sign in</Text>
            <Text variant="body" tone="secondary">
              Sign in to sync your diary and workouts.
            </Text>
            <Link href="/(auth)/sign-in">
              <Text variant="bodyStrong" tone="brand">
                Open sign in
              </Text>
            </Link>
          </Card>
        )}

        <Card className="gap-2">
          <Text variant="headingSmall">Goal</Text>
          <Text variant="body" tone="secondary">
            {goal.data
              ? `${goal.data.goal_type.replaceAll('_', ' ')} · ${goal.data.daily_calorie_target} kcal/day`
              : 'No active goal yet'}
          </Text>
          <Pressable onPress={() => router.push('/goals')}>
            <Text variant="bodyStrong" tone="brand">
              Edit goal & macros
            </Text>
          </Pressable>
        </Card>

        <Card className="gap-2">
          <Text variant="headingSmall">Body</Text>
          <Text variant="body" tone="secondary">
            Latest weight: {weight.weightKg != null ? `${weight.weightKg} kg` : 'not logged'}
          </Text>
          <Text variant="caption" tone="muted">
            Height and units come from setup. Log weight anytime in Measurements.
          </Text>
          <Pressable onPress={() => router.push('/measurements')}>
            <Text variant="bodyStrong" tone="brand">
              Measurements
            </Text>
          </Pressable>
        </Card>

        <Card className="gap-2">
          <Text variant="headingSmall">About Calio</Text>
          <Text variant="bodySmall" tone="secondary">
            Calorie and activity numbers are estimates for everyday tracking, not medical
            measurements.
          </Text>
        </Card>

        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}

        {session ? (
          <Button
            label="Sign out"
            variant="ghost"
            loading={signingOut}
            onPress={() => {
              void handleSignOut();
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}
