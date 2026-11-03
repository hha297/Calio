'use client';

import { DiaryMock } from '@/components/mockups/diary-mock';
import { ProgressMock } from '@/components/mockups/progress-mock';
import { ScanMock } from '@/components/mockups/scan-mock';
import { WorkoutMock } from '@/components/mockups/workout-mock';
import { SectionHeading } from '@/components/ui/section-heading';
import { useMessages } from '@/i18n/locale-provider';

export function AppShowcaseSection() {
  const t = useMessages();

  return (
    <section className="section-pad border-b border-hairline" aria-labelledby="showcase-heading">
      <div className="container-site">
        <SectionHeading
          id="showcase-heading"
          eyebrow={t.showcase.eyebrow}
          title={t.showcase.title}
          description={t.showcase.description}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          <div className="w-[240px] shrink-0 snap-center sm:w-auto">
            <DiaryMock label={t.mockLabels.diary} />
          </div>
          <div className="w-[240px] shrink-0 snap-center sm:w-auto">
            <ScanMock label={t.mockLabels.scan} />
          </div>
          <div className="w-[240px] shrink-0 snap-center sm:w-auto">
            <WorkoutMock label={t.mockLabels.workout} />
          </div>
          <div className="w-[240px] shrink-0 snap-center sm:w-auto">
            <ProgressMock label={t.mockLabels.progress} />
          </div>
        </div>
      </div>
    </section>
  );
}
