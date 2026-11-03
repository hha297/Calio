import { LegalDocument } from '@/components/legal/legal-document';
import { LEGAL_EFFECTIVE_DATE, termsNotice, termsSections } from '@/content/legal';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms of Use',
  description:
    'Terms of Use for Trackwise, including service description, acceptable use, and medical-estimate disclaimers.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Use"
      notice={termsNotice}
      updatedLabel={`Effective date: ${LEGAL_EFFECTIVE_DATE}`}
      sections={termsSections}
    />
  );
}
