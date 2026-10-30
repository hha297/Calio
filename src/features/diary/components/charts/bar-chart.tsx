import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

export type BarChartItem = {
  key: string;
  label: string;
  value: number | null;
  muted?: boolean;
};

type BarChartProps = {
  items: BarChartItem[];
  target?: number | null;
  height?: number;
  formatValue?: (value: number) => string;
  emptyLabel: string;
};

export function BarChart({
  items,
  target,
  height = 140,
  formatValue = (v) => String(Math.round(v)),
  emptyLabel,
}: BarChartProps) {
  const colors = useThemeColors();
  const numeric = items.map((i) => i.value ?? 0);
  const max = Math.max(1, ...(target != null ? [target, ...numeric] : numeric));
  const hasAny = items.some((i) => i.value != null && i.value > 0);

  if (!hasAny) {
    return (
      <View className="items-center justify-center py-8">
        <Text variant="bodySmall" tone="muted">
          {emptyLabel}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ height }} className="flex-row items-end gap-1.5">
      {items.map((item) => {
        const value = item.value ?? 0;
        const barH = Math.max(4, (value / max) * (height - 28));
        return (
          <View key={item.key} className="flex-1 items-center justify-end gap-1">
            {item.value != null ? (
              <Text variant="caption" tone="secondary" numberOfLines={1} style={{ fontSize: 10 }}>
                {formatValue(item.value)}
              </Text>
            ) : (
              <View style={{ height: 12 }} />
            )}
            <View
              style={{
                width: '100%',
                height: barH,
                borderRadius: 6,
                backgroundColor: item.muted ? colors.surfaceMuted : colors.primary,
                opacity: item.value == null ? 0.35 : 1,
              }}
            />
            <Text variant="caption" tone="secondary" numberOfLines={1} style={{ fontSize: 10 }}>
              {item.label}
            </Text>
          </View>
        );
      })}
      {target != null && target > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 22 + (target / max) * (height - 28),
            borderTopWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.borderStrong ?? colors.border,
          }}
        />
      ) : null}
    </View>
  );
}
