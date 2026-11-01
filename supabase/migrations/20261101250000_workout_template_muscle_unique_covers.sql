-- Give muscle-focus and expanded templates unique image_key values
-- (stop sharing muscle-hub / subcategory cover artwork).

update public.workout_templates t
set image_key = v.image_key
from (values
  ('Chest Builder', 'chest-builder'),
  ('Back Builder', 'back-builder'),
  ('Shoulder Pump', 'shoulder-pump'),
  ('Glute Focus', 'glute-focus'),
  ('Arm Pump', 'arm-pump'),
  ('Power Circuit', 'power-circuit'),
  ('Engine Builder', 'engine-builder'),
  ('Jump Conditioner', 'jump-conditioner'),
  ('Desk Reset', 'desk-reset')
) as v(name, image_key)
where t.is_system = true
  and t.name = v.name;
