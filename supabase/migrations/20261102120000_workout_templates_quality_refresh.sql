-- Workout templates quality refresh:
-- - schema: difficulty, goal, estimated_minutes, equipment_summary, planned_rest_sec
-- - fix orphaned name joins via slug + alias matching
-- - rebuild system template exercise lists (compound → accessory)
-- - add diversified system templates (quality over volume)

-- ---------- schema ----------
alter table public.workout_templates
  add column if not exists difficulty text
    check (difficulty is null or difficulty in ('beginner', 'intermediate', 'advanced'));

alter table public.workout_templates
  add column if not exists goal text;

alter table public.workout_templates
  add column if not exists estimated_minutes integer
    check (estimated_minutes is null or estimated_minutes > 0);

alter table public.workout_templates
  add column if not exists equipment_summary text;

alter table public.workout_template_exercises
  add column if not exists planned_rest_sec integer
    check (planned_rest_sec is null or planned_rest_sec >= 0);

comment on column public.workout_templates.difficulty is
  'beginner | intermediate | advanced — guidance only, not a medical classification.';
comment on column public.workout_templates.goal is
  'Short training intent label (hypertrophy, strength, fat loss, etc.).';
comment on column public.workout_templates.estimated_minutes is
  'Approximate session length in minutes for display.';
comment on column public.workout_templates.equipment_summary is
  'Human-readable equipment needs for cards/detail.';
comment on column public.workout_template_exercises.planned_rest_sec is
  'Suggested rest between sets in seconds.';

-- ---------- insert new system templates (idempotent) ----------
insert into public.workout_templates (
  name, category, description, is_system, user_id, image_key,
  difficulty, goal, estimated_minutes, equipment_summary
)
select
  v.name, v.category, v.description, true, null, v.image_key,
  v.difficulty, v.goal, v.estimated_minutes, v.equipment_summary
from (values
  ('Push Hypertrophy', 'Strength',
   'Chest-led pressing volume with shoulder and triceps accessories.',
   'push-hypertrophy', 'intermediate', 'hypertrophy', 55, 'Barbell, dumbbells, cables'),
  ('Pull Hypertrophy', 'Strength',
   'Vertical and horizontal pulls for back thickness, then arm flexors.',
   'pull-hypertrophy', 'intermediate', 'hypertrophy', 55, 'Pull-up bar, cables, dumbbells'),
  ('Posterior Chain', 'Strength',
   'Hinge-dominant strength for glutes, hamstrings, and spinal erectors.',
   'posterior-chain', 'intermediate', 'strength', 50, 'Barbell, bench or machine'),
  ('Quads Builder', 'Strength',
   'Squat patterns and single-leg work for quad growth and knee control.',
   'quads-builder', 'intermediate', 'hypertrophy', 50, 'Barbell, machines, dumbbells'),
  ('Home Dumbbell', 'Strength',
   'Full-body strength with dumbbells and bodyweight — no machines required.',
   'home-dumbbell', 'beginner', 'general', 40, 'Dumbbells, mat'),
  ('Fat-Loss Circuit', 'Cardio',
   'Full-body conditioning rounds that keep heart rate elevated.',
   'fat-loss-circuit', 'intermediate', 'fat_loss', 35, 'Jump rope optional, bodyweight'),
  ('Advanced Calisthenics', 'Bodyweight',
   'Harder bodyweight strength progressions with strict control.',
   'advanced-calisthenics', 'advanced', 'strength', 45, 'Pull-up bar, dip bars, floor'),
  ('Athletic Conditioning', 'Cardio',
   'Power and change-of-direction work for sporty conditioning.',
   'athletic-conditioning', 'intermediate', 'conditioning', 35, 'Box, open floor')
) as v(name, category, description, image_key, difficulty, goal, estimated_minutes, equipment_summary)
where not exists (
  select 1 from public.workout_templates t
  where t.is_system = true and t.name = v.name
);

-- ---------- refresh metadata on all system templates ----------
update public.workout_templates t
set
  description = v.description,
  image_key = coalesce(v.image_key, t.image_key),
  difficulty = v.difficulty,
  goal = v.goal,
  estimated_minutes = v.estimated_minutes,
  equipment_summary = v.equipment_summary
