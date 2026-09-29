import { StyleSheet } from 'react-native';

import { colors } from './colors';

export const borders = {
  hairline: StyleSheet.hairlineWidth,
  width: 1,
  color: colors.border,
  strong: colors.borderStrong,
} as const;
