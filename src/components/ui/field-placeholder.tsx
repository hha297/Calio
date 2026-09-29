import { Text as RNText, type StyleProp, type TextStyle } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';

import { fieldShell, getFieldCompactPlaceholderTypography, getFieldPlaceholderTypography } from './field-styles';

type FieldPlaceholderProps = {
  label: string;
  compact?: boolean;
  style?: StyleProp<TextStyle>;
};

/** Fake placeholder so DM Sans applies on Android/iOS. */
export function FieldPlaceholder({ label, compact = false, style }: FieldPlaceholderProps) {
  const colors = useThemeColors();
  const typography = compact
    ? getFieldCompactPlaceholderTypography(colors)
    : getFieldPlaceholderTypography(colors);

  return (
    <RNText
      pointerEvents="none"
      numberOfLines={compact ? 1 : undefined}
      style={[
        compact ? fieldShell.placeholderCompact : fieldShell.placeholder,
        typography,
        style,
      ]}
    >
      {label}
    </RNText>
  );
}