from (values
  ('Full Body', 'Balanced compound session covering squat, press, pull, and brace.', 'full-body', 'beginner', 'general', 45, 'Barbell, dumbbells, mat'),
  ('Upper Body', 'Press and pull volume for chest, back, and shoulders.', 'upper-body', 'intermediate', 'hypertrophy', 50, 'Barbell, cables, dumbbells'),
  ('Lower Body', 'Squat, hinge, and single-leg strength for the lower body.', 'lower-body', 'intermediate', 'strength', 50, 'Barbell, machines, dumbbells'),
  ('Push Day', 'Chest, shoulders, and triceps in a classic push sequence.', 'push-day', 'intermediate', 'hypertrophy', 50, 'Barbell, dumbbells, bodyweight'),
  ('Pull Day', 'Back thickness and biceps with vertical then horizontal pulls.', 'pull-day', 'intermediate', 'hypertrophy', 50, 'Pull-up bar, cables, dumbbells'),
  ('Leg Day', 'Quads, glutes, and hamstrings under progressive load.', 'leg-day', 'intermediate', 'hypertrophy', 55, 'Barbell, machines, dumbbells'),
  ('Beginner Strength', 'Simple full-body starters with room to progress.', 'beginner-strength', 'beginner', 'strength', 35, 'Dumbbells optional, mat'),
  ('HIIT', 'Short high-effort rounds for conditioning.', 'hiit', 'intermediate', 'conditioning', 25, 'Jump rope, open floor'),
  ('Core Workout', 'Bracing, anti-extension, and controlled abs work.', 'core-workout', 'beginner', 'core', 20, 'Mat, optional cable'),
  ('Chest Builder', 'Pressing volume for chest shape and strength.', 'chest-builder', 'intermediate', 'hypertrophy', 45, 'Barbell, dumbbells, cables'),
  ('Back Builder', 'Rows and pulls for a thicker, stronger back.', 'back-builder', 'intermediate', 'hypertrophy', 45, 'Pull-up bar, cables'),
  ('Shoulder Pump', 'Delts from multiple angles with smart volume.', 'shoulder-pump', 'intermediate', 'hypertrophy', 40, 'Dumbbells, cables'),
  ('Glute Focus', 'Hinge and thrust work that targets glutes hard.', 'glute-focus', 'intermediate', 'hypertrophy', 45, 'Barbell, dumbbells, bench'),
  ('Arm Pump', 'Biceps and triceps finishers with balanced flexor/extensor work.', 'arm-pump', 'beginner', 'hypertrophy', 30, 'Barbell, cables, dumbbells'),
  ('Power Circuit', 'Compound lifts in a crisp, athletic circuit.', 'power-circuit', 'advanced', 'strength', 40, 'Barbell, pull-up bar, box'),
  ('Engine Builder', 'Steady aerobic work to raise work capacity.', 'engine-builder', 'beginner', 'endurance', 40, 'Cardio machines'),
  ('Jump Conditioner', 'Elastic power and conditioning with soft landings.', 'jump-conditioner', 'intermediate', 'conditioning', 30, 'Box, open floor'),
  ('Calisthenics Starter', 'Foundational bodyweight strength without machines.', 'calisthenics-starter', 'beginner', 'strength', 35, 'Pull-up bar, floor'),
  ('Core Crusher', 'Planks, raises, and twists for a resilient midsection.', 'core-crusher', 'intermediate', 'core', 25, 'Pull-up bar, mat'),
  ('Mobility Flow', 'Open hips, spine, and shoulders before or after lifting.', 'mobility-flow', 'beginner', 'mobility', 20, 'Mat'),
  ('Yoga Essentials', 'Breath-led poses for recovery and control.', 'yoga-essentials', 'beginner', 'mobility', 25, 'Mat'),
  ('Desk Reset', 'Undo sitting: chest openers, hips, and neck relief.', 'desk-reset', 'beginner', 'mobility', 15, 'None'),
  ('Push Hypertrophy', 'Chest-led pressing volume with shoulder and triceps accessories.', 'push-hypertrophy', 'intermediate', 'hypertrophy', 55, 'Barbell, dumbbells, cables'),
  ('Pull Hypertrophy', 'Vertical and horizontal pulls for back thickness, then arm flexors.', 'pull-hypertrophy', 'intermediate', 'hypertrophy', 55, 'Pull-up bar, cables, dumbbells'),
  ('Posterior Chain', 'Hinge-dominant strength for glutes, hamstrings, and spinal erectors.', 'posterior-chain', 'intermediate', 'strength', 50, 'Barbell, bench or machine'),
  ('Quads Builder', 'Squat patterns and single-leg work for quad growth and knee control.', 'quads-builder', 'intermediate', 'hypertrophy', 50, 'Barbell, machines, dumbbells'),
  ('Home Dumbbell', 'Full-body strength with dumbbells and bodyweight — no machines required.', 'home-dumbbell', 'beginner', 'general', 40, 'Dumbbells, mat'),
  ('Fat-Loss Circuit', 'Full-body conditioning rounds that keep heart rate elevated.', 'fat-loss-circuit', 'intermediate', 'fat_loss', 35, 'Jump rope optional, bodyweight'),
  ('Advanced Calisthenics', 'Harder bodyweight strength progressions with strict control.', 'advanced-calisthenics', 'advanced', 'strength', 45, 'Pull-up bar, dip bars, floor'),
  ('Athletic Conditioning', 'Power and change-of-direction work for sporty conditioning.', 'athletic-conditioning', 'intermediate', 'conditioning', 35, 'Box, open floor')
) as v(name, description, image_key, difficulty, goal, estimated_minutes, equipment_summary)
where t.is_system = true
  and t.name = v.name;

