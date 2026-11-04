/** Shared feedback image limits (form + /api/feedback). */

export const FEEDBACK_IMAGE_MAX_COUNT = 5;
export const FEEDBACK_IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export const FEEDBACK_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type FeedbackImageMimeType = (typeof FEEDBACK_IMAGE_MIME_TYPES)[number];

export function isAllowedFeedbackImageMimeType(value: string): value is FeedbackImageMimeType {
  return (FEEDBACK_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

export function formatFeedbackImageSizeLimit(): string {
  return '2 MB';
}

export function feedbackImageExtension(mimeType: FeedbackImageMimeType): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
  }
}
