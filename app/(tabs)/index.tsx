import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/states';
import type { MacroTotals } from '@/features/diary/balance';
import { DateStrip } from '@/features/diary/components/date-strip';
import { DiaryDayView } from '@/features/diary/components/diary-day-view';
import { DiaryHeader } from '@/features/diary/components/diary-header';
import { useDayWorkouts } from '@/features/diary/hooks';
import { useSelectedDiaryDate } from '@/features/diary/selected-date';
import {
  useDayFoodTotals,
  useDeleteFoodEntry,
  useFoodEntries,
} from '@/features/food/hooks';
import type { FoodEntry } from '@/features/food/types';
import { useActiveGoal, useProfile } from '@/features/goals/hooks';
import { useLatestWeight } from '@/features/measurements/hooks';
import { useDayWorkoutCalories, type WorkoutListItem } from '@/features/workout/hooks';
import { useAppLanguage } from '@/i18n';
import { parseDiaryDateKey, toDiaryDateKey } from '@/utils/date';

type DaySnapshot = {
  dateKey: string;
  entries: FoodEntry[];
  totals: MacroTotals;
  burned: number;
  workouts: WorkoutListItem[];
};

const emptyTotals: MacroTotals = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

export default function DiaryScreen() {
  const { t } = useTranslation();
  const locale = useAppLanguage();
  const params = useLocalSearchParams<{ date?: string }>();
  const todayKey = toDiaryDateKey();
  const [dateKey, setDateKey] = useSelectedDiaryDate();
  const hasShownDiary = useRef(false);
  const [snapshot, setSnapshot] = useState<DaySnapshot | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
        setDateKey(params.date);
      }
    }, [params.date, setDateKey]),
  );

  const goalQuery = useActiveGoal();
  const profileQuery = useProfile();
  const weightQuery = useLatestWeight();
  const foodQuery = useFoodEntries(dateKey);
  const totalsQuery = useDayFoodTotals(dateKey);
  const burnQuery = useDayWorkoutCalories(dateKey);
  const workoutsQuery = useDayWorkouts(dateKey);
  const deleteEntry = useDeleteFoodEntry();

  const foodReady = foodQuery.isSuccess || foodQuery.isError;
  const workoutsReady = workoutsQuery.isSuccess || workoutsQuery.isError;
  const burnReady = burnQuery.isSuccess || burnQuery.isError;

  useEffect(() => {
    if (!foodReady || !workoutsReady || !burnReady) return;
    setSnapshot({
      dateKey,
      entries: foodQuery.data ?? [],
      totals: totalsQuery.totals,
      burned: burnQuery.data ?? 0,
      workouts: workoutsQuery.data ?? [],
    });
  }, [
    dateKey,
    foodReady,
    workoutsReady,
    burnReady,
    foodQuery.data,
    totalsQuery.totals,
    burnQuery.data,
    workoutsQuery.data,
  ]);

  const subtitle = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(parseDiaryDateKey(dateKey));

  const bootLoading = snapshot == null && (foodQuery.isPending || goalQuery.isPending);
  if (snapshot != null) hasShownDiary.current = true;
  const showBlockingLoader = bootLoading && !hasShownDiary.current;

  const dayError =
    foodQuery.error ?? goalQuery.error ?? burnQuery.error ?? workoutsQuery.error;

  const viewDateKey = snapshot?.dateKey ?? dateKey;
  const viewEntries = snapshot?.entries ?? [];
  const viewTotals = snapshot?.totals ?? emptyTotals;
  const viewBurned = snapshot?.burned ?? 0;
  const viewWorkouts = snapshot?.workouts ?? [];
  const switching = snapshot != null && snapshot.dateKey !== dateKey;

  return (
    <Screen scroll slideFrom="left" padForTabBar>
      <View className="gap-4">
        <DiaryHeader
          title={t('diary.title')}
          subtitle={subtitle}
          onOpenStatistics={() =>
            router.push({ pathname: '/diary/statistics', params: { date: dateKey } })
          }
          onOpenMonthly={() =>
            router.push({ pathname: '/diary/monthly', params: { date: dateKey } })
          }
        />

        <DateStrip
          selectedKey={dateKey}
          todayKey={todayKey}
          locale={locale}
          onSelect={setDateKey}
        />

        {showBlockingLoader ? <LoadingState /> : null}
        {dayError && !showBlockingLoader && snapshot == null ? (
          <ErrorState
            title={t('diary.loadError')}
            body={dayError instanceof Error ? dayError.message : t('diary.stats.retry')}
            onRetry={() => {
              void foodQuery.refetch();
              void goalQuery.refetch();
              void burnQuery.refetch();
              void workoutsQuery.refetch();
            }}
          />
        ) : null}

        {!showBlockingLoader && (snapshot != null || !dayError) ? (
          <View style={{ opacity: switching ? 0.85 : 1 }}>
            <DiaryDayView
              dateKey={dateKey}
              todayKey={todayKey}
              locale={locale}
              goal={goalQuery.data}
              profile={profileQuery.data}
              weightKg={weightQuery.weightKg}
              entries={viewEntries}
              totals={viewTotals}
              burned={viewBurned}
              workouts={viewWorkouts}
              onDeleteEntry={(id) => {
                void deleteEntry.mutateAsync({ id, dateKey: viewDateKey });
              }}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
