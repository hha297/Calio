import { getPublicSupabaseEnv } from '@/lib/supabase/env';

const BUCKET = 'exercise-images';

/** Same resolution order as the mobile app (URL → storage path → image_key/slug guess). */
export function resolveExerciseImageUrl(input: {
  imageUrl?: string | null;
  imageStoragePath?: string | null;
  imageKey?: string | null;
  slug?: string | null;
}): string | null {
  const direct = input.imageUrl?.trim();
  if (direct && /^https?:\/\//i.test(direct)) return direct;

  const storagePath =
    input.imageStoragePath?.trim() ||
    (input.imageKey ? `exercises/shared/${input.imageKey}.webp` : null) ||
    (input.slug ? `exercises/shared/${input.slug}.webp` : null);

  if (!storagePath) return null;

  try {
    const { url } = getPublicSupabaseEnv();
    return `${url.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/${storagePath.replace(/^\/+/, '')}`;
  } catch {
    return null;
  }
}
