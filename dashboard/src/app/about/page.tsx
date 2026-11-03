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
          This website ({siteConfig.domain}) introduces the product, documents policies, and
          points people to download and support channels as they become available.
        </p>
        <p className="rounded-[12px] border border-dashed border-hairline bg-bone px-4 py-3 text-base text-ink">
          TODO: Confirm company identity, founding story, and public contact details for the About
          page before launch.
        </p>
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
