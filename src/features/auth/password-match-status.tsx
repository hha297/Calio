import { Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type PasswordMatchStatusProps = {
  password: string;
  confirmPassword: string;
  /** False until the confirm field has been interacted with. */
  interactive: boolean;
};

export function PasswordMatchStatus({
  password,
  confirmPassword,
  interactive,
}: PasswordMatchStatusProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  if (!interactive || confirmPassword.length === 0) {
    return <View style={{ minHeight: 20 }} />;
  }

  const matched = confirmPassword === password;
  const color = matched ? colors.success : colors.error;
  const Icon = matched ? Check : X;
  const label = matched ? t('auth.passwordsMatch') : t('auth.passwordsDontMatch');

  return (
    <View className="flex-row items-center gap-2" style={{ minHeight: 20 }}>
      <Icon size={14} color={color} strokeWidth={2.5} />
      <Text variant="caption" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