-- ---------- rebuild system template exercises ----------
delete from public.workout_template_exercises te
using public.workout_templates t
where te.template_id = t.id
  and t.is_system = true;

-- Alias pairs cover JSON catalog names vs older DB display names.
-- Seed uses slug when present + primary display name; resolver tries both.

insert into public.workout_template_exercises (
  template_id, exercise_id, position, exercise_name, exercise_type,
  planned_sets, planned_reps, planned_rest_sec, notes
)
select
  t.id,
  e.id,
  x.pos,
  e.name,
  e.exercise_type,
  x.sets,
  x.reps,
  x.rest_sec,
  x.notes
from public.workout_templates t
join lateral (
  values
    -- Full Body
    ('Full Body', 'back-squat', 'Back Squat', 0, 4, 8, 120, 'Compound squat'),
    ('Full Body', 'barbell-bench-press', 'Barbell Bench Press', 1, 4, 8, 120, 'Horizontal press'),
    ('Full Body', 'one-arm-dumbbell-row', 'One Arm Dumbbell Row', 2, 3, 10, 90, 'Each arm'),
    ('Full Body', 'romanian-deadlift', 'Romanian Deadlift', 3, 3, 8, 120, 'Hip hinge'),
    ('Full Body', 'plank', 'Plank', 4, 3, null, 60, 'Brace 30–45s'),
    ('Full Body', 'face-pull', 'Face Pull', 5, 3, 12, 60, 'Shoulder health'),

    -- Upper Body
    ('Upper Body', 'barbell-bench-press', 'Barbell Bench Press', 0, 4, 8, 120, null),
    ('Upper Body', 'lat-pulldown', 'Lat Pulldown', 1, 4, 10, 90, null),
    ('Upper Body', 'seated-dumbbell-shoulder-press', 'Seated Dumbbell Shoulder Press', 2, 3, 10, 90, null),
    ('Upper Body', 'seated-cable-row', 'Seated Cable Row', 3, 3, 10, 90, null),
    ('Upper Body', 'lateral-raise', 'Lateral Raise', 4, 3, 12, 60, null),
    ('Upper Body', 'triceps-pushdown', 'Triceps Pushdown', 5, 3, 12, 60, null),

    -- Lower Body
    ('Lower Body', 'back-squat', 'Back Squat', 0, 4, 8, 150, null),
    ('Lower Body', 'romanian-deadlift', 'Romanian Deadlift', 1, 4, 8, 120, null),
    ('Lower Body', 'bulgarian-split-squat', 'Bulgarian Split Squat', 2, 3, 10, 90, 'Each leg'),
    ('Lower Body', 'leg-press', 'Leg Press', 3, 3, 12, 90, null),
    ('Lower Body', 'hip-thrust', 'Hip Thrust', 4, 3, 10, 90, null),
    ('Lower Body', 'standing-calf-raise', 'Standing Calf Raise', 5, 3, 12, 60, null),

    -- Push Day
    ('Push Day', 'barbell-bench-press', 'Barbell Bench Press', 0, 4, 8, 120, null),
    ('Push Day', 'incline-dumbbell-bench-press', 'Incline Dumbbell Bench Press', 1, 3, 10, 90, null),
    ('Push Day', 'seated-dumbbell-shoulder-press', 'Seated Dumbbell Shoulder Press', 2, 3, 10, 90, null),
    ('Push Day', 'lateral-raise', 'Lateral Raise', 3, 3, 12, 60, null),
    ('Push Day', 'triceps-pushdown', 'Triceps Pushdown', 4, 3, 12, 60, null),
    ('Push Day', 'push-up', 'Push-Up', 5, 2, 12, 60, 'Finisher'),

    -- Pull Day
    ('Pull Day', 'pull-up', 'Pull Up', 0, 4, 6, 120, 'Add band if needed'),
    ('Pull Day', 'seated-cable-row', 'Seated Cable Row', 1, 4, 10, 90, null),
    ('Pull Day', 'lat-pulldown', 'Lat Pulldown', 2, 3, 10, 90, null),
    ('Pull Day', 'face-pull', 'Face Pull', 3, 3, 12, 60, null),
    ('Pull Day', 'barbell-curl', 'Barbell Curl', 4, 3, 10, 60, null),
    ('Pull Day', 'hammer-curl', 'Hammer Curl', 5, 2, 12, 60, null),

    -- Leg Day
    ('Leg Day', 'back-squat', 'Back Squat', 0, 4, 8, 150, null),
    ('Leg Day', 'leg-press', 'Leg Press', 1, 3, 12, 90, null),
    ('Leg Day', 'romanian-deadlift', 'Romanian Deadlift', 2, 3, 8, 120, null),
    ('Leg Day', 'dumbbell-walking-lunge', 'Dumbbell Walking Lunge', 3, 3, 10, 90, 'Each side'),
    ('Leg Day', 'leg-extension', 'Leg Extension', 4, 3, 12, 60, null),
    ('Leg Day', 'standing-calf-raise', 'Standing Calf Raise', 5, 3, 15, 45, null),

    -- Beginner Strength
    ('Beginner Strength', 'goblet-squat', 'Goblet Squat', 0, 3, 10, 90, null),
    ('Beginner Strength', 'push-up', 'Push-Up', 1, 3, 8, 75, 'Kneeling OK'),
    ('Beginner Strength', 'one-arm-dumbbell-row', 'One Arm Dumbbell Row', 2, 3, 10, 75, 'Each arm'),
    ('Beginner Strength', 'glute-bridge', 'Glute Bridge', 3, 3, 12, 60, null),
    ('Beginner Strength', 'plank', 'Plank', 4, 3, null, 45, '20–40s'),

    -- HIIT
    ('HIIT', 'jump-rope', 'Jump Rope', 0, 5, null, 45, '40s work'),
    ('HIIT', 'burpees', 'Burpees', 1, 5, 10, 45, null),
    ('HIIT', 'mountain-climber', 'Mountain Climber', 2, 5, null, 45, '40s work'),
    ('HIIT', 'dumbbell-walking-lunge', 'Dumbbell Walking Lunge', 3, 4, 12, 45, 'Bodyweight OK'),
    ('HIIT', 'jumping-jacks', 'Jumping Jacks', 4, 4, null, 45, '40s work'),

    -- Core Workout
    ('Core Workout', 'plank', 'Plank', 0, 3, null, 45, '30–45s'),
    ('Core Workout', 'dead-bug', 'Dead Bug', 1, 3, 10, 45, 'Each side'),
    ('Core Workout', 'bird-dog', 'Bird Dog', 2, 3, 10, 45, 'Each side'),
    ('Core Workout', 'bicycle-crunch', 'Bicycle Crunch', 3, 3, 16, 45, null),
    ('Core Workout', 'pallof-press', 'Pallof Press', 4, 3, 10, 60, 'Each side'),

    -- Chest Builder
    ('Chest Builder', 'barbell-bench-press', 'Barbell Bench Press', 0, 4, 8, 120, null),
    ('Chest Builder', 'incline-dumbbell-bench-press', 'Incline Dumbbell Bench Press', 1, 3, 10, 90, null),
    ('Chest Builder', 'dumbbell-bench-press', 'Dumbbell Bench Press', 2, 3, 10, 90, null),
    ('Chest Builder', 'cable-chest-fly', 'Cable Chest Fly', 3, 3, 12, 60, null),
    ('Chest Builder', 'push-up', 'Push-Up', 4, 2, 12, 60, 'Finisher'),

    -- Back Builder
    ('Back Builder', 'pull-up', 'Pull Up', 0, 4, 6, 120, null),
    ('Back Builder', 'seated-cable-row', 'Seated Cable Row', 1, 4, 10, 90, null),
    ('Back Builder', 'lat-pulldown', 'Lat Pulldown', 2, 3, 10, 90, null),
    ('Back Builder', 'chest-supported-row', 'Chest Supported Row', 3, 3, 10, 90, null),
    ('Back Builder', 'face-pull', 'Face Pull', 4, 3, 12, 60, null),

    -- Shoulder Pump
    ('Shoulder Pump', 'seated-dumbbell-shoulder-press', 'Seated Dumbbell Shoulder Press', 0, 4, 8, 90, null),
    ('Shoulder Pump', 'arnold-press', 'Arnold Press', 1, 3, 10, 90, null),
    ('Shoulder Pump', 'lateral-raise', 'Lateral Raise', 2, 3, 12, 60, null),
    ('Shoulder Pump', 'rear-delt-fly', 'Rear Delt Fly', 3, 3, 12, 60, null),
    ('Shoulder Pump', 'face-pull', 'Face Pull', 4, 3, 12, 60, null),
    ('Shoulder Pump', 'front-raise', 'Front Raise', 5, 2, 12, 45, null),

    -- Glute Focus
    ('Glute Focus', 'hip-thrust', 'Hip Thrust', 0, 4, 10, 90, null),
    ('Glute Focus', 'romanian-deadlift', 'Romanian Deadlift', 1, 3, 8, 120, null),
    ('Glute Focus', 'bulgarian-split-squat', 'Bulgarian Split Squat', 2, 3, 10, 90, 'Each leg'),
    ('Glute Focus', 'dumbbell-walking-lunge', 'Dumbbell Walking Lunge', 3, 3, 10, 75, null),
    ('Glute Focus', 'glute-bridge', 'Glute Bridge', 4, 3, 12, 60, null),

    -- Arm Pump
    ('Arm Pump', 'barbell-curl', 'Barbell Curl', 0, 3, 10, 60, null),
    ('Arm Pump', 'triceps-pushdown', 'Triceps Pushdown', 1, 3, 12, 60, null),
    ('Arm Pump', 'hammer-curl', 'Hammer Curl', 2, 3, 10, 60, null),
    ('Arm Pump', 'overhead-triceps-extension', 'Overhead Triceps Extension', 3, 3, 12, 60, null),
    ('Arm Pump', 'incline-dumbbell-curl', 'Incline Dumbbell Curl', 4, 2, 12, 45, null),
    ('Arm Pump', 'skull-crusher', 'Skull Crusher', 5, 2, 10, 60, null),

    -- Power Circuit
    ('Power Circuit', 'back-squat', 'Back Squat', 0, 4, 6, 90, 'Quality over speed'),
    ('Power Circuit', 'barbell-bench-press', 'Barbell Bench Press', 1, 4, 6, 90, null),
    ('Power Circuit', 'pull-up', 'Pull Up', 2, 3, 6, 75, null),
    ('Power Circuit', 'kettlebell-swings', 'Kettlebell Swings', 3, 3, 12, 60, null),
    ('Power Circuit', 'box-jump', 'Box Jump', 4, 3, 6, 75, 'Soft landings'),

    -- Engine Builder
    ('Engine Builder', 'running', 'Running', 0, 1, null, 0, '10–15 min easy'),
    ('Engine Builder', 'cycling', 'Cycling', 1, 1, null, 0, '10–15 min steady'),
    ('Engine Builder', 'rowing-machine', 'Rowing Machine', 2, 1, null, 0, '8–12 min steady'),
    ('Engine Builder', 'treadmill-run', 'Treadmill Run', 3, 1, null, 0, 'Optional finisher'),

    -- Jump Conditioner
    ('Jump Conditioner', 'box-jump', 'Box Jump', 0, 4, 6, 75, null),
    ('Jump Conditioner', 'burpees', 'Burpees', 1, 4, 10, 60, null),
    ('Jump Conditioner', 'high-knee', 'High Knee', 2, 4, null, 45, '30–40s'),
    ('Jump Conditioner', 'skater-jump', 'Skater Jump', 3, 3, 12, 60, 'Each side'),
    ('Jump Conditioner', 'mountain-climber', 'Mountain Climber', 4, 3, null, 45, '30–40s'),

    -- Calisthenics Starter
    ('Calisthenics Starter', 'push-up', 'Push-Up', 0, 3, 12, 75, null),
    ('Calisthenics Starter', 'australia-pull-up', 'Australian Pull-Up', 1, 3, 8, 75, null),
    ('Calisthenics Starter', 'dip', 'Dip', 2, 3, 8, 75, 'Bench dip OK'),
    ('Calisthenics Starter', 'reverse-lunge', 'Reverse Lunge', 3, 3, 10, 60, 'Each leg'),
    ('Calisthenics Starter', 'hollow-body-hold', 'Hollow Body Hold', 4, 3, null, 45, '20–30s'),
    ('Calisthenics Starter', 'plank', 'Plank', 5, 2, null, 45, '30s'),

    -- Core Crusher
    ('Core Crusher', 'plank', 'Plank', 0, 3, null, 45, '40–60s'),
    ('Core Crusher', 'hanging-leg-raise', 'Hanging Leg Raise', 1, 3, 10, 60, null),
    ('Core Crusher', 'ab-wheel-rollout', 'Ab Wheel Rollout', 2, 3, 8, 75, null),
    ('Core Crusher', 'russian-twist', 'Russian Twist', 3, 3, 16, 45, null),
    ('Core Crusher', 'bicycle-crunch', 'Bicycle Crunch', 4, 3, 16, 45, null),
    ('Core Crusher', 'cable-crunch', 'Cable Crunch', 5, 2, 12, 60, null),

    -- Mobility Flow
    ('Mobility Flow', 'cat-cow-flow', 'Cat Cow Flow', 0, 2, null, 0, '8–10 slow breaths'),
    ('Mobility Flow', 'world-greatest-stretch', 'World''s Greatest Stretch', 1, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'hip-flexor-lunge-stretch', 'Hip Flexor Lunge Stretch', 2, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'thoracic-opener', 'Thoracic Opener', 3, 2, null, 0, null),
    ('Mobility Flow', 'bird-dog', 'Bird Dog', 4, 2, 8, 0, 'Control'),

    -- Yoga Essentials
    ('Yoga Essentials', 'downward-facing-dog', 'Downward Facing Dog', 0, 2, null, 0, 'Hold + breathe'),
    ('Yoga Essentials', 'child-s-pose-to-down-dog', 'Child''s Pose to Down Dog', 1, 2, null, 0, null),
    ('Yoga Essentials', 'warrior-2', 'Warrior II', 2, 2, null, 0, 'Each side'),
    ('Yoga Essentials', 'bridge-pose-yoga', 'Bridge Pose Yoga', 3, 2, null, 0, null),
    ('Yoga Essentials', 'doorway-chest-stretch', 'Doorway Chest Stretch', 4, 2, null, 0, 'Optional closer'),

    -- Desk Reset
    ('Desk Reset', 'doorway-chest-stretch', 'Doorway Chest Stretch', 0, 2, null, 0, '30–45s'),
    ('Desk Reset', 'cat-cow-flow', 'Cat Cow Flow', 1, 2, null, 0, null),
    ('Desk Reset', 'seated-spinal-twist', 'Seated Spinal Twist', 2, 2, null, 0, 'Each side'),
    ('Desk Reset', 'neck-side-stretch', 'Neck Side Stretch', 3, 2, null, 0, 'Each side'),
    ('Desk Reset', 'hip-flexor-lunge-stretch', 'Hip Flexor Lunge Stretch', 4, 2, null, 0, 'Each side'),

    -- Push Hypertrophy (new)
    ('Push Hypertrophy', 'incline-dumbbell-bench-press', 'Incline Dumbbell Bench Press', 0, 4, 8, 120, null),
    ('Push Hypertrophy', 'barbell-bench-press', 'Barbell Bench Press', 1, 3, 8, 120, null),
    ('Push Hypertrophy', 'overhead-press', 'Overhead Press', 2, 3, 8, 90, null),
    ('Push Hypertrophy', 'cable-chest-fly', 'Cable Chest Fly', 3, 3, 12, 60, null),
    ('Push Hypertrophy', 'lateral-raise', 'Lateral Raise', 4, 3, 12, 60, null),
    ('Push Hypertrophy', 'rope-pushdown', 'Rope Pushdown', 5, 3, 12, 60, null),

    -- Pull Hypertrophy (new)
    ('Pull Hypertrophy', 'pull-up', 'Pull Up', 0, 4, 6, 120, null),
    ('Pull Hypertrophy', 'chest-supported-row', 'Chest Supported Row', 1, 4, 10, 90, null),
    ('Pull Hypertrophy', 'wide-grip-lat-pulldown', 'Wide Grip Lat Pulldown', 2, 3, 10, 90, null),
    ('Pull Hypertrophy', 'face-pull', 'Face Pull', 3, 3, 12, 60, null),
    ('Pull Hypertrophy', 'incline-dumbbell-curl', 'Incline Dumbbell Curl', 4, 3, 10, 60, null),
    ('Pull Hypertrophy', 'hammer-curl', 'Hammer Curl', 5, 2, 12, 45, null),

    -- Posterior Chain (new)
    ('Posterior Chain', 'conventional-deadlift', 'Conventional Deadlift', 0, 4, 5, 180, null),
    ('Posterior Chain', 'romanian-deadlift', 'Romanian Deadlift', 1, 3, 8, 120, null),
    ('Posterior Chain', 'hip-thrust', 'Hip Thrust', 2, 3, 10, 90, null),
    ('Posterior Chain', 'good-morning', 'Good Morning', 3, 3, 10, 90, 'Light–moderate'),
    ('Posterior Chain', 'face-pull', 'Face Pull', 4, 3, 12, 60, null),

    -- Quads Builder (new)
    ('Quads Builder', 'back-squat', 'Back Squat', 0, 4, 8, 150, null),
    ('Quads Builder', 'leg-press', 'Leg Press', 1, 3, 12, 90, null),
    ('Quads Builder', 'bulgarian-split-squat', 'Bulgarian Split Squat', 2, 3, 10, 90, 'Each leg'),
    ('Quads Builder', 'leg-extension', 'Leg Extension', 3, 3, 12, 60, null),
    ('Quads Builder', 'reverse-lunge', 'Reverse Lunge', 4, 2, 10, 75, 'Each leg'),

    -- Home Dumbbell (new)
    ('Home Dumbbell', 'goblet-squat', 'Goblet Squat', 0, 3, 12, 75, null),
    ('Home Dumbbell', 'dumbbell-bench-press', 'Dumbbell Bench Press', 1, 3, 10, 75, 'Floor press OK'),
    ('Home Dumbbell', 'one-arm-dumbbell-row', 'One Arm Dumbbell Row', 2, 3, 10, 75, 'Each arm'),
    ('Home Dumbbell', 'standing-dumbbell-shoulder-press', 'Standing Dumbbell Shoulder Press', 3, 3, 10, 75, null),
    ('Home Dumbbell', 'romanian-deadlift', 'Romanian Deadlift', 4, 3, 10, 90, 'Dumbbell RDL'),
    ('Home Dumbbell', 'plank', 'Plank', 5, 3, null, 45, '30–45s'),

    -- Fat-Loss Circuit (new)
    ('Fat-Loss Circuit', 'jump-rope', 'Jump Rope', 0, 4, null, 40, '40s'),
    ('Fat-Loss Circuit', 'burpees', 'Burpees', 1, 4, 10, 40, null),
    ('Fat-Loss Circuit', 'kettlebell-swings', 'Kettlebell Swings', 2, 4, 15, 40, 'Or hip hinge jumps'),
    ('Fat-Loss Circuit', 'mountain-climber', 'Mountain Climber', 3, 4, null, 40, '40s'),
    ('Fat-Loss Circuit', 'jumping-jacks', 'Jumping Jacks', 4, 3, null, 40, '40s'),
    ('Fat-Loss Circuit', 'bear-crawl', 'Bear Crawl', 5, 3, null, 45, '20–30s'),

    -- Advanced Calisthenics (new)
    ('Advanced Calisthenics', 'pull-up', 'Pull Up', 0, 4, 6, 120, 'Strict'),
    ('Advanced Calisthenics', 'dip', 'Dip', 1, 4, 8, 90, null),
    ('Advanced Calisthenics', 'push-up', 'Push-Up', 2, 3, 15, 75, 'Slow tempo'),
    ('Advanced Calisthenics', 'pistol-squat', 'Pistol Squat', 3, 3, 5, 90, 'Assisted OK'),
    ('Advanced Calisthenics', 'hanging-leg-raise', 'Hanging Leg Raise', 4, 3, 8, 60, null),
    ('Advanced Calisthenics', 'handstand-hold', 'Handstand Hold', 5, 3, null, 60, 'Wall OK'),

    -- Athletic Conditioning (new)
    ('Athletic Conditioning', 'box-jump', 'Box Jump', 0, 4, 5, 75, null),
    ('Athletic Conditioning', 'kettlebell-swings', 'Kettlebell Swings', 1, 4, 12, 60, null),
    ('Athletic Conditioning', 'skater-jump', 'Skater Jump', 2, 3, 12, 60, null),
    ('Athletic Conditioning', 'battle-ropes', 'Battle Ropes', 3, 3, null, 45, '30–40s'),
    ('Athletic Conditioning', 'bear-crawl', 'Bear Crawl', 4, 3, null, 45, '20–30s'),
    ('Athletic Conditioning', 'push-press', 'Push Press', 5, 3, 6, 75, 'Optional load')
) as x(template_name, slug, exercise_name, pos, sets, reps, rest_sec, notes)
  on x.template_name = t.name
