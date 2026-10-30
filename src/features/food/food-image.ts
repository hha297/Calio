/** Max food image size: 10 MB (client-side gate; also configure on Cloudinary preset). */
export const MAX_FOOD_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const FOOD_IMAGE_FOLDER = 'calio/foods';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

export type SelectedFoodImage = {
  uri: string;
  mimeType: string;
  fileName: string;
  byteSize: number | null;
};

export function formatFoodImageSizeLimit(): string {
  return `${MAX_FOOD_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`;
}

export function normalizeImageMimeType(mimeType: string | null | undefined, uri: string): string {
  const trimmed = mimeType?.trim().toLowerCase();
  if (trimmed && trimmed !== 'application/octet-stream') {
    if (trimmed === 'image/jpg') return 'image/jpeg';
    return trimmed;
  }
  const ext = extensionFromUri(uri);
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  if (ext === 'heif') return 'image/heif';
  return '';
}

export function isAllowedFoodImageMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType.toLowerCase());
}

export function validateFoodImageSelection(input: {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}): SelectedFoodImage {
  const uri = input.uri.trim();
  if (!uri) {
    throw new Error('Could not read the selected image. Try another photo.');
  }

  const mimeType = normalizeImageMimeType(input.mimeType, uri);
  if (!mimeType || !isAllowedFoodImageMimeType(mimeType)) {
    throw new Error('Use a JPEG, PNG, or WebP image.');
  }

  const byteSize =
    typeof input.fileSize === 'number' && Number.isFinite(input.fileSize) && input.fileSize >= 0
      ? input.fileSize
      : null;

  if (byteSize != null && byteSize > MAX_FOOD_IMAGE_SIZE_BYTES) {
    throw new Error(`Image must be ${formatFoodImageSizeLimit()} or smaller.`);
  }

  const fileName =
    input.fileName?.trim() ||
    `food.${extensionFromUri(uri) || mimeExtension(mimeType) || 'jpg'}`;

  const ext = extensionFromFileName(fileName);
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('Use a JPEG, PNG, or WebP image.');
  }

  return { uri, mimeType, fileName, byteSize };
}

/** Resolve byte size via fetch when the picker did not report fileSize. */
export async function resolveFoodImageByteSize(uri: string): Promise<number> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Could not read the selected image. Try another photo.');
  }
  const blob = await response.blob();
  return blob.size;
}

export async function assertFoodImageWithinSizeLimit(
  image: SelectedFoodImage,
): Promise<SelectedFoodImage> {
  const byteSize = image.byteSize ?? (await resolveFoodImageByteSize(image.uri));
  if (byteSize > MAX_FOOD_IMAGE_SIZE_BYTES) {
    throw new Error(`Image must be ${formatFoodImageSizeLimit()} or smaller.`);
  }
  return { ...image, byteSize };
}

function extensionFromUri(uri: string): string {
  const cleaned = uri.split('?')[0] ?? uri;
  const match = cleaned.match(/\.([a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase() ?? '';
}

function extensionFromFileName(fileName: string): string {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase() ?? '';
}

function mimeExtension(mimeType: string): string {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/heic') return 'heic';
  if (mimeType === 'image/heif') return 'heif';
  return 'jpg';
}
