import { View } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';
import { cx } from '@/utils/cx';

import { Text } from './text';

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  color?: string;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  label,
  color,
  className,
}: ProgressBarProps) {
  const colors = useThemeColors();
  const fillColor = color ?? colors.primary;
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <View className={cx('gap-1', className)}>
      <View className="flex-row items-center justify-between">
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
        <Text variant="caption" tone="secondary">
          {Math.round(value)} / {Math.round(max)}
        </Text>
      </View>
      <View
        className="h-2 overflow-hidden rounded-full"
        style={{ backgroundColor: colors.surfaceMuted }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${ratio * 100}%`, backgroundColor: fillColor }}
        />
      </View>
    </View>
  );
}
