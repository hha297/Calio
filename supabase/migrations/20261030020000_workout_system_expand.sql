-- Additive workout system expansion: custom exercises, favorites, templates.
-- Non-destructive: no drops, no data wipes.

-- ---------- custom exercises (user-owned catalog rows) ----------
alter table public.exercises
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

alter table public.exercises
  add column if not exists description text;

alter table public.exercises
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

create index if not exists exercises_user_idx on public.exercises (user_id);
create index if not exists exercises_category_idx on public.exercises (category);

drop policy if exists "exercises_select_all" on public.exercises;

create policy "exercises_select_visible" on public.exercises
  for select to authenticated
  using (is_system = true or user_id = auth.uid());

create policy "exercises_insert_own" on public.exercises
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and is_system = false
  );

create policy "exercises_update_own" on public.exercises
  for update to authenticated
  using (auth.uid() = user_id and is_system = false)
  with check (auth.uid() = user_id and is_system = false);

create policy "exercises_delete_own" on public.exercises
  for delete to authenticated
  using (auth.uid() = user_id and is_system = false);

-- ---------- exercise favorites ----------
create table if not exists public.exercise_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, exercise_id)
);

alter table public.exercise_favorites enable row level security;

create policy "exercise_favorites_select_own" on public.exercise_favorites
  for select to authenticated using (auth.uid() = user_id);
create policy "exercise_favorites_insert_own" on public.exercise_favorites
  for insert to authenticated with check (auth.uid() = user_id);
create policy "exercise_favorites_delete_own" on public.exercise_favorites
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- workout templates ----------
create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  category text not null default 'Strength',
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists workout_templates_user_idx
  on public.workout_templates (user_id, updated_at desc);

create trigger workout_templates_set_updated_at
before update on public.workout_templates
for each row execute function public.set_updated_at();

alter table public.workout_templates enable row level security;

create policy "workout_templates_select_visible" on public.workout_templates
  for select to authenticated
  using (is_system = true or user_id = auth.uid());

create policy "workout_templates_insert_own" on public.workout_templates
  for insert to authenticated
  with check (auth.uid() = user_id and is_system = false);

create policy "workout_templates_update_own" on public.workout_templates
  for update to authenticated
  using (auth.uid() = user_id and is_system = false)
  with check (auth.uid() = user_id and is_system = false);

create policy "workout_templates_delete_own" on public.workout_templates
  for delete to authenticated
  using (auth.uid() = user_id and is_system = false);

create table if not exists public.workout_template_exercises (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates (id) on delete cascade,
  exercise_id uuid references public.exercises (id) on delete set null,
  position integer not null default 0,
  exercise_name text not null,
  exercise_type text not null check (exercise_type in ('strength', 'bodyweight', 'cardio', 'other')),
  planned_sets integer,
  planned_reps integer,
  planned_weight_kg numeric(8, 2),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workout_template_exercises_template_idx
  on public.workout_template_exercises (template_id, position);

alter table public.workout_template_exercises enable row level security;

create policy "workout_template_exercises_select_visible" on public.workout_template_exercises
  for select to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and (t.is_system = true or t.user_id = auth.uid())
  ));

