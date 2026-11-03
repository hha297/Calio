import { NextResponse } from 'next/server';

import { SUPPORT_EMAIL } from '@/config/site';

export const runtime = 'nodejs';

const CATEGORIES = new Set([
  'General feedback',
  'Bug report',
  'Feature request',
  'Account or privacy',
  'Other',
]);

type FeedbackBody = {
  category?: unknown;
  subject?: unknown;
  message?: unknown;
  email?: unknown;
  website?: unknown; // honeypot
};

function asTrimmedString(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Honeypot — bots that fill hidden fields are rejected quietly.
  if (asTrimmedString(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const category = asTrimmedString(body.category, 80);
  const subject = asTrimmedString(body.subject, 120);
  const message = asTrimmedString(body.message, 4000);
  const email = asTrimmedString(body.email, 254);

  if (!CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Choose a valid category.' }, { status: 400 });
  }
  if (subject.length < 3) {
    return NextResponse.json({ error: 'Subject must be at least 3 characters.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email or leave it blank.' }, { status: 400 });
  }

  const payload = {
    _subject: `[Trackwise feedback] ${category}: ${subject}`,
    _template: 'table',
    _captcha: 'false',
    category,
    subject,
    message,
    reply_email: email || 'not provided',
    source: 'https://trackwise.one/feedback',
  };

  let upstream: Response;
  try {
    upstream = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SUPPORT_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not reach the mail provider. Try again shortly.' },
      { status: 502 },
    );
  }

  const upstreamText = await upstream.text();
  let upstreamJson: { success?: string; message?: string; error?: string } = {};
  try {
    upstreamJson = JSON.parse(upstreamText) as typeof upstreamJson;
  } catch {
    // non-JSON error body
  }

  if (!upstream.ok) {
    const detail =
      upstreamJson.message ||
      upstreamJson.error ||
      'Mail provider rejected the submission.';
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
