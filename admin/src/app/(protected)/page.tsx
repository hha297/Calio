import Link from 'next/link';

import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { RankBars, TrendLine } from '@/features/dashboard/charts';
import {
  getDashboardMetrics,
  type DashboardRange,
} from '@/features/dashboard/queries';
import { getDictionary } from '@/i18n';
import { cn, formatNumber } from '@/lib/utils';

function MetricCard({
  label,
  value,
  note,
  emphasize,
}: {
  label: string;
  value: number | null;
  note?: string;
  emphasize?: boolean;
}) {
  return (
    <Card className={cn(emphasize && 'bg-bone')}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash">
        {label}
      </div>
      <div
        className={cn(
          'mt-3 font-mono-metric text-3xl font-bold tracking-tight text-ink',
          value == null && 'text-ash',
        )}
      >
        {value == null ? '—' : formatNumber(value)}
      </div>
      {note ? <p className="mt-2 text-xs leading-relaxed text-mute">{note}</p> : null}
    </Card>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const range = ([7, 30, 90].includes(Number(params.range))
    ? Number(params.range)
    : 30) as DashboardRange;
  const metrics = await getDashboardMetrics(range);
  const sparseActivity =
    (metrics.foodEntries ?? 0) === 0 && (metrics.workouts ?? 0) === 0;

  return (
    <>
      <Topbar title={t.dashboard.title} description={t.dashboard.subtitle} />
      <div className="space-y-8 p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-2xl text-sm leading-relaxed text-mute">
            {t.dashboard.engagementNote}
          </p>
          <div className="flex gap-2 rounded-full border border-hairline bg-card p-1">
            {[7, 30, 90].map((value) => (
              <Link
                key={value}
                href={`/?range=${value}`}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
                  range === value
                    ? 'bg-primary text-ink'
                    : 'text-body hover:bg-bone',
                )}
              >
                {value === 7
                  ? t.dashboard.range7
                  : value === 30
                    ? t.dashboard.range30
                    : t.dashboard.range90}
              </Link>
            ))}
          </div>
        </div>

        {sparseActivity ? (
          <Card className="border-dashed bg-bone/70">
            <p className="font-display text-xl font-bold text-ink">
              Live Supabase data — sparse local activity
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mute">
              Catalog counts come from <code className="font-mono-metric text-xs">exercises</code>{' '}
              / <code className="font-mono-metric text-xs">foods</code>. Charts stay empty until
              users create food logs or workouts. Mobile exercise library also reads Supabase
              (not the bundled JSON seed).
            </p>
          </Card>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label={t.dashboard.totalUsers} value={metrics.totalUsers} emphasize />
          <MetricCard label={t.dashboard.newUsers} value={metrics.newUsers} />
          <MetricCard
            label={t.dashboard.dau}
            value={metrics.activeLoggers}
            note="Distinct users with food or workout rows (engagement proxy)"
          />
          <MetricCard label={t.dashboard.workouts} value={metrics.workouts} />
          <MetricCard label={t.dashboard.foodEntries} value={metrics.foodEntries} />
          <MetricCard
            label={t.dashboard.systemExercises}
            value={metrics.systemExercises}
            note="From public.exercises where is_system"
          />
          <MetricCard
            label={t.dashboard.systemFoods}
            value={metrics.systemFoods}
            note="From public.foods where source = system"
          />
          <MetricCard
            label="Session WAU / MAU"
            value={null}
            note="Unavailable until an activity signal exists"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-lg font-bold text-ink">
              {t.dashboard.registrations}
            </h2>
            <div className="mt-4">
              <TrendLine data={metrics.registrationSeries} />
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-bold text-ink">
              {t.dashboard.activity}
            </h2>
            <div className="mt-4">
              <TrendLine data={metrics.foodSeries} color="#3b82f6" />
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-bold text-ink">
              {t.dashboard.topExercises}
            </h2>
            <div className="mt-4">
              <RankBars data={metrics.topExercises} />
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-bold text-ink">
              {t.dashboard.topFoods}
            </h2>
            <div className="mt-4">
              <RankBars data={metrics.topFoods} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
