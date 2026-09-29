import Constants from 'expo-constants';

export type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

type Extra = {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
};

function readExtra(): Extra {
  return (Constants.expoConfig?.extra ?? {}) as Extra;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const extra = readExtra();

  // Prefer Metro-inlined EXPO_PUBLIC_* when present; fall back to app.config extra
  // (more reliable after .env changes / Babel cache).
  const url = (
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    extra.supabaseUrl ||
    ''
  ).trim();

  const publishableKey = (
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_KEY ||
    extra.supabasePublishableKey ||
    ''
  ).trim();

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
