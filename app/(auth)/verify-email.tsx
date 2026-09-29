import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthTextLink } from '@/features/auth/auth-text-link';
import { isEmailConfirmed } from '@/features/auth/email-confirmed';
import { OtpInput } from '@/features/auth/otp-input';
import {
  EMAIL_OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from '@/features/auth/recovery-constants';
import {
  createRecoveryOtpSchema,
  type RecoveryOtpValues,
} from '@/features/auth/schema';
import { reportError } from '@/lib/errors/report-error';
import { useThemeColors } from '@/theme/theme-provider';

/**
 * Signup email verification — 8-digit OTP (same length as password recovery).
 * Uses Supabase `verifyOtp({ type: 'signup' })`, not recovery.
 */
export default function VerifyEmailScreen() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const paramEmail = typeof params.email === 'string' ? params.email.trim() : '';
  const {
    verifySignupOtp,
    resendConfirmationEmail,
    session,
    signOut,
  } = useAuth();

  const email = paramEmail || session?.user.email?.trim() || '';
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [autoSubmittedCode, setAutoSubmittedCode] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  void i18n.language;

  useEffect(() => {
    if (isEmailConfirmed(session?.user)) {
      return;
    }
    if (!email) {
      router.replace('/(auth)/sign-up');
    }
  }, [email, session?.user]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const otpForm = useForm<RecoveryOtpValues>({
    resolver: (values, context, options) =>
      zodResolver(createRecoveryOtpSchema(t))(values, context, options),
    defaultValues: { code: '' },
    mode: 'onSubmit',
  });

  const code = useWatch({ control: otpForm.control, name: 'code' }) ?? '';

  async function verifyOtpCode(otp: string) {
    if (verifyingOtp || !email) return;
    setVerifyingOtp(true);
    setOtpError(null);
    setResendMessage(null);

    try {
      await verifySignupOtp(email, otp);
      // Bootstrap watches session + email_confirmed_at and routes to setup/main.
    } catch (err) {
      reportError(err, { area: 'auth', action: 'verify-signup-otp' });
      setOtpError(toAuthErrorMessage(err));
      setAutoSubmittedCode('');
    } finally {
      setVerifyingOtp(false);
    }
  }

  const onVerifyOtp = () => {
    void otpForm.handleSubmit(async (values) => {
      await verifyOtpCode(values.code);
    })();
  };

  useEffect(() => {
    if (code.length !== EMAIL_OTP_LENGTH) return;
    if (autoSubmittedCode === code || verifyingOtp) return;
    const timer = setTimeout(() => {
      setAutoSubmittedCode(code);
      void verifyOtpCode(code);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- submit once per complete code
  }, [code]);

  const onResend = async () => {
    if (resending || cooldown > 0 || !email) return;
    setOtpError(null);
    setResendMessage(null);
    setResending(true);

    try {
      await resendConfirmationEmail(email);
      otpForm.setValue('code', '');
      setAutoSubmittedCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setResendMessage(t('auth.newCodeOnWay'));
    } catch (err) {
      reportError(err, { area: 'auth', action: 'resend-signup-otp' });
      setOtpError(toAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title={t('auth.verifyEmailTitle')}
      subtitle={t('auth.verifyEmailSubtitle')}
      footer={
        <AuthTextLink
          label={t('auth.backToSignIn')}
          direction="back"
          onPress={() => {
            if (verifyingOtp || resending) return;
            const goSignIn = () => router.replace('/(auth)/sign-in');
            if (session && !isEmailConfirmed(session.user)) {
              void signOut().then(goSignIn).catch(goSignIn);
              return;
            }
            goSignIn();
          }}
        />
      }
    >
      <View className="gap-5">
        <View className="gap-1">
          <Text variant="body" tone="muted">
            {t('auth.verifyEmailSentTo')}
          </Text>
          <Text variant="bodyStrong">{email || '…'}</Text>
        </View>

        <View className="gap-1.5">
          <Text variant="label" tone="secondary">
            {t('auth.verificationCode')}
          </Text>
          <Controller
            control={otpForm.control}
            name="code"
            render={({ field, fieldState }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={verifyingOtp}
                length={EMAIL_OTP_LENGTH}
              />
            )}
          />
        </View>

        {otpError ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.errorMuted }}
          >
            <Text variant="bodySmall" tone="error">
              {otpError}
            </Text>
          </View>
        ) : null}

        {resendMessage ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.secondaryMuted }}
          >
            <Text variant="bodySmall" tone="secondary">
              {resendMessage}
            </Text>
          </View>
        ) : null}

        <Button
          label={t('auth.verifyEmailCta')}
          variant="primary"
          size="lg"
          loading={verifyingOtp}
          disabled={verifyingOtp || code.length !== EMAIL_OTP_LENGTH}
          onPress={onVerifyOtp}
        />

        <View className="items-center gap-1 py-1">
          <Text variant="bodySmall" tone="muted">
            {t('auth.didntReceiveCode')}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={cooldown > 0 || resending}
            onPress={() => {
              void onResend();
            }}
            hitSlop={8}
          >
            <Text
              variant="bodySmall"
              style={{
                color: cooldown > 0 || resending ? colors.textMuted : colors.primary,
              }}
            >
              {resending
                ? t('auth.sending')
                : cooldown > 0
                  ? t('auth.resendIn', { seconds: cooldown })
                  : t('auth.resendCode')}
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthShell>
  );
}
