import Constants from 'expo-constants';
import { router } from 'expo-router';
import { CircleHelp, FileText, Mail, Shield } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import {
  getPrivacyPolicyUrl,
  getSupportEmail,
  getTermsOfServiceUrl,
} from '@/features/account/constants';
import { HeaderDoneButton } from '@/features/account/header-done-button';
import { SettingsRow, SettingsSection } from '@/features/account/settings-row';
import { reportError } from '@/lib/errors/report-error';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

async function openOptionalUrl(url: string | null, unavailableLabel: string) {
  if (!url) {
    Alert.alert(unavailableLabel);
    return;
  }
  try {
    await Linking.openURL(url);
  } catch (err) {
    reportError(err, { area: 'account', action: 'open-url' });
    Alert.alert(unavailableLabel);
  }
}

export default function AboutScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';
  const supportEmail = getSupportEmail();

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ gap: spacing[4] }}>
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">{t('account.about')}</Text>
          <HeaderDoneButton />
        </View>

        <View
          style={{
            padding: spacing[4],
            borderRadius: radii.md,
            backgroundColor: colors.surface,
            gap: spacing[2],
          }}
        >
          <Text variant="headingSmall">Calio</Text>
          <Text variant="caption" tone="muted">
            {t('account.version', { version })}
          </Text>
          <Text variant="body" tone="secondary">
            {t('account.aboutBody')}
          </Text>
        </View>

        <SettingsSection>
          <SettingsRow
            icon={CircleHelp}
            title={t('account.help')}
            onPress={() => router.push('/(tabs)/help')}
          />
          <SettingsRow
            icon={Mail}
            title={t('account.support')}
            subtitle={supportEmail ?? t('account.legalUnavailable')}
            showChevron={Boolean(supportEmail)}
            onPress={
              supportEmail
                ? () => {
                    void openOptionalUrl(
                      `mailto:${supportEmail}`,
                      t('account.legalUnavailable'),
                    );
                  }
                : undefined
            }
          />
          <SettingsRow
            icon={Shield}
            title={t('account.privacyPolicy')}
            subtitle={getPrivacyPolicyUrl() ? undefined : t('account.legalUnavailable')}
            onPress={() =>
              void openOptionalUrl(getPrivacyPolicyUrl(), t('account.legalUnavailable'))
            }
          />
          <SettingsRow
            icon={FileText}
            title={t('account.terms')}
            subtitle={getTermsOfServiceUrl() ? undefined : t('account.legalUnavailable')}
            onPress={() =>
              void openOptionalUrl(getTermsOfServiceUrl(), t('account.legalUnavailable'))
            }
          />
        </SettingsSection>
      </View>
    </Screen>
  );
}
