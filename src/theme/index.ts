import { borders } from './borders';
import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';
import { typography } from './typography';

export { borders, colors, radii, spacing, typography };
export { fonts, useAppFonts } from './fonts';

/**
 * Secondary lime stays an accent fill. On the light background its contrast
 * is too low to use as body text, so text on that fill uses textOnSecondary.
 * `success` is a darker brand-aligned lime for readable success copy/icons;
 * `successBright` matches secondary for meter fills at “Very strong”.
 * Display/UI uses IBM Plex Sans; body copy uses DM Sans.
 */
