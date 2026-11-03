import Constants, { ExecutionEnvironment } from 'expo-constants';

import {
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
  isCanonicalNativeRedirectUri,
  isValidAuthRedirectUri,
  isValidExpoGoRedirectUri,
} from './redirect-uri';

export {
  AUTH_CALLBACK_PATH,
  AUTH_NATIVE_REDIRECT_URI,
  AUTH_NATIVE_SCHEME,
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
  getRedirectToFromAuthorizeUrl,
  isCanonicalNativeRedirectUri,
  isValidAuthRedirectUri,
  isValidExpoGoRedirectUri,
} from './redirect-uri';

export type AuthRuntimeKind = 'expo-go' | 'native' | 'unknown';

/**
 * Resolve the Metro / Expo Go host without hardcoding LAN IPs or tunnel names.
 * Tunnel hosts look like `*.exp.direct`; LAN hosts look like `192.168.x.x:8081`.
 */
export function resolveMetroHost(): string | null {
  const raw =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest?: { debuggerHost?: string; hostUri?: string } }).manifest
      ?.debuggerHost ??
    (Constants as { manifest?: { hostUri?: string } }).manifest?.hostUri ??
    null;
  if (!raw) return null;
  return String(raw).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Classify the auth runtime.
 *
 * Confirmed Bare/Standalone builds are native even when `expoGoConfig` is present —
 * treating `expoGoConfig != null` alone as Expo Go made store builds emit `exp://…`.
 */
export function getAuthRuntimeKind(): AuthRuntimeKind {
  const env = Constants.executionEnvironment;
  const ownership = Constants.appOwnership;

  if (ownership === 'expo' || env === ExecutionEnvironment.StoreClient) {
    return 'expo-go';
  }

  if (env === ExecutionEnvironment.Bare || env === ExecutionEnvironment.Standalone) {
    return 'native';
  }

  // Ambiguous env: only Expo Go when Metro host metadata is actually available.
  if (Constants.expoGoConfig != null && resolveMetroHost()) {
    return 'expo-go';
  }

  return 'unknown';
}

export function isExpoGoRuntime(): boolean {
  return getAuthRuntimeKind() === 'expo-go';
}

export function isNativeAuthRuntime(): boolean {
  return getAuthRuntimeKind() === 'native';
}

/**
 * OAuth redirectTo for the current runtime.
 *
 * - Expo Go (tunnel or LAN): `exp://<metro-host>/--/auth/callback`
 * - Native development / store builds: `trackwise://auth/callback`
 * - Expo Go without Metro, or unknown runtime: throw (never invent `exp://auth/callback`)
 */
export function getAuthRedirectUri(): string {
  const kind = getAuthRuntimeKind();

  if (kind === 'expo-go') {
    const host = resolveMetroHost();
    if (!host) {
      throw new Error(
        'Google sign-in in Expo Go needs a running Metro server (LAN or tunnel). Start Expo, then try again.',
      );
    }
    const uri = buildExpoGoRedirectUri(host);
    if (!isValidExpoGoRedirectUri(uri)) {
      throw new Error('Google sign-in could not build a valid Expo Go redirect.');
    }
    return uri;
  }

  if (kind === 'native') {
    const uri = buildNativeRedirectUri();
    if (!isCanonicalNativeRedirectUri(uri)) {
      throw new Error('Google sign-in could not build the native redirect.');
    }
    return uri;
  }

  throw new Error(
    'Google sign-in is unavailable in this app runtime. Use a development build or the Play Store build.',
  );
}

/** Reject malformed redirects before calling Supabase. */
export function assertUsableAuthRedirectUri(uri: string): void {
  if (!isValidAuthRedirectUri(uri)) {
    throw new Error('Google sign-in redirect is invalid for this runtime.');
  }
  if (uri === 'exp://auth/callback' || /^exp:\/\/\/--\//.test(uri) || uri === 'exp:///--/auth/callback') {
    throw new Error('Google sign-in redirect is missing the Metro host.');
  }
}
