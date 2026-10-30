import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type MacroItem = {
  key: 'carbs' | 'protein' | 'fat';
  value: number;
  target: number;
  color: string;
};

type MacroProgressRowProps = {
  carbs: number;
  protein: number;
  fat: number;
  carbsTarget: number;
  proteinTarget: number;
  fatTarget: number;
};

export function MacroProgressRow({
  carbs,
  protein,
  fat,
  carbsTarget,
  proteinTarget,
  fatTarget,
}: MacroProgressRowProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const items: MacroItem[] = [
    { key: 'carbs', value: carbs, target: carbsTarget, color: colors.macroCarbs },
    { key: 'protein', value: protein, target: proteinTarget, color: colors.macroProtein },
    { key: 'fat', value: fat, target: fatTarget, color: colors.macroFat },
  ];

  return (
    <Card className="gap-3">
      <Text variant="label" tone="secondary">
        {t('diary.macros.title')}
      </Text>
      {items.map((item) => {
        const target = Math.max(0, item.target);
        const ratio = target > 0 ? Math.min(1, item.value / target) : 0;
        const remaining = target - item.value;
        let statusText: string;
        if (target <= 0) statusText = t('diary.macros.noTarget');
        else if (Math.abs(remaining) < 0.5) statusText = t('diary.macros.achieved');
        else if (remaining > 0) statusText = t('diary.macros.remaining', { value: Math.round(remaining) });
        else statusText = t('diary.macros.exceeded', { value: Math.round(Math.abs(remaining)) });

        return (
          <View key={item.key} className="gap-1">
            <View className="flex-row items-center justify-between">
              <Text variant="bodyStrong">{t(`diary.macros.${item.key}`)}</Text>
              <Text variant="caption" tone="secondary">
                {Math.round(item.value)} / {Math.round(target)} g
              </Text>
            </View>
            <View
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: colors.surfaceMuted }}
            >
              <View
                className="h-full rounded-full"
                style={{ width: `${ratio * 100}%`, backgroundColor: item.color }}
              />
            </View>
            <Text variant="caption" tone="secondary">
              {statusText}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}
