import { LegalDocument } from '@/components/legal/legal-document';
import { privacyDraftNotice, privacySections } from '@/content/legal';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'Draft Privacy Policy for Trackwise covering account data, nutrition and workout records, uploads, and user controls.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      notice={privacyDraftNotice}
      sections={privacySections}
    />
  );
}
