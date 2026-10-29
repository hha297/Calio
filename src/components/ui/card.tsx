import { View, type ViewProps } from 'react-native';

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

/** Spotify-style surface card: `#181818` via theme surface, radius 8, no thick border. */
export function Card({ className, style, variant = 'default', ...props }: CardProps) {
  const colors = useThemeColors();
  const raised = variant === 'elevated' ? elevation.card('#000000') : null;

  return (
    <View
      className={cx(className)}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          padding: spacing[4],
          borderWidth: 0,
        },
        raised,
        style,
      ]}
      {...props}
    />
  );
}
