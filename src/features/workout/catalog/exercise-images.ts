import { LOCAL_SUBCATEGORY_IMAGES } from '@/features/workout/catalog/subcategory-images';
import { getSupabase } from '@/lib/supabase/client';
import { getSupabaseEnv } from '@/lib/supabase/env';

/** Neutral placeholder when Storage path is missing/unavailable. Never use an unrelated exercise image. */
export const EXERCISE_IMAGE_PLACEHOLDER: number = require('../../../../assets/images/branding/logo.png');

export const EXERCISE_IMAGES_BUCKET = 'exercise-images';

export type ExerciseImageSource = string | number;

const resolvedUrlCache = new Map<string, string>();

/**
 * Build a public Storage URL for a system exercise image path.
 * Prefers the Supabase client `getPublicUrl` helper; falls back to env URL.
 */
export function buildExerciseStoragePublicUrl(storagePath: string): string | null {
  const clean = storagePath.replace(/^\/+/, '').trim();
  if (!clean) return null;

  const cached = resolvedUrlCache.get(clean);
  if (cached) return cached;

  const supabase = getSupabase();
  if (supabase) {
    const { data } = supabase.storage.from(EXERCISE_IMAGES_BUCKET).getPublicUrl(clean);
    const url = data.publicUrl?.trim();
    if (url) {
      resolvedUrlCache.set(clean, url);
      return url;
    }
  }

  const env = getSupabaseEnv();
  if (!env?.url) return null;
  const url = `${env.url.replace(/\/$/, '')}/storage/v1/object/public/${EXERCISE_IMAGES_BUCKET}/${clean}`;
  resolvedUrlCache.set(clean, url);
  return url;
}

/** Cover tile for a library subcategory (`strength/chest`, `cardio/sports`, …). */
export function getSubcategoryImage(libraryPath: string): number | null {
  const hit = LOCAL_SUBCATEGORY_IMAGES[libraryPath];
  return hit != null ? (hit as number) : null;
}

/**
 * Resolve display image for an exercise from the API / Storage only.
 * Bundled per-exercise assets are intentionally unused (heavy + offline duplicate of DB).
 * Priority: Cloudinary/custom URL → Supabase Storage path → image_key/slug Storage guess → placeholder.
 */
export function resolveExerciseImage(input: {
  imageUrl?: string | null;
  imageStoragePath?: string | null;
  imageKey?: string | null;
  slug?: string | null;
  name?: string | null;
}): ExerciseImageSource {
  const url = input.imageUrl?.trim();
  if (url && /^https?:\/\//i.test(url)) return url;

  const storagePath =
    input.imageStoragePath?.trim() ||
    (input.imageKey ? `exercises/shared/${input.imageKey}.webp` : null) ||
    (input.slug ? `exercises/shared/${input.slug}.webp` : null);

  if (storagePath) {
    const publicUrl = buildExerciseStoragePublicUrl(storagePath);
    if (publicUrl) return publicUrl;
  }

  return EXERCISE_IMAGE_PLACEHOLDER;
}
