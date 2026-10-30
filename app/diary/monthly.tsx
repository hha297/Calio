import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/screen';
import { DiarySubScreenHeader } from '@/features/diary/components/diary-sub-screen-header';
import { MonthlyView } from '@/features/diary/components/monthly-view';
import { useSelectedDiaryDate } from '@/features/diary/selected-date';
import { useActiveGoal } from '@/features/goals/hooks';
import { useAppLanguage } from '@/i18n';
import { toDiaryDateKey } from '@/utils/date';

export default function DiaryMonthlyScreen() {
  const { t } = useTranslation();
  const locale = useAppLanguage();
  const params = useLocalSearchParams<{ date?: string }>();
  const [dateKey, setDateKey] = useSelectedDiaryDate();
  const goalQuery = useActiveGoal();
  const todayKey = toDiaryDateKey();

  useEffect(() => {
    if (params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
      setDateKey(params.date);
    }
  }, [params.date, setDateKey]);

  return (
    <Screen scroll padForTabBar>
      <View className="gap-4">
        <DiarySubScreenHeader
          title={t('diary.nav.monthly')}
          onBack={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
        />
        <MonthlyView
          dateKey={dateKey}
          todayKey={todayKey}
          locale={locale}
          goal={goalQuery.data}
          onSelectDate={setDateKey}
          onOpenDiary={(key) => {
            setDateKey(key);
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
        />
      </View>
    </Screen>
  );
}
