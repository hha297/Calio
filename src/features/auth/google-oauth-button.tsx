import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { reportError } from '@/lib/errors/report-error';
import { useThemeColors } from '@/theme/theme-provider';

import { toAuthErrorMessage } from './auth-errors';
import { useAuth } from './auth-provider';

export function GoogleOAuthButton({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      reportError(err, { area: 'auth', action: 'google-sign-in' });
      setError(toAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
        <Text variant="bodySmall" tone="muted">
          {t('auth.orContinueWith')}
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      </View>

      <Button
        label={t('auth.continueWithGoogle')}
        variant="secondary"
        size="lg"
        onPress={() => void startGoogleSignIn()}
        loading={loading}
        disabled={disabled || loading}
        iconStart={(color) => (
          <MaterialCommunityIcons name="google" size={20} color={color} />
        )}
      />

      {error ? (
        <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: colors.errorMuted }}>
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
