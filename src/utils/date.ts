import { format, parseISO, startOfDay } from 'date-fns';

/** Local calendar day key (yyyy-MM-dd) for diary ownership. */
export function toDiaryDateKey(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDiaryDateKey(key: string): Date {
  return startOfDay(parseISO(key));
}

export function formatDiaryHeading(key: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(parseDiaryDateKey(key));
}
