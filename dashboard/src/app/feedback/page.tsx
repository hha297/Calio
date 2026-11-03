import { FeedbackForm } from '@/components/feedback/feedback-form';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Feedback',
  description:
    'Share product feedback for Trackwise. Preview mode validates your message locally until a backend is connected.',
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
        This form is a polished frontend preview. Validation and success states work locally;
        messages are not sent or stored until a backend endpoint is wired up.
      </p>
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}
