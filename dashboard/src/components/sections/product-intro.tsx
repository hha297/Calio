'use client';

import { Activity, Apple, Flag, LineChart } from 'lucide-react';

import { SectionHeading } from '@/components/ui/section-heading';
import { useMessages } from '@/i18n/locale-provider';

export function ProductIntroSection() {
  const t = useMessages();

  const pillars = [
    { icon: Apple, title: t.intro.nutritionTitle, body: t.intro.nutritionBody },
    { icon: Activity, title: t.intro.workoutTitle, body: t.intro.workoutBody },
    { icon: Flag, title: t.intro.goalsTitle, body: t.intro.goalsBody },
    { icon: LineChart, title: t.intro.progressTitle, body: t.intro.progressBody },
  ] as const;

  return (
    <section className="section-pad border-b border-hairline bg-bone/50">
      <div className="container-site">
        <SectionHeading
          eyebrow={t.intro.eyebrow}
          title={t.intro.title}
          description={t.intro.description}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[16px] border border-hairline bg-card p-5 shadow-soft"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-bone text-ink">
                <pillar.icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
