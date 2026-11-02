import { describe, expect, it } from 'vitest';

import {
  AUTH_CALLBACK_PATH,
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
} from './redirect-uri';

describe('buildExpoGoRedirectUri', () => {
  it('builds a tunnel redirect without hardcoding the host', () => {
    expect(buildExpoGoRedirectUri('abc-anonymous-8081.exp.direct')).toBe(
      `exp://abc-anonymous-8081.exp.direct/--/${AUTH_CALLBACK_PATH}`,
    );
  });

  it('builds a LAN redirect from the Metro host', () => {
    expect(buildExpoGoRedirectUri('192.0.2.10:8081')).toBe(
      `exp://192.0.2.10:8081/--/${AUTH_CALLBACK_PATH}`,
    );
  });

  it('strips accidental protocol prefixes from the host', () => {
    expect(buildExpoGoRedirectUri('http://192.0.2.10:8081/')).toBe(
      `exp://192.0.2.10:8081/--/${AUTH_CALLBACK_PATH}`,
    );
  });
});

describe('buildNativeRedirectUri', () => {
  it('uses the app scheme and shared callback path', () => {
    expect(buildNativeRedirectUri()).toBe('trackwise://auth/callback');
  });
});
