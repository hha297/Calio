import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useBootstrap } from '@/features/bootstrap/bootstrap-provider';
import { reportError } from '@/lib/errors/report-error';
import { colors } from '@/theme';

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
    <LinearGradient
      colors={[colors.primaryBright, colors.primary, '#2A043D']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
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
                <Text variant="bodyStrong" style={{ color: colors.secondary }}>
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
              className="w-full overflow-hidden rounded-[28px] px-5 py-6"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 3,
                borderColor: colors.secondary,
              }}
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
                    height: 10,
                    width: stepIndex === index ? 28 : 10,
                    borderRadius: 999,
                    backgroundColor:
                      stepIndex === index
                        ? colors.secondary
                        : stepIndex < index
                          ? 'rgba(196,220,74,0.45)'
                          : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </View>
          </View>

          <View className="gap-3 pb-2">
            <Button
              label={isLast ? 'Get started' : 'Next'}
              variant="secondary"
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
                <Text variant="bodyStrong" style={{ color: colors.secondary }}>
                  I already have an account
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
