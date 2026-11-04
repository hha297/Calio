import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { SITE_URL, SUPPORT_EMAIL } from '@/config/site';
import {
  FEEDBACK_IMAGE_MAX_BYTES,
  FEEDBACK_IMAGE_MAX_COUNT,
  feedbackImageExtension,
  formatFeedbackImageSizeLimit,
  isAllowedFeedbackImageMimeType,
} from '@/lib/feedback-images';

export const runtime = 'nodejs';

const CATEGORIES = new Set([
  'General feedback',
  'Bug report',
  'Feature request',
  'Account or privacy',
  'Other',
]);

/** Default Resend test sender — replace via RESEND_FROM after verifying trackwise.one. */
const DEFAULT_FROM = 'Trackwise <onboarding@resend.dev>';

function asTrimmedString(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'image';
  return base.slice(0, 80);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
  }

  // Honeypot — bots that fill hidden fields are rejected quietly.
  if (asTrimmedString(formData.get('website'), 200)) {
    return NextResponse.json({ ok: true });
  }

  const category = asTrimmedString(formData.get('category'), 80);
  const subject = asTrimmedString(formData.get('subject'), 120);
  const message = asTrimmedString(formData.get('message'), 4000);
  const email = asTrimmedString(formData.get('email'), 254);

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

  const imageEntries = formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (imageEntries.length > FEEDBACK_IMAGE_MAX_COUNT) {
    return NextResponse.json(
      { error: `You can attach up to ${FEEDBACK_IMAGE_MAX_COUNT} images.` },
      { status: 400 },
    );
  }

  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];

  for (let index = 0; index < imageEntries.length; index += 1) {
    const file = imageEntries[index];
    const mimeType = (file.type || '').toLowerCase();

    if (!isAllowedFeedbackImageMimeType(mimeType)) {
      return NextResponse.json(
        { error: 'Images must be JPEG, PNG, or WebP.' },
        { status: 400 },
      );
    }
    if (file.size > FEEDBACK_IMAGE_MAX_BYTES) {
      return NextResponse.json(
        {
          error: `Each image must be ${formatFeedbackImageSizeLimit()} or smaller.`,
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fallbackName = `feedback-${index + 1}.${feedbackImageExtension(mimeType)}`;
    const filename = sanitizeFilename(file.name || fallbackName);

    attachments.push({
      filename,
      content: buffer,
      contentType: mimeType,
    });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Feedback email is not configured. Add RESEND_API_KEY and restart the server.' },
      { status: 503 },
    );
  }

  const from = process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
  const resend = new Resend(apiKey);
  const mailSubject = `[Trackwise feedback] ${category}: ${subject}`;
  const replyLine = email || 'not provided';
  const attachmentLine =
    attachments.length === 0
      ? 'none'
      : `${attachments.length} image${attachments.length === 1 ? '' : 's'}`;

  const html = `
    <h2>Trackwise feedback</h2>
    <table>
      <tr><td><strong>Category</strong></td><td>${escapeHtml(category)}</td></tr>
      <tr><td><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>
      <tr><td><strong>Reply email</strong></td><td>${escapeHtml(replyLine)}</td></tr>
      <tr><td><strong>Attachments</strong></td><td>${escapeHtml(attachmentLine)}</td></tr>
      <tr><td><strong>Source</strong></td><td>${escapeHtml(`${SITE_URL}/feedback`)}</td></tr>
    </table>
    <h3>Message</h3>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from,
      to: [SUPPORT_EMAIL],
      subject: mailSubject,
      html,
      replyTo: email || undefined,
      text: [
        `Category: ${category}`,
        `Subject: ${subject}`,
        `Reply email: ${replyLine}`,
        `Attachments: ${attachmentLine}`,
        `Source: ${SITE_URL}/feedback`,
        '',
        message,
      ].join('\n'),
      attachments: attachments.length
        ? attachments.map((item) => ({
            filename: item.filename,
            content: item.content,
            contentType: item.contentType,
          }))
        : undefined,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Mail provider rejected the submission.' },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Could not reach the mail provider. Try again shortly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
