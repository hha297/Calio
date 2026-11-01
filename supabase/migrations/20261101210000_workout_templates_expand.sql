-- Expand system workout templates: cover key + richer built-in plans.

alter table public.workout_templates
  add column if not exists image_key text;

comment on column public.workout_templates.image_key is
  'Optional cover key resolved by the app (local template/muscle/category artwork).';

-- Refresh copy + cover keys on existing system templates
update public.workout_templates t
set
  description = v.description,
  image_key = v.image_key
from (values
  ('Full Body', 'Hit every major pattern in one efficient session.', 'full-body'),
  ('Upper Body', 'Press, pull, and finish with shoulder control.', 'upper-body'),
  ('Lower Body', 'Squat, hinge, and single-leg strength.', 'lower-body'),
  ('Push Day', 'Chest, shoulders, and triceps with progressive presses.', 'push-day'),
  ('Pull Day', 'Back thickness and arm flexor work.', 'pull-day'),
  ('Leg Day', 'Quads, glutes, and hamstrings under load.', 'leg-day'),
  ('Beginner Strength', 'Simple full-body starters with room to grow.', 'beginner-strength'),
  ('HIIT', 'Short rounds. High effort. Quick finish.', 'hiit'),
  ('Core Workout', 'Bracing, anti-rotation, and controlled abs work.', 'core-workout')
) as v(name, description, image_key)
where t.is_system = true
  and t.name = v.name;

-- Rename Core Workout display if we prefer Core Crusher later stays compatible via image map.
-- Insert additional system templates (idempotent by name)
insert into public.workout_templates (name, category, description, is_system, user_id, image_key)
select v.name, v.category, v.description, true, null, v.image_key
from (values
  ('Chest Builder', 'Strength', 'Pressing volume for chest shape and strength.', 'chest'),
  ('Back Builder', 'Strength', 'Rows and pulls for a thicker, stronger back.', 'back'),
  ('Shoulder Pump', 'Strength', 'Delts from every angle with smart volume.', 'shoulders'),
  ('Glute Focus', 'Strength', 'Hinge and thrust work that targets glutes hard.', 'glutes'),
  ('Arm Pump', 'Strength', 'Biceps and triceps finishers that actually fill out.', 'arms'),
  ('Power Circuit', 'Strength', 'Compound lifts in a crisp, athletic circuit.', 'full-body'),
  ('Engine Builder', 'Cardio', 'Steady aerobic work to raise your work capacity.', 'cardio'),
  ('Jump Conditioner', 'Cardio', 'Elastic power and conditioning with soft landings.', 'hiit'),
  ('Calisthenics Starter', 'Bodyweight', 'Foundational bodyweight strength without equipment.', 'bodyweight'),
  ('Core Crusher', 'Bodyweight', 'Planks, raises, and twists for a resilient midsection.', 'core-workout'),
  ('Mobility Flow', 'Flexibility', 'Open hips, spine, and shoulders before or after lifting.', 'flexibility'),
  ('Yoga Essentials', 'Flexibility', 'Breath-led poses for recovery and control.', 'flexibility'),
  ('Desk Reset', 'Flexibility', 'Undo sitting: chest openers, hips, and neck relief.', 'flexibility')
) as v(name, category, description, image_key)
where not exists (
  select 1 from public.workout_templates t
  where t.is_system = true and t.name = v.name
);

