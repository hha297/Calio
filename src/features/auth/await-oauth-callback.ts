import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { AppState, type AppStateStatus } from 'react-native';

import { isAuthCallbackUrl } from './auth-callback-url';

export type OAuthCallbackCollection = {
  url: string | null;
  browserType: string;
  source: 'authSession' | 'linking' | null;
  reason:
    | 'success'
    | 'cancelled'
    | 'dismissed'
    | 'timeout'
    | 'grace-expired'
    | 'no-callback';
};

type CollectOptions = {
  authUrl: string;
  redirectTo: string;
  /** Absolute ceiling so loading cannot hang forever (default 3 minutes). */
  overallTimeoutMs?: number;
  /**
   * After the app returns to the foreground, how long to wait for a deep link
   * before treating the attempt as cancelled.
   */
  resumeGraceMs?: number;
};

function isOAuthReturnUrl(url: string): boolean {
  // Boolean wrap: isAuthCallbackUrl is a `url is string` guard; a plain string
  // argument would otherwise narrow to `never` on the false branch.
  return Boolean(isAuthCallbackUrl(url));
}

/**
 * Open the OAuth URL and collect the app callback.
 *
 * On Android Expo Go, `openAuthSessionAsync` may return `dismiss` without a URL
 * while the `exp://` deep link still arrives via Linking. Wait for Linking or a
 * short grace period after the app returns to the foreground — do not finish on
 * early browser results alone.
 */
export function collectOAuthCallbackUrl(options: CollectOptions): Promise<OAuthCallbackCollection> {
  const {
    authUrl,
    redirectTo,
    overallTimeoutMs = 180_000,
    resumeGraceMs = 15_000,
  } = options;

  return new Promise((resolve) => {
    let settled = false;
    let browserType = 'pending';
    let graceTimer: ReturnType<typeof setTimeout> | null = null;
    let leftApp = false;

    const finish = (
      url: string | null,
      source: OAuthCallbackCollection['source'],
      reason: OAuthCallbackCollection['reason'],
    ) => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimer);
      if (graceTimer) clearTimeout(graceTimer);
      linkSub.remove();
      appStateSub.remove();
      void WebBrowser.dismissBrowser();
      resolve({ url, browserType, source, reason });
    };

    const startGrace = (reason: OAuthCallbackCollection['reason']) => {
      if (settled) return;
      if (graceTimer) clearTimeout(graceTimer);
      graceTimer = setTimeout(() => {
        if (!settled) finish(null, null, reason);
      }, resumeGraceMs);
    };

    const linkSub = Linking.addEventListener('url', ({ url }) => {
      if (isOAuthReturnUrl(url)) {
        finish(url, 'linking', 'success');
      }
    });

    const onAppState = (state: AppStateStatus) => {
      if (settled) return;
      if (state === 'background' || state === 'inactive') {
        leftApp = true;
        return;
      }
      if (state === 'active' && leftApp) {
        // Returned from the browser / Custom Tab. Deep link may arrive slightly later.
        const reason: OAuthCallbackCollection['reason'] =
          browserType === 'cancel' ? 'cancelled' : 'grace-expired';
        startGrace(reason);
      }
    };
    const appStateSub = AppState.addEventListener('change', onAppState);

    const hardTimer = setTimeout(() => {
      finish(null, null, 'timeout');
    }, overallTimeoutMs);

    void WebBrowser.openAuthSessionAsync(authUrl, redirectTo)
      .then((browserResult) => {
        browserType = browserResult.type;
        if (
          browserResult.type === 'success' &&
          'url' in browserResult &&
          typeof browserResult.url === 'string' &&
          isOAuthReturnUrl(browserResult.url)
        ) {
          finish(browserResult.url, 'authSession', 'success');
          return;
        }

        // cancel/dismiss/success-without-url: keep waiting for Linking or AppState resume.
        // Android may report dismiss while Google is still visible — do not finish here.
        if (browserResult.type === 'cancel' && leftApp) {
          startGrace('cancelled');
        } else if (
          (browserResult.type === 'dismiss' || browserResult.type === 'success') &&
          leftApp &&
          AppState.currentState === 'active'
        ) {
          startGrace(browserResult.type === 'dismiss' ? 'dismissed' : 'no-callback');
        }
      })
      .catch(() => {
        browserType = 'error';
        if (leftApp) startGrace('no-callback');
      });
  });
}
