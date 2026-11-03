/* eslint-disable import/first -- vitest mocks must be declared before module under test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const constantsState = vi.hoisted(() => ({
  appOwnership: null as string | null,
  executionEnvironment: 'bare' as string,
  expoGoConfig: null as { debuggerHost?: string } | null,
  expoConfig: null as { hostUri?: string } | null,
  manifest: null as { debuggerHost?: string; hostUri?: string } | null,
}));

vi.mock('expo-constants', () => {
  const ExecutionEnvironment = {
    Bare: 'bare',
    Standalone: 'standalone',
    StoreClient: 'storeClient',
  } as const;

  return {
    __esModule: true,
    ExecutionEnvironment,
    default: {
      get appOwnership() {
        return constantsState.appOwnership;
      },
      get executionEnvironment() {
        return constantsState.executionEnvironment;
      },
      get expoGoConfig() {
        return constantsState.expoGoConfig;
      },
      get expoConfig() {
        return constantsState.expoConfig;
      },
      get manifest() {
        return constantsState.manifest;
      },
    },
  };
});

vi.mock('expo-linking', () => ({
  createURL: vi.fn(() => 'should-not-be-used'),
}));

import {
  AUTH_CALLBACK_PATH,
  assertUsableAuthRedirectUri,
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
  getAuthRedirectUri,
  getAuthRuntimeKind,
  getRedirectToFromAuthorizeUrl,
  isCanonicalNativeRedirectUri,
  isValidExpoGoRedirectUri,
  resolveMetroHost,
} from './redirect';

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

describe('redirect URI validators', () => {
  it('accepts only the canonical native callback', () => {
    expect(isCanonicalNativeRedirectUri('trackwise://auth/callback')).toBe(true);
    expect(isCanonicalNativeRedirectUri('trackwise:/auth/callback')).toBe(false);
    expect(isCanonicalNativeRedirectUri('trackwise://auth/callback?x=1')).toBe(false);
  });

  it('requires a Metro host for Expo Go redirects', () => {
    expect(isValidExpoGoRedirectUri('exp://192.0.2.10:8081/--/auth/callback')).toBe(true);
    expect(isValidExpoGoRedirectUri('exp://abc.exp.direct/--/auth/callback')).toBe(true);
    expect(isValidExpoGoRedirectUri('exp://auth/callback')).toBe(false);
    expect(isValidExpoGoRedirectUri('exp:///--/auth/callback')).toBe(false);
  });

  it('rejects malformed Expo redirects before OAuth starts', () => {
    expect(() => assertUsableAuthRedirectUri('exp://auth/callback')).toThrow(/invalid/i);
    expect(() => assertUsableAuthRedirectUri('trackwise://auth/callback')).not.toThrow();
  });

  it('reads redirect_to from a Supabase authorize URL', () => {
    const authUrl =
      'https://example.supabase.co/auth/v1/authorize?provider=google&redirect_to=trackwise%3A%2F%2Fauth%2Fcallback';
    expect(getRedirectToFromAuthorizeUrl(authUrl)).toBe('trackwise://auth/callback');
  });
});

describe('getAuthRuntimeKind / getAuthRedirectUri', () => {
  beforeEach(() => {
    constantsState.appOwnership = null;
    constantsState.executionEnvironment = 'bare';
    constantsState.expoGoConfig = null;
    constantsState.expoConfig = null;
    constantsState.manifest = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('selects the native redirect for Standalone production builds', () => {
    constantsState.executionEnvironment = 'standalone';
    constantsState.expoGoConfig = { debuggerHost: 'should-be-ignored.exp.direct' };
    expect(getAuthRuntimeKind()).toBe('native');
    expect(getAuthRedirectUri()).toBe('trackwise://auth/callback');
  });

  it('selects the native redirect for Bare development builds', () => {
    constantsState.executionEnvironment = 'bare';
    constantsState.expoGoConfig = {};
    expect(getAuthRuntimeKind()).toBe('native');
    expect(getAuthRedirectUri()).toBe('trackwise://auth/callback');
  });

  it('does not let expoGoConfig alone override a confirmed native runtime', () => {
    constantsState.executionEnvironment = 'bare';
    constantsState.appOwnership = null;
    constantsState.expoGoConfig = { debuggerHost: '192.0.2.10:8081' };
    expect(getAuthRuntimeKind()).toBe('native');
    expect(getAuthRedirectUri()).toBe('trackwise://auth/callback');
  });

  it('builds a LAN Expo Go redirect when StoreClient has a Metro host', () => {
    constantsState.executionEnvironment = 'storeClient';
    constantsState.expoGoConfig = { debuggerHost: '192.0.2.10:8081' };
    expect(getAuthRuntimeKind()).toBe('expo-go');
    expect(resolveMetroHost()).toBe('192.0.2.10:8081');
    expect(getAuthRedirectUri()).toBe('exp://192.0.2.10:8081/--/auth/callback');
  });

  it('builds a tunnel Expo Go redirect when ownership is expo', () => {
    constantsState.appOwnership = 'expo';
    constantsState.executionEnvironment = 'storeClient';
    constantsState.expoGoConfig = { debuggerHost: 'abc-anonymous-8081.exp.direct' };
    expect(getAuthRuntimeKind()).toBe('expo-go');
    expect(getAuthRedirectUri()).toBe(
      'exp://abc-anonymous-8081.exp.direct/--/auth/callback',
    );
  });

  it('fails explicitly in Expo Go without a Metro host', () => {
    constantsState.executionEnvironment = 'storeClient';
    constantsState.expoGoConfig = {};
    expect(getAuthRuntimeKind()).toBe('expo-go');
    expect(() => getAuthRedirectUri()).toThrow(/Metro server/i);
  });

  it('fails explicitly for an unknown runtime instead of inventing exp://', () => {
    constantsState.executionEnvironment = 'unknown-env';
    constantsState.appOwnership = null;
    constantsState.expoGoConfig = null;
    expect(getAuthRuntimeKind()).toBe('unknown');
    expect(() => getAuthRedirectUri()).toThrow(/unavailable/i);
  });

  it('treats ambiguous expoGoConfig with a Metro host as Expo Go only when not Bare/Standalone', () => {
    constantsState.executionEnvironment = 'unknown-env';
    constantsState.expoGoConfig = { debuggerHost: '192.0.2.55:8081' };
    expect(getAuthRuntimeKind()).toBe('expo-go');
    expect(getAuthRedirectUri()).toBe('exp://192.0.2.55:8081/--/auth/callback');
  });
});
