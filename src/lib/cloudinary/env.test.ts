import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

import Constants from 'expo-constants';

import { getCloudinaryEnv, isCloudinaryConfigured } from './env';

afterEach(() => {
  vi.unstubAllEnvs();
  (Constants as { expoConfig: { extra: Record<string, string> } }).expoConfig.extra = {};
});

describe('cloudinary env', () => {
  it('returns null when cloudinary env is missing', () => {
    vi.stubEnv('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME', '');
    vi.stubEnv('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET', '');
    expect(getCloudinaryEnv()).toBeNull();
    expect(isCloudinaryConfigured()).toBe(false);
  });

  it('reads cloud name and unsigned upload preset', () => {
    vi.stubEnv('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME', 'Trackwise-demo');
    vi.stubEnv('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET', 'Trackwise_foods_unsigned');
    expect(getCloudinaryEnv()).toEqual({
      cloudName: 'Trackwise-demo',
      uploadPreset: 'Trackwise_foods_unsigned',
    });
    expect(isCloudinaryConfigured()).toBe(true);
  });
});
