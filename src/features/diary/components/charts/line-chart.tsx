import { View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

export type LineSeries = {
  key: string;
  color: string;
  values: (number | null)[];
};

type LineChartProps = {
  labels: string[];
  series: LineSeries[];
  height?: number;
  emptyLabel: string;
};

export function LineChart({ labels, series, height = 148, emptyLabel }: LineChartProps) {
  const colors = useThemeColors();
  const width = Math.max(280, labels.length * 40);
  const padX = 12;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const allValues = series.flatMap((s) => s.values.filter((v): v is number => v != null));
  const max = Math.max(1, ...allValues);
  const hasData = allValues.length > 0;

  if (!hasData) {
    return (
      <View className="items-center justify-center py-8">
        <Text variant="bodySmall" tone="muted">
          {emptyLabel}
        </Text>
      </View>
    );
  }

  const xFor = (index: number) =>
    padX + (labels.length <= 1 ? chartW / 2 : (index / (labels.length - 1)) * chartW);
  const yFor = (value: number) => padY + chartH - (value / max) * chartH;

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {series.map((line) => {
          const points = line.values
            .map((value, index) => (value == null ? null : `${xFor(index)},${yFor(value)}`))
            .filter(Boolean)
            .join(' ');
          return (
            <Polyline
              key={line.key}
              points={points}
              fill="none"
              stroke={line.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
        {series.map((line) =>
          line.values.map((value, index) =>
            value == null ? null : (
              <Circle
                key={`${line.key}-${index}`}
                cx={xFor(index)}
                cy={yFor(value)}
                r={3}
                fill={line.color}
              />
            ),
          ),
        )}
      </Svg>
      <View className="flex-row justify-between px-1">
        {labels.map((label) => (
          <Text key={label} variant="caption" tone="secondary" style={{ fontSize: 10 }}>
            {label}
          </Text>
        ))}
      </View>
      <View className="mt-2 flex-row flex-wrap gap-3">
        {series.map((line) => (
          <View key={line.key} className="flex-row items-center gap-1.5">
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: line.color }}
            />
            <Text variant="caption" tone="secondary">
              {line.key}
            </Text>
          </View>
        ))}
      </View>
      {/* keep colors referenced for empty theme paths */}
      <View style={{ display: 'none', backgroundColor: colors.surface }} />
    </View>
  );
}
