import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { getSupabaseEnv } from './env';

let client: SupabaseClient | null = null;
let refreshBound = false;

function bindAutoRefresh(supabase: SupabaseClient) {
  if (refreshBound) {
    return;
  }

  refreshBound = true;

  // Refresh only while the app is open. A backgrounded refresh loop
  // keeps the process busier than a session restore needs.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}

export function getSupabase(): SupabaseClient | null {
  if (client) {
    return client;
  }

  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  // AsyncStorage avoids expo-sqlite's web WASM path, which Metro cannot
  // resolve during Expo Router's web/SSR bundle. Sessions fit here;
  // SecureStore's 2048-byte limit does not.
  client = createClient(env.url, env.publishableKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  bindAutoRefresh(client);
  return client;
}
