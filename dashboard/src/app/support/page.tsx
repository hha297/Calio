import { SupportCenter } from '@/components/support/support-center';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Support Center',
  description:
    'Trackwise help for account, food tracking, barcode scan, workouts, goals, progress, privacy, and troubleshooting.',
  path: '/support',
});

export default function SupportPage() {
  return <SupportCenter />;
}
