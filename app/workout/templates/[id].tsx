import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { Text } from '@/components/ui/text';
import { TemplateExerciseRow } from '@/features/workout/components/template-exercise-row';
import {
  useTemplateExercises,
  useWorkoutTemplates,
} from '@/features/workout/hooks';
import { getTemplateCover } from '@/features/workout/template-assets';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { radii, withAlpha } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

export default function WorkoutTemplateDetailScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const templates = useWorkoutTemplates();
  const exercises = useTemplateExercises(id ?? null);
  const start = useActiveWorkoutStore((state) => state.start);

  const template = (templates.data ?? []).find((item) => item.id === id) ?? null;

  if (templates.isLoading || (id && exercises.isLoading && !exercises.data)) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (!template) {
    return (
      <Screen>
        <ErrorState
          title={t('workout.templatesError')}
          body={t('workout.retry')}
          onRetry={() => void templates.refetch()}
        />
      </Screen>
    );
  }

  const cover = getTemplateCover(template);
  const list = exercises.data ?? [];

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="headingLarge" numberOfLines={2}>
              {template.name}
            </Text>
            <Text variant="caption" tone="secondary">
              {template.is_system ? t('workout.systemTemplate') : t('workout.custom')}
              {list.length ? ` · ${t('workout.templateExerciseCount', { count: list.length })}` : ''}
            </Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="brand">
              {t('workout.close')}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            width: '100%',
            height: 180,
            borderRadius: radii.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surfaceMuted,
          }}
        >
          <Image
            source={cover}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: withAlpha('#000000', 0.42),
            }}
          >
            {template.description ? (
              <Text variant="bodySmall" style={{ color: '#FFFFFF' }} numberOfLines={3}>
                {template.description}
              </Text>
            ) : null}
          </View>
        </View>

        <Text variant="label" tone="secondary">
          {t('workout.templateExercises')}
        </Text>

        {exercises.error ? (
          <ErrorState
            title={t('workout.templatesError')}
            body={
              exercises.error instanceof Error ? exercises.error.message : t('workout.retry')
            }
            onRetry={() => void exercises.refetch()}
          />
        ) : null}

        {list.length === 0 && !exercises.isLoading ? (
          <Text variant="bodySmall" tone="muted">
            {t('workout.templateEmptyExercises')}
          </Text>
        ) : null}

        <View className="gap-2">
          {list.map((row) => (
            <TemplateExerciseRow key={row.id} exercise={row} showImage={false} />
          ))}
        </View>

        <Button
          label={t('workout.startTemplate')}
          disabled={!list.length || exercises.isLoading}
          onPress={() => {
            start({
              name: template.name,
              sourceTemplateId: template.id,
              exercises: list.map((row) => ({
                exerciseId: row.exercise_id,
                name: row.exercise_name,
                exerciseType: row.exercise_type,
                metValue: null,
                plannedSets: row.planned_sets,
                plannedReps: row.planned_reps,
              })),
            });
            router.push('/workout/active');
          }}
        />
      </View>
    </Screen>
  );
}
