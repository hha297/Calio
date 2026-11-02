import { Pencil, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cmToIn, formatWeight, type UnitSystem } from '@/features/setup/units';
import { iconSizes, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { formatDiaryHeading } from '@/utils/date';

import type { BodyMeasurement } from '../hooks';

type MeasurementHistoryItemProps = {
  row: BodyMeasurement;
  units: UnitSystem;
  onEdit: (row: BodyMeasurement) => void;
  onDelete: (row: BodyMeasurement) => void;
};

function formatLength(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${(Math.round(cmToIn(cm) * 10) / 10).toFixed(1)} in`;
  }
  return `${(Math.round(cm * 10) / 10).toFixed(1)} cm`;
}

export function MeasurementHistoryItem({
  row,
  units,
  onEdit,
  onDelete,
}: MeasurementHistoryItemProps) {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();

  const metrics: string[] = [];
  if (row.weight_kg != null) {
    metrics.push(formatWeight(row.weight_kg, units));
  }
  if (row.body_fat_percent != null) {
    metrics.push(
      t('measurements.bodyFatValue', { value: Number(row.body_fat_percent).toFixed(1) }),
    );
  }
  if (row.waist_cm != null) {
    metrics.push(t('measurements.historyWaist', { value: formatLength(row.waist_cm, units) }));
  }
  if (row.composition_method === 'us_navy_v1') {
    metrics.push(t('measurements.methodNavyShort'));
  } else if (row.composition_method === 'manual' && row.body_fat_percent != null) {
    metrics.push(t('measurements.methodManualShort'));
  }

  return (
    <Card className="gap-2">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text variant="bodyStrong">{formatDiaryHeading(row.measured_on, i18n.language)}</Text>
          <Text variant="bodySmall" tone="secondary">
            {metrics.length > 0 ? metrics.join(' · ') : t('measurements.historyEmptyMetrics')}
          </Text>
        </View>
        <View className="flex-row items-center" style={{ gap: spacing[2] }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('measurements.edit')}
            hitSlop={8}
            onPress={() => onEdit(row)}
          >
            <Pencil size={iconSizes.sm} color={colors.textSecondary} strokeWidth={1.75} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('measurements.delete')}
            hitSlop={8}
            onPress={() => onDelete(row)}
          >
            <Trash2 size={iconSizes.sm} color={colors.error} strokeWidth={1.75} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
