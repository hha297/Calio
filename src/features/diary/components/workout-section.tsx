import { differenceInMinutes, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Dumbbell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { WorkoutListItem } from '@/features/workout/hooks';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type WorkoutSectionProps = {
  workouts: WorkoutListItem[];
  locale: string;
  onAdd: () => void;
};

export function WorkoutSection({ workouts, locale, onAdd }: WorkoutSectionProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const timeFmt = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' });

  const durationLabel = (workout: WorkoutListItem) => {
    if (workout.active_duration_sec != null && workout.active_duration_sec > 0) {
      return t('diary.workout.minutes', {
        value: Math.max(1, Math.round(workout.active_duration_sec / 60)),
      });
    }
    if (!workout.ended_at) return t('diary.workout.inProgress');
    const minutes = Math.max(
      0,
      differenceInMinutes(parseISO(workout.ended_at), parseISO(workout.started_at)),
    );
    return t('diary.workout.minutes', { value: minutes });
  };

  return (
    <Card className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text variant="headingSmall">{t('diary.workout.title')}</Text>
        <Dumbbell size={18} color={colors.textSecondary} />
      </View>

      {workouts.length === 0 ? (
        <View
          className="gap-3 px-3 py-4"
          style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
        >
          <Text variant="bodyStrong">{t('diary.workout.emptyTitle')}</Text>
          <Text variant="bodySmall" tone="secondary">
            {t('diary.workout.emptyBody')}
          </Text>
          <Button label={t('diary.workout.add')} onPress={onAdd} />
        </View>
      ) : (
        <>
          {workouts.map((workout) => (
            <Pressable
              key={workout.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/workout/[id]', params: { id: workout.id } })
              }
              className="flex-row items-center justify-between gap-3 px-3 py-3"
              style={{ backgroundColor: colors.surfaceMuted, borderRadius: radii.md }}
            >
              <View className="flex-1">
                <Text variant="bodyStrong" numberOfLines={1}>
                  {workout.name}
                </Text>
                <Text variant="caption" tone="secondary">
                  {durationLabel(workout)}
                  {' · '}
                  {timeFmt.format(parseISO(workout.started_at))}
                  {workout.estimated_calories > 0
                    ? ` · ${t('diary.workout.kcal', { value: Math.round(workout.estimated_calories) })}`
                    : ''}
                </Text>
              </View>
            </Pressable>
          ))}
          <Button label={t('diary.workout.add')} variant="secondary" onPress={onAdd} />
        </>
      )}
    </Card>
  );
}
