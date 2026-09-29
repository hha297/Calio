type AnalyticsValue = string | number | boolean;

type AnalyticsProperties = Record<string, AnalyticsValue>;

/**
 * Product-usage events only. Do not send nutrition, body, or account
 * secrets through this API. The PostHog client plugs in behind these methods.
 */
export const analytics = {
  track(event: string, properties?: AnalyticsProperties) {
    if (__DEV__) {
      console.info('[analytics]', event, properties ?? {});
    }
  },

  identify(userId: string) {
    if (__DEV__) {
      console.info('[analytics] identify', userId);
    }
  },

  reset() {
    if (__DEV__) {
      console.info('[analytics] reset');
    }
  },
};
