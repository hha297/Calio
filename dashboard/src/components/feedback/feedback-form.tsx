'use client';

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  'General feedback',
  'Bug report',
  'Feature request',
  'Account or privacy',
  'Other',
] as const;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

type FieldErrors = Partial<Record<'category' | 'subject' | 'message' | 'email', string>>;

export function FeedbackForm() {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!category) next.category = 'Choose a category.';
    if (!subject.trim()) next.subject = 'Subject is required.';
    else if (subject.trim().length < 3) next.subject = 'Subject must be at least 3 characters.';
    if (!message.trim()) next.message = 'Message is required.';
    else if (message.trim().length < 10) next.message = 'Message must be at least 10 characters.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email or leave this blank.';
    }
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setState('error');
      return;
    }

    setState('submitting');
    // Mock submission — no backend is connected yet.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setState('success');
  }

  if (state === 'success') {
    return (
      <div
        className="rounded-[20px] border border-hairline bg-card p-8 shadow-soft"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-deep">
          Preview success
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Form validated locally</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          Your feedback was <strong>not transmitted or stored</strong>. No backend is connected yet.
          This success state is a preview so the UI can be reviewed before integration.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => {
            setCategory('');
            setSubject('');
            setMessage('');
            setEmail('');
            setErrors({});
            setState('idle');
          }}
        >
          Send another (preview)
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[20px] border border-hairline bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="rounded-[12px] border border-dashed border-hairline bg-bone px-4 py-3 text-sm text-body">
        Mock mode: submissions are validated in the browser only and are not delivered until a
        backend is connected.
      </div>

      <div className="mt-6 space-y-5">
        <Field
          label="Category"
          htmlFor="category"
          error={errors.category}
          required
        >
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass(Boolean(errors.category))}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subject" htmlFor="subject" error={errors.subject} required>
          <input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass(Boolean(errors.subject))}
            aria-invalid={Boolean(errors.subject)}
            maxLength={120}
          />
        </Field>

        <Field label="Message" htmlFor="message" error={errors.message} required>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={cn(inputClass(Boolean(errors.message)), 'min-h-36 resize-y')}
            aria-invalid={Boolean(errors.message)}
            maxLength={4000}
          />
        </Field>

        <Field
          label="Email (optional)"
          htmlFor="email"
          error={errors.email}
          hint="Only if you want a reply once support email is configured."
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(Boolean(errors.email))}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
      </div>

      {state === 'error' && Object.keys(errors).length > 0 ? (
        <p className="mt-4 text-sm font-medium text-fat" role="alert">
          Please fix the highlighted fields.
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Validating…' : 'Submit feedback (preview)'}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'mt-1.5 w-full rounded-[10px] border bg-canvas px-3.5 py-3 text-[15px] text-ink outline-none transition',
    hasError ? 'border-fat' : 'border-hairline focus:border-primary',
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-fat"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-mute">{hint}</p> : null}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-fat" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
