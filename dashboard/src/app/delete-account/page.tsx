import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { deleteAccountPage as copy } from '@/content/delete-account';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Delete Account',
  description:
    'How to permanently delete your Trackwise account in the mobile app, what data is removed, what may be retained, and how to request deletion by email if you cannot access the app.',
  path: '/delete-account',
});

export default function DeleteAccountPage() {
  return (
    <div className="container-narrow py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">{copy.eyebrow}</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold tracking-tight text-ink">
        {copy.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">{copy.intro}</p>

      <div className="mt-10 space-y-12">
        <section className="scroll-mt-28" id="in-app">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {copy.inApp.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-body">{copy.inApp.body}</p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[16px] leading-relaxed text-body">
            {copy.inApp.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-5 rounded-[12px] border border-hairline bg-bone px-4 py-3 text-[15px] leading-relaxed text-body">
            {copy.inApp.note}
          </p>
        </section>

        <section className="scroll-mt-28" id="email-request">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {copy.emailRequest.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-body">{copy.emailRequest.body}</p>
          <p className="mt-5 text-sm font-bold text-ink">{copy.emailRequest.includeHeading}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-body">
            {copy.emailRequest.includeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-[16px] leading-relaxed text-body">
            {copy.emailRequest.verification}
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-body">{copy.emailRequest.timing}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={copy.links.mailto} external>
              Email {siteConfig.supportEmail}
            </Button>
            <Button href={`tel:${siteConfig.supportPhone}`} external variant="secondary">
              Call {siteConfig.supportPhone}
            </Button>
          </div>
        </section>

        <section className="scroll-mt-28" id="data">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {copy.data.title}
          </h2>
          <h3 className="mt-6 text-lg font-bold text-ink">{copy.data.deletedHeading}</h3>
          <p className="mt-3 text-[16px] leading-relaxed text-body">{copy.data.deletedIntro}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-body">
            {copy.data.deletedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-8 text-lg font-bold text-ink">{copy.data.retainedHeading}</h3>
          <div className="mt-4 space-y-4">
            {copy.data.retainedItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[16px] border border-hairline bg-bone px-5 py-4"
              >
                <h4 className="font-bold text-ink">{item.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-hairline pt-8">
        <Button href={copy.links.privacyHref} variant="secondary">
          {copy.links.privacyLabel}
        </Button>
        <Button href={copy.links.supportHref} variant="secondary">
          {copy.links.supportLabel}
        </Button>
        <Link
          href="/features"
          className="inline-flex h-12 items-center px-2 text-sm font-semibold text-body underline-offset-4 hover:text-ink hover:underline"
        >
          Back to features
        </Link>
      </div>
    </div>
  );
}
