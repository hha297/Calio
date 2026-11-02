'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const foodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(160),
  brand: z.string().trim().max(120).optional().nullable(),
  barcode: z.string().trim().max(64).optional().nullable(),
  serving_label: z.string().trim().min(1).max(80),
  serving_grams: z.coerce.number().min(0).optional().nullable(),
  calories: z.coerce.number().min(0),
  protein_g: z.coerce.number().min(0),
  carbs_g: z.coerce.number().min(0),
  fat_g: z.coerce.number().min(0),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  is_public: z.coerce.boolean().optional(),
});

export async function saveFood(formData: FormData) {
  await requireAdmin();
  const parsed = foodSchema.safeParse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    brand: formData.get('brand') || null,
    barcode: formData.get('barcode') || null,
    serving_label: formData.get('serving_label') || 'serving',
    serving_grams: formData.get('serving_grams') || null,
    calories: formData.get('calories'),
    protein_g: formData.get('protein_g'),
    carbs_g: formData.get('carbs_g'),
    fat_g: formData.get('fat_g'),
    image_url: formData.get('image_url') || null,
    is_public: formData.get('is_public') === 'on',
  });
  if (!parsed.success) redirect('/foods?error=validation');

  const supabase = await createClient();
  if (parsed.data.barcode) {
    let duplicateQuery = supabase
      .from('foods')
      .select('id')
      .eq('barcode', parsed.data.barcode)
      .limit(1);
    if (parsed.data.id) duplicateQuery = duplicateQuery.neq('id', parsed.data.id);
    const { data: dup } = await duplicateQuery.maybeSingle();
    if (dup) {
      redirect(
        parsed.data.id
          ? `/foods/${parsed.data.id}?error=barcode`
          : '/foods/new?error=barcode',
      );
    }
  }

  const payload = {
    name: parsed.data.name,
    brand: parsed.data.brand,
    barcode: parsed.data.barcode || null,
    serving_label: parsed.data.serving_label,
    serving_grams: parsed.data.serving_grams,
    calories: parsed.data.calories,
    protein_g: parsed.data.protein_g,
    carbs_g: parsed.data.carbs_g,
    fat_g: parsed.data.fat_g,
    image_url: parsed.data.image_url || null,
    is_public: parsed.data.is_public ?? true,
    source: 'system' as const,
    user_id: null,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from('foods').update(payload).eq('id', parsed.data.id);
    if (error) redirect(`/foods/${parsed.data.id}?error=save`);
    await supabase.rpc('admin_write_audit', {
      p_action: 'food.update',
      p_target_type: 'foods',
      p_target_id: parsed.data.id,
      p_reason: null,
      p_before: null,
      p_after: payload,
    });
    revalidatePath('/foods');
    redirect(`/foods/${parsed.data.id}?saved=1`);
  }

  const { data, error } = await supabase.from('foods').insert(payload).select('id').single();
  if (error || !data) redirect('/foods/new?error=save');
  await supabase.rpc('admin_write_audit', {
    p_action: 'food.create',
    p_target_type: 'foods',
    p_target_id: data.id,
    p_reason: null,
    p_before: null,
    p_after: payload,
  });
  revalidatePath('/foods');
  redirect(`/foods/${data.id}?saved=1`);
}

export async function archiveFood(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const restore = String(formData.get('restore') ?? '') === '1';
  const supabase = await createClient();
  const { error } = await supabase
    .from('foods')
    .update({ archived_at: restore ? null : new Date().toISOString() })
    .eq('id', id);
  if (error) redirect(`/foods/${id}?error=archive`);
  await supabase.rpc('admin_write_audit', {
    p_action: restore ? 'food.restore' : 'food.archive',
    p_target_type: 'foods',
    p_target_id: id,
    p_reason: 'admin.archive_food',
    p_before: null,
    p_after: { archived: !restore },
  });
  revalidatePath('/foods');
  redirect('/foods');
}
