import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatWeight, type UnitSystem } from '@/features/setup/units';

import type { BodyCompositionResult } from '../navy-body-fat';

type NavyCompositionPreviewProps = {
  composition: BodyCompositionResult;
  units: UnitSystem;
  bmi: number | null;
};

const MISSING_KEY: Record<string, string> = {
  height: 'measurements.missing.height',
  neck: 'measurements.missing.neck',
  waist: 'measurements.missing.waist',
  hip: 'measurements.missing.hip',
  sex: 'measurements.missing.sex',
  weight: 'measurements.missing.weight',
};

export function NavyCompositionPreview({
  composition,
  units,
  bmi,
}: NavyCompositionPreviewProps) {
  const { t } = useTranslation();

  if (composition.ok) {
    return (
      <Card className="gap-2">
        <Text variant="headingSmall">{t('measurements.navyTitle')}</Text>
        <Text variant="bodySmall" tone="secondary">
          {t('measurements.navyEstimateLabel')}
        </Text>
        <Text variant="headingLarge" tone="brand">
          {t('measurements.bodyFatValue', { value: composition.bodyFatPercent.toFixed(1) })}
        </Text>
        <View className="gap-1">
          <Text variant="body">
            {t('measurements.fatMass', {
              value: formatWeight(composition.fatMassKg, units),
            })}
          </Text>
          <Text variant="body">
            {t('measurements.leanMass', {
              value: formatWeight(composition.leanMassKg, units),
            })}
          </Text>
          {composition.ffmi != null ? (
            <Text variant="body">{t('measurements.ffmi', { value: composition.ffmi.toFixed(1) })}</Text>
          ) : null}
          {bmi != null ? (
            <Text variant="bodySmall" tone="secondary">
              {t('measurements.bmiEstimate', { value: bmi })}
            </Text>
          ) : null}
        </View>
        <Text variant="caption" tone="secondary">
          {t('measurements.navyDisclaimer')}
        </Text>
      </Card>
    );
  }

  const missing = composition.missing ?? [];
  const missingLabels = missing
    .map((key) => {
      const i18nKey = MISSING_KEY[key];
      return i18nKey ? t(i18nKey) : key;
    })
    .filter(Boolean);

  return (
    <Card className="gap-2">
      <Text variant="headingSmall">{t('measurements.navyTitle')}</Text>
      <Text variant="bodySmall" tone="secondary">
        {t('measurements.navyNeedMore')}
      </Text>
      {missingLabels.length > 0 ? (
        <Text variant="bodySmall" tone="secondary">
          {t('measurements.navyMissingList', { fields: missingLabels.join(', ') })}
        </Text>
      ) : (
        <Text variant="bodySmall" tone="secondary">
          {t(`measurements.navyReason.${composition.reason}`, {
            defaultValue: t('measurements.navyUnavailable'),
          })}
        </Text>
      )}
      {bmi != null ? (
        <Text variant="bodySmall" tone="secondary">
          {t('measurements.bmiEstimate', { value: bmi })}
        </Text>
      ) : null}
    </Card>
  );
}
