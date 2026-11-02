import Link from 'next/link';

import { Topbar } from '@/components/layout/topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CreateUserButton } from '@/features/users/create-user-modal';
import { UserRowActions } from '@/features/users/row-actions';
import { getDictionary } from '@/i18n';
import { getPublicSupabaseEnv } from '@/lib/supabase/env';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const PAGE_SIZE = 20;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();
  const host = (() => {
    try {
      return new URL(getPublicSupabaseEnv().url).host;
    } catch {
      return 'unknown';
    }
  })();

  let query = supabase
    .from('profiles')
    .select('id, display_name, account_status, created_at, onboarding_completed_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.status) query = query.eq('account_status', params.status);

  const { data: profiles, count, error } = await query;

  const roleMap = new Map<string, string[]>();
  if (profiles?.length) {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in(
        'user_id',
        profiles.map((p) => p.id),
      );
    (roles ?? []).forEach((row) => {
      const list = roleMap.get(row.user_id) ?? [];
      list.push(row.role);
      roleMap.set(row.user_id, list);
    });
  }

  const emailMap = new Map<string, string>();
  try {
    const service = createServiceClient();
    const { data } = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
    for (const user of data.users ?? []) {
      if (user.email) emailMap.set(user.id, user.email);
    }
  } catch {
    try {
      const service = createServiceClient();
      for (const profile of profiles ?? []) {
        const { data } = await service.auth.admin.getUserById(profile.id);
        if (data.user?.email) emailMap.set(profile.id, data.user.email);
      }
    } catch {
      // emails optional
    }
  }

  const q = params.q?.trim().toLowerCase() ?? '';
  const filtered = (profiles ?? []).filter((profile) => {
    if (params.role === 'user') {
      if ((roleMap.get(profile.id) ?? []).some((r) => r === 'admin' || r === 'tester')) {
        return false;
      }
    } else if (params.role && !(roleMap.get(profile.id) ?? []).includes(params.role)) {
      return false;
    }
    if (!q) return true;
    const email = (emailMap.get(profile.id) ?? '').toLowerCase();
    const name = (profile.display_name ?? '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <>
      <Topbar title={t.users.title} description={`Supabase: ${host}`} />
      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form className="flex flex-wrap items-center gap-2">
            <Input
              name="q"
              defaultValue={params.q ?? ''}
              placeholder="Search name or email"
              className="w-64"
            />
            <Select name="role" defaultValue={params.role ?? ''}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="tester">Tester</option>
              <option value="user">User</option>
            </Select>
            <Select name="status" defaultValue={params.status ?? ''}>
              <option value="">All Status</option>
              <option value="active">{t.common.active}</option>
              <option value="suspended">{t.common.suspended}</option>
            </Select>
            <Button type="submit" variant="secondary" size="sm">
              {t.common.filter}
            </Button>
          </form>
          <CreateUserButton />
        </div>

        {error ? (
          <Card className="text-sm text-error">{t.common.error}</Card>
        ) : !filtered.length ? (
          <Card className="text-sm text-ash">{t.common.empty}</Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[28%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead className="bg-bone text-mute">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">{t.users.displayName}</th>
                  <th className="px-3 py-2.5 font-semibold">{t.users.email}</th>
                  <th className="px-3 py-2.5 font-semibold">{t.users.roles}</th>
                  <th className="px-3 py-2.5 font-semibold">{t.users.status}</th>
                  <th className="px-3 py-2.5 font-semibold">{t.users.created}</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const roles = roleMap.get(row.id) ?? ['user'];
                  return (
                    <tr key={row.id} className="border-t border-hairline">
                      <td className="px-3 py-2.5">
                        <Link
                          href={`/users/${row.id}`}
                          className="cursor-pointer font-semibold text-ink hover:text-primary-deep"
                        >
                          {row.display_name || '—'}
                        </Link>
                      </td>
                      <td className="truncate px-3 py-2.5 text-body">
                        {emailMap.get(row.id) ?? '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {roles.map((role) => (
                            <Badge key={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          className={
                            row.account_status === 'suspended'
                              ? 'border-error/30 bg-error/10 text-error'
                              : undefined
                          }
                        >
                          {row.account_status === 'suspended'
                            ? t.common.suspended
                            : t.common.active}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-body">
                        {row.created_at ? String(row.created_at).slice(0, 10) : '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <UserRowActions
                          user={{
                            id: row.id,
                            displayName: row.display_name,
                            email: emailMap.get(row.id) ?? null,
                            roles,
                            status: row.account_status,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
        <div className="text-sm text-mute">
          {t.common.page.replace('{{page}}', String(page))} · {count ?? 0}
        </div>
      </div>
    </>
  );
}
