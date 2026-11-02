import { Screen } from '@/components/ui/screen';
import { ProgressDashboard } from '@/features/progress/progress-dashboard';

export default function ProgressScreen() {
  return (
    <Screen scroll padForTabBar>
      <ProgressDashboard />
    </Screen>
  );
}
