import { describe, expect, it } from 'vitest';

import { colors } from './colors';
import { hexToRgbChannels, withAlpha } from './color-utils';
import { brand, darkColors, lightColors } from './themes';

describe('brand colors', () => {
  it('keeps the Calio primary and secondary colors', () => {
    expect(colors.background).toBe(brand.lightBackground);
    expect(colors.primary).toBe(brand.primary);
    expect(colors.secondary).toBe(brand.secondary);
    expect(colors.primaryPressed).toBe(brand.primaryPressed);
  });

  it('keeps light and dark palettes aligned with brand foundations', () => {
    expect(lightColors.primary).toBe(brand.primary);
    expect(darkColors.primary).toBe(brand.primary);
    expect(darkColors.background).toBe(brand.darkBackground);
    expect(lightColors.overlay).toBe(darkColors.overlay);
  });
});

describe('color utils', () => {
  it('converts hex to rgb channels and alpha', () => {
    expect(hexToRgbChannels('#00D95F')).toBe('0 217 95');
    expect(withAlpha('#121212', 0.7)).toBe('rgba(18,18,18,0.7)');
  });
});
