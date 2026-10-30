import { useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { MacroDonut } from '@/features/diary/components/charts/macro-donut';
import { ProgressRing } from '@/features/diary/components/charts/progress-ring';
import type { MacroTotals } from '@/features/diary/balance';
import { useThemeColors } from '@/theme/theme-provider';

type NutritionRingsProps = {
  macros: MacroTotals;
  calorieTarget: number;
  locale: string;
};

export function NutritionRings({ macros, calorieTarget, locale }: NutritionRingsProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const sideBySide = width >= 380;
  const ringSize = sideBySide ? 118 : 132;

  const calorieLabel = new Intl.NumberFormat(locale).format(Math.round(macros.calories));

  return (
    <Card className="gap-3">
      <Text variant="label" tone="secondary">
        {t('diary.rings.title')}
      </Text>
      <View className={sideBySide ? 'flex-row gap-4' : 'gap-5'}>
        <View className={sideBySide ? 'flex-1 items-center' : 'items-center'}>
          <Text variant="caption" tone="secondary" className="mb-2">
            {t('diary.rings.calorieRing')}
          </Text>
          <ProgressRing
            value={macros.calories}
            max={Math.max(1, calorieTarget)}
            size={ringSize}
            color={colors.macroCalories}
            centerPrimary={calorieLabel}
            centerSecondary={t('diary.rings.kcalConsumed')}
          />
        </View>
        <View className={sideBySide ? 'flex-1' : undefined}>
          <Text variant="caption" tone="secondary" className="mb-2 text-center">
            {t('diary.rings.macroRing')}
          </Text>
          <MacroDonut
            size={ringSize}
            centerLabel={t('diary.rings.consumedShare')}
            emptyLabel={t('diary.rings.emptyMacros')}
            segments={[
              {
                key: 'carbs',
                label: t('diary.macros.carbs'),
                value: macros.carbsG,
                color: colors.macroCarbs,
              },
              {
                key: 'protein',
                label: t('diary.macros.protein'),
                value: macros.proteinG,
                color: colors.macroProtein,
              },
              {
                key: 'fat',
                label: t('diary.macros.fat'),
                value: macros.fatG,
                color: colors.macroFat,
              },
            ]}
          />
        </View>
      </View>
    </Card>
  );
}
