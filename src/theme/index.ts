import { borders } from './borders';
import { colors } from './colors';
import { elevation } from './elevation';
import { iconSizes } from './icons';
import { layout, spacing } from './spacing';
import { motion } from './motion';
import { radii } from './radii';
import { typography } from './typography';

export {
  borders,
  colors,
  elevation,
  iconSizes,
  layout,
  motion,
  radii,
  spacing,
  typography,
};
export { withAlpha, hexToRgbChannels, themeToCssVars } from './color-utils';
export { fonts, useAppFonts } from './fonts';
export { brand, lightColors, darkColors, type ThemeColors } from './themes';
export { ThemeProvider, useTheme, useThemeColors, type ThemePreference } from './theme-provider';

/**
 * Secondary terracotta is an accent fill. On the light background its contrast
 * is too low to use as body text, so text on that fill uses textOnSecondary.
 * `success` is a darker brand-aligned green for readable success copy/icons;
 * `successBright` matches primary for meter fills at “Very strong”.
 * Display/UI uses IBM Plex Sans; body copy uses DM Sans.
 *
 * Runtime paint: prefer `useThemeColors()`. Static `colors` is the light palette
 * (and ColorName source). NativeWind semantic classes (`bg-surface`, `border-border`)
 * resolve via CSS vars set by ThemeProvider for the active scheme.
 */
