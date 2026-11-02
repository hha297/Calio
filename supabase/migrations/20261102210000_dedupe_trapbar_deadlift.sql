-- Keep a single Trapbar Deadlift (slug/image_key trapbar-deadlift).
-- Drop the near-duplicate Trap Bar Deadlift (trap-bar-deadlift).

with candidates as (
  select
    id,
    row_number() over (
      order by
        case
          when slug = 'trapbar-deadlift' then 0
          when image_key = 'trapbar-deadlift' then 1
          when lower(name) = 'trapbar deadlift' then 2
          else 3
        end,
        id
    ) as rn
  from public.exercises
  where is_system = true
    and (
      coalesce(slug, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or coalesce(image_key, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or regexp_replace(lower(name), '[^a-z0-9]+', '', 'g') = 'trapbardeadlift'
    )
),
keeper as (
  select id from candidates where rn = 1
),
doomed as (
  select id from candidates where rn > 1
)
update public.workout_exercises we
set exercise_id = (select id from keeper)
where we.exercise_id in (select id from doomed)
  and (select id from keeper) is not null;

with candidates as (
  select
    id,
    row_number() over (
      order by
        case
          when slug = 'trapbar-deadlift' then 0
          when image_key = 'trapbar-deadlift' then 1
          when lower(name) = 'trapbar deadlift' then 2
          else 3
        end,
        id
    ) as rn
  from public.exercises
  where is_system = true
    and (
      coalesce(slug, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or coalesce(image_key, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or regexp_replace(lower(name), '[^a-z0-9]+', '', 'g') = 'trapbardeadlift'
    )
),
keeper as (
  select id from candidates where rn = 1
),
doomed as (
  select id from candidates where rn > 1
)
update public.workout_template_exercises te
set exercise_id = (select id from keeper)
where te.exercise_id in (select id from doomed)
  and (select id from keeper) is not null
  and not exists (
    select 1
    from public.workout_template_exercises other
    where other.variation_id = te.variation_id
      and other.exercise_id = (select id from keeper)
      and other.id <> te.id
  );

with candidates as (
  select
    id,
    row_number() over (
      order by
        case
          when slug = 'trapbar-deadlift' then 0
          when image_key = 'trapbar-deadlift' then 1
          when lower(name) = 'trapbar deadlift' then 2
          else 3
        end,
        id
    ) as rn
  from public.exercises
  where is_system = true
    and (
      coalesce(slug, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or coalesce(image_key, '') in ('trap-bar-deadlift', 'trapbar-deadlift')
      or regexp_replace(lower(name), '[^a-z0-9]+', '', 'g') = 'trapbardeadlift'
    )
)
delete from public.exercises
where id in (select id from candidates where rn > 1);

update public.exercises
set
  name = 'Trapbar Deadlift',
  category = 'Strength',
  primary_muscles = array['quadriceps']::text[],
  secondary_muscles = coalesce(secondary_muscles, '{}'::text[]),
  slug = 'trapbar-deadlift',
  image_key = 'trapbar-deadlift',
  image_storage_path = coalesce(
    nullif(image_storage_path, ''),
    'exercises/shared/trapbar-deadlift.webp'
  ),
  library_paths = array['strength/quadriceps']::text[],
  content_version = greatest(coalesce(content_version, 1), 5)
where is_system = true
  and (
    slug in ('trapbar-deadlift', 'trap-bar-deadlift')
    or image_key in ('trapbar-deadlift', 'trap-bar-deadlift')
    or regexp_replace(lower(name), '[^a-z0-9]+', '', 'g') = 'trapbardeadlift'
  );
