import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'About',
  description:
    'About Trackwise — a mobile nutrition and fitness tracker for everyday estimates, not medical measurements.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container-narrow py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">About</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold tracking-tight text-ink">
        Built for everyday tracking.
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-body">
        <p>
          Trackwise is a mobile-first nutrition and fitness app for food logging, calories and
          macros, workouts, goals, body measurements, and progress over time.
        </p>
        <p>
          Calorie and activity numbers are estimates for everyday awareness — not medical
          measurements and not medical advice.
        </p>
        <p>
          We started Trackwise to keep diary, training, and progress in one calm place — without
          turning everyday tracking into a clinic visit. The product focuses on what you can log
          yourself: meals, workouts, goals, and measurements.
        </p>
        <p>
          This website ({siteConfig.domain}) introduces the product, publishes policies, and points
          people to download and support channels as they become available.
        </p>
        <div className="rounded-[16px] border border-hairline bg-bone px-5 py-4 text-base text-ink">
          <p className="font-bold">Contact</p>
          <p className="mt-2 text-body">
            Operator: {siteConfig.legalName}
            <br />
            Email:{' '}
            <a
              className="font-semibold text-ink underline underline-offset-2"
              href={`mailto:${siteConfig.supportEmail}`}
            >
              {siteConfig.supportEmail}
            </a>
            <br />
            Phone:{' '}
            <a
              className="font-semibold text-ink underline underline-offset-2"
              href={`tel:${siteConfig.supportPhone}`}
            >
              {siteConfig.supportPhone}
            </a>
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/features">Explore features</Button>
        <Button href="/support" variant="secondary">
          Support Center
        </Button>
      </div>
    </div>
  );
}
