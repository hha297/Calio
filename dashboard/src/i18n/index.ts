import { en } from '@/i18n/locales/en';
import { fi } from '@/i18n/locales/fi';
import { sv } from '@/i18n/locales/sv';
import { vi } from '@/i18n/locales/vi';
import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
  type Messages,
} from '@/i18n/types';

export { LOCALE_FLAGS, LOCALE_LABELS, SUPPORTED_LOCALES };
export type { Locale, Messages };

export const dictionaries: Record<Locale, Messages> = {
  en,
  fi,
  sv,
  vi,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (SUPPORTED_LOCALES as readonly string[]).includes(value));
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}
