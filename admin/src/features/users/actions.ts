'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function setUserRole(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get('user_id') ?? '');
  const role = String(formData.get('role') ?? '');
  const enabled = String(formData.get('enabled') ?? '') === '1';
  const reason = String(formData.get('reason') ?? '').trim();
  if (!userId || !role || !reason) redirect(`/users/${userId}?error=reason`);

  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_role', {
    p_user_id: userId,
    p_role: role,
    p_enabled: enabled,
    p_reason: reason,
  });
  if (error) redirect(`/users/${userId}?error=role`);
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
  redirect(`/users/${userId}?saved=1`);
}

export async function setAccountStatus(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get('user_id') ?? '');
  const status = String(formData.get('status') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  if (!userId || !status || !reason) redirect(`/users/${userId}?error=reason`);

  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_account_status', {
    p_user_id: userId,
    p_status: status,
    p_reason: reason,
  });
  if (error) redirect(`/users/${userId}?error=status`);
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
  redirect(`/users/${userId}?saved=1`);
}

export async function createUser(formData: FormData) {
  const session = await requireAdmin();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const displayName = String(formData.get('display_name') ?? '').trim();
  const reason = 'admin.create_user';
  const grantAdmin = formData.get('admin') === '1' || formData.get('admin') === 'on';
  const grantTester = formData.get('tester') === '1' || formData.get('tester') === 'on';

  if (!email || password.length < 8) {
    throw new Error('Email and password (8+) are required.');
  }

  const service = createServiceClient();
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: displayName ? { display_name: displayName } : undefined,
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? 'Unable to create user');
  }

  const userId = data.user.id;
  if (displayName) {
    await service.from('profiles').update({ display_name: displayName }).eq('id', userId);
  }

  const supabase = await createClient();
  if (grantAdmin) {
    const { error: roleError } = await supabase.rpc('admin_set_role', {
      p_user_id: userId,
      p_role: 'admin',
      p_enabled: true,
      p_reason: reason,
    });
    if (roleError) throw new Error(roleError.message);
  }
  if (grantTester) {
    const { error: roleError } = await supabase.rpc('admin_set_role', {
      p_user_id: userId,
      p_role: 'tester',
      p_enabled: true,
      p_reason: reason,
    });
    if (roleError) throw new Error(roleError.message);
  }

  await supabase.rpc('admin_write_audit', {
    p_action: 'user.create',
    p_target_type: 'auth.users',
    p_target_id: userId,
    p_reason: reason,
    p_before: null,
    p_after: {
      email,
      display_name: displayName || null,
      created_by: session.userId,
      admin: grantAdmin,
      tester: grantTester,
    },
  });

  revalidatePath('/users');
}

export async function updateUser(formData: FormData) {
  const session = await requireAdmin();
  const userId = String(formData.get('user_id') ?? '');
  const displayName = String(formData.get('display_name') ?? '').trim();
  const status = String(formData.get('status') ?? 'active');
  const reason = 'admin.update_user';
  const wantAdmin = formData.get('admin') === '1' || formData.get('admin') === 'on';
  const wantTester = formData.get('tester') === '1' || formData.get('tester') === 'on';

  if (!userId) throw new Error('User is required.');
  if (status !== 'active' && status !== 'suspended') {
    throw new Error('Invalid status');
  }

  const supabase = await createClient();
  const { data: roleRows } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  const current = new Set((roleRows ?? []).map((row) => row.role));

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ display_name: displayName || null })
    .eq('id', userId);
  if (profileError) throw new Error(profileError.message);

  const { data: profile } = await supabase
    .from('profiles')
    .select('account_status')
    .eq('id', userId)
    .maybeSingle();

  if (profile && profile.account_status !== status) {
    const { error } = await supabase.rpc('admin_set_account_status', {
      p_user_id: userId,
      p_status: status,
      p_reason: reason,
    });
    if (error) throw new Error(error.message);
  }

  if (wantAdmin !== current.has('admin')) {
    const { error } = await supabase.rpc('admin_set_role', {
      p_user_id: userId,
      p_role: 'admin',
      p_enabled: wantAdmin,
      p_reason: reason,
    });
    if (error) throw new Error(error.message);
  }
  if (wantTester !== current.has('tester')) {
    const { error } = await supabase.rpc('admin_set_role', {
      p_user_id: userId,
      p_role: 'tester',
      p_enabled: wantTester,
      p_reason: reason,
    });
    if (error) throw new Error(error.message);
  }

  await supabase.rpc('admin_write_audit', {
    p_action: 'user.update',
    p_target_type: 'profiles',
    p_target_id: userId,
    p_reason: reason,
    p_before: { roles: [...current], account_status: profile?.account_status },
    p_after: {
      display_name: displayName || null,
      status,
      admin: wantAdmin,
      tester: wantTester,
      actor: session.userId,
    },
  });

  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  const userId = String(formData.get('user_id') ?? '');
  const reason = 'admin.delete_user';
  if (!userId) throw new Error('User is required.');
  if (userId === session.userId) throw new Error('You cannot delete your own account.');

  const supabase = await createClient();
  const { data: targetRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin');
  if (targetRoles?.length) {
    const { count } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    if ((count ?? 0) <= 1) {
      throw new Error('Cannot delete the last admin.');
    }
  }

  const service = createServiceClient();
  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  // Actor may still write audit if session remains valid.
  await supabase.rpc('admin_write_audit', {
    p_action: 'user.delete',
    p_target_type: 'auth.users',
    p_target_id: userId,
    p_reason: reason,
    p_before: null,
    p_after: { deleted_by: session.userId },
  });

  revalidatePath('/users');
}
