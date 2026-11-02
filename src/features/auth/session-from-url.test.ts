import { describe, expect, it } from 'vitest';

import { isAuthCallbackUrl } from './auth-callback-url';

describe('isAuthCallbackUrl', () => {
  it.each([
    'trackwise://auth/callback?code=abc',
    'trackwise://auth/callback/#access_token=abc',
    'exp://192.0.2.1:8081/--/auth/callback?code=abc',
    'exp://abc-anonymous-8081.exp.direct/--/auth/callback?code=abc',
    'exp://abc-anonymous-8081.exp.direct/--/auth/callback#access_token=abc',
  ])('accepts the configured auth callback destination: %s', (url) => {
    expect(isAuthCallbackUrl(url)).toBe(true);
  });

  it.each([
    null,
    'trackwise://other/callback?code=abc',
    'https://example.com/?code=abc',
    'trackwise://auth/callback-evil?code=abc',
  ])('rejects unrelated destinations: %s', (url) => {
    expect(isAuthCallbackUrl(url)).toBe(false);
  });
});
