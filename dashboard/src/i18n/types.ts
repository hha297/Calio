export const SUPPORTED_LOCALES = ['en', 'fi', 'sv', 'vi'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fi: 'Suomi',
  sv: 'Svenska',
  vi: 'Tiếng Việt',
};

/** @deprecated Prefer LocaleFlag SVG — emoji regional indicators show as letters on Windows. */
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'EN',
  fi: 'FI',
  sv: 'SV',
  vi: 'VI',
};

export type Messages = {
  nav: {
    features: string;
    howItWorks: string;
    faq: string;
    support: string;
    download: string;
    about: string;
    feedback: string;
    privacy: string;
    terms: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
    toggle: string;
  };
  language: {
    label: string;
  };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    description: string;
    explore: string;
    getApp: string;
    availability: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    description: string;
    nutritionTitle: string;
    nutritionBody: string;
    workoutTitle: string;
    workoutBody: string;
    goalsTitle: string;
    goalsBody: string;
    progressTitle: string;
    progressBody: string;
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    fullList: string;
    nutritionEyebrow: string;
    nutritionTitle: string;
    scanEyebrow: string;
    scanTitle: string;
    scanBody: string;
    workoutEyebrow: string;
    workoutTitle: string;
    goalsEyebrow: string;
    goalsTitle: string;
    goalsBody: string;
    progressEyebrow: string;
    progressTitle: string;
    progressBody: string;
  };
  how: {
    eyebrow: string;
    title: string;
    description: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
  };
  download: {
    eyebrow: string;
    title: string;
    description: string;
    comingSoon: string;
    qrPlaceholder: string;
    qrHint: string;
  };
  footer: {
    blurb: string;
    product: string;
    company: string;
    legal: string;
    support: string;
    contact: string;
    contactSupport: string;
    sendFeedback: string;
    accountDeletion: string;
    estimates: string;
    rights: string;
  };
  common: {
    comingSoon: string;
  };
  mockLabels: {
    diary: string;
    scan: string;
    workout: string;
    progress: string;
    goals: string;
  };
};
