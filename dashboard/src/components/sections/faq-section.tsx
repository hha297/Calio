'use client';

import { Accordion } from '@/components/ui/accordion';
import { SectionHeading } from '@/components/ui/section-heading';
import { homeFaq } from '@/content/faq';
import { useMessages } from '@/i18n/locale-provider';

export function FaqSection() {
  const t = useMessages();

  return (
    <section id="faq" className="section-pad scroll-mt-24 border-b border-hairline" aria-labelledby="faq-heading">
      <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHeading
          id="faq-heading"
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          description={t.faq.description}
        />
        <Accordion items={homeFaq} />
      </div>
    </section>
  );
}
