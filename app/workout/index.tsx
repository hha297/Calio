import { Redirect } from 'expo-router';

/**
 * Legacy `/workout` entry now lands on the tab dashboard so Diary shortcuts
 * and deep links share one home with the bottom navigation visible.
 */
export default function WorkoutStackIndexRedirect() {
  return <Redirect href="/(tabs)/workout" />;
}
