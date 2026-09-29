import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CheckboxRow } from '@/components/ui/checkbox-row';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { reportError } from '@/lib/errors/report-error';
import { useThemeColors } from '@/theme/theme-provider';

import { toAuthErrorMessage } from './auth-errors';
import { useAuth } from './auth-provider';
import { AuthShell } from './auth-shell';
import { AuthTextLink } from './auth-text-link';
import { PasswordMatchStatus } from './password-match-status';
import { PasswordRequirements } from './password-requirements';
import { PasswordStrengthMeter } from './password-strength-meter';
import {
  createSignInSchema,
  createSignUpSchema,
  type SignInValues,
  type SignUpValues,
} from './schema';

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up';
  /** Optional banner on sign-in (e.g. after password reset). */
  notice?: string;
};

export function AuthForm({ mode, notice }: AuthFormProps) {
  if (mode === 'sign-in') {
    return <SignInForm notice={notice} />;
  }
  return <SignUpForm />;
}

function SignInForm({ notice }: { notice?: string }) {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { signIn } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState, getValues } = useForm<SignInValues>({
    resolver: (values, context, options) =>
      zodResolver(createSignInSchema(t))(values, context, options),
    defaultValues: { email: '', password: '', rememberMe: true },
    mode: 'onSubmit',
  });

  // Keep language in deps so validation messages refresh with i18n.
  void i18n.language;

  const onSubmit = handleSubmit(async (values) => {
    if (formState.isSubmitting) return;
    setFormError(null);

    try {
      await signIn(values.email, values.password, values.rememberMe);
    } catch (error) {
      reportError(error, { area: 'auth', action: 'sign-in' });
      setFormError(toAuthErrorMessage(error));
    }
  });

  return (
    <AuthShell
      title={t('auth.signInTitle')}
      subtitle={t('auth.signInSubtitle')}
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1.5">
          <Text variant="bodySmall" tone="muted">
            {t('auth.newToCalio')}
          </Text>
          <AuthTextLink
            href="/(auth)/sign-up"
            label={t('auth.createAnAccount')}
            direction="forward"
          />
        </View>
      }
    >
      <View className="gap-5">
        {notice ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.secondaryMuted }}
          >
            <Text variant="bodySmall" tone="secondary">
              {notice}
            </Text>
          </View>
        ) : null}

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
              returnKeyType="next"
              placeholder={t('auth.emailPlaceholder')}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.password')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              passwordToggle
              secureTextEntry
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              placeholder={t('auth.passwordPlaceholder')}
            />
          )}
        />

        <View className="flex-row items-center justify-between gap-2">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <CheckboxRow
                label={t('auth.keepSignedIn')}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Pressable
            className="shrink-0"
            accessibilityRole="link"
            accessibilityLabel={t('auth.forgotPassword')}
            onPress={() =>
              router.push({
                pathname: '/(auth)/forgot-password',
                params: { email: getValues('email') },
              })
            }
            hitSlop={8}
          >
            <Text variant="bodySmall" style={{ color: colors.primary }}>
              {t('auth.forgotPassword')}
            </Text>
          </Pressable>
        </View>

        {formError ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.errorMuted }}
          >
            <Text variant="bodySmall" tone="error">
              {formError}
            </Text>
          </View>
        ) : null}

        <Button
          label={t('auth.signInCta')}
          variant="primary"
          size="lg"
          onPress={onSubmit}
          loading={formState.isSubmitting}
          disabled={formState.isSubmitting}
        />
      </View>
    </AuthShell>
  );
}

function emailUserInputs(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return [] as string[];
  const local = trimmed.split('@')[0] ?? '';
  return [trimmed, local].filter((part) => part.length >= 3);
}

/** Delay before surfacing email format errors while the user is still typing. */
const EMAIL_ERROR_DELAY_MS = 1600;

function useDebouncedReveal(value: string, delayMs = EMAIL_ERROR_DELAY_MS) {
  const [revealedFor, setRevealedFor] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealedFor(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return {
    revealed: revealedFor === value,
    revealNow: () => setRevealedFor(value),
  };
}

function SignUpForm() {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, formState, trigger } = useForm<SignUpValues>({
    resolver: (values, context, options) =>
      zodResolver(createSignUpSchema(t))(values, context, options),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  void i18n.language;

  const password = useWatch({ control, name: 'password' }) ?? '';
  const confirmPassword = useWatch({ control, name: 'confirmPassword' }) ?? '';
  const email = useWatch({ control, name: 'email' }) ?? '';
  const strengthInputs = useMemo(() => emailUserInputs(email), [email]);
  const { revealed: emailErrorReady, revealNow: revealEmailError } = useDebouncedReveal(email);

  const onSubmit = handleSubmit(async (values) => {
    if (formState.isSubmitting) return;
    setFormError(null);

    try {
      const result = await signUp(values.email, values.password);
      if (result.needsEmailConfirmation) {
        router.replace({
          pathname: '/(auth)/check-email',
          params: { email: values.email },
        });
      }
    } catch (error) {
      reportError(error, { area: 'auth', action: 'sign-up' });
      setFormError(toAuthErrorMessage(error));
    }
  });

  const canSubmit = formState.isValid && !formState.isSubmitting;

  return (
    <AuthShell
      title={t('auth.signUpTitle')}
      subtitle={t('auth.signUpSubtitle')}
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1.5">
          <Text variant="bodySmall" tone="muted">
            {t('auth.alreadyHaveAccount')}
          </Text>
          <AuthTextLink
            href="/(auth)/sign-in"
            label={t('auth.signInCta')}
            direction="forward"
          />
        </View>
      }
    >
      <View className="gap-5">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => {
            const interacted = fieldState.isDirty || fieldState.isTouched;
            const showError = interacted && emailErrorReady;
            return (
              <Input
                label={t('auth.email')}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={() => {
                  field.onBlur();
                  revealEmailError();
                }}
                error={showError ? fieldState.error?.message : undefined}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                placeholder={t('auth.emailPlaceholder')}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => {
            const interactive = fieldState.isDirty || field.value.length > 0;
            return (
              <View className="gap-2.5">
                <Input
                  label={t('auth.password')}
                  value={field.value}
                  onChangeText={(text) => {
                    field.onChange(text);
                    if (confirmPassword.length > 0) {
                      void trigger('confirmPassword');
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
          control={control}
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
                    if (canSubmit) {
                      void onSubmit();
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

        {formError ? (
          <View
            className="rounded-2xl px-3 py-2.5"
            style={{ backgroundColor: colors.errorMuted }}
          >
            <Text variant="bodySmall" tone="error">
              {formError}
            </Text>
          </View>
        ) : null}

        <Button
          label={t('auth.signUpCta')}
          variant="primary"
          size="lg"
          onPress={onSubmit}
          loading={formState.isSubmitting}
          disabled={!canSubmit}
        />
      </View>
    </AuthShell>
  );
}
