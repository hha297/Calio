'use client';

import { SectionHeading } from '@/components/ui/section-heading';
import { useMessages } from '@/i18n/locale-provider';

export function HowItWorksSection() {
  const t = useMessages();
  const steps = [
    { step: 1, title: t.how.step1Title, description: t.how.step1Body },
    { step: 2, title: t.how.step2Title, description: t.how.step2Body },
    { step: 3, title: t.how.step3Title, description: t.how.step3Body },
  ];

  return (
    <section
      id="how-it-works"
      className="section-pad scroll-mt-24 border-b border-hairline bg-bone/40"
      aria-labelledby="how-heading"
    >
      <div className="container-site">
        <SectionHeading
          id="how-heading"
          eyebrow={t.how.eyebrow}
          title={t.how.title}
          description={t.how.description}
          align="center"
          className="mx-auto"
        />

        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.step}
              className="relative rounded-[20px] border border-hairline bg-card p-6 shadow-soft"
            >
              <span className="font-display text-5xl font-extrabold leading-none text-primary">
                {String(step.step).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
