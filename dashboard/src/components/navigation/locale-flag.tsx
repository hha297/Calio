import type { ReactNode } from 'react';

import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

type LocaleFlagProps = {
  locale: Locale;
  className?: string;
};

/** Inline SVG flags — Windows often renders emoji regional indicators as letters (GB/FI/…). */
export function LocaleFlag({ locale, className }: LocaleFlagProps) {
  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-hairline',
        className,
      )}
      aria-hidden
    >
      {FLAG_SVGS[locale]}
    </span>
  );
}

const FLAG_SVGS: Record<Locale, ReactNode> = {
  en: (
    <svg viewBox="0 0 60 40" className="size-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="5" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="14" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  ),
  fi: (
    <svg viewBox="0 0 60 40" className="size-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#fff" />
      <rect x="16" width="10" height="40" fill="#003580" />
      <rect y="15" width="60" height="10" fill="#003580" />
    </svg>
  ),
  sv: (
    <svg viewBox="0 0 60 40" className="size-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#005293" />
      <rect x="16" width="10" height="40" fill="#FECB00" />
      <rect y="15" width="60" height="10" fill="#FECB00" />
    </svg>
  ),
  vi: (
    <svg viewBox="0 0 60 40" className="size-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#DA251D" />
      <path
        d="M30 8.5 L32.9 17.2 H42 L34.6 22.6 L37.5 31.3 L30 25.9 L22.5 31.3 L25.4 22.6 L18 17.2 H27.1 Z"
        fill="#FFFF00"
      />
    </svg>
  ),
};
