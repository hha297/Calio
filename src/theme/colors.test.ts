import { describe, expect, it } from 'vitest';

import { colors } from './colors';
import { brand } from './themes';

describe('brand colors', () => {
  it('keeps the Calio primary and secondary colors', () => {
    expect(colors.background).toBe(brand.lightBackground);
    expect(colors.primary).toBe(brand.primary);
    expect(colors.secondary).toBe(brand.secondary);
    expect(colors.primaryPressed).toBe(brand.primaryPressed);
  });
});
