import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/auth/auth-shell';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { reportError } from '@/lib/errors/report-error';
import { colors } from '@/theme';

const RESEND_COOLDOWN_SEC = 60;

export default function CheckEmailScreen() {
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
      setMessage('Email sent again.');
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
      title="Check your email"
      subtitle={
        email
          ? `We sent a confirmation link to ${email}. Open it, then sign in.`
          : 'Open the confirmation link we sent, then sign in.'
      }
      footer={
        <Link href="/(auth)/sign-in">
          <Text variant="bodyStrong" style={{ color: colors.secondary }}>
            Back to sign in
          </Text>
        </Link>
      }
    >
      <View className="gap-4">
        {message ? (
          <Text variant="bodySmall" className="text-success">
            {message}
          </Text>
        ) : null}
        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}

        <Button
          label={secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend email'}
          variant="secondary"
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
