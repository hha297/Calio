import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { colors } from '@/theme';
import { cx } from '@/utils/cx';

import { Text, type TextTone } from './text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const containerClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  ghost: 'border border-border bg-transparent',
};

const sizeClass: Record<ButtonSize, string> = {
  md: 'h-12 rounded-md px-4',
  lg: 'h-14 rounded-2xl px-5',
};

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'onPrimary',
  secondary: 'onSecondary',
  ghost: 'primary',
};

const pressedColor: Record<ButtonVariant, string> = {
  primary: colors.primaryPressed,
  secondary: colors.secondaryPressed,
  ghost: colors.surfaceMuted,
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: colors.textOnPrimary,
  secondary: colors.textOnSecondary,
  ghost: colors.primary,
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cx(
        'items-center justify-center',
        sizeClass[size],
        containerClass[variant],
        isDisabled && 'opacity-50',
      )}
      style={({ pressed }) =>
        pressed && !isDisabled ? { backgroundColor: pressedColor[variant] } : undefined
      }
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor[variant]} />
      ) : (
        <Text variant="button" tone={labelTone[variant]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
