import { View, type ViewProps } from 'react-native';

import { borders } from '@/theme/borders';
import { useThemeColors } from '@/theme/theme-provider';

type SeparatorProps = ViewProps & {
  /** Vertical hairline for toolbars; default is horizontal. */
  vertical?: boolean;
};

/** Theme-aware divider for list rows and section breaks. */
export function Separator({ vertical = false, style, ...props }: SeparatorProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="none"
      style={[
        {
          backgroundColor: colors.border,
          ...(vertical
            ? { width: borders.hairline, alignSelf: 'stretch' }
            : { height: borders.hairline, width: '100%' }),
        },
        style,
      ]}
      {...props}
    />
  );
}
