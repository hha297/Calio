-- Independent training-level variations per workout template.
-- Exercises attach to a variation (not shared across levels).

create table if not exists public.workout_template_variations (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates (id) on delete cascade,
  training_level text not null
    check (training_level in ('beginner', 'intermediate', 'advanced')),
  description text,
  estimated_minutes integer
    check (estimated_minutes is null or estimated_minutes > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (template_id, training_level)
);

create index if not exists workout_template_variations_template_idx
  on public.workout_template_variations (template_id, training_level);

create trigger workout_template_variations_set_updated_at
before update on public.workout_template_variations
for each row execute function public.set_updated_at();

comment on table public.workout_template_variations is
  'Per-template beginner/intermediate/advanced workout variants with independent exercise lists.';

alter table public.workout_template_variations enable row level security;

create policy "workout_template_variations_select_visible"
  on public.workout_template_variations
  for select to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and (t.is_system = true or t.user_id = auth.uid())
  ));

create policy "workout_template_variations_insert_own"
  on public.workout_template_variations
  for insert to authenticated
  with check (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

create policy "workout_template_variations_update_own"
  on public.workout_template_variations
  for update to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ))
  with check (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

create policy "workout_template_variations_delete_own"
  on public.workout_template_variations
  for delete to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

-- Link exercises to a variation (keep template_id for RLS / denormalized access).
alter table public.workout_template_exercises
  add column if not exists variation_id uuid
    references public.workout_template_variations (id) on delete cascade;

create index if not exists workout_template_exercises_variation_idx
  on public.workout_template_exercises (variation_id, position);

-- Backfill: one variation per template that already has exercises.
insert into public.workout_template_variations (
  template_id, training_level, description, estimated_minutes
)
select
  t.id,
  coalesce(
    case
      when t.difficulty in ('beginner', 'intermediate', 'advanced') then t.difficulty
      else null
    end,
    'intermediate'
  ),
  t.description,
  t.estimated_minutes
from public.workout_templates t
where exists (
  select 1 from public.workout_template_exercises te
  where te.template_id = t.id and te.variation_id is null
)
and not exists (
  select 1 from public.workout_template_variations v
  where v.template_id = t.id
    and v.training_level = coalesce(
      case
        when t.difficulty in ('beginner', 'intermediate', 'advanced') then t.difficulty
        else null
      end,
      'intermediate'
    )
);

update public.workout_template_exercises te
set variation_id = v.id
from public.workout_template_variations v
where te.template_id = v.template_id
  and te.variation_id is null
  and v.training_level = coalesce(
    (
      select case
        when t.difficulty in ('beginner', 'intermediate', 'advanced') then t.difficulty
        else 'intermediate'
      end
      from public.workout_templates t
      where t.id = te.template_id
    ),
    'intermediate'
  );

-- Templates with no exercises yet still get no variation until configured.
