import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import type { DailyBalance } from '@/features/diary/balance';
import { useThemeColors } from '@/theme/theme-provider';

type CalorieBalanceCardProps = {
  balance: DailyBalance;
  locale: string;
};

function formatKcal(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Math.round(value));
}

export function CalorieBalanceCard({ balance, locale }: CalorieBalanceCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const over = balance.remaining < 0;
  const headline = over
    ? t('diary.balance.exceededBy', { value: formatKcal(Math.abs(balance.remaining), locale) })
    : t('diary.balance.remaining', { value: formatKcal(balance.remaining, locale) });

  return (
    <Card className="gap-3">
      <Text variant="label" tone="secondary">
        {t('diary.balance.title')}
      </Text>
      <Text variant="display" tone={over ? 'error' : 'brand'} numberOfLines={2}>
        {headline}
      </Text>
      <Text variant="bodySmall" tone="secondary">
        {t('diary.balance.activityNote')}
      </Text>
      <View className="flex-row justify-between gap-2">
        <Metric label={t('diary.balance.consumed')} value={formatKcal(balance.consumed, locale)} />
        <Metric label={t('diary.balance.activity')} value={formatKcal(balance.burned, locale)} />
        <Metric label={t('diary.balance.target')} value={formatKcal(balance.target, locale)} />
      </View>
      <ProgressBar
        label={t('diary.balance.progress')}
        value={balance.consumed}
        max={Math.max(1, balance.target)}
        color={colors.macroCalories}
      />
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-0.5">
      <Text variant="metric">{value}</Text>
      <Text variant="caption" tone="secondary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
