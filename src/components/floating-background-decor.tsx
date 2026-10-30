import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

/** Quiet primary accents for auth/hero — scarce green on Replicate bone canvases. */
export function FloatingBackgroundDecor() {
  const { scheme, colors } = useTheme();
  const isDark = scheme === 'dark';

  return (
    <View pointerEvents="none" style={styles.layer}>
      <View
        style={[
          styles.blob,
          styles.blobTopRight,
          {
            backgroundColor: colors.primaryBright,
            opacity: isDark ? 0.18 : 0.14,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobMidLeft,
          {
            backgroundColor: colors.primary,
            opacity: isDark ? 0.12 : 0.1,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringUpperLeft,
          {
            borderColor: colors.primary,
            opacity: isDark ? 0.22 : 0.16,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTopRight: {
    top: -64,
    right: -72,
    width: 220,
    height: 220,
  },
  blobMidLeft: {
    top: '40%',
    left: -80,
    width: 160,
    height: 160,
  },
  ring: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 2,
  },
  ringUpperLeft: {
    top: 120,
    left: -28,
  },
});
