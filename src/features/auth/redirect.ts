import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Linking from 'expo-linking';

import {
  AUTH_CALLBACK_PATH,
  AUTH_NATIVE_SCHEME,
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
} from './redirect-uri';

export {
  AUTH_CALLBACK_PATH,
  AUTH_NATIVE_SCHEME,
  buildExpoGoRedirectUri,
  buildNativeRedirectUri,
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
 * Expo Go detection.
 *
 * SDK 58 Expo Go can report `executionEnvironment=bare` and `appOwnership=null`
 * while still exposing `expoGoConfig`, so do not rely on StoreClient alone.
 */
export function isExpoGoRuntime(): boolean {
  return getAuthRuntimeKind() === 'expo-go';
}

export function getAuthRuntimeKind(): AuthRuntimeKind {
  if (
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Constants.expoGoConfig != null
  ) {
    return 'expo-go';
  }

  if (
    Constants.executionEnvironment === ExecutionEnvironment.Bare ||
    Constants.executionEnvironment === ExecutionEnvironment.Standalone
  ) {
    return 'native';
  }

  return 'unknown';
}

/**
 * OAuth redirectTo for the current runtime.
 *
 * - Expo Go (tunnel or LAN): `exp://<metro-host>/--/auth/callback`
 *   Linking.createURL() with a custom app scheme strips the Expo-hosted Metro host
 *   and yields `trackwise://…`, which Android Expo Go cannot complete via Custom Tabs.
 * - Native development / store builds: `trackwise://auth/callback`
 */
export function getAuthRedirectUri(): string {
  const kind = getAuthRuntimeKind();

  if (kind === 'expo-go') {
    const host = resolveMetroHost();
    if (host) {
      return buildExpoGoRedirectUri(host);
    }
    return Linking.createURL(AUTH_CALLBACK_PATH, { scheme: 'exp' });
  }

  const uri = Linking.createURL(AUTH_CALLBACK_PATH, { scheme: AUTH_NATIVE_SCHEME });
  return uri.startsWith(`${AUTH_NATIVE_SCHEME}:`) ? uri : buildNativeRedirectUri();
}
