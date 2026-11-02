import { addDays, formatISO, subDays } from 'date-fns';

import { createClient } from '@/lib/supabase/server';

export type DashboardRange = 7 | 30 | 90;

function dayKeys(range: DashboardRange, end = new Date()) {
  const endKey = formatISO(end, { representation: 'date' });
  const start = subDays(end, range - 1);
  const keys: string[] = [];
  for (let i = 0; i < range; i += 1) {
    keys.push(formatISO(addDays(start, i), { representation: 'date' }));
  }
  return { startKey: keys[0]!, endKey, keys };
}

async function headCount(
  build: (
    client: Awaited<ReturnType<typeof createClient>>,
  ) => PromiseLike<{ count: number | null; error: { message: string } | null }>,
): Promise<number | null> {
  const supabase = await createClient();
  const { count, error } = await build(supabase);
  if (error) return null;
  return count ?? 0;
}

export async function getDashboardMetrics(range: DashboardRange) {
  const supabase = await createClient();
  const { startKey, endKey } = dayKeys(range);
  const startIso = `${startKey}T00:00:00.000Z`;

  const [
    totalUsers,
    newUsers,
    workouts,
    foodEntries,
    systemExercises,
    systemFoods,
  ] = await Promise.all([
    headCount((client) =>
      client.from('profiles').select('*', { count: 'exact', head: true }),
    ),
    headCount((client) =>
      client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startIso),
    ),
    headCount((client) =>
      client.from('workouts').select('*', { count: 'exact', head: true }),
    ),
    headCount((client) =>
      client.from('food_entries').select('*', { count: 'exact', head: true }),
    ),
    headCount((client) =>
      client
        .from('exercises')
        .select('*', { count: 'exact', head: true })
        .eq('is_system', true)
        .is('archived_at', null),
    ),
    headCount((client) =>
      client
        .from('foods')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'system')
        .is('archived_at', null),
    ),
  ]);

  // Engagement proxies: distinct users with food or workout activity in window.
  const { data: foodActors } = await supabase
    .from('food_entries')
    .select('user_id')
    .gte('logged_on', startKey)
    .lte('logged_on', endKey)
    .limit(1000);

  const { data: workoutActors } = await supabase
    .from('workouts')
    .select('user_id')
    .gte('started_at', startIso)
    .limit(1000);

  const activeSet = new Set<string>();
  (foodActors ?? []).forEach((row) => activeSet.add(row.user_id));
  (workoutActors ?? []).forEach((row) => activeSet.add(row.user_id));

  // Registration trend by day (capped fetch)
  const { data: recentProfiles } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', startIso)
    .order('created_at', { ascending: true })
    .limit(1000);

  const registrationsByDay = new Map<string, number>();
  dayKeys(range).keys.forEach((key) => registrationsByDay.set(key, 0));
  (recentProfiles ?? []).forEach((row) => {
    const key = String(row.created_at).slice(0, 10);
    if (registrationsByDay.has(key)) {
      registrationsByDay.set(key, (registrationsByDay.get(key) ?? 0) + 1);
    }
  });

  const { data: recentFood } = await supabase
    .from('food_entries')
    .select('logged_on')
    .gte('logged_on', startKey)
    .lte('logged_on', endKey)
    .limit(1000);

  const foodByDay = new Map<string, number>();
  dayKeys(range).keys.forEach((key) => foodByDay.set(key, 0));
  (recentFood ?? []).forEach((row) => {
    const key = String(row.logged_on).slice(0, 10);
    if (foodByDay.has(key)) {
      foodByDay.set(key, (foodByDay.get(key) ?? 0) + 1);
    }
  });

  const { data: recentWorkouts } = await supabase
    .from('workouts')
    .select('started_at')
    .gte('started_at', startIso)
    .limit(1000);

  const workoutsByDay = new Map<string, number>();
  dayKeys(range).keys.forEach((key) => workoutsByDay.set(key, 0));
  (recentWorkouts ?? []).forEach((row) => {
    const key = String(row.started_at).slice(0, 10);
    if (workoutsByDay.has(key)) {
      workoutsByDay.set(key, (workoutsByDay.get(key) ?? 0) + 1);
    }
  });

  // Top exercises / foods from recent slices (not inventing history)
  const { data: workoutExerciseRows } = await supabase
    .from('workout_exercises')
    .select('exercise_name')
    .limit(1000);
  const exerciseCounts = new Map<string, number>();
  (workoutExerciseRows ?? []).forEach((row) => {
    const name = row.exercise_name || 'Unknown';
    exerciseCounts.set(name, (exerciseCounts.get(name) ?? 0) + 1);
  });
  const topExercises = [...exerciseCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const { data: foodNameRows } = await supabase
    .from('food_entries')
    .select('food_name')
    .gte('logged_on', startKey)
    .limit(1000);
  const foodCounts = new Map<string, number>();
  (foodNameRows ?? []).forEach((row) => {
    const name = row.food_name || 'Unknown';
    foodCounts.set(name, (foodCounts.get(name) ?? 0) + 1);
  });
  const topFoods = [...foodCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return {
    range,
    startKey,
    endKey,
    totalUsers,
    newUsers,
    activeLoggers: activeSet.size,
    workouts,
    foodEntries,
    systemExercises,
    systemFoods,
    registrationSeries: [...registrationsByDay.entries()].map(([date, value]) => ({
      date,
      value,
    })),
    foodSeries: [...foodByDay.entries()].map(([date, value]) => ({ date, value })),
    workoutSeries: [...workoutsByDay.entries()].map(([date, value]) => ({
      date,
      value,
    })),
    topExercises,
    topFoods,
    sessionDauAvailable: false as const,
  };
}
