import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { iconSizes, radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type SettingsRowProps = {
  icon?: LucideIcon;
  /** Emoji / flag / custom leading mark (used instead of `icon` when set). */
  leading?: ReactNode;
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  disabled?: boolean;
  /** String caption or custom node (e.g. selected checkmark, theme toggle). */
  trailing?: ReactNode;
};

export function SettingsRow({
  icon: Icon,
  leading,
  title,
  subtitle,
  onPress,
  destructive = false,
  showChevron = true,
  disabled = false,
  trailing,
}: SettingsRowProps) {
  const colors = useThemeColors();
  const titleColor = destructive ? colors.error : colors.textPrimary;

  const content = (
    <>
      {leading != null || Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
          {leading != null ? (
            leading
          ) : Icon ? (
            <Icon
              size={iconSizes.md}
              color={destructive ? colors.error : colors.primary}
              strokeWidth={2.2}
            />
          ) : null}
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text variant="bodyStrong" style={{ color: titleColor }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {typeof trailing === 'string' ? (
        <Text variant="caption" tone="secondary" numberOfLines={1} style={styles.trailing}>
          {trailing}
        </Text>
      ) : trailing != null ? (
        <View style={styles.trailingSlot}>{trailing}</View>
      ) : null}
      {showChevron && onPress ? (
        <ChevronRight size={iconSizes.md} color={colors.textMuted} strokeWidth={2} />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, disabled ? { opacity: 0.5 } : null]} accessibilityLabel={title}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      cssInterop={false}
      style={({ pressed }) => [
        styles.row,
        pressed ? { backgroundColor: colors.surfaceMuted } : null,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      {content}
    </Pressable>
  );
}

export function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <View style={styles.section}>
      {title ? (
        <Text variant="label" tone="secondary" style={styles.sectionTitle}>
          {title}
        </Text>
      ) : null}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing[2],
  },
  sectionTitle: {
    paddingHorizontal: spacing[1],
  },
  sectionCard: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: 56,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  trailing: {
    maxWidth: 96,
    textAlign: 'right',
  },
  trailingSlot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
