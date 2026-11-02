'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function updateFeatureFlag(formData: FormData) {
  const session = await requireAdmin();
  const key = String(formData.get('key') ?? '');
  const enabled = formData.get('enabled') === 'on';
  const testerOnly = formData.get('tester_only') === 'on';
  if (!key) redirect('/system/flags?error=1');

  const supabase = await createClient();
  const { error } = await supabase
    .from('feature_flags')
    .update({
      enabled,
      tester_only: testerOnly,
      updated_by: session.userId,
    })
    .eq('key', key);
  if (error) redirect('/system/flags?error=1');

  await supabase.rpc('admin_write_audit', {
    p_action: 'feature_flag.update',
    p_target_type: 'feature_flags',
    p_target_id: key,
    p_reason: null,
    p_before: null,
    p_after: { enabled, tester_only: testerOnly },
  });

  revalidatePath('/system/flags');
  redirect('/system/flags?saved=1');
}
