'use client';

import { DiaryMock } from '@/components/mockups/diary-mock';
import { GoalsMock } from '@/components/mockups/goals-mock';
import { ProgressMock } from '@/components/mockups/progress-mock';
import { ScanMock } from '@/components/mockups/scan-mock';
import { WorkoutMock } from '@/components/mockups/workout-mock';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { useMessages } from '@/i18n/locale-provider';

export function FeatureShowcaseSection() {
  const t = useMessages();

  return (
    <section className="section-pad border-b border-hairline" aria-labelledby="features-heading">
      <div className="container-site">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="features-heading"
            eyebrow={t.features.eyebrow}
            title={t.features.title}
            description={t.features.description}
          />
          <Button href="/features" variant="secondary" className="shrink-0 self-start sm:self-auto">
            {t.features.fullList}
          </Button>
        </div>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">
              {t.features.nutritionEyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t.features.nutritionTitle}
            </h3>
          </div>
          <DiaryMock label={t.mockLabels.diary} />
        </div>

        <div className="mt-20 overflow-hidden rounded-[24px] bg-ink text-card lg:grid lg:grid-cols-2 lg:items-center">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/45">
              {t.features.scanEyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.features.scanTitle}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">{t.features.scanBody}</p>
          </div>
          <div className="flex justify-center bg-[#161616] px-6 py-10 lg:py-12">
            <ScanMock label={t.mockLabels.scan} />
          </div>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <WorkoutMock label={t.mockLabels.workout} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">
              {t.features.workoutEyebrow}
            </p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t.features.workoutTitle}
            </h3>
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col rounded-[24px] border border-hairline bg-bone p-6 sm:p-8">
            <GoalsMock label="" className="w-[280px]" />
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">
                {t.features.goalsEyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t.features.goalsTitle}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{t.features.goalsBody}</p>
            </div>
          </article>
          <article className="flex flex-col rounded-[24px] border border-hairline bg-card p-6 shadow-soft sm:p-8">
            <ProgressMock label="" className="w-[280px]" />
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">
                {t.features.progressEyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t.features.progressTitle}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{t.features.progressBody}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
