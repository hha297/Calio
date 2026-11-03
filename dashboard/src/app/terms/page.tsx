import { LegalDocument } from '@/components/legal/legal-document';
import { termsDraftNotice, termsSections } from '@/content/legal';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms of Use',
  description:
    'Draft Terms of Use for Trackwise, including service description, acceptable use, and medical-estimate disclaimers.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Use" notice={termsDraftNotice} sections={termsSections} />
  );
}
