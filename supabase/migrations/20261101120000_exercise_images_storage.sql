-- System exercise image Storage + richer catalog columns.
-- Non-destructive: additive columns, RLS, public-read bucket policies.

-- ---------- catalog columns ----------
alter table public.exercises
  add column if not exists slug text;

alter table public.exercises
  add column if not exists image_storage_path text;

alter table public.exercises
  add column if not exists image_url text;

alter table public.exercises
  add column if not exists overview text;

alter table public.exercises
  add column if not exists common_mistakes text;

alter table public.exercises
  add column if not exists safety_notes text;

alter table public.exercises
  add column if not exists content_version integer not null default 1;

create unique index if not exists exercises_system_slug_uidx
  on public.exercises (slug)
  where is_system = true and slug is not null;

create index if not exists exercises_image_storage_path_idx
  on public.exercises (image_storage_path);

-- ---------- storage bucket (system exercise images) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exercise-images',
  'exercise-images',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png', 'image/jpg']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read for system exercise artwork.
drop policy if exists "exercise_images_public_read" on storage.objects;
create policy "exercise_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'exercise-images');

-- No authenticated client writes to system exercise images.
-- Admin/service-role uploads bypass RLS.
drop policy if exists "exercise_images_no_client_insert" on storage.objects;
drop policy if exists "exercise_images_no_client_update" on storage.objects;
drop policy if exists "exercise_images_no_client_delete" on storage.objects;

-- Explicit deny for authenticated role mutations (service role still works).
create policy "exercise_images_no_client_insert"
  on storage.objects
  for insert
  to authenticated
  with check (false);

create policy "exercise_images_no_client_update"
  on storage.objects
  for update
  to authenticated
  using (false);

create policy "exercise_images_no_client_delete"
  on storage.objects
  for delete
  to authenticated
  using (false);
