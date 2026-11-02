import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type MetricTileProps = {
  label: string;
  value: string;
  hint?: string | null;
};

/** Fixed two-column friendly tile — avoid NativeWind % min-widths that crush layouts. */
export function MetricTile({ label, value, hint }: MetricTileProps) {
  const colors = useThemeColors();
  return (
    <View style={[styles.tile, { backgroundColor: colors.surfaceMuted }]}>
      <Text variant="caption" tone="secondary" numberOfLines={2}>
        {label}
      </Text>
      <Text variant="metric" numberOfLines={1} style={styles.value}>
        {value}
      </Text>
      {hint ? (
        <Text variant="caption" tone="muted" numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function MetricTileRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text variant="bodySmall" tone="secondary" style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
      <Text variant="bodyStrong" style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: radii.md,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  statLabel: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  statValue: {
    flexShrink: 1,
    maxWidth: '52%',
    textAlign: 'right',
  },
});