create policy "workout_template_exercises_insert_own" on public.workout_template_exercises
  for insert to authenticated
  with check (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

create policy "workout_template_exercises_update_own" on public.workout_template_exercises
  for update to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ))
  with check (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

create policy "workout_template_exercises_delete_own" on public.workout_template_exercises
  for delete to authenticated
  using (exists (
    select 1 from public.workout_templates t
    where t.id = template_id and t.user_id = auth.uid() and t.is_system = false
  ));

-- ---------- session metadata ----------
alter table public.workouts
  add column if not exists source_template_id uuid references public.workout_templates (id) on delete set null;

alter table public.workouts
  add column if not exists status text not null default 'completed'
    check (status in ('in_progress', 'completed', 'discarded'));

alter table public.workouts
  add column if not exists active_duration_sec integer;

alter table public.workout_sets
  add column if not exists completed boolean not null default true;

-- ---------- seed system templates (idempotent by name) ----------
insert into public.workout_templates (name, category, description, is_system, user_id)
select v.name, v.category, v.description, true, null
from (values
  ('Full Body', 'Strength', 'Compound lifts across major muscle groups'),
  ('Upper Body', 'Strength', 'Push and pull for chest, back, and shoulders'),
  ('Lower Body', 'Strength', 'Squat and hinge focused session'),
  ('Push Day', 'Strength', 'Chest, shoulders, and triceps'),
  ('Pull Day', 'Strength', 'Back and biceps'),
  ('Leg Day', 'Strength', 'Quads, glutes, and hamstrings'),
  ('Beginner Strength', 'Strength', 'Simple starter strength routine'),
  ('HIIT', 'Cardio', 'Short high-intensity intervals'),
  ('Core Workout', 'Bodyweight', 'Core stability and control')
) as v(name, category, description)
where not exists (
  select 1 from public.workout_templates t where t.is_system = true and t.name = v.name
);

-- Attach template exercises by matching catalog names when present
insert into public.workout_template_exercises (
  template_id, exercise_id, position, exercise_name, exercise_type, planned_sets, planned_reps
)
select t.id, e.id, x.pos, e.name, e.exercise_type, x.sets, x.reps
from public.workout_templates t
join lateral (
  values
    -- Full Body
    ('Full Body', 'Barbell Back Squat', 0, 3, 8),
    ('Full Body', 'Barbell Bench Press', 1, 3, 8),
    ('Full Body', 'Dumbbell Row', 2, 3, 10),
    ('Full Body', 'Plank', 3, 3, null),
    -- Upper Body
    ('Upper Body', 'Barbell Bench Press', 0, 3, 8),
    ('Upper Body', 'Lat Pulldown', 1, 3, 10),
    ('Upper Body', 'Dumbbell Shoulder Press', 2, 3, 10),
    ('Upper Body', 'Dumbbell Row', 3, 3, 10),
    -- Lower Body
    ('Lower Body', 'Barbell Back Squat', 0, 4, 8),
    ('Lower Body', 'Romanian Deadlift', 1, 3, 8),
    ('Lower Body', 'Walking Lunge', 2, 3, 10),
    ('Lower Body', 'Leg Press', 3, 3, 12),
    -- Push
    ('Push Day', 'Barbell Bench Press', 0, 4, 8),
    ('Push Day', 'Dumbbell Shoulder Press', 1, 3, 10),
    ('Push Day', 'Push-Up', 2, 3, 12),
    -- Pull
    ('Pull Day', 'Pull-Up', 0, 4, 6),
    ('Pull Day', 'Lat Pulldown', 1, 3, 10),
    ('Pull Day', 'Dumbbell Row', 2, 3, 10),
    -- Legs
    ('Leg Day', 'Barbell Back Squat', 0, 4, 8),
    ('Leg Day', 'Leg Press', 1, 3, 12),
    ('Leg Day', 'Romanian Deadlift', 2, 3, 8),
    ('Leg Day', 'Walking Lunge', 3, 3, 10),
    -- Beginner
    ('Beginner Strength', 'Push-Up', 0, 3, 10),
    ('Beginner Strength', 'Walking Lunge', 1, 3, 10),
    ('Beginner Strength', 'Dumbbell Row', 2, 3, 10),
    ('Beginner Strength', 'Plank', 3, 3, null),
    -- HIIT
    ('HIIT', 'Jump Rope', 0, 4, null),
    ('HIIT', 'Push-Up', 1, 4, 12),
    ('HIIT', 'Walking Lunge', 2, 4, 12),
    -- Core
    ('Core Workout', 'Plank', 0, 3, null),
    ('Core Workout', 'Bicycle Crunch', 1, 3, 16)
) as x(template_name, exercise_name, pos, sets, reps)
  on x.template_name = t.name
join public.exercises e on e.name = x.exercise_name and e.is_system = true
where t.is_system = true
  and not exists (
    select 1 from public.workout_template_exercises te
    where te.template_id = t.id and te.position = x.pos
  );
