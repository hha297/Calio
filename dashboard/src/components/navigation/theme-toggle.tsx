'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme/theme-provider';
import { useMessages } from '@/i18n/locale-provider';

export function ThemeToggle() {
  const { resolved, toggleLightDark } = useTheme();
  const t = useMessages();
  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      onClick={toggleLightDark}
      className="inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-card text-ink transition hover:bg-bone"
      aria-label={t.theme.toggle}
      title={isDark ? t.theme.light : t.theme.dark}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
