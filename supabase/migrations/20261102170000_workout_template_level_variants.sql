-- Seed Beginner / Intermediate / Advanced variations for system templates.
-- Existing variation exercises stay as the primary level; missing levels get
-- independent exercise lists (not copies with tweaked sets/reps).

-- ---------- ensure all three levels exist ----------
insert into public.workout_template_variations (
  template_id, training_level, description, estimated_minutes
)
select
  t.id,
  lvl.training_level,
  lvl.description,
  greatest(
    15,
    coalesce(t.estimated_minutes, 45)
      + case lvl.training_level
          when 'beginner' then -10
          when 'intermediate' then 0
          else 15
        end
  )
from public.workout_templates t
cross join (
  values
    ('beginner'::text, 'Simpler selection, manageable volume, focus on form.'),
    ('intermediate', 'Balanced compound + isolation volume for trained lifters.'),
    ('advanced', 'Higher volume and specialized selections for experienced trainees.')
) as lvl(training_level, description)
where t.is_system = true
  and not exists (
    select 1
    from public.workout_template_variations v
    where v.template_id = t.id
      and v.training_level = lvl.training_level
  );

-- ---------- seed missing level exercise lists ----------
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
join lateral (
  values
    -- ===================== Push Day =====================
    ('Push Day', 'beginner', 'Chest Press Machine', 0, 3, 12, 90, 'Learn pressing path'),
    ('Push Day', 'beginner', 'Incline Push-Up', 1, 3, 10, 75, 'Hands elevated OK'),
    ('Push Day', 'beginner', 'Machine Shoulder Press', 2, 3, 10, 75, null),
    ('Push Day', 'beginner', 'Lateral Raise', 3, 2, 12, 60, 'Light dumbbells'),
    ('Push Day', 'beginner', 'Triceps Pushdown', 4, 3, 12, 60, null),

    ('Push Day', 'advanced', 'Barbell Bench Press', 0, 5, 6, 150, 'Top set heavy'),
    ('Push Day', 'advanced', 'Incline Barbell Bench Press', 1, 4, 8, 120, null),
    ('Push Day', 'advanced', 'Chest Dip', 2, 3, 8, 90, 'Add weight if able'),
    ('Push Day', 'advanced', 'Seated Dumbbell Shoulder Press', 3, 4, 8, 90, null),
    ('Push Day', 'advanced', 'Cable Lateral Raise', 4, 3, 15, 45, 'Constant tension'),
    ('Push Day', 'advanced', 'Pec Deck Fly', 5, 3, 12, 60, null),
    ('Push Day', 'advanced', 'Overhead Triceps Extension', 6, 3, 12, 60, null),

    -- ===================== Push Hypertrophy =====================
    ('Push Hypertrophy', 'beginner', 'Chest Press Machine', 0, 3, 12, 90, null),
    ('Push Hypertrophy', 'beginner', 'Incline Dumbbell Bench Press', 1, 3, 10, 75, 'Moderate incline'),
    ('Push Hypertrophy', 'beginner', 'Lateral Raise', 2, 3, 12, 60, null),
    ('Push Hypertrophy', 'beginner', 'Triceps Pushdown', 3, 3, 12, 60, null),

    ('Push Hypertrophy', 'advanced', 'Barbell Bench Press', 0, 4, 6, 150, null),
    ('Push Hypertrophy', 'advanced', 'Incline Dumbbell Bench Press', 1, 4, 8, 120, null),
    ('Push Hypertrophy', 'advanced', 'Chest Dip', 2, 3, 8, 90, 'Lean forward'),
    ('Push Hypertrophy', 'advanced', 'Seated Dumbbell Shoulder Press', 3, 4, 8, 90, null),
    ('Push Hypertrophy', 'advanced', 'Cable Lateral Raise', 4, 4, 12, 45, null),
    ('Push Hypertrophy', 'advanced', 'Pec Deck Fly', 5, 3, 15, 45, null),
    ('Push Hypertrophy', 'advanced', 'Overhead Triceps Extension', 6, 3, 12, 60, null),

    -- ===================== Pull Day =====================
    ('Pull Day', 'beginner', 'Lat Pulldown', 0, 3, 12, 90, 'Full stretch'),
    ('Pull Day', 'beginner', 'Machine Row', 1, 3, 12, 75, null),
    ('Pull Day', 'beginner', 'Face Pull', 2, 3, 15, 60, null),
    ('Pull Day', 'beginner', 'Dumbbell Curl', 3, 3, 12, 60, null),

    ('Pull Day', 'advanced', 'Pull-Up', 0, 5, 6, 120, 'Weighted if able'),
    ('Pull Day', 'advanced', 'Bent-Over Barbell Row', 1, 4, 8, 120, null),
    ('Pull Day', 'advanced', 'Chest-Supported Row', 2, 4, 10, 90, null),
    ('Pull Day', 'advanced', 'Straight-Arm Pulldown', 3, 3, 12, 60, null),
    ('Pull Day', 'advanced', 'Face Pull', 4, 3, 15, 45, null),
    ('Pull Day', 'advanced', 'Incline Dumbbell Curl', 5, 3, 10, 60, null),
    ('Pull Day', 'advanced', 'Hammer Curl', 6, 3, 12, 45, null),

    -- ===================== Pull Hypertrophy =====================
    ('Pull Hypertrophy', 'beginner', 'Wide-Grip Lat Pulldown', 0, 3, 12, 90, null),
    ('Pull Hypertrophy', 'beginner', 'Seated Cable Row', 1, 3, 12, 75, null),
    ('Pull Hypertrophy', 'beginner', 'Face Pull', 2, 3, 15, 60, null),
    ('Pull Hypertrophy', 'beginner', 'Dumbbell Curl', 3, 3, 12, 60, null),

    ('Pull Hypertrophy', 'advanced', 'Pull-Up', 0, 4, 6, 120, null),
    ('Pull Hypertrophy', 'advanced', 'T-Bar Row', 1, 4, 8, 90, null),
    ('Pull Hypertrophy', 'advanced', 'Single-Arm Cable Row', 2, 3, 10, 75, 'Each arm'),
    ('Pull Hypertrophy', 'advanced', 'Wide-Grip Lat Pulldown', 3, 3, 10, 75, null),
    ('Pull Hypertrophy', 'advanced', 'Face Pull', 4, 3, 15, 45, null),
    ('Pull Hypertrophy', 'advanced', 'Bayesian Cable Curl', 5, 3, 12, 45, null),
    ('Pull Hypertrophy', 'advanced', 'Hammer Curl', 6, 3, 12, 45, null),

    -- ===================== Full Body =====================
    ('Full Body', 'intermediate', 'Barbell Back Squat', 0, 4, 8, 120, null),
    ('Full Body', 'intermediate', 'Barbell Bench Press', 1, 4, 8, 120, null),
    ('Full Body', 'intermediate', 'One-Arm Dumbbell Row', 2, 3, 10, 90, 'Each arm'),
    ('Full Body', 'intermediate', 'Romanian Deadlift', 3, 3, 8, 120, null),
    ('Full Body', 'intermediate', 'Lateral Raise', 4, 3, 12, 60, null),
    ('Full Body', 'intermediate', 'Plank', 5, 3, null, 45, '40s'),

    ('Full Body', 'advanced', 'Barbell Back Squat', 0, 5, 5, 150, null),
    ('Full Body', 'advanced', 'Barbell Bench Press', 1, 4, 6, 120, null),
    ('Full Body', 'advanced', 'Conventional Deadlift', 2, 3, 5, 180, null),
    ('Full Body', 'advanced', 'Pull-Up', 3, 4, 6, 90, null),
    ('Full Body', 'advanced', 'Overhead Press', 4, 3, 8, 90, null),
    ('Full Body', 'advanced', 'Hanging Leg Raise', 5, 3, 10, 60, null),

    -- ===================== Upper Body =====================
    ('Upper Body', 'beginner', 'Chest Press Machine', 0, 3, 12, 90, null),
    ('Upper Body', 'beginner', 'Lat Pulldown', 1, 3, 12, 90, null),
    ('Upper Body', 'beginner', 'Machine Shoulder Press', 2, 3, 10, 75, null),
    ('Upper Body', 'beginner', 'Machine Row', 3, 3, 12, 75, null),
    ('Upper Body', 'beginner', 'Triceps Pushdown', 4, 2, 12, 60, null),

    ('Upper Body', 'advanced', 'Barbell Bench Press', 0, 4, 6, 150, null),
    ('Upper Body', 'advanced', 'Pull-Up', 1, 4, 6, 120, null),
    ('Upper Body', 'advanced', 'Overhead Press', 2, 4, 8, 90, null),
    ('Upper Body', 'advanced', 'Chest-Supported Row', 3, 4, 8, 90, null),
    ('Upper Body', 'advanced', 'Cable Lateral Raise', 4, 3, 15, 45, null),
    ('Upper Body', 'advanced', 'Close-Grip Bench Press', 5, 3, 8, 75, null),
    ('Upper Body', 'advanced', 'Incline Dumbbell Curl', 6, 3, 10, 60, null),

    -- ===================== Lower Body =====================
    ('Lower Body', 'beginner', 'Goblet Squat', 0, 3, 12, 90, null),
    ('Lower Body', 'beginner', 'Romanian Deadlift', 1, 3, 10, 90, 'Light–moderate'),
    ('Lower Body', 'beginner', 'Reverse Lunge', 2, 3, 10, 75, 'Each leg'),
    ('Lower Body', 'beginner', 'Glute Bridge', 3, 3, 12, 60, null),
    ('Lower Body', 'beginner', 'Standing Calf Raise', 4, 3, 15, 45, null),

    ('Lower Body', 'advanced', 'Barbell Back Squat', 0, 5, 5, 180, null),
    ('Lower Body', 'advanced', 'Romanian Deadlift', 1, 4, 6, 150, null),
    ('Lower Body', 'advanced', 'Bulgarian Split Squat', 2, 4, 8, 90, 'Each leg'),
    ('Lower Body', 'advanced', 'Leg Press', 3, 3, 12, 90, null),
    ('Lower Body', 'advanced', 'Lying Leg Curl', 4, 3, 12, 60, null),
    ('Lower Body', 'advanced', 'Walking Lunge', 5, 3, 12, 75, null),
    ('Lower Body', 'advanced', 'Standing Calf Raise', 6, 4, 12, 45, null),

    -- ===================== Leg Day =====================
    ('Leg Day', 'beginner', 'Goblet Squat', 0, 3, 12, 90, null),
    ('Leg Day', 'beginner', 'Leg Press', 1, 3, 12, 90, null),
    ('Leg Day', 'beginner', 'Romanian Deadlift', 2, 3, 10, 90, null),
    ('Leg Day', 'beginner', 'Leg Extension', 3, 3, 12, 60, null),
    ('Leg Day', 'beginner', 'Standing Calf Raise', 4, 3, 15, 45, null),

    ('Leg Day', 'advanced', 'Barbell Back Squat', 0, 5, 5, 180, null),
    ('Leg Day', 'advanced', 'Front Squat', 1, 4, 6, 150, null),
    ('Leg Day', 'advanced', 'Romanian Deadlift', 2, 4, 8, 120, null),
    ('Leg Day', 'advanced', 'Bulgarian Split Squat', 3, 3, 8, 90, 'Each leg'),
    ('Leg Day', 'advanced', 'Leg Extension', 4, 3, 15, 45, null),
    ('Leg Day', 'advanced', 'Lying Leg Curl', 5, 3, 12, 60, null),
    ('Leg Day', 'advanced', 'Walking Lunge', 6, 3, 12, 60, null),
    ('Leg Day', 'advanced', 'Standing Calf Raise', 7, 4, 12, 45, null),

    -- ===================== Beginner Strength =====================
    ('Beginner Strength', 'intermediate', 'Goblet Squat', 0, 4, 10, 90, null),
    ('Beginner Strength', 'intermediate', 'Dumbbell Bench Press', 1, 4, 8, 90, null),
    ('Beginner Strength', 'intermediate', 'One-Arm Dumbbell Row', 2, 3, 10, 75, 'Each arm'),
    ('Beginner Strength', 'intermediate', 'Romanian Deadlift', 3, 3, 10, 90, null),
    ('Beginner Strength', 'intermediate', 'Dumbbell Shoulder Press', 4, 3, 10, 75, null),
    ('Beginner Strength', 'intermediate', 'Plank', 5, 3, null, 45, '40s'),

    ('Beginner Strength', 'advanced', 'Barbell Back Squat', 0, 4, 6, 150, null),
    ('Beginner Strength', 'advanced', 'Barbell Bench Press', 1, 4, 6, 120, null),
    ('Beginner Strength', 'advanced', 'Bent-Over Barbell Row', 2, 4, 8, 90, null),
    ('Beginner Strength', 'advanced', 'Romanian Deadlift', 3, 3, 8, 120, null),
    ('Beginner Strength', 'advanced', 'Overhead Press', 4, 3, 8, 90, null),
    ('Beginner Strength', 'advanced', 'Pull-Up', 5, 3, 6, 90, 'Band OK'),
    ('Beginner Strength', 'advanced', 'Hanging Knee Raise', 6, 3, 10, 60, null),

    -- ===================== Chest Builder =====================
    ('Chest Builder', 'beginner', 'Chest Press Machine', 0, 3, 12, 90, null),
    ('Chest Builder', 'beginner', 'Incline Push-Up', 1, 3, 10, 75, null),
    ('Chest Builder', 'beginner', 'Pec Deck Fly', 2, 3, 12, 60, null),
    ('Chest Builder', 'beginner', 'Push-Up', 3, 2, 10, 60, 'Kneeling OK'),

    ('Chest Builder', 'advanced', 'Barbell Bench Press', 0, 5, 5, 150, null),
    ('Chest Builder', 'advanced', 'Incline Barbell Bench Press', 1, 4, 8, 120, null),
    ('Chest Builder', 'advanced', 'Dumbbell Bench Press', 2, 3, 10, 90, null),
    ('Chest Builder', 'advanced', 'Cable Fly', 3, 3, 12, 60, null),
    ('Chest Builder', 'advanced', 'Chest Dip', 4, 3, 8, 75, null),
    ('Chest Builder', 'advanced', 'Pec Deck Fly', 5, 3, 15, 45, null),

    -- ===================== Back Builder =====================
    ('Back Builder', 'beginner', 'Lat Pulldown', 0, 3, 12, 90, null),
    ('Back Builder', 'beginner', 'Machine Row', 1, 3, 12, 75, null),
    ('Back Builder', 'beginner', 'Seated Cable Row', 2, 3, 12, 75, null),
    ('Back Builder', 'beginner', 'Face Pull', 3, 3, 15, 60, null),

    ('Back Builder', 'advanced', 'Pull-Up', 0, 5, 5, 120, null),
    ('Back Builder', 'advanced', 'Bent-Over Barbell Row', 1, 4, 8, 120, null),
    ('Back Builder', 'advanced', 'Chest-Supported Row', 2, 4, 10, 90, null),
    ('Back Builder', 'advanced', 'Wide-Grip Lat Pulldown', 3, 3, 10, 75, null),
    ('Back Builder', 'advanced', 'Straight-Arm Pulldown', 4, 3, 12, 60, null),
    ('Back Builder', 'advanced', 'Face Pull', 5, 3, 15, 45, null),

    -- ===================== Shoulder Pump =====================
    ('Shoulder Pump', 'beginner', 'Machine Shoulder Press', 0, 3, 12, 75, null),
    ('Shoulder Pump', 'beginner', 'Lateral Raise', 1, 3, 12, 60, null),
    ('Shoulder Pump', 'beginner', 'Front Raise', 2, 2, 12, 45, null),
    ('Shoulder Pump', 'beginner', 'Face Pull', 3, 3, 15, 60, null),

    ('Shoulder Pump', 'advanced', 'Overhead Press', 0, 4, 6, 120, null),
    ('Shoulder Pump', 'advanced', 'Arnold Press', 1, 4, 8, 90, null),
    ('Shoulder Pump', 'advanced', 'Cable Lateral Raise', 2, 4, 15, 45, null),
    ('Shoulder Pump', 'advanced', 'Rear Delt Fly', 3, 4, 12, 45, null),
    ('Shoulder Pump', 'advanced', 'Face Pull', 4, 3, 15, 45, null),
    ('Shoulder Pump', 'advanced', 'Upright Row', 5, 3, 10, 60, 'Light, elbows high'),
    ('Shoulder Pump', 'advanced', 'Front Raise', 6, 2, 12, 45, null),

    -- ===================== Glute Focus =====================
    ('Glute Focus', 'beginner', 'Glute Bridge', 0, 3, 15, 60, null),
    ('Glute Focus', 'beginner', 'Goblet Squat', 1, 3, 12, 75, null),
    ('Glute Focus', 'beginner', 'Reverse Lunge', 2, 3, 10, 75, 'Each leg'),
    ('Glute Focus', 'beginner', 'Cable Pull-Through', 3, 3, 12, 60, null),

    ('Glute Focus', 'advanced', 'Hip Thrust', 0, 5, 8, 90, 'Pause at top'),
    ('Glute Focus', 'advanced', 'Romanian Deadlift', 1, 4, 8, 120, null),
    ('Glute Focus', 'advanced', 'Bulgarian Split Squat', 2, 4, 8, 90, 'Each leg'),
    ('Glute Focus', 'advanced', 'Single-Leg Romanian Deadlift', 3, 3, 10, 75, 'Each leg'),
    ('Glute Focus', 'advanced', 'Walking Lunge', 4, 3, 12, 60, null),
    ('Glute Focus', 'advanced', 'Single-Leg Glute Bridge', 5, 3, 12, 45, 'Each side'),

    -- ===================== Arm Pump =====================
    ('Arm Pump', 'intermediate', 'Barbell Curl', 0, 4, 10, 60, null),
    ('Arm Pump', 'intermediate', 'Triceps Pushdown', 1, 4, 12, 60, null),
    ('Arm Pump', 'intermediate', 'Hammer Curl', 2, 3, 10, 60, null),
    ('Arm Pump', 'intermediate', 'Overhead Triceps Extension', 3, 3, 12, 60, null),
    ('Arm Pump', 'intermediate', 'Incline Dumbbell Curl', 4, 3, 12, 45, null),
    ('Arm Pump', 'intermediate', 'Rope Pushdown', 5, 3, 12, 45, null),

    ('Arm Pump', 'advanced', 'EZ-Bar Curl', 0, 4, 8, 75, null),
    ('Arm Pump', 'advanced', 'Close-Grip Bench Press', 1, 4, 8, 90, null),
    ('Arm Pump', 'advanced', 'Incline Dumbbell Curl', 2, 3, 10, 60, null),
    ('Arm Pump', 'advanced', 'Skull Crusher', 3, 3, 10, 60, null),
    ('Arm Pump', 'advanced', 'Bayesian Cable Curl', 4, 3, 12, 45, null),
    ('Arm Pump', 'advanced', 'Rope Pushdown', 5, 3, 15, 45, null),
    ('Arm Pump', 'advanced', 'Hammer Curl', 6, 3, 12, 45, null),

    -- ===================== Power Circuit =====================
    ('Power Circuit', 'beginner', 'Goblet Squat', 0, 3, 10, 75, null),
    ('Power Circuit', 'beginner', 'Push-Up', 1, 3, 10, 60, null),
    ('Power Circuit', 'beginner', 'Australian Pull-Up', 2, 3, 8, 75, null),
    ('Power Circuit', 'beginner', 'Box Jump', 3, 3, 5, 75, 'Low box'),
    ('Power Circuit', 'beginner', 'Plank', 4, 3, null, 45, '30s'),

    ('Power Circuit', 'intermediate', 'Barbell Back Squat', 0, 4, 6, 90, null),
    ('Power Circuit', 'intermediate', 'Barbell Bench Press', 1, 4, 6, 90, null),
    ('Power Circuit', 'intermediate', 'Pull-Up', 2, 3, 6, 75, null),
    ('Power Circuit', 'intermediate', 'Kettlebell Swings', 3, 3, 12, 60, null),
    ('Power Circuit', 'intermediate', 'Box Jump', 4, 3, 6, 75, null),

    -- ===================== Posterior Chain =====================
    ('Posterior Chain', 'beginner', 'Romanian Deadlift', 0, 3, 10, 90, 'Light'),
    ('Posterior Chain', 'beginner', 'Glute Bridge', 1, 3, 12, 60, null),
    ('Posterior Chain', 'beginner', 'Back Extension', 2, 3, 12, 60, null),
    ('Posterior Chain', 'beginner', 'Seated Leg Curl', 3, 3, 12, 60, null),
    ('Posterior Chain', 'beginner', 'Face Pull', 4, 2, 15, 45, null),

    ('Posterior Chain', 'advanced', 'Conventional Deadlift', 0, 5, 3, 180, null),
    ('Posterior Chain', 'advanced', 'Romanian Deadlift', 1, 4, 6, 120, null),
    ('Posterior Chain', 'advanced', 'Hip Thrust', 2, 4, 8, 90, null),
    ('Posterior Chain', 'advanced', 'Nordic Hamstring Curl', 3, 3, 6, 90, 'Assisted OK'),
    ('Posterior Chain', 'advanced', 'Good Morning', 4, 3, 8, 90, null),
    ('Posterior Chain', 'advanced', 'Face Pull', 5, 3, 15, 45, null),

    -- ===================== Quads Builder =====================
    ('Quads Builder', 'beginner', 'Goblet Squat', 0, 3, 12, 90, null),
    ('Quads Builder', 'beginner', 'Leg Press', 1, 3, 12, 90, null),
    ('Quads Builder', 'beginner', 'Leg Extension', 2, 3, 12, 60, null),
    ('Quads Builder', 'beginner', 'Reverse Lunge', 3, 3, 10, 75, 'Each leg'),

    ('Quads Builder', 'advanced', 'Barbell Back Squat', 0, 5, 5, 180, null),
    ('Quads Builder', 'advanced', 'Front Squat', 1, 4, 6, 150, null),
    ('Quads Builder', 'advanced', 'Hack Squat', 2, 3, 10, 90, null),
    ('Quads Builder', 'advanced', 'Bulgarian Split Squat', 3, 3, 8, 90, 'Each leg'),
    ('Quads Builder', 'advanced', 'Leg Extension', 4, 4, 12, 45, null),
    ('Quads Builder', 'advanced', 'Walking Lunge', 5, 3, 12, 60, null),

    -- ===================== Home Dumbbell =====================
    ('Home Dumbbell', 'intermediate', 'Goblet Squat', 0, 4, 10, 75, null),
    ('Home Dumbbell', 'intermediate', 'Dumbbell Bench Press', 1, 4, 8, 75, null),
    ('Home Dumbbell', 'intermediate', 'One-Arm Dumbbell Row', 2, 3, 10, 75, 'Each arm'),
    ('Home Dumbbell', 'intermediate', 'Standing Dumbbell Shoulder Press', 3, 3, 10, 75, null),
    ('Home Dumbbell', 'intermediate', 'Romanian Deadlift', 4, 3, 10, 90, null),
    ('Home Dumbbell', 'intermediate', 'Hammer Curl', 5, 2, 12, 45, null),
    ('Home Dumbbell', 'intermediate', 'Plank', 6, 3, null, 45, null),

    ('Home Dumbbell', 'advanced', 'Bulgarian Split Squat', 0, 4, 8, 90, 'Each leg'),
    ('Home Dumbbell', 'advanced', 'Dumbbell Bench Press', 1, 4, 8, 75, null),
    ('Home Dumbbell', 'advanced', 'One-Arm Dumbbell Row', 2, 4, 8, 75, 'Each arm'),
    ('Home Dumbbell', 'advanced', 'Standing Dumbbell Shoulder Press', 3, 4, 8, 75, null),
    ('Home Dumbbell', 'advanced', 'Single-Leg Romanian Deadlift', 4, 3, 10, 75, 'Each leg'),
    ('Home Dumbbell', 'advanced', 'Arnold Press', 5, 3, 10, 60, null),
    ('Home Dumbbell', 'advanced', 'Side Plank', 6, 3, null, 45, 'Each side'),

    -- ===================== HIIT =====================
    ('HIIT', 'beginner', 'Jumping Jacks', 0, 4, null, 40, '30s work'),
    ('HIIT', 'beginner', 'High Knee', 1, 4, null, 40, '30s'),
    ('HIIT', 'beginner', 'Mountain Climber', 2, 3, null, 40, '30s'),
    ('HIIT', 'beginner', 'Bodyweight Squat', 3, 3, 15, 45, null),
    ('HIIT', 'beginner', 'Plank', 4, 3, null, 40, '20–30s'),

    ('HIIT', 'advanced', 'Burpees', 0, 6, 12, 30, null),
    ('HIIT', 'advanced', 'Box Jump', 1, 5, 8, 40, null),
    ('HIIT', 'advanced', 'Jump Rope', 2, 5, null, 30, '40s hard'),
    ('HIIT', 'advanced', 'Mountain Climber', 3, 5, null, 30, '40s'),
    ('HIIT', 'advanced', 'Kettlebell Swings', 4, 4, 15, 40, null),
    ('HIIT', 'advanced', 'Bear Crawl', 5, 3, null, 40, '30s'),

    -- ===================== Fat-Loss Circuit =====================
    ('Fat-Loss Circuit', 'beginner', 'Jumping Jacks', 0, 3, null, 40, '30s'),
    ('Fat-Loss Circuit', 'beginner', 'Bodyweight Squat', 1, 3, 15, 40, null),
    ('Fat-Loss Circuit', 'beginner', 'Push-Up', 2, 3, 8, 40, 'Kneeling OK'),
    ('Fat-Loss Circuit', 'beginner', 'Mountain Climber', 3, 3, null, 40, '30s'),
    ('Fat-Loss Circuit', 'beginner', 'Plank', 4, 3, null, 40, '30s'),

    ('Fat-Loss Circuit', 'advanced', 'Burpees', 0, 5, 12, 30, null),
    ('Fat-Loss Circuit', 'advanced', 'Kettlebell Swings', 1, 5, 15, 30, null),
    ('Fat-Loss Circuit', 'advanced', 'Jump Rope', 2, 4, null, 30, '45s'),
    ('Fat-Loss Circuit', 'advanced', 'Box Jump', 3, 4, 8, 40, null),
    ('Fat-Loss Circuit', 'advanced', 'Mountain Climber', 4, 4, null, 30, '40s'),
    ('Fat-Loss Circuit', 'advanced', 'Bear Crawl', 5, 3, null, 40, '30s'),
    ('Fat-Loss Circuit', 'advanced', 'Battle Ropes', 6, 3, null, 40, '30s'),

    -- ===================== Engine Builder =====================
    ('Engine Builder', 'intermediate', 'Running', 0, 1, null, 0, '15–20 min steady'),
    ('Engine Builder', 'intermediate', 'Rowing Machine', 1, 1, null, 0, '10–12 min'),
    ('Engine Builder', 'intermediate', 'Cycling', 2, 1, null, 0, '10–15 min'),
    ('Engine Builder', 'intermediate', 'Jump Rope', 3, 3, null, 45, '60s easy'),

    ('Engine Builder', 'advanced', 'Running', 0, 1, null, 0, '20–25 min tempo'),
    ('Engine Builder', 'advanced', 'Row Intervals', 1, 6, null, 60, '60s hard / 60s easy'),
    ('Engine Builder', 'advanced', 'Cycling', 2, 1, null, 0, '15 min hard'),
    ('Engine Builder', 'advanced', 'Jump Rope', 3, 4, null, 30, '45s hard'),
    ('Engine Builder', 'advanced', 'Burpees', 4, 3, 10, 45, 'Finisher'),

    -- ===================== Jump Conditioner =====================
    ('Jump Conditioner', 'beginner', 'Jumping Jacks', 0, 3, null, 45, '30s'),
    ('Jump Conditioner', 'beginner', 'Bodyweight Squat', 1, 3, 12, 60, null),
    ('Jump Conditioner', 'beginner', 'High Knee', 2, 3, null, 45, '20–30s'),
    ('Jump Conditioner', 'beginner', 'Box Jump', 3, 3, 4, 75, 'Low box, soft land'),
    ('Jump Conditioner', 'beginner', 'Plank', 4, 2, null, 45, null),

    ('Jump Conditioner', 'advanced', 'Box Jump', 0, 5, 6, 60, null),
    ('Jump Conditioner', 'advanced', 'Burpees', 1, 5, 12, 45, null),
    ('Jump Conditioner', 'advanced', 'Skater Jump', 2, 4, 14, 45, null),
    ('Jump Conditioner', 'advanced', 'High Knee', 3, 4, null, 30, '40s'),
    ('Jump Conditioner', 'advanced', 'Mountain Climber', 4, 4, null, 30, '40s'),
    ('Jump Conditioner', 'advanced', 'Jump Rope', 5, 3, null, 30, '45s'),

    -- ===================== Athletic Conditioning =====================
    ('Athletic Conditioning', 'beginner', 'Box Jump', 0, 3, 4, 75, 'Low box'),
    ('Athletic Conditioning', 'beginner', 'Reverse Lunge', 1, 3, 10, 60, 'Each leg'),
    ('Athletic Conditioning', 'beginner', 'Push-Up', 2, 3, 8, 60, null),
    ('Athletic Conditioning', 'beginner', 'Bear Crawl', 3, 2, null, 45, '20s'),
    ('Athletic Conditioning', 'beginner', 'Plank', 4, 3, null, 45, null),

    ('Athletic Conditioning', 'advanced', 'Box Jump', 0, 5, 5, 60, null),
    ('Athletic Conditioning', 'advanced', 'Push Press', 1, 4, 5, 75, null),
    ('Athletic Conditioning', 'advanced', 'Kettlebell Swings', 2, 4, 12, 45, null),
    ('Athletic Conditioning', 'advanced', 'Skater Jump', 3, 4, 12, 45, null),
    ('Athletic Conditioning', 'advanced', 'Battle Ropes', 4, 4, null, 30, '40s'),
    ('Athletic Conditioning', 'advanced', 'Bear Crawl', 5, 3, null, 40, '30s'),
    ('Athletic Conditioning', 'advanced', 'Burpees', 6, 3, 10, 45, null),

    -- ===================== Calisthenics Starter =====================
    ('Calisthenics Starter', 'intermediate', 'Push-Up', 0, 4, 12, 60, null),
    ('Calisthenics Starter', 'intermediate', 'Australian Pull-Up', 1, 4, 10, 75, null),
    ('Calisthenics Starter', 'intermediate', 'Dip', 2, 3, 10, 75, null),
    ('Calisthenics Starter', 'intermediate', 'Bulgarian Split Squat', 3, 3, 10, 75, 'Each leg'),
    ('Calisthenics Starter', 'intermediate', 'Hollow Body Hold', 4, 3, null, 45, '30s'),
    ('Calisthenics Starter', 'intermediate', 'Side Plank', 5, 3, null, 45, 'Each side'),

    ('Calisthenics Starter', 'advanced', 'Diamond Push-Up', 0, 4, 12, 60, null),
    ('Calisthenics Starter', 'advanced', 'Pull-Up', 1, 4, 8, 90, null),
    ('Calisthenics Starter', 'advanced', 'Dip', 2, 4, 10, 75, null),
    ('Calisthenics Starter', 'advanced', 'Pistol Squat', 3, 3, 5, 90, 'Assisted OK'),
    ('Calisthenics Starter', 'advanced', 'Hanging Leg Raise', 4, 3, 10, 60, null),
    ('Calisthenics Starter', 'advanced', 'Pike Push-Up', 5, 3, 8, 75, null),

    -- ===================== Advanced Calisthenics =====================
    ('Advanced Calisthenics', 'beginner', 'Incline Push-Up', 0, 3, 10, 75, null),
    ('Advanced Calisthenics', 'beginner', 'Australian Pull-Up', 1, 3, 8, 75, null),
    ('Advanced Calisthenics', 'beginner', 'Bench Dip', 2, 3, 10, 75, null),
    ('Advanced Calisthenics', 'beginner', 'Reverse Lunge', 3, 3, 10, 60, 'Each leg'),
    ('Advanced Calisthenics', 'beginner', 'Plank', 4, 3, null, 45, null),

    ('Advanced Calisthenics', 'intermediate', 'Push-Up', 0, 4, 12, 60, null),
    ('Advanced Calisthenics', 'intermediate', 'Pull-Up', 1, 4, 6, 90, 'Band OK'),
    ('Advanced Calisthenics', 'intermediate', 'Dip', 2, 3, 8, 75, null),
    ('Advanced Calisthenics', 'intermediate', 'Bulgarian Split Squat', 3, 3, 8, 75, null),
    ('Advanced Calisthenics', 'intermediate', 'Hanging Knee Raise', 4, 3, 10, 60, null),
    ('Advanced Calisthenics', 'intermediate', 'Pike Push-Up', 5, 3, 8, 75, null),

    -- ===================== Core Workout =====================
    ('Core Workout', 'intermediate', 'Plank', 0, 3, null, 45, '45–60s'),
    ('Core Workout', 'intermediate', 'Hanging Knee Raise', 1, 3, 12, 45, null),
    ('Core Workout', 'intermediate', 'Russian Twist', 2, 3, 16, 45, null),
    ('Core Workout', 'intermediate', 'Bicycle Crunch', 3, 3, 20, 45, null),
    ('Core Workout', 'intermediate', 'Pallof Press', 4, 3, 12, 60, 'Each side'),
    ('Core Workout', 'intermediate', 'Dead Bug', 5, 2, 12, 45, null),

    ('Core Workout', 'advanced', 'Hanging Leg Raise', 0, 4, 10, 60, null),
    ('Core Workout', 'advanced', 'Ab Wheel Rollout', 1, 4, 8, 75, null),
    ('Core Workout', 'advanced', 'Cable Crunch', 2, 3, 12, 60, null),
    ('Core Workout', 'advanced', 'Pallof Press', 3, 3, 12, 45, 'Each side'),
    ('Core Workout', 'advanced', 'Side Plank', 4, 3, null, 45, 'Each side'),
    ('Core Workout', 'advanced', 'Russian Twist', 5, 3, 20, 45, null),

    -- ===================== Core Crusher =====================
    ('Core Crusher', 'beginner', 'Plank', 0, 3, null, 45, '30s'),
    ('Core Crusher', 'beginner', 'Dead Bug', 1, 3, 10, 45, null),
    ('Core Crusher', 'beginner', 'Bird Dog', 2, 3, 10, 45, null),
    ('Core Crusher', 'beginner', 'Bicycle Crunch', 3, 3, 16, 45, null),
    ('Core Crusher', 'beginner', 'Glute Bridge', 4, 2, 12, 45, null),

    ('Core Crusher', 'advanced', 'Hanging Leg Raise', 0, 4, 12, 60, null),
    ('Core Crusher', 'advanced', 'Ab Wheel Rollout', 1, 4, 10, 75, null),
    ('Core Crusher', 'advanced', 'Cable Crunch', 2, 4, 12, 45, null),
    ('Core Crusher', 'advanced', 'Pallof Press', 3, 3, 12, 45, null),
    ('Core Crusher', 'advanced', 'Russian Twist', 4, 3, 20, 45, null),
    ('Core Crusher', 'advanced', 'Side Plank', 5, 3, null, 45, 'Each side'),
    ('Core Crusher', 'advanced', 'Captain''s Chair Leg Raise', 6, 3, 12, 45, null),

    -- ===================== Mobility Flow =====================
    ('Mobility Flow', 'intermediate', 'Cat-Cow', 0, 2, null, 0, '10 breaths'),
    ('Mobility Flow', 'intermediate', 'World''s Greatest Stretch', 1, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'intermediate', 'Hip Flexor Lunge Stretch', 2, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'intermediate', 'Thoracic Opener', 3, 2, null, 0, null),
    ('Mobility Flow', 'intermediate', 'Deep Squat Hold', 4, 2, null, 0, '45–60s'),
    ('Mobility Flow', 'intermediate', 'Bird Dog', 5, 2, 10, 0, null),

    ('Mobility Flow', 'advanced', 'World''s Greatest Stretch', 0, 3, null, 0, 'Each side'),
    ('Mobility Flow', 'advanced', 'Deep Squat Hold', 1, 3, null, 0, '60–90s'),
    ('Mobility Flow', 'advanced', 'Hip Flexor Lunge Stretch', 2, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'advanced', 'Thoracic Opener', 3, 3, null, 0, null),
    ('Mobility Flow', 'advanced', 'Single-Leg Forward Fold', 4, 2, null, 0, 'Each side'),
    ('Mobility Flow', 'advanced', 'Pigeon Pose', 5, 2, null, 0, 'Each side'),

    -- ===================== Yoga Essentials =====================
    ('Yoga Essentials', 'intermediate', 'Downward-Facing Dog', 0, 2, null, 0, null),
    ('Yoga Essentials', 'intermediate', 'Child''s Pose to Down Dog', 1, 2, null, 0, null),
    ('Yoga Essentials', 'intermediate', 'Warrior II', 2, 2, null, 0, 'Each side'),
    ('Yoga Essentials', 'intermediate', 'Low Lunge Yoga', 3, 2, null, 0, 'Each side'),
    ('Yoga Essentials', 'intermediate', 'Bridge Pose Yoga', 4, 2, null, 0, null),
    ('Yoga Essentials', 'intermediate', 'Doorway Chest Stretch', 5, 2, null, 0, null),

    ('Yoga Essentials', 'advanced', 'Downward-Facing Dog', 0, 3, null, 0, 'Longer holds'),
    ('Yoga Essentials', 'advanced', 'Warrior II', 1, 3, null, 0, 'Each side'),
    ('Yoga Essentials', 'advanced', 'Low Lunge Yoga', 2, 2, null, 0, 'Each side'),
    ('Yoga Essentials', 'advanced', 'Bridge Pose Yoga', 3, 3, null, 0, null),
    ('Yoga Essentials', 'advanced', 'Pigeon Pose', 4, 2, null, 0, 'Each side'),
    ('Yoga Essentials', 'advanced', 'Single-Leg Forward Fold', 5, 2, null, 0, 'Each side'),

    -- ===================== Desk Reset =====================
    ('Desk Reset', 'intermediate', 'Doorway Chest Stretch', 0, 2, null, 0, '45s'),
    ('Desk Reset', 'intermediate', 'Cat-Cow', 1, 2, null, 0, null),
    ('Desk Reset', 'intermediate', 'Seated Spinal Twist', 2, 2, null, 0, 'Each side'),
    ('Desk Reset', 'intermediate', 'Neck Side Stretch', 3, 2, null, 0, 'Each side'),
    ('Desk Reset', 'intermediate', 'Hip Flexor Lunge Stretch', 4, 2, null, 0, 'Each side'),
    ('Desk Reset', 'intermediate', 'Thoracic Opener', 5, 2, null, 0, null),

    ('Desk Reset', 'advanced', 'Doorway Chest Stretch', 0, 3, null, 0, '60s'),
    ('Desk Reset', 'advanced', 'World''s Greatest Stretch', 1, 2, null, 0, 'Each side'),
    ('Desk Reset', 'advanced', 'Hip Flexor Lunge Stretch', 2, 2, null, 0, 'Each side'),
    ('Desk Reset', 'advanced', 'Thoracic Opener', 3, 3, null, 0, null),
    ('Desk Reset', 'advanced', 'Deep Squat Hold', 4, 2, null, 0, '45s'),
    ('Desk Reset', 'advanced', 'Seated Spinal Twist', 5, 2, null, 0, 'Each side')
  ) as x(template_name, training_level, exercise_name, pos, sets, reps, rest_sec, notes)
  on x.template_name = t.name
 and x.training_level = v.training_level
