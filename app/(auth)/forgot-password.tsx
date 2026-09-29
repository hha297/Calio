import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/auth/auth-shell';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { emailOnlySchema, type EmailOnly } from '@/features/auth/schema';
import { reportError } from '@/lib/errors/report-error';
import { colors } from '@/theme';

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const prefill = typeof params.email === 'string' ? params.email : '';
  const { resetPasswordForEmail } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<EmailOnly>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: prefill },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (formState.isSubmitting) return;
    setError(null);
    setMessage(null);

    try {
      await resetPasswordForEmail(values.email);
      setMessage('If that email is on Calio, a reset link is on the way. Open it on this phone.');
    } catch (err) {
      reportError(err, { area: 'auth', action: 'reset-password' });
      setError(toAuthErrorMessage(err));
    }
  });

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We’ll send a reset link to your email."
      footer={
        <Link href="/(auth)/sign-in">
          <Text variant="bodyStrong" style={{ color: colors.secondary }}>
            Back to sign in
          </Text>
        </Link>
      }
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
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
              placeholder="you@email.com"
            />
          )}
        />

        {error ? (
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: '#FCECEE' }}>
            <Text variant="bodySmall" tone="error">
              {error}
            </Text>
          </View>
        ) : null}
        {message ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.secondaryMuted }}
          >
            <Text variant="bodySmall" tone="secondary">
              {message}
            </Text>
          </View>
        ) : null}

        <Button
          label="Send reset link"
          variant="secondary"
          size="lg"
          loading={formState.isSubmitting}
          disabled={formState.isSubmitting}
          onPress={onSubmit}
        />
      </View>
    </AuthShell>
  );
}
