import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type DiarySubScreenHeaderProps = {
  title: string;
  onBack: () => void;
};

export function DiarySubScreenHeader({ title, onBack }: DiarySubScreenHeaderProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('diary.nav.backToDiary')}
        onPress={onBack}
        hitSlop={6}
        className="h-11 w-11 items-center justify-center"
        style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
      >
        <ChevronLeft size={22} color={colors.textPrimary} />
      </Pressable>
      <Text variant="headingLarge" className="flex-1" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
