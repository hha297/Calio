import { LegalDocument } from '@/components/legal/legal-document';
import { LEGAL_EFFECTIVE_DATE, privacyNotice, privacySections } from '@/content/legal';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Trackwise covering account data, nutrition and workout records, uploads, diagnostics, and user rights.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      notice={privacyNotice}
      updatedLabel={`Effective date: ${LEGAL_EFFECTIVE_DATE}`}
      sections={privacySections}
    />
  );
}
