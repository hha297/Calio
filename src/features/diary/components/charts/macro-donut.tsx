import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/ui/text';

export type MacroDonutSegment = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type MacroDonutProps = {
  segments: MacroDonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel: string;
  emptyLabel: string;
  /** Gap between separate arc shapes, in degrees. */
  gapDegrees?: number;
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Open arc path (not a closed pie slice) — one Chrome-style color band. */
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const sweep = ((endDeg - startDeg) % 360 + 360) % 360;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function MacroDonut({
  segments,
  size = 128,
  strokeWidth = 12,
  centerLabel,
  emptyLabel,
  gapDegrees = 14,
}: MacroDonutProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const empty = total <= 0;

  const usableDegrees = Math.max(0, 360 - gapDegrees * segments.length);
  let cursor = 0;
  const arcs = segments.map((segment) => {
    const portion = empty ? 1 / Math.max(segments.length, 1) : Math.max(0, segment.value) / total;
    const sweep = usableDegrees * portion;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + gapDegrees;
    return {
      ...segment,
      start,
      end,
      dashed: empty || segment.value <= 0,
    };
  });

  return (
    <View className="items-center gap-3">
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          {arcs.map((arc) =>
            arc.end - arc.start > 0.5 ? (
              <Path
                key={arc.key}
                d={arcPath(cx, cy, radius, arc.start, arc.end)}
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={arc.dashed ? '5 7' : undefined}
                opacity={arc.dashed ? 0.55 : 1}
              />
            ) : null,
          )}
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center', paddingHorizontal: 10 }}>
          <Text variant="caption" tone="secondary" style={{ textAlign: 'center' }}>
            {empty ? emptyLabel : centerLabel}
          </Text>
        </View>
      </View>
      <View className="w-full gap-1.5">
        {segments.map((segment) => {
          const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <View key={segment.key} className="flex-row items-center justify-between gap-2">
              <View className="flex-1 flex-row items-center gap-2">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: segment.color,
                    opacity: segment.value <= 0 ? 0.45 : 1,
                  }}
                />
                <Text variant="caption" numberOfLines={1}>
                  {segment.label}
                </Text>
              </View>
              <Text variant="caption" tone="secondary">
                {Math.round(segment.value)} g · {pct}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
