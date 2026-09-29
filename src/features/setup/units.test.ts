import { describe, expect, it } from 'vitest';

import { birthDateFromAge, cmToFtIn, ftInToCm, kgToLb, lbToKg } from './units';

describe('unit conversion', () => {
  it('round-trips kg and lb without drifting on display switches', () => {
    const kg = 70;
    const lb = kgToLb(kg);
    expect(lbToKg(lb)).toBeCloseTo(kg, 6);
  });

  it('round-trips height', () => {
    const cm = 178;
    const { feet, inches } = cmToFtIn(cm);
    expect(ftInToCm(feet, inches)).toBeCloseTo(cm, 0);
  });

  it('builds a birth date from age', () => {
    const today = new Date('2026-09-29T12:00:00');
    expect(birthDateFromAge(30, today)).toBe('1996-09-29');
  });
});
