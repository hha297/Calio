'use client';

import { ArrowRight } from 'lucide-react';

import { AddFoodMock } from '@/components/mockups/add-food-mock';
import { DiaryMock } from '@/components/mockups/diary-mock';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/i18n/locale-provider';

export function HeroSection() {
  const t = useMessages();

  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(0,217,95,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(32,32,32,0.05), transparent 50%)',
        }}
      />
      <div className="container-site relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-hairline bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-mute">
            {t.hero.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
            {t.hero.titleBefore}{' '}
            <span className="text-primary">{t.hero.titleAccent}</span> {t.hero.titleAfter}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-body sm:text-xl">
            {t.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/features" size="lg">
              {t.hero.explore}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/#download" variant="secondary" size="lg">
              {t.hero.getApp}
            </Button>
          </div>
          <p className="mt-6 text-sm text-mute">{t.hero.availability}</p>
        </div>

        <div className="mx-auto flex w-full max-w-md items-end justify-center gap-5 sm:gap-6">
          <div className="w-[min(46%,240px)] translate-y-8">
            <AddFoodMock label="" />
          </div>
          <div className="w-[min(54%,300px)] -translate-y-2">
            <DiaryMock label="" />
          </div>
        </div>
      </div>
    </section>
  );
}
