import { Screen } from '@/components/ui/screen';
import { WorkoutDashboard } from '@/features/workout/components/workout-dashboard';

/** Workout tab home — stays inside tabs so the floating dock remains visible. */
export default function WorkoutTabScreen() {
  return (
    <Screen scroll padForTabBar>
      <WorkoutDashboard />
    </Screen>
  );
}
