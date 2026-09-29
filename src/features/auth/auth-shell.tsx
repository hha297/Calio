import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Text } from '@/components/ui/text';
import { AuthBackgroundDecor } from '@/features/auth/auth-background-decor';
import { AuthTopBar } from '@/features/auth/auth-top-bar';
import { useThemeColors } from '@/theme/theme-provider';
import { brand } from '@/theme/themes';

type AuthShellProps = {
  title: string;
  /** Optional welcome copy under the title. Omit when it adds nothing. */
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showTopBar?: boolean;
};

/**
 * Neutral auth canvas — light/dark background tokens only.
 * Brand green is reserved for accents (logo, CTAs, focus), not the screen fill.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  showTopBar = true,
}: AuthShellProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AuthBackgroundDecor />

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          {showTopBar ? (
            <View style={styles.topBar}>
              <AuthTopBar />
            </View>
          ) : null}

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets
          >
            <View style={styles.hero}>
              <BrandMark size="hero" />
              <Text variant="display" style={[styles.title, { color: colors.textPrimary }]}>
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
                  shadowColor: brand.darkBackground,
                },
              ]}
            >
              {children}
            </View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    zIndex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },
  hero: {
    position: 'relative',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
    paddingBottom: 4,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 340,
    paddingHorizontal: 8,
    lineHeight: 24,
  },
  card: {
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  footer: {
    marginTop: 22,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
