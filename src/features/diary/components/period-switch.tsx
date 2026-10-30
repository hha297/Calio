import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type Period = 'day' | 'week';

type PeriodSwitchProps = {
  value: Period;
  dayLabel: string;
  weekLabel: string;
  onChange: (value: Period) => void;
};

/** High-contrast Day / Week control — selected uses primary fill. */
export function PeriodSwitch({ value, dayLabel, weekLabel, onChange }: PeriodSwitchProps) {
  const colors = useThemeColors();
  const options: { value: Period; label: string }[] = [
    { value: 'day', label: dayLabel },
    { value: 'week', label: weekLabel },
  ];

  return (
    <View
      className="flex-row"
      style={{
        padding: 4,
        backgroundColor: colors.surfaceMuted,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
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
            style={{
              minHeight: 24,
              minWidth: 60,
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radii.pill,
              backgroundColor: selected ? colors.primary : 'transparent',
            }}
          >
            <Text
              variant="label"
              style={{
                color: selected ? colors.textOnPrimary : colors.textSecondary,
                fontSize: 14,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
