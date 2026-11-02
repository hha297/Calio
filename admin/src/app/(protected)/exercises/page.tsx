import Link from 'next/link';

import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArchivedToggle } from '@/components/ui/archived-toggle';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ExerciseListTable } from '@/features/exercises/exercise-list-table';
import { getDictionary } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 20;

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
    archived?: string;
  }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  const showArchived = params.archived === '1';
  const q = params.q ?? '';
  const type = params.type ?? '';

  let query = supabase
    .from('exercises')
    .select(
      'id, name, category, exercise_type, difficulty, equipment, is_system, archived_at, image_url, image_key, image_storage_path, slug, description, instructions',
      { count: 'exact' },
    )
    .eq('is_system', true)
    .order('name')
    .range(from, to);

  if (q.trim()) query = query.ilike('name', `%${q.trim()}%`);
  if (type) query = query.eq('exercise_type', type);
  if (showArchived) query = query.not('archived_at', 'is', null);
  else query = query.is('archived_at', null);

  const { data, count, error } = await query;
  const qs = (next: { page?: number; archived?: string }) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (type) sp.set('type', type);
    if (next.archived) sp.set('archived', next.archived);
    if (next.page && next.page > 1) sp.set('page', String(next.page));
    const value = sp.toString();
    return value ? `/exercises?${value}` : '/exercises';
  };

  return (
    <>
      <Topbar title={t.exercises.title} />
      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form className="flex flex-wrap items-center gap-2">
            <Input name="q" defaultValue={q} placeholder={t.common.search} className="w-56" />
            <Select name="type" defaultValue={type}>
              <option value="">All Types</option>
              <option value="strength">Strength</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cardio">Cardio</option>
              <option value="other">Other</option>
            </Select>
            <input type="hidden" name="archived" value={showArchived ? '1' : ''} />
            <Button type="submit" variant="secondary" size="sm">
              {t.common.filter}
            </Button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <ArchivedToggle
              showArchived={showArchived}
              activeHref={qs({ archived: '' })}
              archivedHref={qs({ archived: '1' })}
            />
            <Link href="/exercises/new">
              <Button size="sm">{t.exercises.create}</Button>
            </Link>
          </div>
        </div>

        {error ? (
          <Card className="text-sm text-error">{t.common.error}</Card>
        ) : !data?.length ? (
          <Card className="text-sm text-ash">{t.common.empty}</Card>
        ) : (
          <ExerciseListTable
            rows={data}
            labels={{ system: t.common.system, archived: t.common.archived }}
          />
        )}

        <div className="flex items-center justify-between text-sm text-mute">
          <span>
            {t.common.page.replace('{{page}}', String(page))} · {count ?? 0} total
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                className="cursor-pointer rounded-full border border-hairline bg-card px-3 py-1.5 font-medium"
                href={qs({ page: page - 1, archived: showArchived ? '1' : '' })}
              >
                {t.common.prev}
              </Link>
            ) : null}
            {(count ?? 0) > page * PAGE_SIZE ? (
              <Link
                className="cursor-pointer rounded-full border border-hairline bg-card px-3 py-1.5 font-medium"
                href={qs({ page: page + 1, archived: showArchived ? '1' : '' })}
              >
                {t.common.next}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
