import { describe, expect, it } from 'vitest';

import { calculateDailyBalance, scaleNutrition, sumMacros } from './balance';

describe('scaleNutrition', () => {
  it('scales a serving by quantity', () => {
    expect(
      scaleNutrition({ calories: 100, proteinG: 10, carbsG: 20, fatG: 5 }, 2),
    ).toEqual({ calories: 200, proteinG: 20, carbsG: 40, fatG: 10 });
  });
});

describe('sumMacros', () => {
  it('adds entries', () => {
    expect(
      sumMacros([
        { calories: 100, proteinG: 10, carbsG: 5, fatG: 2 },
        { calories: 50, proteinG: 5, carbsG: 5, fatG: 1 },
      ]),
    ).toEqual({ calories: 150, proteinG: 15, carbsG: 10, fatG: 3 });
  });
});

describe('calculateDailyBalance', () => {
  it('credits estimated burn toward remaining', () => {
    const result = calculateDailyBalance({
      consumed: 1800,
      burned: 200,
      target: 2000,
    });
    expect(result.remaining).toBe(400);
    expect(result.status).toBe('under');
  });

  it('marks over target when remaining is strongly negative', () => {
    const result = calculateDailyBalance({
      consumed: 2500,
      burned: 0,
      target: 2000,
    });
    expect(result.remaining).toBe(-500);
    expect(result.status).toBe('over');
  });
});
