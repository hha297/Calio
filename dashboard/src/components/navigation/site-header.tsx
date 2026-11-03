'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BrandMark } from '@/components/brand/brand-mark';
import { LocaleSwitcher } from '@/components/navigation/locale-switcher';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const t = useMessages();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/features', label: t.nav.features },
    { href: '/#how-it-works', label: t.nav.howItWorks },
    { href: '/#faq', label: t.nav.faq },
    { href: '/support', label: t.nav.support },
  ] as const;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/80 bg-canvas/90 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
        <BrandMark size="sm" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-semibold text-body transition-colors hover:bg-bone hover:text-ink',
                pathname === item.href && 'bg-bone text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button href="/#download" size="sm">
            {t.nav.download}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-hairline bg-card text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-hairline bg-canvas lg:hidden"
      >
        <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[12px] px-3 py-3 text-base font-semibold text-ink hover:bg-bone"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/#download" className="mt-2 w-full" onClick={() => setOpen(false)}>
            {t.nav.download}
          </Button>
        </nav>
      </div>
    </header>
  );
}