join lateral (
  select ex.*
  from public.exercises ex
  where ex.is_system = true
    and (
      lower(ex.name) = lower(x.exercise_name)
      or lower(regexp_replace(ex.name, '[^a-z0-9]+', '', 'g'))
        = lower(regexp_replace(x.exercise_name, '[^a-z0-9]+', '', 'g'))
      or (
        x.exercise_name = 'Bodyweight Squat'
        and lower(ex.name) in ('bodyweight squat', 'air squat', 'squat')
      )
      or (
        x.exercise_name = 'High Knee'
        and lower(ex.name) in ('high knee', 'high knees')
      )
      or (
        x.exercise_name = 'Cat-Cow'
        and lower(ex.name) in ('cat-cow', 'cat cow', 'cat-cow flow', 'cat cow flow')
      )
      or (
        x.exercise_name = 'World''s Greatest Stretch'
        and lower(ex.name) like '%greatest stretch%'
      )
      or (
        x.exercise_name = 'Child''s Pose to Down Dog'
        and lower(ex.name) like '%child%down dog%'
      )
      or (
        x.exercise_name = 'Downward-Facing Dog'
        and lower(ex.name) in ('downward-facing dog', 'downward facing dog')
      )
      or (
        x.exercise_name = 'Pigeon Pose'
        and lower(ex.name) like '%pigeon%'
      )
      or (
        x.exercise_name = 'Glute Bridge'
        and lower(ex.name) in ('glute bridge', 'glute bridges')
      )
      or (
        x.exercise_name = 'Hip Thrust'
        and lower(ex.name) in ('hip thrust', 'barbell hip thrust')
      )
      or (
        x.exercise_name = 'Skull Crusher'
        and lower(ex.name) in ('skull crusher', 'skull crushers', 'lying triceps extension')
      )
      or (
        x.exercise_name = 'Kettlebell Swings'
        and lower(ex.name) in ('kettlebell swings', 'kettlebell swing')
      )
      or (
        x.exercise_name = 'Battle Ropes'
        and lower(ex.name) in ('battle ropes', 'battle rope')
      )
      or (
        x.exercise_name = 'Hollow Body Hold'
        and lower(ex.name) like 'hollow body%'
      )
      or (
        x.exercise_name = 'Captain''s Chair Leg Raise'
        and lower(ex.name) like '%captain%leg raise%'
      )
      or (
        x.exercise_name = 'Good Morning'
        and lower(ex.name) in ('good morning', 'good mornings')
      )
      or (
        x.exercise_name = 'Thoracic Opener'
        and lower(ex.name) like 'thoracic%'
      )
    )
  order by
    case
      when lower(ex.name) = lower(x.exercise_name) then 0
      else 1
    end
  limit 1
) e on true
where t.is_system = true
  and not exists (
    select 1
    from public.workout_template_exercises te
    where te.variation_id = v.id
  );

-- Refresh variation duration/description for seeded empty levels (idempotent-ish).
update public.workout_template_variations v
set
  description = coalesce(v.description, d.description),
  estimated_minutes = coalesce(
    v.estimated_minutes,
    greatest(
      15,
      coalesce(t.estimated_minutes, 45)
        + case v.training_level
            when 'beginner' then -10
            when 'intermediate' then 0
            else 15
          end
    )
  )
from public.workout_templates t
cross join (
  values
    ('beginner'::text, 'Simpler selection, manageable volume, focus on form.'),
    ('intermediate', 'Balanced compound + isolation volume for trained lifters.'),
    ('advanced', 'Higher volume and specialized selections for experienced trainees.')
) as d(training_level, description)
where t.id = v.template_id
  and t.is_system = true
  and d.training_level = v.training_level;
