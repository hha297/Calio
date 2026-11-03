'use client';

import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/navigation/site-header';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { LocaleProvider } from '@/i18n/locale-provider';

/** Client shell so header/footer always sit inside theme + locale context. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </LocaleProvider>
    </ThemeProvider>
  );
}
