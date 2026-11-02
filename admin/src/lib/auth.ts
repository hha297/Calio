import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export type AdminRole = 'user' | 'admin' | 'tester';

export type AdminSession = {
  userId: string;
  email: string | null;
  roles: AdminRole[];
  isAdmin: boolean;
  isTester: boolean;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRows } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const roles = (roleRows ?? []).map((row) => row.role as AdminRole);
  const isAdmin = roles.includes('admin');
  const isTester = roles.includes('tester') || isAdmin;

  return {
    userId: user.id,
    email: user.email ?? null,
    roles,
    isAdmin,
    isTester,
  };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect('/login');
  }
  if (!session.isAdmin) {
    redirect('/login?error=forbidden');
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('account_status')
    .eq('id', session.userId)
    .maybeSingle();

  if (profile?.account_status === 'suspended') {
    await supabase.auth.signOut();
    redirect('/login?error=suspended');
  }

  return session;
}
