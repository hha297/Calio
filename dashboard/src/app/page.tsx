import { AppShowcaseSection } from '@/components/sections/app-showcase';
import { DownloadSection } from '@/components/sections/download-section';
import { FaqSection } from '@/components/sections/faq-section';
import { FeatureShowcaseSection } from '@/components/sections/feature-showcase';
import { HeroSection } from '@/components/sections/hero';
import { HowItWorksSection } from '@/components/sections/how-it-works';
import { ProductIntroSection } from '@/components/sections/product-intro';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Trackwise',
  description:
    'Track nutrition, workouts, and progress in one place. Make every step count with Trackwise.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductIntroSection />
      <FeatureShowcaseSection />
      <HowItWorksSection />
      <AppShowcaseSection />
      <FaqSection />
      <DownloadSection />
    </>
  );
}
