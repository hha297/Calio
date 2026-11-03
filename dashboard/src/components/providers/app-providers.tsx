'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { LocaleProvider } from '@/i18n/locale-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
