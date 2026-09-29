import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

/** Soft abstract shapes behind auth content — theme-aware, non-interactive. */
export function AuthBackgroundDecor() {
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
            opacity: isDark ? 0.2 : 0.26,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobMidLeft,
          {
            backgroundColor: colors.primary,
            opacity: isDark ? 0.16 : 0.22,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobBottomRight,
          {
            backgroundColor: colors.primaryPressed,
            opacity: isDark ? 0.18 : 0.24,
          },
        ]}
      />
      <View
        style={[
          styles.block,
          styles.blockLowerLeft,
          {
            backgroundColor: colors.primaryBright,
            opacity: isDark ? 0.28 : 0.34,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringUpperLeft,
          {
            borderColor: colors.primary,
            opacity: isDark ? 0.32 : 0.38,
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
    width: 220,
    height: 220,
    borderRadius: 72,
    transform: [{ rotate: '18deg' }],
  },
  blobMidLeft: {
    top: '34%',
    left: -80,
    width: 168,
    height: 168,
  },
  blobBottomRight: {
    bottom: 120,
    right: -36,
    width: 140,
    height: 140,
  },
  block: {
    position: 'absolute',
    borderRadius: 18,
  },
  blockLowerLeft: {
    bottom: 200,
    left: 24,
    width: 52,
    height: 52,
    transform: [{ rotate: '-12deg' }],
  },
  ring: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
  },
  ringUpperLeft: {
    top: 128,
    left: -28,
  },
});
