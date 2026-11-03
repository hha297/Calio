'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { LocaleFlag } from '@/components/navigation/locale-flag';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n';
import { useLocale, useMessages } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useMessages();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function select(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={t.language.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex h-10 min-w-[10.75rem] items-center gap-2.5 rounded-full border border-hairline bg-card pl-2.5 pr-3.5 text-sm font-semibold text-ink transition',
          'hover:bg-bone focus-visible:border-primary',
          open && 'border-primary bg-bone',
        )}
      >
        <LocaleFlag locale={locale} className="size-[22px] rounded-[5px]" />
        <span className="min-w-0 flex-1 truncate text-left">{LOCALE_LABELS[locale]}</span>
        <ChevronDown
          className={cn(
            'ml-0.5 size-4 shrink-0 text-mute transition-transform duration-200',
            open && 'rotate-180 text-ink',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t.language.label}
          className="absolute right-0 top-[calc(100%+8px)] z-[80] min-w-[12.5rem] overflow-hidden rounded-[16px] border border-hairline bg-card py-1.5 shadow-phone"
        >
          {SUPPORTED_LOCALES.map((code) => {
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => select(code)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition',
                    selected ? 'bg-primary/12 text-ink' : 'text-body hover:bg-bone hover:text-ink',
                  )}
                >
                  <LocaleFlag locale={code} className="size-[22px] rounded-[5px]" />
                  <span className="min-w-0 flex-1">{LOCALE_LABELS[code]}</span>
                  {selected ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
