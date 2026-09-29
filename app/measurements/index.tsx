import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useProfile } from '@/features/goals/hooks';
import {
  calculateBmi,
  useAddBodyMeasurement,
  useBodyMeasurements,
} from '@/features/measurements/hooks';
import { toDiaryDateKey } from '@/utils/date';

export default function MeasurementsScreen() {
  const profile = useProfile();
  const history = useBodyMeasurements();
  const add = useAddBodyMeasurement();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [error, setError] = useState<string | null>(null);
  const bmi =
    weight && profile.data?.height_cm
      ? calculateBmi(Number(weight), Number(profile.data.height_cm))
      : null;

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">Measurements</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="primary">
              Close
            </Text>
          </Pressable>
        </View>
        <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
        <Input label="Body fat % (optional)" value={bodyFat} onChangeText={setBodyFat} keyboardType="decimal-pad" />
        <Input label="Waist cm (optional)" value={waist} onChangeText={setWaist} keyboardType="decimal-pad" />
        {bmi != null ? (
          <Text variant="bodySmall" tone="secondary">
            BMI estimate with saved height: {bmi}
          </Text>
        ) : null}
        {error ? (
          <Text variant="bodySmall" tone="error">
            {error}
          </Text>
        ) : null}
        <Button
          label="Save measurement"
          loading={add.isPending}
          onPress={() => {
            setError(null);
            void add
              .mutateAsync({
                measuredOn: toDiaryDateKey(),
                weightKg: weight ? Number(weight) : undefined,
                bodyFatPercent: bodyFat ? Number(bodyFat) : undefined,
                waistCm: waist ? Number(waist) : undefined,
              })
              .then(() => {
                setWeight('');
                setBodyFat('');
                setWaist('');
                void history.refetch();
              })
              .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Could not save.');
              });
          }}
        />
        <Text variant="headingSmall">History</Text>
        {(history.data ?? []).map((row) => (
          <View key={row.id} className="flex-row justify-between border-b border-border py-3">
            <Text variant="body">{row.measured_on}</Text>
            <Text variant="bodyStrong">
              {row.weight_kg != null ? `${row.weight_kg} kg` : '—'}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
