import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/theme';
import { cx } from '@/utils/cx';

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
  color = colors.primary,
  className,
}: ProgressBarProps) {
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
      <View className="h-2 overflow-hidden rounded-full bg-surfaceMuted">
        <View
          className="h-full rounded-full"
          style={{ width: `${ratio * 100}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}
