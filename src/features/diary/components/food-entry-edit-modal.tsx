import { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { parsePositiveAmount, rescaleLoggedNutrition } from '@/features/food/scan-calculations';
import type { FoodEntry } from '@/features/food/types';
import { useThemeColors } from '@/theme/theme-provider';

type FoodEntryEditModalProps = {
  entry: FoodEntry | null;
  saving?: boolean;
  deleting?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSave: (input: {
    amount: number;
    amountUnit: 'g' | 'ml' | 'serving';
    servingLabel: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number | null;
    sugarsG: number | null;
    saturatedFatG: number | null;
    sodiumMg: number | null;
  }) => Promise<void>;
};

function fmt(value: number | null | undefined, digits = 0) {
  if (value == null || !Number.isFinite(value)) return '—';
  const rounded =
    digits === 0 ? Math.round(value) : Math.round(value * 10 ** digits) / 10 ** digits;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(digits);
}

export function FoodEntryEditModal({
  entry,
  saving = false,
  deleting = false,
  onClose,
  onDelete,
  onSave,
}: FoodEntryEditModalProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [boundEntryId, setBoundEntryId] = useState<string | null>(null);

  if (entry && entry.id !== boundEntryId) {
    setBoundEntryId(entry.id);
    setAmount(entry.amount != null ? String(entry.amount) : String(entry.quantity));
    setError(null);
  } else if (!entry && boundEntryId != null) {
    setBoundEntryId(null);
  }

  const amountUnit = entry?.amount_unit ?? 'serving';
  const previousAmount = entry?.amount ?? entry?.quantity ?? 1;
  const parsed = parsePositiveAmount(amount);

  const preview = useMemo(() => {
    if (!entry || !parsed) return null;
    try {
      return rescaleLoggedNutrition(
        {
          calories: entry.calories,
          proteinG: entry.protein_g,
          carbsG: entry.carbs_g,
          fatG: entry.fat_g,
          fiberG: entry.fiber_g ?? null,
          sugarsG: entry.sugars_g ?? null,
          saturatedFatG: entry.saturated_fat_g ?? null,
          sodiumMg: entry.sodium_mg ?? null,
        },
        previousAmount,
        parsed,
      );
    } catch {
      return null;
    }
  }, [entry, parsed, previousAmount]);

  const canSave = Boolean(entry && parsed && preview && !saving && !deleting);

  const save = async () => {
    if (!entry || !parsed || !preview) return;
    setError(null);
    const servingLabel =
      amountUnit === 'serving'
        ? `${parsed} × ${entry.serving_label.replace(/^\d+(?:[.,]\d+)?\s*[×x]\s*/i, '')}`
        : `${parsed} ${amountUnit}`;
    try {
      await onSave({
        amount: parsed,
        amountUnit,
        servingLabel,
        calories: preview.calories!,
        proteinG: preview.proteinG!,
        carbsG: preview.carbsG!,
        fatG: preview.fatG!,
        fiberG: preview.fiberG ?? null,
        sugarsG: preview.sugarsG ?? null,
        saturatedFatG: preview.saturatedFatG ?? null,
        sodiumMg: preview.sodiumMg ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('diary.meals.editFailed'));
    }
  };

  return (
    <Modal visible={Boolean(entry)} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <View className="flex-1 gap-4 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text variant="headingMedium">{t('diary.meals.editTitle')}</Text>
            <Pressable onPress={onClose}>
              <Text variant="bodyStrong" tone="secondary">
                {t('diary.meals.deleteCancel')}
              </Text>
            </Pressable>
          </View>

          {entry ? (
            <>
              <View className="gap-1">
                <Text variant="bodyStrong">{entry.food_name}</Text>
                {entry.brand ? (
                  <Text variant="caption" tone="secondary">
                    {entry.brand}
                  </Text>
                ) : null}
              </View>

              <Input
                label={`${t('diary.meals.amount')} (${amountUnit})`}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              {preview ? (
                <Text variant="bodySmall" tone="secondary">
                  {t('diary.meals.updatedNutrition')}:{' '}
                  <Text variant="bodyStrong" tone="brand">
                    {fmt(preview.calories)} kcal
                  </Text>
                  {` · ${t('diary.macros.protein')} ${fmt(preview.proteinG, 1)} · ${t('diary.macros.carbs')} ${fmt(preview.carbsG, 1)} · ${t('diary.macros.fat')} ${fmt(preview.fatG, 1)}`}
                </Text>
              ) : null}

              {error ? (
                <Text variant="bodySmall" tone="error">
                  {error}
                </Text>
              ) : null}

              <Button
                label={saving ? t('diary.meals.saving') : t('diary.meals.saveAmount')}
                disabled={!canSave}
                onPress={() => void save()}
              />

              {onDelete ? (
                <Button
                  label={t('diary.meals.deleteConfirm')}
                  variant="destructive"
                  disabled={saving || deleting}
                  onPress={onDelete}
                />
              ) : null}
            </>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
