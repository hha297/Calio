import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useDeleteAccount } from '@/features/account/hooks';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { reportError } from '@/lib/errors/report-error';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

export default function DeleteAccountScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const deleteAccount = useDeleteAccount();
  const [error, setError] = useState<string | null>(null);

  function confirmDelete() {
    setError(null);
    Alert.alert(t('account.deleteConfirmTitle'), t('account.deleteConfirmBody'), [
      { text: t('account.cancel'), style: 'cancel' },
      {
        text: t('account.deleteConfirmAction'),
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteAccount.mutateAsync();
              router.replace('/(auth)/sign-in');
            } catch (err) {
              reportError(err, { area: 'account', action: 'delete-account' });
              setError(err instanceof Error ? err.message : toAuthErrorMessage(err));
            }
          })();
        },
      },
    ]);
  }

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ gap: spacing[4] }}>
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">{t('account.deleteAccount')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="brand">
              {t('account.cancel')}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            gap: spacing[3],
            padding: spacing[4],
            borderRadius: radii.md,
            backgroundColor: colors.surface,
          }}
        >
          <Text variant="body" tone="secondary">
            {t('account.deleteConfirmBody')}
          </Text>
          <Button
            label={t('account.deleteConfirmAction')}
            variant="destructive"
            loading={deleteAccount.isPending}
            disabled={deleteAccount.isPending}
            iconStart={(color) => <Trash2 size={18} color={color} />}
            onPress={confirmDelete}
          />
          {error ? (
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
