import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/theme';
import { cx } from '@/utils/cx';

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
};

export function CheckboxRow({ label, checked, onChange, hint }: CheckboxRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      className="flex-row items-start gap-3"
      hitSlop={4}
    >
      <View
        className={cx(
          'mt-0.5 h-6 w-6 items-center justify-center rounded-md border-2',
          checked ? 'border-primary bg-primary' : 'border-borderStrong bg-surface',
        )}
      >
        {checked ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="bodyStrong">{label}</Text>
        {hint ? (
          <Text variant="caption" tone="secondary">
            {hint}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
