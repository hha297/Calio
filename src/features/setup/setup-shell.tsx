import { ArrowLeft, ArrowRight } from 'lucide-react-native';
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
import { FloatingBackgroundDecor } from '@/components/floating-background-decor';
import { setupCardShadow } from '@/features/setup/setup-shadows';
import { brand } from '@/theme/themes';
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

/**
 * Setup canvas — same family as AuthShell: neutral background, green accents,
 * surface card. No full-bleed primary gradient.
 */
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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FloatingBackgroundDecor />

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <View style={styles.topBar}>
            {onBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                hitSlop={10}
                style={styles.backRow}
              >
                <ArrowLeft size={18} color={colors.primary} strokeWidth={2.5} />
                <Text variant="bodyStrong" style={{ color: colors.primary }}>
                  Back
                </Text>
              </Pressable>
            ) : (
              <View style={styles.topSpacer} />
            )}
            <Text variant="caption" tone="muted">
              Step {stepIndex + 1} of {stepTotal}
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceMuted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(1, progress) * 100}%`,
                  backgroundColor: colors.primary,
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
              <BrandMark size="hero" />
              <Text
                variant="headingLarge"
                style={[styles.title, { color: colors.textPrimary }]}
              >
                {title}
              </Text>
              {subtitle ? (
                <Text
                  variant="body"
                  style={[styles.subtitle, { color: colors.textMuted }]}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                setupCardShadow(brand.darkBackground),
              ]}
            >
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
                    iconEnd={(color) => (
                      <ArrowRight size={18} color={color} strokeWidth={2.5} />
                    )}
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
  safe: { flex: 1, zIndex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  topSpacer: { width: 72 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressTrack: {
    marginHorizontal: 20,
    height: 6,
    borderRadius: 999,
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
    maxWidth: 340,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
  },
  cta: { marginTop: 20 },
  footer: { marginTop: 18, alignItems: 'center' },
});
