import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  StyleSheet,
  View,
  type PressableProps,
} from 'react-native';

import { layout, radii, spacing } from '@/theme';
import { fonts } from '@/theme/fonts';
import { useThemeColors } from '@/theme/theme-provider';

/** @deprecated Use `text` — kept for existing call sites. */
type LegacyGhost = 'ghost';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive' | LegacyGhost;
type ButtonSize = 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style' | 'className'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** When false, button sizes to its label (header actions). Default true. */
  fullWidth?: boolean;
  iconStart?: (color: string) => ReactNode;
  iconEnd?: (color: string) => ReactNode;
  cssInterop?: false;
};

type ResolvedVariant = 'primary' | 'secondary' | 'text' | 'destructive';

function resolveVariant(variant: ButtonVariant): ResolvedVariant {
  if (variant === 'ghost') return 'text';
  return variant;
}

/**
 * Spotify-style pill buttons (DESIGN.MD). Primary = Calio green `#00D95F` on black label.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  disabled,
  iconStart,
  iconEnd,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const resolved = resolveVariant(variant);
  const isDisabled = Boolean(disabled || loading);
  const radius = radii.pill;
  const labelSize = size === 'lg' ? styles.labelLg : styles.labelMd;

  const palette = (pressed: boolean) => {
    if (isDisabled) {
      return {
        backgroundColor: colors.buttonDisabledBackground,
        borderColor: colors.buttonDisabledBackground,
        borderWidth: 0,
        labelColor: colors.buttonDisabledText,
        spinnerColor: colors.buttonDisabledText,
      };
    }

    if (resolved === 'primary') {
      return {
        backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        borderColor: colors.primary,
        borderWidth: 0,
        labelColor: colors.textOnPrimary,
        spinnerColor: colors.textOnPrimary,
      };
    }

    if (resolved === 'secondary') {
      return {
        backgroundColor: pressed ? colors.border : colors.surfaceMuted,
        borderColor: colors.border,
        borderWidth: 1,
        labelColor: colors.textPrimary,
        spinnerColor: colors.textPrimary,
      };
    }

    if (resolved === 'destructive') {
      return {
        backgroundColor: 'transparent',
        borderColor: colors.error,
        borderWidth: 1,
        labelColor: colors.error,
        spinnerColor: colors.error,
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
    <View style={[styles.wrap, fullWidth ? styles.wrapFull : styles.wrapInline]}>
      <Pressable
        {...props}
        cssInterop={false}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        style={[
          styles.base,
          fullWidth ? styles.baseFull : styles.baseInline,
          size === 'lg' ? styles.lg : styles.md,
        ]}
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
                <View style={styles.content}>
                  {iconStart?.(p.labelColor)}
                  <RNText
                    style={[
                      styles.label,
                      labelSize,
                      resolved === 'primary' || resolved === 'secondary'
                        ? styles.labelCased
                        : null,
                      { color: p.labelColor },
                    ]}
                  >
                    {label}
                  </RNText>
                  {iconEnd?.(p.labelColor)}
                </View>
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
    alignSelf: 'stretch',
  },
  wrapFull: {
    width: '100%',
  },
  wrapInline: {
    width: undefined,
    alignSelf: 'center',
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  baseFull: {
    width: '100%',
  },
  baseInline: {
    width: undefined,
    paddingHorizontal: spacing[3],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  md: {
    minHeight: layout.controlMinHeight,
    borderRadius: radii.pill,
    paddingHorizontal: spacing[5],
  },
  lg: {
    minHeight: 52,
    borderRadius: radii.pill,
    paddingHorizontal: spacing[6],
  },
  label: {
    fontFamily: fonts.ibmBold,
    textAlign: 'center',
  },
  labelMd: {
    fontSize: 15,
    lineHeight: 20,
  },
  labelLg: {
    fontSize: 16,
    lineHeight: 22,
  },
  labelCased: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
