-- Per-exercise calorie estimates + reproducibility metadata for workout sessions.
-- Historical workouts keep existing workouts.estimated_calories; new finishes write both.

alter table public.workouts
  add column if not exists calorie_calc_version integer;

alter table public.workouts
  add column if not exists calorie_body_weight_kg numeric(6, 2);

alter table public.workout_exercises
  add column if not exists estimated_calories numeric(10, 2) not null default 0;

alter table public.workout_exercises
  add column if not exists estimate_method text
    check (estimate_method is null or estimate_method in ('direct', 'allocated'));

alter table public.workout_exercises
  add column if not exists estimate_calc_version integer;

alter table public.workout_exercises
  add column if not exists estimate_duration_sec integer;

alter table public.workout_exercises
  add column if not exists estimate_activity_key text;

alter table public.workout_exercises
  add column if not exists estimate_body_weight_kg numeric(6, 2);

comment on column public.workout_exercises.estimate_method is
  'direct = activity-specific estimate; allocated = share of a resistance-session model (not a unique lift measurement).';

comment on column public.workouts.calorie_calc_version is
  'Calculation engine version used when estimated_calories was written.';
