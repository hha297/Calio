'use client';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

/** Native details/summary — avoids React state click bugs that broke the FAQ. */
export function Accordion({ items, className }: AccordionProps) {
  return (
    <div
      className={cn(
        'divide-y divide-hairline overflow-hidden rounded-[16px] border border-hairline bg-card',
        className,
      )}
    >
      {items.map((item, index) => (
        <details key={item.id} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-semibold text-ink transition-colors hover:bg-bone/60 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-mute transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5 text-[15px] leading-relaxed text-body sm:px-6">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
