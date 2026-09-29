import { Platform, StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { fonts } from '@/theme/fonts';

/** Blinking caret + text selection tint — primary purple across all fields. */
export const fieldCursorProps = {
  cursorColor: colors.primary,
  selectionColor: colors.primary,
} as const;

/**
 * Shared field typography. Native Android/iOS placeholders ignore custom
 * fonts — always pair with FieldPlaceholder instead of TextInput.placeholder.
 */
export const fieldTypography = {
  fontFamily: fonts.dmRegular,
  fontSize: 16,
  lineHeight: 22,
  color: colors.textPrimary,
  ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
} as const;

export const fieldPlaceholderTypography = {
  fontFamily: fonts.dmRegular,
  fontSize: 16,
  lineHeight: 22,
  color: colors.textMuted,
  ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
} as const;

export const fieldCompactTypography = {
  fontFamily: fonts.dmRegular,
  fontSize: 14,
  lineHeight: 18,
  color: colors.textPrimary,
  ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
} as const;

export const fieldCompactPlaceholderTypography = {
  fontFamily: fonts.dmRegular,
  fontSize: 14,
  lineHeight: 18,
  color: colors.textMuted,
  ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
} as const;

export const fieldShell = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  placeholder: {
    ...fieldPlaceholderTypography,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  placeholderCompact: {
    ...fieldCompactPlaceholderTypography,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
