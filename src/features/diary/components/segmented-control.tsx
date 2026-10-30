import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type Option<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  compact?: boolean;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  compact = false,
}: SegmentedControlProps<T>) {
  const colors = useThemeColors();

  return (
    <View
      className="flex-row p-0.5"
      style={{
        backgroundColor: colors.surfaceMuted,
        borderRadius: radii.pill,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className="items-center justify-center"
            style={{
              paddingHorizontal: compact ? 10 : 12,
              paddingVertical: compact ? 6 : 8,
              minHeight: 32,
              borderRadius: radii.pill,
              backgroundColor: selected ? colors.surface : 'transparent',
            }}
          >
            <Text
              variant="caption"
              tone={selected ? 'brand' : 'secondary'}
              style={{ fontSize: compact ? 12 : 13 }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
