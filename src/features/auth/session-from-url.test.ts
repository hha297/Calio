import { describe, expect, it } from 'vitest';

import { isAuthCallbackUrl } from './auth-callback-url';

describe('isAuthCallbackUrl', () => {
  it.each([
    'calio://auth/callback?code=abc',
    'calio://auth/callback/#access_token=abc',
    'exp://192.0.2.1:8081/--/auth/callback?code=abc',
  ])('accepts the configured auth callback destination: %s', (url) => {
    expect(isAuthCallbackUrl(url)).toBe(true);
  });

  it.each([
    null,
    'calio://other/callback?code=abc',
    'https://example.com/?code=abc',
    'calio://auth/callback-evil?code=abc',
  ])('rejects unrelated destinations: %s', (url) => {
    expect(isAuthCallbackUrl(url)).toBe(false);
  });
});
