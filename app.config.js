const appJson = require('./app.json');

/** @type {import('expo/config').ExpoConfig} */
module.exports = () => {
  const expo = appJson.expo;

  return {
    ...expo,
    extra: {
      ...(expo.extra ?? {}),
      // Loaded by Expo CLI from .env.local before this file runs.
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
      supabasePublishableKey:
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.EXPO_PUBLIC_SUPABASE_KEY ||
        '',
    },
  };
};
