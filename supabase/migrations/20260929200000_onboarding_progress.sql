-- Post-signup setup progress + profile preference fields for Calio onboarding.

alter table public.profiles
  add column if not exists activity_level text
    check (
      activity_level is null
      or activity_level in ('sedentary', 'light', 'moderate', 'demanding')
    );

alter table public.profiles
  add column if not exists preferences jsonb not null default '{}'::jsonb;

create table if not exists public.onboarding_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_step text not null,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger onboarding_progress_set_updated_at
before update on public.onboarding_progress
for each row execute function public.set_updated_at();

alter table public.onboarding_progress enable row level security;

create policy "onboarding_progress_select_own" on public.onboarding_progress
  for select to authenticated using (auth.uid() = user_id);
create policy "onboarding_progress_insert_own" on public.onboarding_progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "onboarding_progress_update_own" on public.onboarding_progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "onboarding_progress_delete_own" on public.onboarding_progress
  for delete to authenticated using (auth.uid() = user_id);

-- Idempotent first-weight rows from setup: one weight sample per user per day.
-- NOTE: core schema already created a non-unique index with this name.
-- Use 20260929210000_body_measurements_unique_day.sql to replace it with a unique index.
-- (Left here for documentation; the later migration is authoritative.)
-- create unique index if not exists body_measurements_user_day_idx
--   on public.body_measurements (user_id, measured_on);
