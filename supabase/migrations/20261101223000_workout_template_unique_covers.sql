-- Give expanded system templates unique cover keys (stop sharing hiit/full-body/flexibility).

update public.workout_templates t
set image_key = v.image_key
from (values
  ('Power Circuit', 'power-circuit'),
  ('Engine Builder', 'engine-builder'),
  ('Jump Conditioner', 'jump-conditioner'),
  ('Calisthenics Starter', 'calisthenics-starter'),
  ('Core Crusher', 'core-crusher'),
  ('Mobility Flow', 'mobility-flow'),
  ('Yoga Essentials', 'yoga-essentials'),
  ('Desk Reset', 'desk-reset')
) as v(name, image_key)
where t.is_system = true
  and t.name = v.name;
