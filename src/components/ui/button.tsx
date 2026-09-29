import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type PressableProps,
} from 'react-native';

import { fonts } from '@/theme/fonts';
import { typography } from '@/theme';
import { brand } from '@/theme/themes';
import { useThemeColors } from '@/theme/theme-provider';

/** @deprecated Use `text` — kept for existing call sites. */
type LegacyGhost = 'ghost';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | LegacyGhost;
type ButtonSize = 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style' | 'className'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** NativeWind: use raw Pressable so theme backgroundColor is not stripped. */
  cssInterop?: false;
};

type ResolvedVariant = 'primary' | 'secondary' | 'text';

function resolveVariant(variant: ButtonVariant): ResolvedVariant {
  if (variant === 'ghost') return 'text';
  return variant;
}

/**
 * Theme-driven buttons. NativeWind cssInterop is disabled on Pressable (see wrap-jsx).
 * Primary fill is painted on an inner View so green CTAs stay visible on all platforms.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const resolved = resolveVariant(variant);
  const isDisabled = Boolean(disabled || loading);
  const radius = size === 'lg' ? 16 : 8;

  const palette = (pressed: boolean) => {
    if (isDisabled) {
      return {
        backgroundColor: colors.buttonDisabledBackground,
        borderColor: colors.buttonDisabledBackground,
        borderWidth: resolved === 'secondary' ? 1 : 0,
        labelColor: colors.buttonDisabledText,
        spinnerColor: colors.buttonDisabledText,
      };
    }

    if (resolved === 'primary') {
      return {
        backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        borderColor: colors.primary,
        borderWidth: 0,
        labelColor: brand.darkBackground,
        spinnerColor: brand.darkBackground,
      };
    }

    if (resolved === 'secondary') {
      return {
        backgroundColor: pressed ? colors.primaryMuted : colors.surface,
        borderColor: colors.primary,
        borderWidth: 1,
        labelColor: colors.primary,
        spinnerColor: colors.primary,
      };
    }

    return {
      backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      labelColor: colors.primary,
      spinnerColor: colors.primary,
    };
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        {...props}
        cssInterop={false}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        style={[styles.base, size === 'lg' ? styles.lg : styles.md]}
      >
        {({ pressed }) => {
          const p = palette(pressed);
          return (
            <>
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: p.backgroundColor,
                    borderColor: p.borderColor,
                    borderWidth: p.borderWidth,
                    borderRadius: radius,
                  },
                ]}
              />
              {loading ? (
                <ActivityIndicator color={p.spinnerColor} />
              ) : (
                <RNText style={[styles.label, { color: p.labelColor }]}>{label}</RNText>
              )}
            </>
          );
        }}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
  },
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  md: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  lg: {
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.ibmSemiBold,
    fontSize: typography.button.size,
    lineHeight: typography.button.lineHeight,
    textAlign: 'center',
  },
});
