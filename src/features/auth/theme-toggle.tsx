import { Moon, Sun } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { brand } from '@/theme/themes';
import { useTheme } from '@/theme/theme-provider';

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 24;
const THUMB_PAD = 3;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PAD * 2;

/** Sliding sun/moon theme toggle — left = light, right = dark. */
export function ThemeToggle() {
  const { scheme, colors, toggleLightDark } = useTheme();
  const isDark = scheme === 'dark';
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 220 });
  }, [isDark, progress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));

  // Light: white track + primary border/thumb. Dark: muted track + primary thumb.
  const trackBg = isDark ? colors.surfaceMuted : colors.surface;
  const trackBorder = isDark ? colors.border : colors.primary;
  const thumbBg = colors.primary;
  const iconColor = isDark ? '#FFFFFF' : colors.textOnPrimary;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? 'Dark mode' : 'Light mode'}
      hitSlop={8}
      onPress={toggleLightDark}
      style={styles.hit}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackBg,
            borderColor: trackBorder,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbBg,
              borderColor: 'transparent',
              shadowColor: brand.darkBackground,
            },
            thumbStyle,
          ]}
        >
          {isDark ? (
            <Moon size={14} color={iconColor} strokeWidth={2.5} />
          ) : (
            <Sun size={14} color={iconColor} strokeWidth={2.5} />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1,
    paddingHorizontal: THUMB_PAD,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});
