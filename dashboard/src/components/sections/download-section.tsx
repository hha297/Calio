'use client';

import { QrCode } from 'lucide-react';

import { StoreBadges } from '@/components/store/store-badges';
import { siteConfig } from '@/config/site';
import { useMessages } from '@/i18n/locale-provider';

export function DownloadSection() {
  const t = useMessages();

  return (
    <section
      id="download"
      className="section-pad scroll-mt-24 border-b border-hairline bg-[#141414] text-white"
      aria-labelledby="download-heading"
    >
      <div className="container-site grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/45">
            {t.download.eyebrow}
          </p>
          <h2
            id="download-heading"
            className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-white"
          >
            {t.download.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            {t.download.description}
          </p>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-primary">
            {t.download.status}: {t.download.androidFree}
          </div>
          <StoreBadges className="mt-8" size="lg" variant="onDark" />
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto flex size-40 items-center justify-center rounded-[20px] border border-dashed border-white/25 bg-white/5">
            <div className="text-center">
              <QrCode className="mx-auto size-12 text-white/50" aria-hidden />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/45">
                {t.download.qrPlaceholder}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">
            {t.download.qrHint} ({siteConfig.domain})
          </p>
        </div>
      </div>
    </section>
  );
}
