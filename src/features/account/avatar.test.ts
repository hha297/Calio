import { describe, expect, it } from 'vitest';

import { profileInitial, validateAvatarSelection } from './avatar';

describe('profileInitial', () => {
  it('uses the first character of the display name', () => {
    expect(profileInitial('Alex', 'a@example.com')).toBe('A');
  });

  it('falls back to the email local part', () => {
    expect(profileInitial(null, 'sam@example.com')).toBe('S');
  });

  it('uses a safe default when nothing is available', () => {
    expect(profileInitial(null, null)).toBe('C');
  });
});

describe('validateAvatarSelection', () => {
  it('accepts jpeg images under the size limit', () => {
    const selected = validateAvatarSelection({
      uri: 'file:///avatar.jpg',
      mimeType: 'image/jpeg',
      fileName: 'avatar.jpg',
      fileSize: 1024,
    });
    expect(selected.mimeType).toBe('image/jpeg');
  });

  it('rejects oversized files when size is known', () => {
    expect(() =>
      validateAvatarSelection({
        uri: 'file:///big.jpg',
        mimeType: 'image/jpeg',
        fileSize: 6 * 1024 * 1024,
      }),
    ).toThrow(/5 MB/);
  });
});
