import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { LoadingState } from '@/components/ui/states';
import {
  WORKOUT_CATEGORY_IMAGES,
  WORKOUT_IMAGE_CATEGORIES,
} from '@/features/workout/category-assets';
import { formatElapsed, useWorkouts } from '@/features/workout/hooks';
import { radii, withAlpha } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export default function WorkoutHomeScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const workouts = useWorkouts();
  const active = useActiveWorkoutStore();

  const startEmpty = () => {
    active.start({ name: t('workout.defaultName') });
    router.push('/workout/active');
  };

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="headingLarge">{t('workout.startTitle')}</Text>
            <Text variant="bodySmall" tone="secondary">
              {t('workout.startSubtitle')}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('workout.close')}
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center"
            style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
          >
            <X size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {active.startedAt ? (
          <Button
            label={t('workout.resume')}
            onPress={() => router.push('/workout/active')}
          />
        ) : (
          <Button label={t('workout.startEmpty')} onPress={startEmpty} />
        )}

        <View className="gap-2">
          <Text variant="label" tone="secondary">
            {t('workout.categories')}
          </Text>
          <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
            {WORKOUT_IMAGE_CATEGORIES.map((item) => (
              <View key={item} style={{ width: '50%', padding: 6 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t(`workout.category.${item}`)}
                  onPress={() =>
                    router.push({
                      pathname: '/workout/exercises',
                      params: { category: item },
                    })
                  }
                  className="overflow-hidden"
                  style={{
                    height: 132,
                    borderRadius: radii.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {({ pressed }) => (
                    <>
                      <Image
                        source={WORKOUT_CATEGORY_IMAGES[item]}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          transform: [{ scale: pressed ? 1.04 : 1 }],
                        }}
                        resizeMode="cover"
                        accessibilityIgnoresInvertColors
                      />
                      <View
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          top: 0,
                          backgroundColor: withAlpha('#000000', pressed ? 0.42 : 0.32),
                        }}
                      />
                      <View
                        className="flex-1 justify-end gap-1 px-3 pt-8"
                        style={{ paddingBottom: 16 }}
                      >
                        <Text
                          variant="headingSmall"
                          numberOfLines={1}
                          style={{ color: '#FFFFFF' }}
                        >
                          {t(`workout.category.${item}`)}
                        </Text>
                        <Text
                          variant="caption"
                          numberOfLines={2}
                          style={{
                            color: withAlpha('#FFFFFF', 0.85),
                            fontSize: 11,
                            lineHeight: 14,
                          }}
                        >
                          {t(`workout.categorySubtitle.${item}`)}
                        </Text>
                      </View>
                    </>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text variant="label" tone="secondary">
              {t('workout.recent')}
            </Text>
            <Pressable onPress={() => router.push('/workout/exercises')}>
              <Text variant="caption" tone="brand">
                {t('workout.library')}
              </Text>
            </Pressable>
          </View>
          {workouts.isLoading ? <LoadingState /> : null}
          {(workouts.data?.length ?? 0) === 0 && !workouts.isLoading ? (
            <EmptyState title={t('workout.emptyHistory')} body={t('workout.emptyHistoryBody')} />
          ) : null}
          {(workouts.data ?? []).slice(0, 8).map((workout) => (
            <Pressable
              key={workout.id}
              onPress={() =>
                router.push({ pathname: '/workout/[id]', params: { id: workout.id } })
              }
            >
              <Card className="gap-1">
                <Text variant="bodyStrong">{workout.name}</Text>
                <Text variant="caption" tone="secondary">
                  {formatDistanceToNow(new Date(workout.started_at), { addSuffix: true })}
                  {workout.active_duration_sec
                    ? ` · ${formatElapsed(workout.active_duration_sec)}`
                    : ''}
                  {` · ~${Math.round(workout.estimated_calories)} ${t('workout.kcalEst')}`}
                </Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}
