import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthTextLink } from '@/features/auth/auth-text-link';
import { RECOVERY_OTP_LENGTH } from '@/features/auth/recovery-constants';
import { createEmailOnlySchema, type EmailOnly } from '@/features/auth/schema';
import { reportError } from '@/lib/errors/report-error';
import { useThemeColors } from '@/theme/theme-provider';

export default function ForgotPasswordScreen() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const prefill = typeof params.email === 'string' ? params.email : '';
  const { resetPasswordForEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<EmailOnly>({
    resolver: (values, context, options) =>
      zodResolver(createEmailOnlySchema(t))(values, context, options),
    defaultValues: { email: prefill },
  });

  void i18n.language;

  const onSubmit = handleSubmit(async (values) => {
    if (formState.isSubmitting) return;
    setError(null);

    try {
      await resetPasswordForEmail(values.email);
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: values.email },
      });
    } catch (err) {
      reportError(err, { area: 'auth', action: 'reset-password' });
      setError(toAuthErrorMessage(err));
    }
  });

  return (
    <AuthShell
      title={t('auth.forgotTitle')}
      subtitle={t('auth.forgotSubtitle', { count: RECOVERY_OTP_LENGTH })}
      footer={
        <AuthTextLink
          href="/(auth)/sign-in"
          label={t('auth.backToSignIn')}
          direction="back"
        />
      }
    >
      <View className="gap-5">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.email')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

        {error ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.errorMuted }}
          >
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          </View>
        ) : null}

        <Button
          label={t('auth.sendCode')}
          variant="primary"
          size="lg"
          loading={formState.isSubmitting}
          disabled={formState.isSubmitting}
          onPress={onSubmit}
        />
      </View>
    </AuthShell>
  );
}
