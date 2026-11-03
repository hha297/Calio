'use client';

import { useMemo, useState } from 'react';

import { Accordion } from '@/components/ui/accordion';
import { siteConfig } from '@/config/site';
import { supportFaq } from '@/content/faq';
import { supportTopics } from '@/content/support';

export function SupportCenter() {
  const [query, setQuery] = useState('');

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return supportFaq;
    return supportFaq.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return supportTopics;
    return supportTopics
      .map((topic) => ({
        ...topic,
        items: topic.items.filter(
          (item) =>
            item.heading.toLowerCase().includes(q) ||
            item.body.toLowerCase().includes(q) ||
            topic.title.toLowerCase().includes(q),
        ),
      }))
      .filter((topic) => topic.items.length > 0 || topic.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <section className="border-b border-hairline bg-bone/50">
        <div className="container-site py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">
            Support Center
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
            Help for real Trackwise workflows.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
            Search common questions or browse topics grounded in the current mobile app.
          </p>
          <label className="mt-8 block max-w-xl">
            <span className="sr-only">Search support</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQ and help topics…"
              className="w-full rounded-full border border-hairline bg-card px-5 py-3.5 text-[15px] text-ink outline-none focus:border-primary"
            />
          </label>
        </div>
      </section>

      <div className="container-site py-14 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportTopics.map((topic) => (
            <a
              key={topic.id}
              href={`#${topic.id}`}
              className="rounded-[16px] border border-hairline bg-card p-5 shadow-soft transition hover:border-ink/20"
            >
              <h2 className="font-display text-xl font-bold text-ink">{topic.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-body">{topic.summary}</p>
            </a>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="support-faq-heading">
          <h2 id="support-faq-heading" className="font-display text-3xl font-bold tracking-tight">
            Searchable FAQ
          </h2>
          <p className="mt-2 text-body">
            {filteredFaq.length} result{filteredFaq.length === 1 ? '' : 's'}
            {query.trim() ? ` for “${query.trim()}”` : ''}
          </p>
          <div className="mt-6">
            {filteredFaq.length > 0 ? (
              <Accordion items={filteredFaq} />
            ) : (
              <p className="rounded-[16px] border border-hairline bg-bone px-5 py-6 text-body">
                No FAQ matches. Try another keyword or browse topics below.
              </p>
            )}
          </div>
        </section>

        <div className="mt-16 space-y-12">
          {filteredTopics.map((topic) => (
            <section key={topic.id} id={topic.id} className="scroll-mt-28">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink">
                {topic.title}
              </h2>
              <p className="mt-2 text-body">{topic.summary}</p>
              <div className="mt-6 space-y-4">
                {topic.items.map((item) => (
                  <article
                    key={item.heading}
                    className="rounded-[16px] border border-hairline bg-card p-5"
                  >
                    <h3 className="text-base font-bold text-ink">{item.heading}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-body">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section
          id="contact"
          className="mt-16 scroll-mt-28 rounded-[24px] border border-hairline bg-bone p-8"
        >
          <h2 className="font-display text-2xl font-bold text-ink">Contact support</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-body">
            {siteConfig.supportEmail ? (
              <>
                Email{' '}
                <a
                  className="font-semibold text-ink underline underline-offset-2"
                  href={`mailto:${siteConfig.supportEmail}`}
                >
                  {siteConfig.supportEmail}
                </a>
                .
              </>
            ) : (
              <>
                An official support email is not configured yet. Set{' '}
                <code className="font-metric text-sm">NEXT_PUBLIC_SUPPORT_EMAIL</code> when ready,
                or use the feedback form for a local preview submission.
              </>
            )}
          </p>
          <a
            href="/feedback"
            className="mt-5 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-on-primary"
          >
            Send feedback
          </a>
        </section>
      </div>
    </>
  );
}
