import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useThemeColors } from '@/theme/theme-provider';

/** Left-edge hit area (px). Narrow enough to not steal horizontal scrolls. */
const EDGE_WIDTH = 24;
/** Distance / velocity to commit the pop. */
const COMMIT_DISTANCE = 72;
const COMMIT_VELOCITY = 600;

/**
 * Android native-stack does not support iOS-style swipe-back (`gestureEnabled`
 * is iOS-only; Expo Router also forces it off on Android). This edge gesture
 * calls `router.back()` so nested + root workout history both work.
 */
export function AndroidEdgeSwipeBack() {
  const router = useRouter();
  const colors = useThemeColors();
  const dragX = useSharedValue(0);
  const active = useSharedValue(0);

  const pan = useMemo(() => {
    const goBack = () => {
      if (router.canGoBack()) {
        router.back();
      }
    };

    return Gesture.Pan()
      .enabled(Platform.OS === 'android')
      .hitSlop({ left: 0, width: EDGE_WIDTH })
      .activeOffsetX(12)
      .failOffsetY([-24, 24])
      .onBegin(() => {
        active.value = 1;
        dragX.value = 0;
      })
      .onUpdate((e) => {
        dragX.value = Math.max(0, e.translationX);
      })
      .onEnd((e) => {
        const shouldCommit =
          e.translationX > COMMIT_DISTANCE || e.velocityX > COMMIT_VELOCITY;
        if (shouldCommit) {
          dragX.value = 0;
          active.value = 0;
          runOnJS(goBack)();
          return;
        }
        dragX.value = withSpring(0, { damping: 28, stiffness: 320 });
        active.value = 0;
      })
      .onFinalize(() => {
        if (active.value === 1) {
          dragX.value = withSpring(0, { damping: 28, stiffness: 320 });
          active.value = 0;
        }
      });
  }, [active, dragX, router]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: Math.min(dragX.value / COMMIT_DISTANCE, 1) * 0.4,
    transform: [{ translateX: Math.min(dragX.value * 0.15, 12) }],
  }));

  if (Platform.OS !== 'android') {
    return null;
  }

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={styles.edge}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Animated.View
          style={[styles.indicator, { backgroundColor: colors.primary }, indicatorStyle]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  edge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    zIndex: 1000,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: '30%',
    bottom: '30%',
    width: 3,
    borderRadius: 2,
  },
});
