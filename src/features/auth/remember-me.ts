import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_KEY = 'calio.auth.remember_me';

/** When false, the next cold start clears the persisted Supabase session. */
export async function getRememberMe(): Promise<boolean> {
  const value = await AsyncStorage.getItem(REMEMBER_KEY);
  // Default on for first-time / missing preference.
  return value !== '0';
}

export async function setRememberMe(remember: boolean): Promise<void> {
  await AsyncStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
}
