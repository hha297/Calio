import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

import { lightColors, darkColors, type ThemeColors } from './themes';

const THEME_KEY = 'calio.theme.preference';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedScheme = 'light' | 'dark';

type ThemeContextValue = {
  preference: ThemePreference;
  scheme: ResolvedScheme;
  colors: ThemeColors;
  setPreference: (next: ThemePreference) => void;
  toggleLightDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(
  preference: ThemePreference,
  system: string | null | undefined,
): ResolvedScheme {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return system === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (!active) return;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    void AsyncStorage.setItem(THEME_KEY, next);
  }, []);

  const scheme = resolveScheme(preference, system);
  const colors = scheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    if (!hydrated) return;
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [preference, hydrated]);

  const toggleLightDark = useCallback(() => {
    setPreference(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, setPreference]);

  const value = useMemo(
    () => ({
      preference,
      scheme,
      colors,
      setPreference,
      toggleLightDark,
    }),
    [preference, scheme, colors, setPreference, toggleLightDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}

/** Prefer useTheme().colors inside components; static light fallback for modules. */
export function useThemeColors(): ThemeColors {
  return useTheme().colors;
}
