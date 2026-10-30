import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useCreateCustomExercise } from '@/features/workout/hooks';
import type { ExerciseType } from '@/features/workout/types';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

const TYPES: ExerciseType[] = ['strength', 'bodyweight', 'cardio', 'other'];

export default function CreateCustomExerciseScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const create = useCreateCustomExercise();
  const addExercise = useActiveWorkoutStore((state) => state.addExercise);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Custom');
  const [type, setType] = useState<ExerciseType>('strength');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');

  async function onSave() {
    if (!name.trim()) {
      Alert.alert(t('workout.customRequired'));
      return;
    }
    try {
      const exercise = await create.mutateAsync({
        name: name.trim(),
        category: category.trim() || 'Other',
        exerciseType: type,
        equipment: equipment.trim() || null,
        description: description.trim() || null,
      });
      const hasActive = useActiveWorkoutStore.getState().startedAt;
      if (hasActive) {
        addExercise({
          exerciseId: exercise.id,
          name: exercise.name,
          exerciseType: exercise.exercise_type,
          metValue: exercise.met_value,
          primaryMuscles: exercise.primary_muscles,
        });
      }
      router.back();
    } catch (error) {
      Alert.alert(
        t('workout.saveFailed'),
        error instanceof Error ? error.message : t('workout.retry'),
      );
    }
  }

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="headingLarge">{t('workout.createCustom')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="secondary">
              {t('workout.close')}
            </Text>
          </Pressable>
        </View>

        <Input label={t('workout.exerciseName')} value={name} onChangeText={setName} />
        <Input label={t('workout.categoryLabel')} value={category} onChangeText={setCategory} />
        <Input
          label={t('workout.equipmentOptional')}
          value={equipment}
          onChangeText={setEquipment}
        />
        <Input
          label={t('workout.descriptionOptional')}
          value={description}
          onChangeText={setDescription}
        />

        <Text variant="label" tone="secondary">
          {t('workout.trackingType')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {TYPES.map((item) => {
            const selected = type === item;
            return (
              <Pressable
                key={item}
                onPress={() => setType(item)}
                className="px-3 py-2"
                style={{
                  borderRadius: radii.pill,
                  backgroundColor: selected ? colors.primaryMuted : colors.surfaceMuted,
                  borderWidth: selected ? 1.5 : 1,
                  borderColor: selected ? colors.primary : colors.border,
                }}
              >
                <Text variant="caption" tone={selected ? 'brand' : 'secondary'}>
                  {t(`workout.type.${item}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          label={t('workout.saveCustom')}
          onPress={() => {
            void onSave();
          }}
          loading={create.isPending}
          disabled={create.isPending}
        />
      </View>
    </Screen>
  );
}
