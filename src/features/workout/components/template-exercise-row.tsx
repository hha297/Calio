import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

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
  /** Hide thumbs when the template cover already fills the hero (avoids duplicate art). */
  showImage?: boolean;
};

export function TemplateExerciseRow({
  exercise,
  showImage = true,
}: TemplateExerciseRowProps) {
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
  const plan =
    exercise.planned_sets != null
      ? ` · ${exercise.planned_sets}×${exercise.planned_reps ?? '—'}`
      : '';

  return (
    <View className="flex-row items-center gap-3">
      {showImage ? (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radii.sm,
            overflow: 'hidden',
            backgroundColor: colors.surfaceMuted,
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
      <Text variant="caption" tone="secondary" className="min-w-0 flex-1" numberOfLines={2}>
        {exercise.exercise_name}
        {plan}
      </Text>
    </View>
  );
}
