import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type ProgressRingProps = {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  centerPrimary: string;
  centerSecondary: string;
};

export function ProgressRing({
  value,
  max,
  size = 128,
  strokeWidth = 10,
  color,
  centerPrimary,
  centerSecondary,
}: ProgressRingProps) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const offset = circumference * (1 - ratio);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceMuted}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color ?? colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center', paddingHorizontal: 8 }}>
        <Text variant="headingMedium" numberOfLines={1}>
          {centerPrimary}
        </Text>
        <Text variant="caption" tone="secondary" numberOfLines={2} style={{ textAlign: 'center' }}>
          {centerSecondary}
        </Text>
      </View>
    </View>
  );
}
