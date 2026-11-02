import Link from 'next/link';

import { Topbar } from '@/components/layout/topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getDictionary } from '@/i18n';
import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 20;

export default async function FoodsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; archived?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();

  let query = supabase
    .from('foods')
    .select('id, name, brand, barcode, source, is_public, calories, archived_at, image_url', {
      count: 'exact',
    })
    .or('source.eq.system,user_id.is.null')
    .order('name')
    .range(from, to);

  if (params.q?.trim()) {
    const q = params.q.trim();
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,barcode.ilike.%${q}%`);
  }
  if (params.archived === '1') query = query.not('archived_at', 'is', null);
  else query = query.is('archived_at', null);

  const { data, count, error } = await query;

  return (
    <>
      <Topbar title={t.foods.title} />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form className="flex flex-wrap gap-2">
            <Input name="q" defaultValue={params.q ?? ''} placeholder={t.common.search} className="w-72" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="archived" value="1" defaultChecked={params.archived === '1'} />
              {t.common.archived}
            </label>
            <Button type="submit" variant="secondary" size="sm">
              {t.common.filter}
            </Button>
          </form>
          <Link href="/foods/new">
            <Button size="sm">{t.foods.create}</Button>
          </Link>
        </div>
        {error ? (
          <Card className="text-sm text-[#d64545]">{t.common.error}</Card>
        ) : !data?.length ? (
          <Card className="text-sm text-[#8d8d8d]">{t.common.empty}</Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f3f0e8] text-[#646464]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Barcode</th>
                  <th className="px-4 py-3">kcal</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t border-[#e4e0d8]">
                    <td className="px-4 py-3">
                      <Link href={`/foods/${row.id}`} className="font-medium hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{row.brand ?? '—'}</td>
                    <td className="px-4 py-3">{row.barcode ?? '—'}</td>
                    <td className="px-4 py-3">{row.calories}</td>
                    <td className="px-4 py-3">
                      {row.archived_at ? (
                        <Badge className="bg-[#fce8e8]">{t.common.archived}</Badge>
                      ) : (
                        <Badge className="capitalize">{row.source}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        <div className="flex justify-between text-sm text-[#646464]">
          <span>
            {t.common.page.replace('{{page}}', String(page))} · {count ?? 0}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link className="rounded-lg border bg-white px-3 py-1.5" href={`/foods?page=${page - 1}`}>
                {t.common.prev}
              </Link>
            ) : null}
            {(count ?? 0) > page * PAGE_SIZE ? (
              <Link className="rounded-lg border bg-white px-3 py-1.5" href={`/foods?page=${page + 1}`}>
                {t.common.next}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
