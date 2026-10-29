import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

/**
 * Soft floating abstract shapes behind screen content.
 * Uses the theme primary scale (#00D95F family) at opacities that stay visible
 * on both light cream and dark olive canvases.
 */
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
            opacity: isDark ? 0.5 : 0.6,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobMidLeft,
          {
            backgroundColor: colors.primary,
            opacity: isDark ? 0.32 : 0.36,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobBottomRight,
          {
            backgroundColor: colors.primaryPressed,
            opacity: isDark ? 0.34 : 0.38,
          },
        ]}
      />
      <View
        style={[
          styles.block,
          styles.blockLowerLeft,
          {
            backgroundColor: colors.primaryBright,
            opacity: isDark ? 0.4 : 0.45,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringUpperLeft,
          {
            borderColor: colors.primary,
            opacity: isDark ? 0.5 : 0.48,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringLowerRight,
          {
            borderColor: colors.primaryBright,
            opacity: isDark ? 0.42 : 0.4,
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
    top: -56,
    right: -72,
    width: 240,
    height: 240,
    borderRadius: 80,
    transform: [{ rotate: '18deg' }],
  },
  blobMidLeft: {
    top: '32%',
    left: -90,
    width: 190,
    height: 190,
  },
  blobBottomRight: {
    bottom: 100,
    right: -48,
    width: 160,
    height: 160,
  },
  block: {
    position: 'absolute',
    borderRadius: 18,
  },
  blockLowerLeft: {
    bottom: 200,
    left: 24,
    width: 56,
    height: 56,
    transform: [{ rotate: '-12deg' }],
  },
  ring: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
  },
  ringUpperLeft: {
    top: 120,
    left: -30,
  },
  ringLowerRight: {
    bottom: 150,
    right: 24,
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
