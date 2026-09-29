import { View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';
import { cx } from '@/utils/cx';

type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className, style, ...props }: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cx('rounded-lg border p-4', className)}
      style={[{ backgroundColor: colors.surface, borderColor: colors.border }, style]}
      {...props}
    />
  );
}
