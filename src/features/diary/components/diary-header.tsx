import { CalendarDays, ChartNoAxesCombined } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type DiaryHeaderProps = {
  title: string;
  subtitle: string;
  onOpenStatistics: () => void;
  onOpenMonthly: () => void;
};

export function DiaryHeader({
  title,
  subtitle,
  onOpenStatistics,
  onOpenMonthly,
}: DiaryHeaderProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="min-w-0 flex-1 gap-1">
        <Text variant="headingLarge" numberOfLines={1}>
          {title}
        </Text>
        <Text
          variant="caption"
          tone="secondary"
          numberOfLines={1}
          style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
        >
          {subtitle}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <HeaderIconButton
          accessibilityLabel={t('diary.nav.openStatistics')}
          onPress={onOpenStatistics}
          backgroundColor={colors.surfaceMuted}
        >
          <ChartNoAxesCombined size={20} color={colors.textPrimary} strokeWidth={2} />
        </HeaderIconButton>
        <HeaderIconButton
          accessibilityLabel={t('diary.nav.openMonthly')}
          onPress={onOpenMonthly}
          backgroundColor={colors.surfaceMuted}
        >
          <CalendarDays size={20} color={colors.textPrimary} strokeWidth={2} />
        </HeaderIconButton>
      </View>
    </View>
  );
}

function HeaderIconButton({
  children,
  onPress,
  accessibilityLabel,
  backgroundColor,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  backgroundColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={4}
      className="h-11 w-11 items-center justify-center"
      style={{
        backgroundColor,
        borderRadius: radii.md,
      }}
    >
      {children}
    </Pressable>
  );
}
