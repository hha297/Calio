'use client';

import { Check } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { SUPPORT_EMAIL } from '@/config/site';
import { cn } from '@/lib/utils';

const categories = [
  'General feedback',
  'Bug report',
  'Feature request',
  'Account or privacy',
  'Other',
] as const;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

type FieldErrors = Partial<Record<'category' | 'subject' | 'message' | 'email' | 'form', string>>;

export function FeedbackForm() {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
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

  function resetForm() {
    setCategory('');
    setSubject('');
    setMessage('');
    setEmail('');
    setWebsite('');
    setErrors({});
    setState('idle');
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
    setErrors({});

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          message: message.trim(),
          email: email.trim(),
          website,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setErrors({ form: data.error || 'Could not send feedback. Please try again.' });
        setState('error');
        return;
      }

      setState('success');
    } catch {
      setErrors({
        form: `Network error. Email us directly at ${SUPPORT_EMAIL}.`,
      });
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div
        className="rounded-[20px] border border-hairline bg-card p-8 shadow-soft"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-deep">
          Sent
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Thanks for the feedback</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          Your message was delivered to the Trackwise support inbox
          {email.trim() ? (
            <>
              . If you left a reply email, we may follow up at <strong>{email.trim()}</strong>
            </>
          ) : null}
          .
        </p>
        <Button className="mt-6" variant="secondary" onClick={resetForm}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-[20px] border border-hairline bg-card p-6 shadow-soft sm:p-8"
    >
      {/* Honeypot — visually hidden from people */}
      <div className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            Category <span className="text-fat">*</span>
          </legend>
          <div
            className="mt-2.5 grid gap-2 sm:grid-cols-2"
            role="radiogroup"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            {categories.map((item) => {
              const selected = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setCategory(item);
                    setErrors((current) => ({ ...current, category: undefined, form: undefined }));
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-[12px] border px-3.5 py-3 text-left text-[15px] font-medium transition',
                    selected
                      ? 'border-primary bg-primary/10 text-ink'
                      : 'border-hairline bg-canvas text-body hover:border-ink/25 hover:text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full border',
                      selected
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-hairline bg-card',
                    )}
                    aria-hidden
                  >
                    {selected ? <Check className="size-3.5 stroke-[3]" /> : null}
                  </span>
                  {item}
                </button>
              );
            })}
          </div>
          {errors.category ? (
            <p id="category-error" className="mt-1.5 text-xs font-medium text-fat" role="alert">
              {errors.category}
            </p>
          ) : null}
        </fieldset>

        <Field label="Subject" htmlFor="subject" error={errors.subject} required>
          <input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass(Boolean(errors.subject))}
            aria-invalid={Boolean(errors.subject)}
            maxLength={120}
            placeholder="Short summary"
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
            placeholder="What happened, what you expected, and any steps to reproduce"
          />
        </Field>

        <Field
          label="Email (optional)"
          htmlFor="email"
          error={errors.email}
          hint={`Leave this if you want a reply. Messages go to ${SUPPORT_EMAIL}.`}
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
            placeholder="you@example.com"
          />
        </Field>
      </div>

      {errors.form ? (
        <p className="mt-4 text-sm font-medium text-fat" role="alert">
          {errors.form}
        </p>
      ) : null}

      {state === 'error' && !errors.form && Object.keys(errors).length > 0 ? (
        <p className="mt-4 text-sm font-medium text-fat" role="alert">
          Please fix the highlighted fields.
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Submit feedback'}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'mt-1.5 w-full rounded-[12px] border bg-canvas px-3.5 py-3 text-[15px] text-ink outline-none transition placeholder:text-mute',
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
