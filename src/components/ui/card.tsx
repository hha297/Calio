import { StyleSheet, View, type ViewProps } from 'react-native';

import { elevation } from '@/theme/elevation';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/theme-provider';
import { cx } from '@/utils/cx';

type CardVariant = 'default' | 'elevated';

type CardProps = ViewProps & {
  className?: string;
  variant?: CardVariant;
};

/** Replicate-style card: white on bone canvas, mid radius, hairline. */
export function Card({ className, style, variant = 'default', ...props }: CardProps) {
  const colors = useThemeColors();
  const raised = variant === 'elevated' ? elevation.card('#202020') : null;

  return (
    <View
      className={cx(className)}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          padding: spacing[4],
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        raised,
        style,
      ]}
      {...props}
    />
  );
}
