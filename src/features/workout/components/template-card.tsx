import { Pressable, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import { getTemplateCover } from '@/features/workout/template-assets';
import type { WorkoutTemplate } from '@/features/workout/types';
import { radii, withAlpha } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type TemplateCardProps = {
  template: WorkoutTemplate;
  onPress: () => void;
  wide?: boolean;
};

export function TemplateCard({ template, onPress, wide = false }: TemplateCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const cover = getTemplateCover(template);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={template.name}
      onPress={onPress}
      className="overflow-hidden"
      style={{
        width: wide ? '100%' : undefined,
        height: wide ? 148 : 160,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceMuted,
      }}
    >
      {({ pressed }) => (
        <>
          <Image
            source={cover}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: [{ scale: pressed ? 1.04 : 1 }],
            }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: withAlpha('#000000', pressed ? 0.48 : 0.34),
            }}
          />
          <View className="flex-1 justify-end gap-1 px-3" style={{ paddingBottom: 14, paddingTop: 20 }}>
            <Text variant="caption" style={{ color: withAlpha('#FFFFFF', 0.85) }} numberOfLines={1}>
              {template.is_system ? t('workout.systemTemplate') : t('workout.custom')}
            </Text>
            <Text variant="headingSmall" style={{ color: '#FFFFFF' }} numberOfLines={2}>
              {template.name}
            </Text>
            {template.description ? (
              <Text
                variant="caption"
                style={{ color: withAlpha('#FFFFFF', 0.82) }}
                numberOfLines={2}
              >
                {template.description}
              </Text>
            ) : null}
          </View>
        </>
      )}
    </Pressable>
  );
}
