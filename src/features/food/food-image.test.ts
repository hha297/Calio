import { describe, expect, it } from 'vitest';

import {
  MAX_FOOD_IMAGE_SIZE_BYTES,
  formatFoodImageSizeLimit,
  normalizeImageMimeType,
  validateFoodImageSelection,
} from './food-image';

describe('food image validation', () => {
  it('exposes a 10 MB size limit', () => {
    expect(MAX_FOOD_IMAGE_SIZE_BYTES).toBe(10 * 1024 * 1024);
    expect(formatFoodImageSizeLimit()).toBe('10 MB');
  });

  it('normalizes mime types from uri when missing', () => {
    expect(normalizeImageMimeType(null, 'file:///tmp/photo.PNG')).toBe('image/png');
    expect(normalizeImageMimeType('image/jpg', 'x')).toBe('image/jpeg');
  });

  it('accepts a valid jpeg under the size limit', () => {
    const selected = validateFoodImageSelection({
      uri: 'file:///tmp/food.jpg',
      mimeType: 'image/jpeg',
      fileName: 'food.jpg',
      fileSize: 1024,
    });
    expect(selected.mimeType).toBe('image/jpeg');
    expect(selected.byteSize).toBe(1024);
  });

  it('rejects oversized images when size is known', () => {
    expect(() =>
      validateFoodImageSelection({
        uri: 'file:///tmp/food.jpg',
        mimeType: 'image/jpeg',
        fileSize: MAX_FOOD_IMAGE_SIZE_BYTES + 1,
      }),
    ).toThrow(/10 MB/);
  });

  it('rejects unsupported formats', () => {
    expect(() =>
      validateFoodImageSelection({
        uri: 'file:///tmp/food.gif',
        mimeType: 'image/gif',
      }),
    ).toThrow(/JPEG, PNG, or WebP/);
  });
});
