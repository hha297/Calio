import { addDays, subDays } from 'date-fns';

import type { ProgressPeriod } from '@/features/progress/types';
import { parseDiaryDateKey, toDiaryDateKey } from '@/utils/date';

export function progressRange(period: ProgressPeriod, todayKey = toDiaryDateKey()) {
  const end = parseDiaryDateKey(todayKey);
  const start = subDays(end, period - 1);
  const startKey = toDiaryDateKey(start);
  const endKey = todayKey;
  const dayKeys = Array.from({ length: period }, (_, index) =>
    toDiaryDateKey(addDays(start, index)),
  );
  return { startKey, endKey, dayKeys, todayKey };
}

export type TrendBucketMode = 'daily' | 'weekly' | 'biweekly';

/** Bucket day keys into ISO weeks (Mon–Sun) that intersect the range. */
export function weekBuckets(dayKeys: string[]): { key: string; dayKeys: string[] }[] {
  const buckets: { key: string; dayKeys: string[] }[] = [];
  let current: { key: string; dayKeys: string[] } | null = null;

  for (const dayKey of dayKeys) {
    const weekStart = toDiaryDateKey(
      // Match diary aggregations: Monday week start.
      (() => {
        const date = parseDiaryDateKey(dayKey);
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        return addDays(date, diff);
      })(),
    );
    if (!current || current.key !== weekStart) {
      current = { key: weekStart, dayKeys: [dayKey] };
      buckets.push(current);
    } else {
      current.dayKeys.push(dayKey);
    }
  }

  return buckets;
}

/** Merge consecutive week buckets (e.g. groupSize 2 → biweekly). */
export function mergeWeekBuckets(
  weeks: { key: string; dayKeys: string[] }[],
  groupSize: number,
): { key: string; dayKeys: string[] }[] {
  if (groupSize <= 1) return weeks;
  const merged: { key: string; dayKeys: string[] }[] = [];
  for (let index = 0; index < weeks.length; index += groupSize) {
    const group = weeks.slice(index, index + groupSize);
    const first = group[0];
    if (!first) continue;
    merged.push({
      key: first.key,
      dayKeys: group.flatMap((item) => item.dayKeys),
    });
  }
  return merged;
}

/** 7 → daily, 30 → weekly, 90 → biweekly (keeps charts readable). */
export function trendBucketMode(period: ProgressPeriod): TrendBucketMode {
  if (period === 7) return 'daily';
  if (period === 90) return 'biweekly';
  return 'weekly';
}

export function trendSourceBuckets(
  period: ProgressPeriod,
  dayKeys: string[],
): { key: string; dayKeys: string[] }[] {
  const mode = trendBucketMode(period);
  if (mode === 'daily') {
    return dayKeys.map((key) => ({ key, dayKeys: [key] }));
  }
  const weeks = weekBuckets(dayKeys);
  return mode === 'biweekly' ? mergeWeekBuckets(weeks, 2) : weeks;
}