-- Attach exercises to new templates when catalog names exist
insert into public.workout_template_exercises (
  template_id, exercise_id, position, exercise_name, exercise_type, planned_sets, planned_reps
)
select t.id, e.id, x.pos, e.name, e.exercise_type, x.sets, x.reps
from public.workout_templates t
join lateral (
  values
    ('Chest Builder', 'Barbell Bench Press', 0, 4, 8),
    ('Chest Builder', 'Incline Dumbbell Bench Press', 1, 3, 10),
    ('Chest Builder', 'Cable Chest Fly', 2, 3, 12),
    ('Chest Builder', 'Push-Up', 3, 3, 12),

    ('Back Builder', 'Pull Up', 0, 4, 6),
    ('Back Builder', 'Seated Cable Row', 1, 3, 10),
    ('Back Builder', 'Lat Pulldown', 2, 3, 10),
    ('Back Builder', 'Face Pull', 3, 3, 12),

    ('Shoulder Pump', 'Dumbbell Shoulder Press', 0, 4, 8),
    ('Shoulder Pump', 'Lateral Raise', 1, 3, 12),
    ('Shoulder Pump', 'Face Pull', 2, 3, 12),
    ('Shoulder Pump', 'Arnold Press', 3, 3, 10),

    ('Glute Focus', 'Hip Thrust', 0, 4, 10),
    ('Glute Focus', 'Romanian Deadlift', 1, 3, 8),
    ('Glute Focus', 'Dumbbell Walking Lunge', 2, 3, 10),
    ('Glute Focus', 'Glute Bridge', 3, 3, 12),

    ('Arm Pump', 'Barbell Curl', 0, 3, 10),
    ('Arm Pump', 'Triceps Pushdown', 1, 3, 12),
    ('Arm Pump', 'Hammer Curl', 2, 3, 10),
    ('Arm Pump', 'Overhead Triceps Extension', 3, 3, 12),

    ('Power Circuit', 'Back Squat', 0, 4, 6),
    ('Power Circuit', 'Barbell Bench Press', 1, 4, 6),
    ('Power Circuit', 'Pull Up', 2, 3, 6),
    ('Power Circuit', 'Box Jump', 3, 3, 6),

    ('Engine Builder', 'Running', 0, 1, null),
    ('Engine Builder', 'Cycling', 1, 1, null),
    ('Engine Builder', 'Rowing Machine', 2, 1, null),

    ('Jump Conditioner', 'Box Jump', 0, 4, 6),
    ('Jump Conditioner', 'Burpees', 1, 4, 10),
    ('Jump Conditioner', 'High Knee', 2, 4, null),
    ('Jump Conditioner', 'Mountain Climber', 3, 4, null),

    ('Calisthenics Starter', 'Push-Up', 0, 3, 12),
    ('Calisthenics Starter', 'Australian Pull-Up', 1, 3, 8),
    ('Calisthenics Starter', 'Dip', 2, 3, 8),
    ('Calisthenics Starter', 'Hollow Body Hold', 3, 3, null),

    ('Core Crusher', 'Plank', 0, 3, null),
    ('Core Crusher', 'Hanging Leg Raise', 1, 3, 10),
    ('Core Crusher', 'Russian Twist', 2, 3, 16),
    ('Core Crusher', 'Bicycle Crunch', 3, 3, 16),

    ('Mobility Flow', 'Cat-Cow', 0, 2, null),
    ('Mobility Flow', 'World''s Greatest Stretch', 1, 2, null),
    ('Mobility Flow', 'Hip Flexor Lunge Stretch', 2, 2, null),
    ('Mobility Flow', 'Thoracic Opener', 3, 2, null),

    ('Yoga Essentials', 'Downward Facing Dog', 0, 2, null),
    ('Yoga Essentials', 'Child''s Pose to Down Dog', 1, 2, null),
    ('Yoga Essentials', 'Warrior II', 2, 2, null),
    ('Yoga Essentials', 'Bridge Pose Yoga', 3, 2, null),

    ('Desk Reset', 'Doorway Chest Stretch', 0, 2, null),
    ('Desk Reset', 'Cat-Cow', 1, 2, null),
    ('Desk Reset', 'Seated Spinal Twist', 2, 2, null),
    ('Desk Reset', 'Neck Side Stretch', 3, 2, null)
) as x(template_name, exercise_name, pos, sets, reps)
  on x.template_name = t.name
join public.exercises e
  on e.is_system = true
 and lower(e.name) = lower(x.exercise_name)
where t.is_system = true
  and not exists (
    select 1 from public.workout_template_exercises te
    where te.template_id = t.id and te.position = x.pos
  );
