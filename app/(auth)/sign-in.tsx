import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthForm } from '@/features/auth/auth-form';

export default function SignInScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ reset?: string }>();
  const notice =
    params.reset === '1' ? t('auth.passwordUpdatedNotice') : undefined;

  return <AuthForm mode="sign-in" notice={notice} />;
}
