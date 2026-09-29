import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';

import { Text } from './text';

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
};

export function CheckboxRow({ label, checked, onChange, hint }: CheckboxRowProps) {
  const colors = useThemeColors();
  const alignStart = Boolean(hint);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      cssInterop={false}
      hitSlop={4}
      style={[styles.row, alignStart ? styles.rowStart : styles.rowCenter]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? colors.primary : colors.borderStrong,
            backgroundColor: checked ? colors.primary : colors.surface,
          },
        ]}
      >
        {checked ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
      </View>
      <View style={[styles.labelWrap, alignStart && styles.labelWrapTop]}>
        <Text variant="bodySmall" tone="primary" numberOfLines={2} style={styles.label}>
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" tone="secondary">
            {hint}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  rowCenter: {
    alignItems: 'center',
  },
  rowStart: {
    alignItems: 'flex-start',
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flexShrink: 1,
    gap: 2,
    justifyContent: 'center',
  },
  labelWrapTop: {
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  label: {
    flexShrink: 1,
  },
});
