import { FeedbackForm } from '@/components/feedback/feedback-form';
import { SUPPORT_EMAIL } from '@/config/site';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Feedback',
  description:
    'Send product feedback, bug reports, and feature requests to the Trackwise team.',
  path: '/feedback',
});

export default function FeedbackPage() {
  return (
    <div className="container-narrow py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mute">Feedback</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold tracking-tight text-ink">
        Tell us what to improve.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">
        Bugs, ideas, and account questions all help. Messages are sent to{' '}
        <a
          className="font-semibold text-ink underline underline-offset-2"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}
