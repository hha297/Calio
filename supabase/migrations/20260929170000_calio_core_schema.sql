-- Calio foundation schema: profiles, goals, foods, diary, exercises, workouts, measurements.
-- Apply with: npx supabase db push   OR run this SQL in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  height_cm numeric(5, 2),
  sex text check (sex is null or sex in ('female', 'male', 'other', 'prefer_not_to_say')),
  birth_date date,
  units text not null default 'metric' check (units in ('metric', 'imperial')),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, 'Calio'), '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- goals ----------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_type text not null check (goal_type in ('lose_weight', 'maintain_weight', 'gain_weight')),
  target_weight_kg numeric(6, 2),
  daily_calorie_target integer not null check (daily_calorie_target > 0),
  weekly_change_kg numeric(4, 2),
  protein_g integer,
  carbs_g integer,
  fat_g integer,
  is_active boolean not null default true,
  started_at date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists goals_user_active_idx on public.goals (user_id) where is_active;

create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

alter table public.goals enable row level security;

create policy "goals_select_own" on public.goals
  for select to authenticated using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals
  for insert to authenticated with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- foods (canonical) ----------
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  brand text,
  barcode text,
  serving_label text not null default 'serving',
  serving_grams numeric(10, 2),
  calories numeric(10, 2) not null default 0,
  protein_g numeric(10, 2) not null default 0,
  carbs_g numeric(10, 2) not null default 0,
  fat_g numeric(10, 2) not null default 0,
  source text not null default 'manual' check (source in ('manual', 'open_food_facts', 'system')),
  image_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists foods_barcode_idx on public.foods (barcode);
create index if not exists foods_user_name_idx on public.foods (user_id, name);

create trigger foods_set_updated_at
before update on public.foods
for each row execute function public.set_updated_at();

alter table public.foods enable row level security;

-- Users can read public/system foods and their own foods.
create policy "foods_select_visible" on public.foods
  for select to authenticated
  using (is_public = true or user_id = auth.uid() or user_id is null);

create policy "foods_insert_own" on public.foods
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "foods_update_own" on public.foods
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "foods_delete_own" on public.foods
  for delete to authenticated
  using (user_id = auth.uid());

-- ---------- food entries (historical snapshots) ----------
create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid references public.foods (id) on delete set null,
  logged_on date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snacks')),
  quantity numeric(10, 2) not null default 1 check (quantity > 0),
  -- Snapshot at log time so later food edits do not rewrite history.
  food_name text not null,
  brand text,
  serving_label text not null,
  calories numeric(10, 2) not null,
  protein_g numeric(10, 2) not null,
  carbs_g numeric(10, 2) not null,
  fat_g numeric(10, 2) not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists food_entries_user_day_idx on public.food_entries (user_id, logged_on);

create trigger food_entries_set_updated_at
before update on public.food_entries
for each row execute function public.set_updated_at();

alter table public.food_entries enable row level security;

create policy "food_entries_select_own" on public.food_entries
  for select to authenticated using (auth.uid() = user_id);
create policy "food_entries_insert_own" on public.food_entries
  for insert to authenticated with check (auth.uid() = user_id);
create policy "food_entries_update_own" on public.food_entries
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "food_entries_delete_own" on public.food_entries
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- favorites ----------
create table if not exists public.food_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid not null references public.foods (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, food_id)
);

alter table public.food_favorites enable row level security;

create policy "food_favorites_select_own" on public.food_favorites
  for select to authenticated using (auth.uid() = user_id);
create policy "food_favorites_insert_own" on public.food_favorites
  for insert to authenticated with check (auth.uid() = user_id);
create policy "food_favorites_delete_own" on public.food_favorites
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- exercise catalog ----------
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  primary_muscles text[] not null default '{}',
  secondary_muscles text[] not null default '{}',
  equipment text,
  exercise_type text not null check (exercise_type in ('strength', 'bodyweight', 'cardio', 'other')),
  movement_pattern text,
  instructions text,
  met_value numeric(5, 2),
  is_system boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists exercises_name_idx on public.exercises (name);
create index if not exists exercises_type_idx on public.exercises (exercise_type);

alter table public.exercises enable row level security;

create policy "exercises_select_all" on public.exercises
  for select to authenticated using (true);

-- ---------- workouts ----------
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Workout',
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  notes text,
  estimated_calories numeric(10, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists workouts_user_started_idx on public.workouts (user_id, started_at desc);

create trigger workouts_set_updated_at
before update on public.workouts
for each row execute function public.set_updated_at();

alter table public.workouts enable row level security;

create policy "workouts_select_own" on public.workouts
  for select to authenticated using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts
  for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_id uuid references public.exercises (id) on delete set null,
  position integer not null default 0,
  -- Snapshot so catalog edits do not rewrite history.
  exercise_name text not null,
  exercise_type text not null check (exercise_type in ('strength', 'bodyweight', 'cardio', 'other')),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workout_exercises_workout_idx on public.workout_exercises (workout_id, position);

alter table public.workout_exercises enable row level security;

create policy "workout_exercises_select_own" on public.workout_exercises
  for select to authenticated
  using (exists (
    select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()
  ));
create policy "workout_exercises_insert_own" on public.workout_exercises
  for insert to authenticated
  with check (exists (
    select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()
  ));
create policy "workout_exercises_update_own" on public.workout_exercises
  for update to authenticated
  using (exists (
    select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()
  ));
create policy "workout_exercises_delete_own" on public.workout_exercises
  for delete to authenticated
  using (exists (
    select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()
  ));

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  set_number integer not null check (set_number > 0),
  weight_kg numeric(8, 2),
  reps integer,
  duration_sec integer,
  distance_m numeric(10, 2),
  rest_sec integer,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workout_sets_exercise_idx on public.workout_sets (workout_exercise_id, set_number);

alter table public.workout_sets enable row level security;

create policy "workout_sets_select_own" on public.workout_sets
  for select to authenticated
  using (exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));
