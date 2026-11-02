import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useWorkoutDetail } from '@/features/workout/hooks';

export default function WorkoutSummaryScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    id?: string;
    estimated?: string;
    volume?: string;
    durationMin?: string;
    intensity?: string;
  }>();
  const detail = useWorkoutDetail(params.id ?? null);

  const estimated = Number(params.estimated ?? detail.data?.estimated_calories ?? 0);
  const durationMin = Number(
    params.durationMin ?? Math.round((detail.data?.active_duration_sec ?? 0) / 60) ?? 0,
  );
  const volume = Number(params.volume ?? 0);
  const intensity =
    params.intensity === 'light' ||
    params.intensity === 'moderate' ||
    params.intensity === 'vigorous'
      ? params.intensity
      : null;
  const exerciseCount = detail.data?.exercises.length ?? 0;
  const setCount =
    detail.data?.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0) ?? 0;

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <Text variant="headingLarge">{t('workout.summaryTitle')}</Text>
        <Text variant="bodySmall" tone="secondary">
          {t('workout.summarySubtitle')}
        </Text>

        <Card className="gap-2">
          <Text variant="headingSmall">{detail.data?.name ?? t('workout.defaultName')}</Text>
          <Text variant="label" tone="secondary">
            {t('workout.estimatedActiveCalories')}
          </Text>
          <Text variant="headingLarge" tone="brand">
            {t('workout.summaryCalories', { value: Math.round(estimated) })}
          </Text>
          <Text variant="caption" tone="secondary">
            {intensity
              ? t('workout.caloriesEstimateMetaIntensity', {
                  minutes: durationMin,
                  intensity: t(`workout.intensity.${intensity}`),
                })
              : t('workout.caloriesEstimateMeta', { minutes: durationMin })}
          </Text>
          <Text variant="caption" tone="muted">
            {t('workout.sessionCaloriesSumNote')}
          </Text>
          <Text variant="body">{t('workout.summaryDuration', { value: durationMin })}</Text>
          <Text variant="body">{t('workout.summaryVolume', { value: volume })}</Text>
          <Text variant="body">
            {t('workout.summaryCounts', { exercises: exerciseCount, sets: setCount })}
          </Text>
        </Card>

        {detail.data?.exercises?.length ? (
          <Card className="gap-2">
            <Text variant="label" tone="secondary">
              {t('workout.perExerciseCalories')}
            </Text>
            {detail.data.exercises.map((exercise) => (
              <View
                key={exercise.id}
                className="flex-row items-center justify-between gap-3"
              >
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {exercise.exercise_name}
                  </Text>
                  <Text variant="caption" tone="muted">
                    {exercise.estimate_method === 'allocated'
                      ? t('workout.estimateMethodAllocated')
                      : t('workout.estimateMethodDirect')}
                  </Text>
                </View>
                <Text variant="bodyStrong" tone="brand">
                  {t('workout.summaryCalories', {
                    value: Math.round(Number(exercise.estimated_calories ?? 0)),
                  })}
                </Text>
              </View>
            ))}
          </Card>
        ) : null}

        <Button
          label={t('workout.backToDiary')}
          onPress={() => router.replace('/')}
        />
        <Button
          label={t('workout.viewHistory')}
          variant="secondary"
          onPress={() => {
            if (params.id) {
              router.replace({ pathname: '/workout/[id]', params: { id: params.id } });
            } else {
              router.replace('/workout/history');
            }
          }}
        />
      </View>
    </Screen>
  );
}
