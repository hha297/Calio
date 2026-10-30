import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { FloatingBackgroundDecor } from '@/components/floating-background-decor';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useBootstrap } from '@/features/bootstrap/bootstrap-provider';
import { reportError } from '@/lib/errors/report-error';
import { elevation, radii, spacing, withAlpha } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

const steps = [
  {
    title: 'Log meals without the fuss',
    body: 'Search, scan, or add a food. Calories and macros land in your diary automatically.',
  },
  {
    title: 'See the day at a glance',
    body: 'Track intake against your target so cutting or bulking stays intentional.',
  },
  {
    title: 'Train in the same place',
    body: 'Log strength and cardio next to your food — no extra notebook.',
  },
  {
    title: 'Goals that match your phase',
    body: 'Set a cut, maintain, or bulk target and keep the daily balance clear.',
  },
];

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const { completeOnboarding } = useBootstrap();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  async function finish(href: '/(auth)/sign-up' | '/(auth)/sign-in') {
    if (busy) return;
    setBusy(true);
    try {
      await completeOnboarding();
      router.replace(href);
    } catch (error) {
      reportError(error, { area: 'onboarding', action: 'complete' });
      setBusy(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FloatingBackgroundDecor />
      <SafeAreaView style={{ flex: 1, zIndex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
        <View className="flex-1 justify-between px-5 py-3">
          <View className="items-end">
            {!isLast ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Skip onboarding"
                disabled={busy}
                onPress={() => {
                  void finish('/(auth)/sign-up');
                }}
                hitSlop={12}
              >
                <Text variant="bodyStrong" style={{ color: colors.primary }}>
                  Skip
                </Text>
              </Pressable>
            ) : (
              <View className="h-5" />
            )}
          </View>

          <View className="items-center gap-7">
            <BrandMark size="hero" />

            <View
              className="w-full px-5 py-6"
              style={[
                elevation.card('#000000'),
                {
                  backgroundColor: colors.surface,
                  borderRadius: radii.md,
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[6],
                },
              ]}
            >
              <Text variant="display" className="mb-3">
                {step.title}
              </Text>
              <Text variant="body" tone="secondary">
                {step.body}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              {steps.map((item, stepIndex) => (
                <View
                  key={item.title}
                  style={{
                    height: 8,
                    width: stepIndex === index ? 24 : 8,
                    borderRadius: radii.pill,
                    backgroundColor:
                      stepIndex === index
                        ? colors.primary
                        : stepIndex < index
                          ? withAlpha(colors.primary, 0.45)
                          : colors.surfaceMuted,
                  }}
                />
              ))}
            </View>
          </View>

          <View className="gap-3 pb-2">
            <Button
              label={isLast ? 'Get started' : 'Next'}
              variant="primary"
              size="lg"
              loading={busy && isLast}
              disabled={busy}
              onPress={() => {
                if (isLast) {
                  void finish('/(auth)/sign-up');
                  return;
                }
                setIndex((value) => value + 1);
              }}
            />
            {isLast ? (
              <Pressable
                disabled={busy}
                onPress={() => {
                  void finish('/(auth)/sign-in');
                }}
                className="items-center py-2"
              >
                <Text variant="bodyStrong" style={{ color: colors.primary }}>
                  I already have an account
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
