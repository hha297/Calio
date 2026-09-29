import { LinearGradient } from 'expo-linear-gradient';
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
import { colors } from '@/theme';

type AuthShellProps = {
  title: string;
  /** Optional welcome copy under the title. Omit when it adds nothing. */
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Purple canvas + lime accents; content sits above décor with solid contrast. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#6B1A96', colors.primary, '#2A043D']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={styles.decorLayer}>
        <View style={styles.blobTop} />
        <View style={styles.blobSide} />
        <View style={styles.blobCorner} />
      </View>

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <BrandMark size="hero" />
              <Text variant="display" tone="onPrimary" style={styles.title}>
                {title}
              </Text>
              {subtitle ? (
                <Text variant="body" style={styles.subtitle}>
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHandle} />
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
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    zIndex: 2,
  },
  decorLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    overflow: 'hidden',
  },
  blobTop: {
    position: 'absolute',
    top: -48,
    right: -64,
    width: 200,
    height: 200,
    borderRadius: 64,
    backgroundColor: colors.secondary,
    opacity: 0.22,
    transform: [{ rotate: '22deg' }],
  },
  blobSide: {
    position: 'absolute',
    top: 210,
    left: -70,
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: colors.secondaryHot,
    opacity: 0.16,
  },
  blobCorner: {
    position: 'absolute',
    bottom: 160,
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    opacity: 0.55,
    transform: [{ rotate: '-14deg' }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    maxWidth: 340,
    paddingHorizontal: 8,
    lineHeight: 24,
  },
  card: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.secondary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  cardHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  footer: {
    marginTop: 22,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
