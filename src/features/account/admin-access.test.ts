import { afterEach, describe, expect, it, vi } from 'vitest';
import Constants from 'expo-constants';

import { getAdminDashboardUrl } from './admin-access';

vi.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabase: () => null,
}));

afterEach(() => {
  vi.unstubAllEnvs();
  (Constants as { expoConfig: { extra: Record<string, string> } }).expoConfig.extra = {};
});

describe('getAdminDashboardUrl', () => {
  it('returns null when unset', () => {
    vi.stubEnv('EXPO_PUBLIC_ADMIN_URL', '');
    expect(getAdminDashboardUrl()).toBeNull();
  });

  it('returns trimmed EXPO_PUBLIC_ADMIN_URL', () => {
    vi.stubEnv('EXPO_PUBLIC_ADMIN_URL', ' https://admin.example.com ');
    expect(getAdminDashboardUrl()).toBe('https://admin.example.com');
  });

  it('falls back to app.config extra.adminUrl', () => {
    vi.stubEnv('EXPO_PUBLIC_ADMIN_URL', '');
    (Constants as { expoConfig: { extra: Record<string, string> } }).expoConfig.extra = {
      adminUrl: 'https://from-extra.example.com',
    };
    expect(getAdminDashboardUrl()).toBe('https://from-extra.example.com');
  });
});
