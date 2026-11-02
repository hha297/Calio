-- Patch missing High Knee / walking-lunge rows when catalog names differ.

insert into public.workout_template_exercises (
  template_id, variation_id, exercise_id, position, exercise_name, exercise_type,
  planned_sets, planned_reps, planned_rest_sec, notes
)
select
  t.id,
  v.id,
  e.id,
  x.pos,
  e.name,
  e.exercise_type,
  x.sets,
  x.reps,
  x.rest_sec,
  x.notes
from public.workout_templates t
join public.workout_template_variations v
  on v.template_id = t.id
join (
  values
    ('HIIT'::text, 'beginner'::text, 'high_knee'::text, 1, 3, null::integer, 40, '20–30s'::text),
    ('HIIT', 'intermediate', 'walking_lunge', 3, 3, 12, 45, null),
    ('Jump Conditioner', 'beginner', 'high_knee', 2, 2, null::integer, 45, '20s'),
    ('Jump Conditioner', 'intermediate', 'high_knee', 2, 3, null::integer, 45, '30–40s')
) as x(template_name, training_level, kind, pos, sets, reps, rest_sec, notes)
  on x.template_name = t.name
 and x.training_level = v.training_level
join lateral (
  select ex.*
  from public.exercises ex
  where ex.is_system = true
    and (
      (
        x.kind = 'high_knee'
        and (
          lower(ex.name) in ('high knee', 'high knees')
          or regexp_replace(lower(ex.name), '[^a-z0-9]+', '', 'g') in ('highknee', 'highknees')
        )
      )
      or (
        x.kind = 'walking_lunge'
        and (
          lower(ex.name) in ('dumbbell walking lunge', 'walking lunge')
          or regexp_replace(lower(ex.name), '[^a-z0-9]+', '', 'g') in ('dumbbellwalkinglunge', 'walkinglunge')
        )
      )
    )
  order by case when lower(ex.name) in ('high knee', 'dumbbell walking lunge') then 0 else 1 end
  limit 1
) e on true
where t.is_system = true
  and not exists (
    select 1
    from public.workout_template_exercises te
    where te.variation_id = v.id
      and te.position = x.pos
  );
