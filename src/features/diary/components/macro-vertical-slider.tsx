import { type ReactNode, useCallback, useEffect } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type MacroVerticalSliderProps = {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
  onChange: (value: number) => void;
  height?: number;
};

export function MacroVerticalSlider({
  label,
  value,
  color,
  icon,
  onChange,
  height = 160,
}: MacroVerticalSliderProps) {
  const colors = useThemeColors();
  const trackHeight = useSharedValue(height);
  const fillRatio = useSharedValue(value / 100);

  useEffect(() => {
    fillRatio.value = value / 100;
  }, [fillRatio, value]);

  const emit = useCallback(
    (ratio: number) => {
      const next = Math.max(0, Math.min(100, Math.round(ratio * 100)));
      onChange(next);
    },
    [onChange],
  );

  const updateFromY = (y: number) => {
    'worklet';
    const h = trackHeight.value || height;
    const clampedY = Math.max(0, Math.min(h, y));
    const ratio = 1 - clampedY / h;
    fillRatio.value = ratio;
    runOnJS(emit)(ratio);
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      updateFromY(e.y);
    })
    .onUpdate((e) => {
      updateFromY(e.y);
    });

  const tap = Gesture.Tap().onEnd((e) => {
    updateFromY(e.y);
  });

  const fillStyle = useAnimatedStyle(() => ({
    height: `${Math.max(4, fillRatio.value * 100)}%`,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    trackHeight.value = event.nativeEvent.layout.height;
  };

  return (
    <View className="flex-1 items-center gap-2">
      <View className="items-center gap-1">
        {icon}
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
        <Text variant="headingSmall" style={{ color }}>
          {value}%
        </Text>
      </View>
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <View
          onLayout={onLayout}
          style={{
            width: 36,
            height,
            borderRadius: radii.pill,
            backgroundColor: colors.surfaceMuted,
            overflow: 'hidden',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={[
              {
                width: '100%',
                borderRadius: radii.pill,
                backgroundColor: color,
              },
              fillStyle,
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  );
}
