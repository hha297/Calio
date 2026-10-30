import { useSyncExternalStore } from 'react';

import { toDiaryDateKey } from '@/utils/date';

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

let selectedDateKey = toDiaryDateKey();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getSelectedDiaryDateKey(): string {
  return selectedDateKey;
}

export function setSelectedDiaryDateKey(key: string) {
  if (!DATE_KEY_RE.test(key) || key === selectedDateKey) return;
  selectedDateKey = key;
  emit();
}

export function subscribeSelectedDiaryDate(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Shared selected diary day across Diary home and analytics destinations. */
export function useSelectedDiaryDate() {
  const dateKey = useSyncExternalStore(
    subscribeSelectedDiaryDate,
    getSelectedDiaryDateKey,
    getSelectedDiaryDateKey,
  );
  return [dateKey, setSelectedDiaryDateKey] as const;
}
