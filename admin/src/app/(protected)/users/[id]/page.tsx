import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Topbar } from '@/components/layout/topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { setAccountStatus, setUserRole } from '@/features/users/actions';
import { getDictionary } from '@/i18n';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const t = getDictionary();
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (!profile) notFound();

  const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', id);
  const roleSet = new Set((roles ?? []).map((r) => r.role));
  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', id)
    .eq('is_active', true)
    .maybeSingle();

  let email: string | null = null;
  try {
    const service = createServiceClient();
    const { data } = await service.auth.admin.getUserById(id);
    email = data.user?.email ?? null;
  } catch {
    email = null;
  }

  return (
    <>
      <Topbar title={t.users.detail} />
      <div className="space-y-4 p-6">
        {query.saved ? <Card className="bg-[#D8F8E6] text-sm">Saved.</Card> : null}
        {query.error ? (
          <Card className="bg-[#fce8e8] text-sm text-[#d64545]">{t.common.error}</Card>
        ) : null}

        <Card className="space-y-2">
          <h2 className="text-lg font-semibold">{profile.display_name || '—'}</h2>
          <p className="text-sm text-[#646464]">{email ?? 'Email unavailable'}</p>
          <div className="flex flex-wrap gap-2">
            {[...roleSet].length
              ? [...roleSet].map((role) => (
                  <Badge key={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
                ))
              : <Badge>User</Badge>}
            <Badge
              className={profile.account_status === 'suspended' ? 'bg-[#fce8e8]' : undefined}
            >
              {profile.account_status === 'suspended' ? t.common.suspended : t.common.active}
            </Badge>
          </div>
          <p className="text-sm text-[#3a3a3a]">
            Registered {profile.created_at ? String(profile.created_at).slice(0, 10) : '—'} ·
            Onboarding{' '}
            {profile.onboarding_completed_at
              ? String(profile.onboarding_completed_at).slice(0, 10)
              : 'incomplete'}
          </p>
          {goal ? (
            <p className="text-sm text-[#3a3a3a]">
              Active goal: {goal.goal_type} · {goal.daily_calorie_target} kcal
            </p>
          ) : (
            <p className="text-sm text-[#8d8d8d]">No active goal</p>
          )}
          <Link href={`/user-data?user=${id}`} className="text-sm text-[#00B84F] hover:underline">
            View user data
          </Link>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold">Role actions</h3>
          {(
            [
              ['admin', roleSet.has('admin')],
              ['tester', roleSet.has('tester')],
            ] as const
          ).map(([role, has]) => (
            <form key={role} action={setUserRole} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="user_id" value={id} />
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="enabled" value={has ? '0' : '1'} />
              <input type="hidden" name="reason" value="admin.detail_action" />
              <Button type="submit" variant={has ? 'danger' : 'secondary'}>
                {role === 'admin'
                  ? has
                    ? t.users.demoteAdmin
                    : t.users.promoteAdmin
                  : has
                    ? t.users.revokeTester
                    : t.users.grantTester}
              </Button>
            </form>
          ))}
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold">Account status</h3>
          <form action={setAccountStatus} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="user_id" value={id} />
            <input
              type="hidden"
              name="status"
              value={profile.account_status === 'suspended' ? 'active' : 'suspended'}
            />
            <input type="hidden" name="reason" value="admin.detail_action" />
            <Button
              type="submit"
              variant={profile.account_status === 'suspended' ? 'secondary' : 'danger'}
            >
              {profile.account_status === 'suspended' ? t.users.restore : t.users.suspend}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
