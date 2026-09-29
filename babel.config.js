module.exports = function (api) {
  // Invalidate Babel cache when Supabase env changes so EXPO_PUBLIC_* inlines stay fresh.
  api.cache.using(
    () =>
      [
        process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
        process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
      ].join('|'),
  );

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
