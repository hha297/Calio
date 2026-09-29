import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { CheckboxRow } from '@/components/ui/checkbox-row';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { reportError } from '@/lib/errors/report-error';
import { colors } from '@/theme';

import { toAuthErrorMessage } from './auth-errors';
import { useAuth } from './auth-provider';
import { AuthShell } from './auth-shell';
import { PasswordMatchStatus } from './password-match-status';
import { PasswordRequirements } from './password-requirements';
import { PasswordStrengthMeter } from './password-strength-meter';
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from './schema';

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up';
};

export function AuthForm({ mode }: AuthFormProps) {
  if (mode === 'sign-in') {
    return <SignInForm />;
  }
  return <SignUpForm />;
}

function SignInForm() {
  const { signIn } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState, getValues } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
    mode: 'onSubmit',
  });

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
      title="Sign in"
      subtitle="Jump back into your meals, workouts, and daily progress. Pick up where you left off and keep your goals in sight."
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1.5">
          <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)' }}>
            New to Calio?
          </Text>
          <Link href="/(auth)/sign-up">
            <Text variant="bodyStrong" style={{ color: colors.secondary }}>
              Create an account
            </Text>
          </Link>
        </View>
      }
    >
      <View className="gap-5">
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
              returnKeyType="next"
              placeholder="you@email.com"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label="Password"
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
              placeholder="Your password"
            />
          )}
        />

        <View className="flex-row items-center justify-between gap-3 pt-0.5">
          <View className="flex-1">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <CheckboxRow
                  label="Keep me signed in"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Forgot password"
            onPress={() =>
              router.push({
                pathname: '/(auth)/forgot-password',
                params: { email: getValues('email') },
              })
            }
            hitSlop={8}
          >
            <Text variant="bodySmall" style={{ color: colors.primary }}>
              Forgot password?
            </Text>
          </Pressable>
        </View>

        {formError ? (
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: '#FCECEE' }}>
            <Text variant="bodySmall" tone="error">
              {formError}
            </Text>
          </View>
        ) : null}

        <Button
          label="Sign in"
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
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const timer = setTimeout(() => setRevealed(true), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return { revealed, revealNow: () => setRevealed(true) };
}

function SignUpForm() {
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState, trigger } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

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
      title="Create account"
      subtitle="Get to know your meals, track your workouts, and find what works for you. Your goals, your pace — all in one place."
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1.5">
          <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Already have an account?
          </Text>
          <Link href="/(auth)/sign-in">
            <Text variant="bodyStrong" style={{ color: colors.secondary }}>
              Sign in
            </Text>
          </Link>
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
                label="Email"
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
                placeholder="you@email.com"
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
                  label="Password"
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
                  placeholder="Create a password"
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
                  label="Confirm password"
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
                  placeholder="Confirm password"
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
          <View className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: '#FCECEE' }}>
            <Text variant="bodySmall" tone="error">
              {formError}
            </Text>
          </View>
        ) : null}

        <Button
          label="Create account"
          variant="secondary"
          size="lg"
          onPress={onSubmit}
          loading={formState.isSubmitting}
          disabled={!canSubmit}
        />
      </View>
    </AuthShell>
  );
}
