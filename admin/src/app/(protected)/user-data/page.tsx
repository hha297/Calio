import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getDictionary } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

type FoodRow = {
  id: string;
  logged_on: string;
  meal_type: string | null;
  food_name: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};

type WorkoutRow = {
  id: string;
  name: string | null;
  started_at: string | null;
  ended_at: string | null;
  estimated_calories: number | null;
  status: string | null;
};

type MeasurementRow = {
  id: string;
  measured_on: string;
  weight_kg: number | null;
  body_fat_percent: number | null;
  waist_cm: number | null;
};

type GoalRow = {
  id: string;
  goal_type: string | null;
  daily_calorie_target: number | null;
  is_active: boolean | null;
  started_at: string | null;
};

type TemplateRow = {
  id: string;
  name: string | null;
  category: string | null;
  is_system: boolean | null;
  updated_at: string | null;
};

export default async function UserDataPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string; tab?: string; from?: string; to?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const userId = params.user?.trim() ?? '';
  const tab = params.tab ?? 'food';
  const supabase = await createClient();

  let foodLogs: FoodRow[] = [];
  let workouts: WorkoutRow[] = [];
  let measurements: MeasurementRow[] = [];
  let goals: GoalRow[] = [];
  let templates: TemplateRow[] = [];

  if (userId) {
    if (tab === 'food') {
      let q = supabase
        .from('food_entries')
        .select('id, logged_on, meal_type, food_name, calories, protein_g, carbs_g, fat_g')
        .eq('user_id', userId)
        .order('logged_on', { ascending: false })
        .limit(50);
      if (params.from) q = q.gte('logged_on', params.from);
      if (params.to) q = q.lte('logged_on', params.to);
      const { data } = await q;
      foodLogs = (data as FoodRow[] | null) ?? [];
    }
    if (tab === 'workouts') {
      const { data } = await supabase
        .from('workouts')
        .select('id, name, started_at, ended_at, estimated_calories, status')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(50);
      workouts = (data as WorkoutRow[] | null) ?? [];
    }
    if (tab === 'measurements') {
      const { data } = await supabase
        .from('body_measurements')
        .select('id, measured_on, weight_kg, body_fat_percent, waist_cm')
        .eq('user_id', userId)
        .order('measured_on', { ascending: false })
        .limit(50);
      measurements = (data as MeasurementRow[] | null) ?? [];
    }
    if (tab === 'goals') {
      const { data } = await supabase
        .from('goals')
        .select('id, goal_type, daily_calorie_target, is_active, started_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      goals = (data as GoalRow[] | null) ?? [];
    }
    if (tab === 'templates') {
      const { data } = await supabase
        .from('workout_templates')
        .select('id, name, category, is_system, updated_at')
        .eq('user_id', userId)
        .eq('is_system', false)
        .order('updated_at', { ascending: false })
        .limit(50);
      templates = (data as TemplateRow[] | null) ?? [];
    }
  }

  const tabs = [
    ['food', t.userData.foodLogs],
    ['workouts', t.userData.workouts],
    ['measurements', t.userData.measurements],
    ['goals', t.userData.goals],
    ['templates', t.userData.templates],
  ] as const;

  return (
    <>
      <Topbar title={t.userData.title} />
      <div className="space-y-4 p-6">
        <p className="text-sm text-[#646464]">{t.userData.readOnly}</p>
        <form className="flex flex-wrap gap-2">
          <Input name="user" defaultValue={userId} placeholder="User UUID" className="w-80" />
          <Input name="from" type="date" defaultValue={params.from ?? ''} />
          <Input name="to" type="date" defaultValue={params.to ?? ''} />
          <input type="hidden" name="tab" value={tab} />
          <Button type="submit" variant="secondary" size="sm">
            {t.common.filter}
          </Button>
        </form>

        {userId ? (
          <div className="flex flex-wrap gap-2">
            {tabs.map(([key, label]) => (
              <a
                key={key}
                href={`/user-data?user=${userId}&tab=${key}&from=${params.from ?? ''}&to=${params.to ?? ''}`}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  tab === key ? 'bg-[#00D95F] text-[#202020]' : 'border bg-white'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        ) : null}

        {!userId ? (
          <Card className="text-sm text-[#8d8d8d]">Enter a user id to inspect data.</Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            {tab === 'food' ? (
              <DataTable
                empty={!foodLogs.length}
                headers={['Date', 'Meal', 'Food', 'kcal', 'P', 'C', 'F']}
                rows={foodLogs.map((row) => [
                  row.logged_on,
                  row.meal_type ?? '—',
                  row.food_name ?? '—',
                  row.calories ?? '—',
                  row.protein_g ?? '—',
                  row.carbs_g ?? '—',
                  row.fat_g ?? '—',
                ])}
              />
            ) : null}
            {tab === 'workouts' ? (
              <DataTable
                empty={!workouts.length}
                headers={['Name', 'Started', 'Ended', 'kcal', 'Status']}
                rows={workouts.map((row) => [
                  row.name ?? '—',
                  row.started_at?.replace('T', ' ').slice(0, 16) ?? '—',
                  row.ended_at?.replace('T', ' ').slice(0, 16) ?? '—',
                  row.estimated_calories ?? '—',
                  row.status ?? '—',
                ])}
              />
            ) : null}
            {tab === 'measurements' ? (
              <DataTable
                empty={!measurements.length}
                headers={['Date', 'Weight kg', 'Body fat %', 'Waist cm']}
                rows={measurements.map((row) => [
                  row.measured_on,
                  row.weight_kg ?? '—',
                  row.body_fat_percent ?? '—',
                  row.waist_cm ?? '—',
                ])}
              />
            ) : null}
            {tab === 'goals' ? (
              <DataTable
                empty={!goals.length}
                headers={['Type', 'kcal', 'Active', 'Started']}
                rows={goals.map((row) => [
                  row.goal_type ?? '—',
                  row.daily_calorie_target ?? '—',
                  row.is_active ? 'yes' : 'no',
                  row.started_at?.slice(0, 10) ?? '—',
                ])}
              />
            ) : null}
            {tab === 'templates' ? (
              <DataTable
                empty={!templates.length}
                headers={['Name', 'Category', 'Updated']}
                rows={templates.map((row) => [
                  row.name ?? '—',
                  row.category ?? '—',
                  row.updated_at?.slice(0, 10) ?? '—',
                ])}
              />
            ) : null}
          </Card>
        )}
      </div>
    </>
  );
}

function DataTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: Array<Array<string | number>>;
  empty: boolean;
}) {
  if (empty) {
    return <p className="p-4 text-sm text-[#8d8d8d]">Nothing here yet.</p>;
  }
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-[#f3f0e8] text-[#646464]">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-3 font-medium">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="border-t border-[#e4e0d8]">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-3">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
