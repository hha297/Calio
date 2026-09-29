import { Text as RNText, type StyleProp, type TextStyle } from 'react-native';

import { fieldShell } from './field-styles';

type FieldPlaceholderProps = {
  label: string;
  compact?: boolean;
  style?: StyleProp<TextStyle>;
};

/** Fake placeholder so DM Sans applies on Android/iOS. */
export function FieldPlaceholder({ label, compact = false, style }: FieldPlaceholderProps) {
  return (
    <RNText
      pointerEvents="none"
      numberOfLines={compact ? 1 : undefined}
      style={[compact ? fieldShell.placeholderCompact : fieldShell.placeholder, style]}
    >
      {label}
    </RNText>
  );
}
