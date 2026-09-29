import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { brand } from '@/theme/themes';
import { useTheme, useThemeColors } from '@/theme/theme-provider';

type BootstrapScreenProps = {
  error?: string | null;
  onRetry?: () => void;
  /** Escape hatch when the session is stale (e.g. account deleted mid-onboarding). */
  onSignIn?: () => void;
};

/** Branded wait / error — matches auth canvas (neutral bg, green accents). */
export function BootstrapScreen({ error, onRetry, onSignIn }: BootstrapScreenProps) {
  const colors = useThemeColors();
  const { scheme } = useTheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View pointerEvents="none" style={styles.decorLayer}>
        <View
          style={[
            styles.blob,
            styles.blobTop,
            {
              backgroundColor: colors.primaryBright,
              opacity: isDark ? 0.18 : 0.22,
            },
          ]}
        />
        <View
          style={[
            styles.blob,
            styles.blobSide,
            {
              backgroundColor: colors.primary,
              opacity: isDark ? 0.12 : 0.16,
            },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <BrandMark size="xl" />

          {error ? (
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
              <Text
                variant="headingSmall"
                style={[styles.centerText, { color: colors.textPrimary }]}
              >
                Couldn’t prepare your data
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.centerText, { color: colors.textMuted }]}
              >
                {error}
              </Text>
              <View style={styles.actions}>
                {onRetry ? (
                  <Button label="Retry" variant="primary" size="lg" onPress={onRetry} />
                ) : null}
                {onSignIn ? (
                  <Button
                    label="Back to sign in"
                    variant="secondary"
                    size="lg"
                    onPress={onSignIn}
                  />
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text variant="bodySmall" style={{ color: colors.textMuted }}>
                Getting things ready…
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  decorLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    top: -48,
    right: -64,
    width: 200,
    height: 200,
    borderRadius: 64,
    transform: [{ rotate: '18deg' }],
  },
  blobSide: {
    bottom: 120,
    left: -70,
    width: 160,
    height: 160,
  },
  safe: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  centerText: {
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  loading: {
    alignItems: 'center',
    gap: 12,
  },
});
