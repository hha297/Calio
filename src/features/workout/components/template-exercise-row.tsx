import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import {
  EXERCISE_IMAGE_PLACEHOLDER,
  resolveExerciseImage,
} from '@/features/workout/catalog/exercise-images';
import type { WorkoutTemplateExercise } from '@/features/workout/types';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type TemplateExerciseRowProps = {
  exercise: WorkoutTemplateExercise;
  index?: number;
  showImage?: boolean;
  onPress?: () => void;
};

function formatPlan(
  exercise: WorkoutTemplateExercise,
  holdLabel: string,
  restLabel: (sec: number) => string,
): string {
  const parts: string[] = [];
  if (exercise.planned_sets != null) {
    if (exercise.planned_reps != null) {
      parts.push(`${exercise.planned_sets}×${exercise.planned_reps}`);
    } else {
      parts.push(`${exercise.planned_sets}×${holdLabel}`);
    }
  }
  if (exercise.planned_rest_sec != null && exercise.planned_rest_sec > 0) {
    parts.push(restLabel(exercise.planned_rest_sec));
  }
  return parts.join(' · ');
}

export function TemplateExerciseRow({
  exercise,
  index,
  showImage = true,
  onPress,
}: TemplateExerciseRowProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  const resolved = resolveExerciseImage({
    imageUrl: exercise.image_url,
    imageStoragePath: exercise.image_storage_path,
    imageKey: exercise.image_key,
    slug: exercise.slug,
    name: exercise.exercise_name,
  });
  const source = failed ? EXERCISE_IMAGE_PLACEHOLDER : resolved;
  const plan = formatPlan(
    exercise,
    t('workout.templateHold'),
    (sec) => t('workout.templateRestSec', { count: sec }),
  );
  const muscles = (exercise.primary_muscles ?? []).slice(0, 3);
  const muscleLabel = muscles
    .map((m) => t(`workout.muscle.${m}`, { defaultValue: m }))
    .join(' · ');

  const body = (
    <>
      {showImage ? (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radii.sm,
            overflow: 'hidden',
            backgroundColor: colors.surfaceMuted,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Image
            source={source}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            recyclingKey={exercise.id}
            transition={0}
            cachePolicy="memory-disk"
            onError={() => setFailed(true)}
          />
        </View>
      ) : null}
      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-start gap-2">
          {index != null ? (
            <View
              style={{
                minWidth: 22,
                height: 22,
                paddingHorizontal: 4,
                borderRadius: radii.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                marginTop: 1,
              }}
            >
              <Text variant="caption" tone="onPrimary" style={{ fontVariant: ['tabular-nums'] }}>
                {index + 1}
              </Text>
            </View>
          ) : null}
          <Text variant="bodyStrong" className="min-w-0 flex-1" numberOfLines={2}>
            {exercise.exercise_name}
          </Text>
        </View>
        {plan ? (
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {plan}
          </Text>
        ) : null}
        {muscleLabel ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {muscleLabel}
            {exercise.equipment ? ` · ${exercise.equipment}` : ''}
          </Text>
        ) : exercise.equipment ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {exercise.equipment}
          </Text>
        ) : null}
        {exercise.notes ? (
          <Text variant="caption" tone="muted" numberOfLines={2}>
            {exercise.notes}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={exercise.exercise_name}
        onPress={onPress}
        className="flex-row items-center gap-3"
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      className="flex-row items-center gap-3"
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {body}
    </View>
  );
}
