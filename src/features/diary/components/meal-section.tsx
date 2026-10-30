import { Plus } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { MEAL_IMAGES } from '@/features/diary/meal-assets';
import type { FoodEntry, MealType } from '@/features/food/types';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type MealSectionProps = {
  meal: MealType;
  entries: FoodEntry[];
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export function MealSection({ meal, entries, onAdd, onDelete }: MealSectionProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const mealCalories = Math.round(entries.reduce((sum, entry) => sum + entry.calories, 0));

  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-3">
        <Image
          source={MEAL_IMAGES[meal]}
          style={{ width: 44, height: 44, borderRadius: radii.sm }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <View className="flex-1">
          <Text variant="headingSmall">{t(`meals.${meal}`)}</Text>
          <Text variant="caption" tone="secondary">
            {t('diary.meals.kcal', { value: mealCalories })}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('diary.meals.add')}
          onPress={onAdd}
          className="h-10 w-10 items-center justify-center"
          style={{
            backgroundColor: colors.primary,
            borderRadius: radii.pill,
          }}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      {entries.length === 0 ? (
        <View
          className="items-start gap-2 px-3 py-3"
          style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
        >
          <Text variant="bodySmall" tone="muted">
            {t('diary.meals.empty')}
          </Text>
          <Pressable accessibilityRole="button" onPress={onAdd}>
            <Text variant="label" tone="brand">
              {t('diary.meals.add')}
            </Text>
          </Pressable>
        </View>
      ) : (
        entries.map((entry) => (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            accessibilityHint={t('diary.meals.deleteHint')}
            className="flex-row items-center justify-between px-3 py-3"
            style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
            onLongPress={() => onDelete(entry.id)}
          >
            <View className="flex-1 pr-3">
              <Text variant="bodyStrong" numberOfLines={1}>
                {entry.food_name}
              </Text>
              <Text variant="caption" tone="secondary" numberOfLines={1}>
                {entry.quantity} × {entry.serving_label}
                {entry.brand ? ` · ${entry.brand}` : ''}
              </Text>
            </View>
            <Text variant="bodyStrong" tone="brand">
              {Math.round(entry.calories)}
            </Text>
          </Pressable>
        ))
      )}
    </Card>
  );
}
