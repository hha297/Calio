import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { setupCardShadow } from '@/features/setup/setup-shadows';
import { brand } from '@/theme/themes';
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
      cssInterop={false}
      style={[
        styles.card,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primaryMuted : colors.surface,
        },
        selected ? setupCardShadow(brand.darkBackground) : null,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.check,
            {
              borderColor: selected ? colors.primary : colors.borderStrong,
              backgroundColor: selected ? colors.primary : colors.surface,
            },
          ]}
        >
          {selected ? <Check size={12} color={colors.textOnPrimary} strokeWidth={3} /> : null}
        </View>
        <View style={styles.copy}>
          <Text variant="bodyStrong" style={{ color: colors.textPrimary }}>
            {label}
          </Text>
          {description ? (
            <Text variant="bodySmall" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  check: {
    marginTop: 2,
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
