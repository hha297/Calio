import { StyleSheet } from 'react-native';

/**
 * Border widths only. Colors come from `useThemeColors()` (`border`, `borderStrong`,
 * `borderFocus`, `error`) so they track light/dark correctly.
 */
export const borders = {
  hairline: StyleSheet.hairlineWidth,
  width: 1,
  widthStrong: 1.5,
  widthEmphasis: 2,
} as const;
