import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/auth/auth-shell';
import { toAuthErrorMessage } from '@/features/auth/auth-errors';
import { useAuth } from '@/features/auth/auth-provider';
import { updatePasswordSchema, type UpdatePasswordValues } from '@/features/auth/schema';
import { reportError } from '@/lib/errors/report-error';
import { colors } from '@/theme';

export default function UpdatePasswordScreen() {
  const { updatePassword, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { control, handleSubmit, formState } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (formState.isSubmitting) return;
    setError(null);

    try {
      await updatePassword(values.password);
      setSuccess(true);
    } catch (err) {
      reportError(err, { area: 'auth', action: 'update-password' });
      setError(toAuthErrorMessage(err));
    }
  });

  return (
    <AuthShell
      title="New password"
      subtitle={success ? 'Password updated. Taking you in…' : undefined}
    >
      {success ? (
        <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: colors.secondaryMuted }}>
          <Text variant="body" tone="secondary">
            Loading your diary…
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="New password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                passwordToggle
                secureTextEntry
                textContentType="newPassword"
                placeholder="At least 8 characters"
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Input
                label="Confirm password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                passwordToggle
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                placeholder="Confirm password"
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

          <Button
            label="Update password"
            variant="secondary"
            size="lg"
            loading={formState.isSubmitting}
            disabled={formState.isSubmitting}
            onPress={onSubmit}
          />
          <Button
            label="Cancel and sign out"
            variant="ghost"
            onPress={() => {
              void signOut();
            }}
          />
        </View>
      )}
    </AuthShell>
  );
}
