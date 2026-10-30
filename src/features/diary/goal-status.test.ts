import { describe, expect, it } from 'vitest';

import {
  calorieGoalTolerance,
  classifyDayCalories,
} from '@/features/diary/goal-status';

describe('calorieGoalTolerance', () => {
  it('uses at least the minimum floor', () => {
    expect(calorieGoalTolerance(500)).toBe(80);
  });

  it('scales with larger targets', () => {
    expect(calorieGoalTolerance(3000)).toBe(240);
  });
});

describe('classifyDayCalories', () => {
  it('marks future days', () => {
    expect(
      classifyDayCalories({
        consumed: 2000,
        target: 2000,
        dateKey: '2026-11-01',
        todayKey: '2026-10-29',
        hasFoodLogs: true,
      }),
    ).toBe('future');
  });

  it('marks missing logs as no_data', () => {
    expect(
      classifyDayCalories({
        consumed: null,
        target: 2000,
        dateKey: '2026-10-28',
        todayKey: '2026-10-29',
        hasFoodLogs: false,
      }),
    ).toBe('no_data');
  });

  it('classifies historical days within tolerance as achieved', () => {
    expect(
      classifyDayCalories({
        consumed: 2050,
        target: 2000,
        dateKey: '2026-10-28',
        todayKey: '2026-10-29',
        hasFoodLogs: true,
      }),
    ).toBe('achieved');
  });

  it('classifies historical over-target days', () => {
    expect(
      classifyDayCalories({
        consumed: 2600,
        target: 2000,
        dateKey: '2026-10-28',
        todayKey: '2026-10-29',
        hasFoodLogs: true,
      }),
    ).toBe('above');
  });

  it('keeps today as in_progress when off target', () => {
    expect(
      classifyDayCalories({
        consumed: 800,
        target: 2000,
        dateKey: '2026-10-29',
        todayKey: '2026-10-29',
        hasFoodLogs: true,
      }),
    ).toBe('in_progress');
  });
});
