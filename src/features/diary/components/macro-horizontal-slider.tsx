import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  View,
  type ViewInstance,
} from 'react-native';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type MacroHorizontalSliderProps = {
  label: string;
  value: number;
  color: string;
  icon: ReactNode;
  disabled?: boolean;
  onChange: (value: number) => void;
  /** Parent should disable ScrollView while true to stop scroll fighting the drag. */
  onDraggingChange?: (dragging: boolean) => void;
};

/** Touch-responder slider — works inside RN Modal; locks parent scroll while dragging. */
export function MacroHorizontalSlider({
  label,
  value,
  color,
  icon,
  disabled = false,
  onChange,
  onDraggingChange,
}: MacroHorizontalSliderProps) {
  const colors = useThemeColors();
  const trackRef = useRef<ViewInstance>(null);
  const trackWidth = useRef(1);
  const trackPageX = useRef(0);
  const draggingRef = useRef(false);
  const [visualRatio, setVisualRatio] = useState(Math.max(0, Math.min(1, value / 100)));

  useEffect(() => {
    if (draggingRef.current) return;
    setVisualRatio(Math.max(0, Math.min(1, value / 100)));
  }, [value]);

  const emitFromPageX = useCallback(
    (pageX: number) => {
      if (disabled) return;
      const w = Math.max(1, trackWidth.current);
      const next = Math.max(
        0,
        Math.min(100, Math.round(((pageX - trackPageX.current) / w) * 100)),
      );
      setVisualRatio(next / 100);
      onChange(next);
    },
    [disabled, onChange],
  );

  const beginDrag = (event: GestureResponderEvent) => {
    if (disabled) return;
    draggingRef.current = true;
    onDraggingChange?.(true);
    const pageX = event.nativeEvent.pageX;
    trackRef.current?.measureInWindow((x, _y, width) => {
      trackPageX.current = x;
      trackWidth.current = Math.max(1, width);
      emitFromPageX(pageX);
    });
  };

  const moveDrag = (event: GestureResponderEvent) => {
    if (!draggingRef.current || disabled) return;
    emitFromPageX(event.nativeEvent.pageX);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    onDraggingChange?.(false);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = Math.max(1, event.nativeEvent.layout.width);
  };

  const thumbLeft = `${visualRatio * 100}%`;

  return (
    <View className="gap-1.5" style={{ opacity: disabled ? 0.55 : 1 }}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text variant="bodyStrong">{label}</Text>
        </View>
        <Text variant="headingSmall" style={{ color }}>
          {value}%
        </Text>
      </View>
      <View
        ref={trackRef}
        onLayout={onLayout}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderTerminationRequest={() => false}
        onResponderGrant={beginDrag}
        onResponderMove={moveDrag}
        onResponderRelease={endDrag}
        onResponderTerminate={endDrag}
        accessibilityRole="adjustable"
        accessibilityState={{ disabled }}
        accessibilityValue={{ min: 0, max: 100, now: value }}
        style={{
          height: 44,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            height: 10,
            borderRadius: radii.pill,
            backgroundColor: colors.border,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${Math.max(2, visualRatio * 100)}%`,
              borderRadius: radii.pill,
              backgroundColor: color,
            }}
          />
        </View>
        {!disabled ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: thumbLeft,
              marginLeft: -10,
              top: 12,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: color,
              borderWidth: 2,
              borderColor: colors.surface,
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
