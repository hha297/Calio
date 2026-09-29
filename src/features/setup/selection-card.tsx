import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type SelectionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function SelectionCard({
  label,
  description,
  selected,
  onPress,
  disabled,
}: SelectionCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      className="rounded-2xl border-2 px-4 py-3.5"
      style={{
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primaryMuted : colors.surface,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2"
          style={{
            borderColor: selected ? colors.primary : colors.borderStrong,
            backgroundColor: selected ? colors.primary : colors.surface,
          }}
        >
          {selected ? <Check size={12} color={colors.textOnPrimary} strokeWidth={3} /> : null}
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="bodyStrong">{label}</Text>
          {description ? (
            <Text variant="bodySmall" tone="secondary">
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
