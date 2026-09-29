import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthTextLink } from '@/features/auth/auth-text-link';
import { reportError } from '@/lib/errors/report-error';

const RESEND_COOLDOWN_SEC = 60;

export default function CheckEmailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const { resendConfirmationEmail } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SEC);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function handleResend() {
    if (!email || secondsLeft > 0 || resending) {
      return;
    }

    setResending(true);
    setError(null);
    setMessage(null);

    try {
      await resendConfirmationEmail(email);
      setMessage(t('auth.checkEmailSentAgain'));
      setSecondsLeft(RESEND_COOLDOWN_SEC);
    } catch (err) {
      reportError(err, { area: 'auth', action: 'resend-confirmation' });
      setError(toAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell
      title={t('auth.checkEmailTitle')}
      subtitle={
        email
          ? t('auth.checkEmailSubtitleWithEmail', { email })
          : t('auth.checkEmailSubtitle')
      }
      footer={
        <AuthTextLink
          href="/(auth)/sign-in"
          label={t('auth.backToSignIn')}
          direction="back"
        />
      }
    >
      <View className="gap-4">
        {message ? (
          <Text variant="bodySmall" tone="success">
            {message}
          </Text>
        ) : null}
        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}

        <Button
          label={
            secondsLeft > 0
              ? t('auth.resendIn', { seconds: secondsLeft })
              : t('auth.resendEmail')
          }
          variant="primary"
          size="lg"
          loading={resending}
          disabled={!email || secondsLeft > 0 || resending}
          onPress={() => {
            void handleResend();
          }}
        />
      </View>
    </AuthShell>
  );
}
