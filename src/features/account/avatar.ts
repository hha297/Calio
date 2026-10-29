import {
  isAllowedFoodImageMimeType,
  normalizeImageMimeType,
  resolveFoodImageByteSize,
  type SelectedFoodImage,
} from '@/features/food/food-image';

import { AVATAR_FOLDER, MAX_AVATAR_SIZE_BYTES } from './constants';

export type SelectedAvatarImage = SelectedFoodImage;

export function formatAvatarSizeLimit(): string {
  return `${MAX_AVATAR_SIZE_BYTES / (1024 * 1024)} MB`;
}

export function validateAvatarSelection(input: {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}): SelectedAvatarImage {
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

  if (byteSize != null && byteSize > MAX_AVATAR_SIZE_BYTES) {
    throw new Error(`Avatar must be ${formatAvatarSizeLimit()} or smaller.`);
  }

  const fileName = input.fileName?.trim() || `avatar.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
  return { uri, mimeType, fileName, byteSize };
}

export async function assertAvatarWithinSizeLimit(
  image: SelectedAvatarImage,
): Promise<SelectedAvatarImage> {
  const byteSize = image.byteSize ?? (await resolveFoodImageByteSize(image.uri));
  if (byteSize > MAX_AVATAR_SIZE_BYTES) {
    throw new Error(`Avatar must be ${formatAvatarSizeLimit()} or smaller.`);
  }
  return { ...image, byteSize };
}

export { AVATAR_FOLDER };

export function profileInitial(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const name = displayName?.trim();
  if (name) {
    const char = Array.from(name)[0];
    if (char) return char.toUpperCase();
  }
  const local = email?.split('@')[0]?.trim();
  if (local) {
    const char = Array.from(local)[0];
    if (char) return char.toUpperCase();
  }
  return 'C';
}
