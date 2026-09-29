import { describe, expect, it } from 'vitest';

import { colors } from './colors';

describe('brand colors', () => {
  it('keeps the Calio primary and secondary colors', () => {
    expect(colors.background).toBe('#F4F0F7');
    expect(colors.primary).toBe('#55067A');
    expect(colors.secondary).toBe('#C4DC4A');
  });
});