create policy "workout_sets_insert_own" on public.workout_sets
  for insert to authenticated
  with check (exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));
create policy "workout_sets_update_own" on public.workout_sets
  for update to authenticated
  using (exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));
create policy "workout_sets_delete_own" on public.workout_sets
  for delete to authenticated
  using (exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));

-- ---------- body measurements ----------
create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(6, 2),
  body_fat_percent numeric(5, 2),
  waist_cm numeric(6, 2),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists body_measurements_user_day_idx
  on public.body_measurements (user_id, measured_on desc);

alter table public.body_measurements enable row level security;

create policy "body_measurements_select_own" on public.body_measurements
  for select to authenticated using (auth.uid() = user_id);
create policy "body_measurements_insert_own" on public.body_measurements
  for insert to authenticated with check (auth.uid() = user_id);
create policy "body_measurements_update_own" on public.body_measurements
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "body_measurements_delete_own" on public.body_measurements
  for delete to authenticated using (auth.uid() = user_id);

-- ---------- seed exercises ----------
insert into public.exercises (name, category, primary_muscles, secondary_muscles, equipment, exercise_type, movement_pattern, instructions, met_value)
select * from (values
  ('Barbell Back Squat', 'Legs', array['quadriceps','glutes'], array['hamstrings','core'], 'barbell', 'strength', 'squat', 'Bar on upper back. Sit hips down and stand tall.', 6.0),
  ('Barbell Bench Press', 'Chest', array['chest'], array['triceps','shoulders'], 'barbell', 'strength', 'horizontal_press', 'Lower the bar to mid-chest, then press up.', 5.0),
  ('Conventional Deadlift', 'Posterior', array['hamstrings','glutes','back'], array['core','forearms'], 'barbell', 'strength', 'hinge', 'Hinge at the hips, keep the bar close, stand tall.', 6.0),
  ('Pull-Up', 'Back', array['lats'], array['biceps','core'], 'pull-up bar', 'bodyweight', 'vertical_pull', 'Pull chin above the bar without swinging.', 8.0),
  ('Push-Up', 'Chest', array['chest'], array['triceps','shoulders','core'], 'bodyweight', 'bodyweight', 'horizontal_press', 'Keep a straight line from head to heels.', 8.0),
  ('Dumbbell Row', 'Back', array['lats'], array['biceps','rear delts'], 'dumbbell', 'strength', 'horizontal_pull', 'Brace on a bench and row the dumbbell to the hip.', 5.0),
  ('Overhead Press', 'Shoulders', array['shoulders'], array['triceps','core'], 'barbell', 'strength', 'vertical_press', 'Press the bar overhead without leaning back.', 5.0),
  ('Walking Lunge', 'Legs', array['quadriceps','glutes'], array['hamstrings'], 'bodyweight', 'bodyweight', 'lunge', 'Step forward and lower until the back knee nearly touches the floor.', 6.5),
  ('Plank', 'Core', array['core'], array['shoulders'], 'bodyweight', 'bodyweight', 'isometric', 'Hold a straight body line on forearms and toes.', 3.5),
  ('Running', 'Cardio', array['quadriceps','glutes','calves'], array['core'], 'none', 'cardio', 'locomotion', 'Steady outdoor or treadmill run.', 9.8),
  ('Cycling', 'Cardio', array['quadriceps','glutes'], array['calves'], 'bike', 'cardio', 'locomotion', 'Indoor or outdoor cycling.', 7.5),
  ('Jump Rope', 'Cardio', array['calves'], array['shoulders','core'], 'rope', 'cardio', 'locomotion', 'Keep jumps low and wrists relaxed.', 11.0),
  ('Walk', 'Cardio', array['legs'], array[]::text[], 'none', 'other', 'locomotion', 'Brisk walk for general activity.', 3.5),
  ('Yoga Flow', 'Mobility', array['full body'], array[]::text[], 'mat', 'other', 'mobility', 'Continuous mobility and stretch sequence.', 3.0),
  ('Lat Pulldown', 'Back', array['lats'], array['biceps'], 'cable', 'strength', 'vertical_pull', 'Pull the bar to the upper chest with control.', 5.0),
  ('Leg Press', 'Legs', array['quadriceps','glutes'], array['hamstrings'], 'machine', 'strength', 'squat', 'Press through mid-foot without locking hard.', 5.0),
  ('Romanian Deadlift', 'Posterior', array['hamstrings','glutes'], array['back'], 'barbell', 'strength', 'hinge', 'Soft knees, push hips back, feel the hamstrings.', 5.5),
  ('Dumbbell Shoulder Press', 'Shoulders', array['shoulders'], array['triceps'], 'dumbbell', 'strength', 'vertical_press', 'Press dumbbells overhead from shoulder height.', 5.0),
  ('Bicycle Crunch', 'Core', array['abs'], array['obliques'], 'bodyweight', 'bodyweight', 'flexion', 'Alternate elbow to opposite knee with control.', 4.0),
  ('Rowing Machine', 'Cardio', array['back','legs'], array['core','arms'], 'rower', 'cardio', 'locomotion', 'Drive with legs, then pull, then recover.', 7.0)
) as seed(name, category, primary_muscles, secondary_muscles, equipment, exercise_type, movement_pattern, instructions, met_value)
where not exists (select 1 from public.exercises limit 1);
