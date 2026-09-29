/* eslint-disable import/no-named-as-default-member -- i18next default instance API */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { useSyncExternalStore } from 'react';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fi from './locales/fi.json';
import sv from './locales/sv.json';
import vi from './locales/vi.json';

export const SUPPORTED_LANGUAGES = ['en', 'fi', 'sv', 'vi'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  fi: 'Suomi',
  sv: 'Svenska',
  vi: 'Tiếng Việt',
};

const LANGUAGE_KEY = 'calio.language';

function deviceLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase() ?? 'en';
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(code)) {
    return code as AppLanguage;
  }
  return 'en';
}

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      sv: { translation: sv },
      vi: { translation: vi },
    },
    lng: deviceLanguage(),
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
  });
}

void AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    void i18next.changeLanguage(stored);
  }
});

export async function changeAppLanguage(next: AppLanguage) {
  await AsyncStorage.setItem(LANGUAGE_KEY, next);
  await i18next.changeLanguage(next);
}

export function getCurrentLanguage(): AppLanguage {
  const lng = (i18next.resolvedLanguage || i18next.language || 'en').split('-')[0];
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(lng)) {
    return lng as AppLanguage;
  }
  return 'en';
}

/** Re-renders when the user or persisted storage changes locale. */
export function useAppLanguage(): AppLanguage {
  return useSyncExternalStore(
    (onStoreChange) => {
      i18next.on('languageChanged', onStoreChange);
      return () => i18next.off('languageChanged', onStoreChange);
    },
    getCurrentLanguage,
    getCurrentLanguage,
  );
}

export default i18next;
