import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthTextLink } from '@/features/auth/auth-text-link';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { OtpInput } from '@/features/auth/otp-input';
import { PasswordMatchStatus } from '@/features/auth/password-match-status';
import { PasswordRequirements } from '@/features/auth/password-requirements';
import { PasswordStrengthMeter } from '@/features/auth/password-strength-meter';
import {
  RECOVERY_OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from '@/features/auth/recovery-constants';
import {
  createRecoveryOtpSchema,
  createUpdatePasswordSchema,
  type RecoveryOtpValues,
  type UpdatePasswordValues,
} from '@/features/auth/schema';
import { reportError } from '@/lib/errors/report-error';
import { useThemeColors } from '@/theme/theme-provider';

type Step = 'otp' | 'password';

/**
 * Full password recovery UI: verify 8-digit email OTP, then set a new password.
 */
export default function ResetPasswordScreen() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const paramEmail = typeof params.email === 'string' ? params.email.trim() : '';
  const { verifyRecoveryOtp, resetPasswordForEmail, completePasswordReset, signOut, session, passwordRecovery } =
    useAuth();

  const email = paramEmail || session?.user.email?.trim() || '';
  const [step, setStep] = useState<Step>(passwordRecovery ? 'password' : 'otp');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [autoSubmittedCode, setAutoSubmittedCode] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  void i18n.language;

  useEffect(() => {
    if (step === 'otp' && !email) {
      router.replace('/(auth)/forgot-password');
    }
  }, [email, step]);

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

  const passwordForm = useForm<UpdatePasswordValues>({
    resolver: (values, context, options) =>
      zodResolver(createUpdatePasswordSchema(t))(values, context, options),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const code = useWatch({ control: otpForm.control, name: 'code' }) ?? '';
  const password = useWatch({ control: passwordForm.control, name: 'password' }) ?? '';
  const confirmPassword = useWatch({ control: passwordForm.control, name: 'confirmPassword' }) ?? '';

  const strengthInputs = useMemo(() => {
    const local = email.split('@')[0] ?? '';
    return [email, local].filter((part) => part.length >= 3);
  }, [email]);

  async function verifyOtpCode(otp: string) {
    if (verifyingOtp || !email) return;
    setVerifyingOtp(true);
    setOtpError(null);
    setResendMessage(null);

    try {
      await verifyRecoveryOtp(email, otp);
      setStep('password');
    } catch (err) {
      reportError(err, { area: 'auth', action: 'verify-recovery-otp' });
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
    if (step !== 'otp') return;
    if (code.length !== RECOVERY_OTP_LENGTH) return;
    if (autoSubmittedCode === code || verifyingOtp) return;
    const timer = setTimeout(() => {
      setAutoSubmittedCode(code);
      void verifyOtpCode(code);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- submit once per complete code
  }, [code, step]);

  const onResend = async () => {
    if (resending || cooldown > 0 || !email) return;
    setOtpError(null);
    setResendMessage(null);
    setResending(true);

    try {
      await resetPasswordForEmail(email);
      otpForm.setValue('code', '');
      setAutoSubmittedCode('');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setResendMessage(t('auth.newCodeOnWay'));
    } catch (err) {
      reportError(err, { area: 'auth', action: 'resend-recovery-otp' });
      setOtpError(toAuthErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const canUpdatePassword =
    passwordForm.formState.isValid &&
    !passwordForm.formState.isSubmitting &&
    (passwordRecovery || step === 'password');

  const onUpdatePassword = passwordForm.handleSubmit(async (values) => {
    if (passwordForm.formState.isSubmitting) return;
    setPasswordError(null);

    try {
      setFinishing(true);
      await completePasswordReset(values.password);
      router.replace({
        pathname: '/(auth)/sign-in',
        params: { reset: '1' },
      });
    } catch (err) {
      setFinishing(false);
      reportError(err, { area: 'auth', action: 'complete-password-reset' });
      setPasswordError(toAuthErrorMessage(err));
    }
  });

  const title = step === 'otp' ? t('auth.resetTitle') : t('auth.newPassword');
  const subtitle =
    step === 'otp'
      ? t('auth.resetSubtitleOtp', { count: RECOVERY_OTP_LENGTH, email: email || '…' })
      : t('auth.resetSubtitlePassword');

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      footer={
        step === 'otp' ? (
          <AuthTextLink
            href={{
              pathname: '/(auth)/forgot-password',
              params: email ? { email } : undefined,
            }}
            label={t('auth.useDifferentEmail')}
            direction="back"
          />
        ) : (
          <AuthTextLink
            label={t('auth.cancelAndSignIn')}
            direction="back"
            onPress={() => {
              if (finishing || passwordForm.formState.isSubmitting) return;
              void signOut().then(() => router.replace('/(auth)/sign-in'));
            }}
          />
        )
      }
    >
      {step === 'otp' ? (
        <View className="gap-5">
          <View className="gap-1">
            <Text variant="label" tone="secondary">
              {t('auth.email')}
            </Text>
            <Text variant="bodyStrong">{email}</Text>
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
                  length={RECOVERY_OTP_LENGTH}
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
            label={t('auth.verifyCode')}
            variant="primary"
            size="lg"
            loading={verifyingOtp}
            disabled={verifyingOtp || code.length !== RECOVERY_OTP_LENGTH}
            onPress={onVerifyOtp}
          />

          <Pressable
            accessibilityRole="button"
            disabled={cooldown > 0 || resending}
            onPress={() => {
              void onResend();
            }}
            hitSlop={8}
            className="items-center py-1"
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

          <AuthTextLink
            href="/(auth)/sign-in"
            label={t('auth.backToSignIn')}
            direction="back"
          />
        </View>
      ) : (
        <View className="gap-5">
          <Controller
            control={passwordForm.control}
            name="password"
            render={({ field, fieldState }) => {
              const interactive = fieldState.isDirty || field.value.length > 0;
              return (
                <View className="gap-2.5">
                  <Input
                    label={t('auth.newPassword')}
                    value={field.value}
                    onChangeText={(text) => {
                      field.onChange(text);
                      if (confirmPassword.length > 0) {
                        void passwordForm.trigger('confirmPassword');
                      }
                    }}
                    onBlur={field.onBlur}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                    passwordToggle
                    secureTextEntry
                    textContentType="newPassword"
                    returnKeyType="next"
                    placeholder={t('auth.createPasswordPlaceholder')}
                  />
                  <PasswordStrengthMeter password={field.value} userInputs={strengthInputs} />
                  <PasswordRequirements password={field.value} interactive={interactive} />
                </View>
              );
            }}
          />

          <Controller
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field, fieldState }) => {
              const interactive =
                fieldState.isDirty || fieldState.isTouched || field.value.length > 0;
              const showRequired =
                interactive && field.value.length === 0 ? fieldState.error?.message : undefined;

              return (
                <View className="gap-1.5">
                  <Input
                    label={t('auth.confirmPassword')}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={showRequired}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                    passwordToggle
                    secureTextEntry
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      if (canUpdatePassword) {
                        void onUpdatePassword();
                      }
                    }}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                  />
                  <PasswordMatchStatus
                    password={password}
                    confirmPassword={field.value}
                    interactive={interactive}
                  />
                </View>
              );
            }}
          />

          {passwordError ? (
            <View
              className="rounded-2xl px-3 py-2.5"
              style={{ backgroundColor: colors.errorMuted }}
            >
              <Text variant="bodySmall" tone="error">
                {passwordError}
              </Text>
            </View>
          ) : null}

          <Button
            label={t('auth.updatePassword')}
            variant="primary"
            size="lg"
            loading={passwordForm.formState.isSubmitting || finishing}
            disabled={!canUpdatePassword || finishing}
            onPress={onUpdatePassword}
          />
        </View>
      )}
    </AuthShell>
  );
}
