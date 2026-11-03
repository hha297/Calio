export const siteConfig = {
  name: 'Trackwise',
  tagline: 'Make every step count.',
  description:
    'Track your nutrition, workouts, and progress in one place. Build better habits and understand your journey with Trackwise.',
  domain: 'trackwise.one',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://trackwise.one',
  googlePlayUrl: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL?.trim() || '',
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || '',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || '',
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL?.trim() || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || '',
    github: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '',
  },
} as const;

export function isStoreAvailable(url: string): boolean {
  return url.length > 0;
}

export function getStoreStatus() {
  const googlePlay = isStoreAvailable(siteConfig.googlePlayUrl);
  const appStore = isStoreAvailable(siteConfig.appStoreUrl);
  return {
    googlePlay,
    appStore,
    anyAvailable: googlePlay || appStore,
    label: googlePlay || appStore ? 'Available now' : 'Coming soon',
  };
}
