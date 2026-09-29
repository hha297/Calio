import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type SetupShellProps = {
  title: string;
  subtitle?: string;
  stepIndex: number;
  stepTotal: number;
  children: ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  footer?: ReactNode;
  hideContinue?: boolean;
};

export function SetupShell({
  title,
  subtitle,
  stepIndex,
  stepTotal,
  children,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  continueLoading,
  footer,
  hideContinue,
}: SetupShellProps) {
  const colors = useThemeColors();
  const progress = stepTotal > 0 ? (stepIndex + 1) / stepTotal : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.primary }]}>
      <LinearGradient
        colors={[colors.primaryBright, colors.primary, colors.primaryPressed]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <View style={styles.topBar}>
            {onBack ? (
              <Pressable accessibilityRole="button" onPress={onBack} hitSlop={10}>
                <Text variant="bodyStrong" style={{ color: colors.secondary }}>
                  Back
                </Text>
              </Pressable>
            ) : (
              <View style={styles.topSpacer} />
            )}
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Step {stepIndex + 1} of {stepTotal}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(1, progress) * 100}%`,
                  backgroundColor: colors.secondary,
                },
              ]}
            />
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets
          >
            <View style={styles.hero}>
              <BrandMark size="md" />
              <Text variant="headingLarge" style={[styles.title, { color: '#F1F5E9' }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text variant="body" style={styles.subtitle}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.secondary,
                },
              ]}
            >
              <View style={[styles.cardHandle, { backgroundColor: colors.primary }]} />
              {children}
              {!hideContinue && onContinue ? (
                <View style={styles.cta}>
                  <Button
                    label={continueLabel}
                    variant="primary"
                    size="lg"
                    onPress={onContinue}
                    disabled={continueDisabled || continueLoading}
                    loading={continueLoading}
                  />
                </View>
              ) : null}
            </View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  topSpacer: { width: 48 },
  progressTrack: {
    marginHorizontal: 20,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: { textAlign: 'center' },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    maxWidth: 340,
    lineHeight: 22,
  },
  card: {
    borderRadius: 28,
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  cardHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 999,
    marginBottom: 18,
  },
  cta: { marginTop: 20 },
  footer: { marginTop: 18, alignItems: 'center' },
});
