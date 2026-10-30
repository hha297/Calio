import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { WORKOUT_IMAGE_CATEGORIES } from '@/features/workout/category-assets';
import { useCreateWorkoutTemplate } from '@/features/workout/hooks';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function CreateTemplateScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ category?: string }>();
  const create = useCreateWorkoutTemplate();
  const draftExercises = useActiveWorkoutStore((state) => state.exercises);
  const [name, setName] = useState('');
  const initialCategory = WORKOUT_IMAGE_CATEGORIES.includes(
    params.category as (typeof WORKOUT_IMAGE_CATEGORIES)[number],
  )
    ? (params.category as string)
    : 'Strength';
  const [category, setCategory] = useState(initialCategory);
  const [description, setDescription] = useState('');

  async function onSave() {
    if (!name.trim()) {
      Alert.alert(t('workout.templateNameRequired'));
      return;
    }
    if (draftExercises.length === 0) {
      Alert.alert(t('workout.templateNeedsExercises'));
      return;
    }
    try {
      await create.mutateAsync({
        name: name.trim(),
        category,
        description: description.trim() || null,
        exercises: draftExercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.name,
          exerciseType: exercise.exerciseType,
          plannedSets: exercise.sets.length,
          plannedReps: exercise.sets[0]?.reps ? Number(exercise.sets[0].reps) : null,
        })),
      });
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
          <Text variant="headingLarge">{t('workout.createTemplate')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="secondary">
              {t('workout.close')}
            </Text>
          </Pressable>
        </View>

        <Text variant="caption" tone="secondary">
          {t('workout.createTemplateHint')}
        </Text>

        <Input label={t('workout.templateName')} value={name} onChangeText={setName} />
        <Input
          label={t('workout.descriptionOptional')}
          value={description}
          onChangeText={setDescription}
        />

        <Text variant="label" tone="secondary">
          {t('workout.categories')}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {WORKOUT_IMAGE_CATEGORIES.map((item) => {
            const selected = category === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                className="px-3 py-2"
                style={{
                  borderRadius: radii.pill,
                  backgroundColor: selected ? colors.primaryMuted : colors.surfaceMuted,
                  borderWidth: selected ? 1.5 : 1,
                  borderColor: selected ? colors.primary : colors.border,
                }}
              >
                <Text variant="caption" tone={selected ? 'brand' : 'secondary'}>
                  {t(`workout.category.${item}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text variant="bodySmall" tone="secondary">
          {t('workout.templateExerciseCount', { count: draftExercises.length })}
        </Text>
        <Button
          label={t('workout.addExercise')}
          variant="secondary"
          onPress={() => {
            if (!useActiveWorkoutStore.getState().startedAt) {
              useActiveWorkoutStore.getState().start({ name: name || t('workout.defaultName') });
            }
            router.push('/workout/exercises');
          }}
        />

        <Button
          label={t('workout.saveTemplate')}
          onPress={() => {
            void onSave();
          }}
          loading={create.isPending}
        />
      </View>
    </Screen>
  );
}
