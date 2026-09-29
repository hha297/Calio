import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors } from '@/theme';
import { fonts } from '@/theme/fonts';
import { cx } from '@/utils/cx';

const variantClass = {
  display: 'text-display',
  headingLarge: 'text-headingLarge',
  headingMedium: 'text-headingMedium',
  headingSmall: 'text-headingSmall',
  body: 'text-body',
  bodyStrong: 'text-body',
  bodySmall: 'text-bodySmall',
  caption: 'text-caption',
  label: 'text-label',
  button: 'text-button',
} as const;

const variantFont: Record<keyof typeof variantClass, TextStyle> = {
  display: { fontFamily: fonts.ibmBold },
  headingLarge: { fontFamily: fonts.ibmBold },
  headingMedium: { fontFamily: fonts.ibmSemiBold },
  headingSmall: { fontFamily: fonts.ibmSemiBold },
  body: { fontFamily: fonts.dmRegular },
  bodyStrong: { fontFamily: fonts.dmSemiBold },
  bodySmall: { fontFamily: fonts.dmRegular },
  caption: { fontFamily: fonts.dmRegular },
  label: { fontFamily: fonts.dmMedium },
  button: { fontFamily: fonts.ibmSemiBold },
};

/** Explicit colors — avoid NativeWind class collisions wiping text. */
const toneStyle: Record<string, TextStyle> = {
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
  onPrimary: { color: colors.textOnPrimary },
  onSecondary: { color: colors.textOnSecondary },
  error: { color: colors.error },
  success: { color: colors.success },
  brand: { color: colors.primary },
};

export type TextVariant = keyof typeof variantClass;
export type TextTone = keyof typeof toneStyle;

type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

export function Text({
  variant = 'body',
  tone = 'primary',
  className,
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      {...props}
      className={cx(variantClass[variant], className)}
      style={[variantFont[variant], toneStyle[tone], style]}
    />
  );
}
