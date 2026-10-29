import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { reportError } from '@/lib/errors/report-error';
import { layout, radii, spacing } from '@/theme';
import { fonts } from '@/theme/fonts';
import { useTheme, useThemeColors } from '@/theme/theme-provider';

import { toAuthErrorMessage } from './auth-errors';
import { useAuth } from './auth-provider';
import { GoogleGMark } from './google-g-mark';

/**
 * Google Sign-In branding (custom button path):
 * https://developers.google.com/identity/branding-guidelines
 *
 * Light — fill #FFFFFF, stroke #747775, label #1F1F1F
 * Dark  — fill #131314, stroke #8E918F, label #E3E3E3
 * “G” must stay official multicolor on a white tile (never recolored).
 */
const GOOGLE_BUTTON = {
  light: {
    fill: '#FFFFFF',
    stroke: '#747775',
    label: '#1F1F1F',
  },
  dark: {
    fill: '#131314',
    stroke: '#8E918F',
    label: '#E3E3E3',
  },
} as const;

export function GoogleOAuthButton({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { scheme } = useTheme();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const palette = scheme === 'dark' ? GOOGLE_BUTTON.dark : GOOGLE_BUTTON.light;
  const isDisabled = disabled || loading;

  const startGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      reportError(err, { area: 'auth', action: 'google-sign-in' });
      setError(toAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text variant="bodySmall" tone="muted">
          {t('auth.orContinueWith')}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('auth.continueWithGoogle')}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={() => void startGoogleSignIn()}
        cssInterop={false}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: palette.fill,
            borderColor: palette.stroke,
            opacity: isDisabled ? 0.55 : pressed ? 0.92 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={palette.label} />
        ) : (
          <View style={styles.content}>
            <GoogleGMark size={20} />
            <RNText style={[styles.label, { color: palette.label }]}>
              {t('auth.continueWithGoogle')}
            </RNText>
          </View>
        )}
      </Pressable>

      {error ? (
        <View style={[styles.errorBanner, { backgroundColor: colors.errorMuted }]}>
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing[4],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  button: {
    width: '100%',
    minHeight: layout.controlMinHeight,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  label: {
    fontFamily: fonts.ibmMedium,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorBanner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: 10,
  },
});
