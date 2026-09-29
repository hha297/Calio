import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'calio.onboarding.completed';

export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === '1';
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, '1');
}