join lateral (
  select ex.*
  from public.exercises ex
  where ex.is_system = true
    and (
      (x.slug is not null and ex.slug = x.slug)
      or lower(ex.name) = lower(x.exercise_name)
      or lower(regexp_replace(ex.name, '[^a-z0-9]+', '', 'g'))
        = lower(regexp_replace(x.exercise_name, '[^a-z0-9]+', '', 'g'))
      or (
        x.slug = 'back-squat'
        and lower(ex.name) in ('back squat', 'barbell back squat')
      )
      or (
        x.slug = 'pull-up'
        and lower(ex.name) in ('pull up', 'pull-up')
      )
      or (
        x.slug = 'dumbbell-walking-lunge'
        and lower(ex.name) in ('dumbbell walking lunge', 'walking lunge')
      )
      or (
        x.slug = 'cable-chest-fly'
        and lower(ex.name) in ('cable chest fly', 'cable fly')
      )
      or (
        x.slug = 'high-knee'
        and lower(ex.name) in ('high knee', 'high knees')
      )
      or (
        x.slug = 'downward-facing-dog'
        and lower(ex.name) in ('downward facing dog', 'downward-facing dog')
      )
      or (
        x.slug = 'cat-cow-flow'
        and lower(ex.name) in ('cat cow flow', 'cat-cow', 'cat-cow flow', 'cat cow')
      )
      or (
        x.slug = 'one-arm-dumbbell-row'
        and lower(ex.name) in ('one arm dumbbell row', 'dumbbell row', 'one-arm dumbbell row')
      )
      or (
        x.slug = 'seated-dumbbell-shoulder-press'
        and lower(ex.name) in (
          'seated dumbbell shoulder press',
          'dumbbell shoulder press',
          'standing dumbbell shoulder press'
        )
      )
      or (
        x.slug = 'triceps-pushdown'
        and (
          lower(ex.name) in ('triceps pushdown', 'tricep pushdown')
          or ex.slug in ('tricep-pushdown', 'triceps-pushdown')
        )
      )
      or (
        x.slug = 'bicycle-crunch'
        and (
          lower(ex.name) in ('bicycle crunch', 'bicycles crunches')
          or ex.slug in ('bicycle-crunch', 'bicycles-crunches')
        )
      )
      or (
        x.slug = 'australia-pull-up'
        and (
          lower(ex.name) like 'australian pull%'
          or ex.slug in ('australia-pull-up', 'australian-pull-up')
        )
      )
      or (
        x.slug = 'world-greatest-stretch'
        and lower(ex.name) like '%greatest stretch%'
      )
      or (
        x.slug = 'child-s-pose-to-down-dog'
        and lower(ex.name) like '%child%down dog%'
      )
      or (
        x.slug = 'warrior-2'
        and lower(ex.name) in ('warrior ii', 'warrior 2', 'warrior ii yoga')
      )
      or (
        x.slug = 'pistol-squat'
        and lower(ex.name) = 'pistol squat'
      )
    )
  order by
    case
      when ex.slug = x.slug then 0
      when lower(ex.name) = lower(x.exercise_name) then 1
      else 2
    end
  limit 1
) e on true
where t.is_system = true;
