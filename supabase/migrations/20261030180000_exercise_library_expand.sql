-- Additive exercise library expansion (non-destructive).
alter table public.exercises add column if not exists difficulty text;
alter table public.exercises add column if not exists tips text;
alter table public.exercises add column if not exists image_key text;
alter table public.exercises add column if not exists library_paths text[] not null default '{}'::text[];
create index if not exists exercises_library_paths_gin on public.exercises using gin (library_paths);
create index if not exists exercises_image_key_idx on public.exercises (image_key);

update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, 'barbell-bench-press'),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Barbell Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, 'incline-barbell-bench-press'),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Barbell Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, 'decline-barbell-bench-press'),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Decline Barbell Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, 'dumbbell-bench-press'),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dumbbell Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, 'incline-dumbbell-bench-press'),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Dumbbell Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Decline Dumbbell Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dumbbell Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Dumbbell Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Low Cable Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('High Cable Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pec Deck Fly');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chest Press Machine');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Smith Machine Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Decline Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Diamond Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Wide-Grip Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/chest','bodyweight/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chest Dip');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chest Squeeze Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Floor Press');
update public.exercises set
  library_paths = ARRAY['strength/chest','strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Close-Grip Bench Press');
update public.exercises set
  library_paths = ARRAY['strength/chest']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep wrists stacked over elbows at the bottom of the press.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','shoulders']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Landmine Press');
update public.exercises set
  library_paths = ARRAY['strength/back','bodyweight/back','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pull-Up');
update public.exercises set
  library_paths = ARRAY['strength/back','bodyweight/back','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chin-Up');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Lat Pulldown');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Close-Grip Lat Pulldown');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Wide-Grip Lat Pulldown');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Cable Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bent-Over Barbell Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pendlay Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('One-Arm Dumbbell Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chest-Supported Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('T-Bar Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Straight-Arm Pulldown');
update public.exercises set
  library_paths = ARRAY['strength/back','strength/hamstrings','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Conventional Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/back','strength/glutes','strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Sumo Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/back','strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Trap Bar Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings','strength/glutes','strength/back']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Romanian Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/back','strength/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Back Extension');
update public.exercises set
  library_paths = ARRAY['strength/shoulders','strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Face Pull');
update public.exercises set
  library_paths = ARRAY['strength/back','bodyweight/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Inverted Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Meadows Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Single-Arm Cable Row');
update public.exercises set
  library_paths = ARRAY['strength/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Lead with the elbows and keep the neck neutral.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['biceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Machine Row');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Overhead Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Dumbbell Shoulder Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Dumbbell Shoulder Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Arnold Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Lateral Raise');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Lateral Raise');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Front Raise');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Rear Delt Fly');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Pec Deck');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Upright Row');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Machine Shoulder Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Push Press');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Front Raise');
update public.exercises set
  library_paths = ARRAY['strength/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bent-Over Reverse Fly');
update public.exercises set
  library_paths = ARRAY['strength/shoulders','bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a moderate weight that keeps tension on the delts.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['triceps','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pike Push-Up');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Barbell Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('EZ-Bar Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dumbbell Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hammer Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Dumbbell Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Preacher Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Concentration Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Spider Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bayesian Cable Curl');
update public.exercises set
  library_paths = ARRAY['strength/biceps','bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep elbows close to your sides unless the variation requires otherwise.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['forearms']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Chin-Up Hold');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Triceps Pushdown');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Rope Pushdown');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Overhead Triceps Extension');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Skull Crusher');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Triceps Kickback');
update public.exercises set
  library_paths = ARRAY['strength/triceps','bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bench Dip');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Overhead Extension');
update public.exercises set
  library_paths = ARRAY['strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('JM Press');
update public.exercises set
  library_paths = ARRAY['strength/triceps','bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Avoid flaring elbows wildly; control the eccentric.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['shoulders','chest']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Diamond Push-Up Hold');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Wrist Curl');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Wrist Curl');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Farmer Carry');
update public.exercises set
  library_paths = ARRAY['strength/forearms','bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dead Hang');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Plate Pinch Hold');
update public.exercises set
  library_paths = ARRAY['strength/forearms','bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Towel Pull-Up Hold');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Behind-the-Back Wrist Curl');
update public.exercises set
  library_paths = ARRAY['strength/forearms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Stop if you feel sharp pain in the wrists.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['grip']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Gripper Squeeze');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Barbell Back Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Front Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','bodyweight/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Goblet Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Leg Press');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hack Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Leg Extension');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','strength/glutes','bodyweight/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bulgarian Split Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','bodyweight/quadriceps','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Walking Lunge');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Lunge');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Step-Up');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Heels-Elevated Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps','bodyweight/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Sissy Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Smith Machine Squat');
update public.exercises set
  library_paths = ARRAY['strength/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use a depth you can control without rounding the lower back.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['glutes','hamstrings','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Belt Squat');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Stiff-Leg Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Lying Leg Curl');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Leg Curl');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings','bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Nordic Hamstring Curl');
update public.exercises set
  library_paths = ARRAY['strength/glutes','strength/hamstrings']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hip Thrust');
update public.exercises set
  library_paths = ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Glute Bridge');
update public.exercises set
  library_paths = ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Single-Leg Glute Bridge');
update public.exercises set
  library_paths = ARRAY['strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Kickback');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings','strength/back']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Good Morning');
update public.exercises set
  library_paths = ARRAY['strength/hamstrings','strength/glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Single-Leg Romanian Deadlift');
update public.exercises set
  library_paths = ARRAY['strength/glutes','strength/hamstrings','cardio/hiit']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Kettlebell Swing');
update public.exercises set
  library_paths = ARRAY['strength/glutes','strength/hamstrings']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Hyperextension');
update public.exercises set
  library_paths = ARRAY['strength/glutes','strength/hamstrings']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Pull-Through');
update public.exercises set
  library_paths = ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Keep a soft knee bend on hinge variations.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['back','core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Frog Pump');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Leg Press Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Donkey Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves','bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Single-Leg Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Smith Machine Calf Raise');
update public.exercises set
  library_paths = ARRAY['strength/calves','cardio/jumping']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Train both bent-knee and straight-knee variations over the week.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Jump Rope Calf Bounce');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Plank');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Side Plank');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Crunch');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Reverse Crunch');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hanging Leg Raise');
update public.exercises set
  library_paths = ARRAY['strength/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Captain''s Chair Leg Raise');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bicycle Crunch');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Russian Twist');
update public.exercises set
  library_paths = ARRAY['strength/core']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Ab Wheel Rollout');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core','flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dead Bug');
update public.exercises set
  library_paths = ARRAY['strength/core','cardio/hiit','bodyweight/full-body','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Mountain Climber');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hollow Body Hold');
update public.exercises set
  library_paths = ARRAY['strength/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cable Crunch');
update public.exercises set
  library_paths = ARRAY['strength/core','bodyweight/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hanging Knee Raise');
update public.exercises set
  library_paths = ARRAY['strength/core']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pallof Press');
update public.exercises set
  library_paths = ARRAY['strength/core','flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Quality reps beat rushing through core work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['obliques']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bird Dog');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Running');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Interval Run');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Tempo Run');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hill Sprints');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Treadmill Run');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Easy Jog');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Fartlek Run');
update public.exercises set
  library_paths = ARRAY['cardio/running']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Track Repeats');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Brisk Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Incline Treadmill Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Power Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Hiking');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Ruck Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Recovery Walk');
update public.exercises set
  library_paths = ARRAY['cardio/walking']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Stair Walk');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cycling');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Stationary Bike');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Spin Class Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Outdoor Bike Hills');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Easy Spin');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Cadence Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Recumbent Bike');
update public.exercises set
  library_paths = ARRAY['cardio/cycling']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Assault Bike');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Rowing Machine');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Row Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Steady State Row');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Row Sprints');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Technique Row');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Mixed Row Pyramid');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Damper Cap Row');
update public.exercises set
  library_paths = ARRAY['cardio/rowing']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Row + Walk Recoveries');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Freestyle Swim');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Swim Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Backstroke');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Breaststroke');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Kickboard Drill');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Open Water Swim');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Swim Easy Laps');
update public.exercises set
  library_paths = ARRAY['cardio/swimming']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pull Buoy Swim');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Elliptical');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Stair Climber');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('SkiErg');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Arc Trainer');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Treadmill Incline Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Fan Bike Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Elliptical');
update public.exercises set
  library_paths = ARRAY['cardio/machines']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('ClimbMill');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Burpees');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('HIIT Circuit');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Tabata Bodyweight');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Jumping Jacks');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('High Knees');
update public.exercises set
  library_paths = ARRAY['cardio/hiit','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Skater Jumps');
update public.exercises set
  library_paths = ARRAY['cardio/hiit']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Battle Ropes');
update public.exercises set
  library_paths = ARRAY['cardio/hiit']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('KB Snatch Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/jumping']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Jump Rope');
update public.exercises set
  library_paths = ARRAY['cardio/jumping']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Double Unders');
update public.exercises set
  library_paths = ARRAY['cardio/jumping','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Box Jump');
update public.exercises set
  library_paths = ARRAY['cardio/jumping','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Broad Jump');
update public.exercises set
  library_paths = ARRAY['cardio/jumping','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Tuck Jump');
update public.exercises set
  library_paths = ARRAY['cardio/jumping','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Lateral Bound');
update public.exercises set
  library_paths = ARRAY['cardio/jumping']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Jump Rope Intervals');
update public.exercises set
  library_paths = ARRAY['cardio/jumping','bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Depth Jump');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Basketball Pickup');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Soccer Scrimmage');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Tennis Rally');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Badminton Game');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Martial Arts Sparring');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Volleyball Game');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Shadow Boxing');
update public.exercises set
  library_paths = ARRAY['cardio/sports']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Warm up first and keep landings soft on jumping work.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core','legs']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Agility Ladder Drills');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Full Body Stretch Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('World''s Greatest Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Cat-Cow Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Child''s Pose to Down Dog');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Forward Fold Sequence');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Thread the Needle Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Supine Twist Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Dynamic Warm-Up Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Doorway Chest Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Cross-Body Shoulder Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Overhead Triceps Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Wall Angels');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Open Book Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Pec Minor Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Sleeper Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/chest-shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Band Dislocate');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Cat-Cow');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Child''s Pose');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Thread the Needle');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Spinal Twist');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Knee-to-Chest Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Prone Press-Up');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Side Bend');
update public.exercises set
  library_paths = ARRAY['flexibility/back-spine']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Sphinx Pose');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('90/90 Hip Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Pigeon Pose');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Frog Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Couch Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Butterfly Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hip Flexor Lunge Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Figure-Four Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hips']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Adductor Rock Back');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Hamstring Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Hamstring Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Supine Hamstring Strap Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Quad Couch Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('IT Band Cross-Over Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calf Wall Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Downward Dog Hamstring Focus');
update public.exercises set
  library_paths = ARRAY['flexibility/hamstrings-legs']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Single-Leg Forward Fold');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Ankle Circles');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Knee-Over-Toe Rock');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Banded Ankle Distraction');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calf Stretch on Step');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Tibialis Raise Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Ankle Alphabet');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Wall Ankle Mobilization');
update public.exercises set
  library_paths = ARRAY['flexibility/ankles']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Plantar Flex Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Yoga Flow');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Sun Salutation A');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Downward-Facing Dog');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Warrior II');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Tree Pose');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Bridge Pose Yoga');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Low Lunge Yoga');
update public.exercises set
  library_paths = ARRAY['flexibility/yoga']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Savasana Breath');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Static Full Body Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Neck Side Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Standing Quad Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Seated Butterfly Hold');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Lying Twist Hold');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Chest Opener Hold');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hamstring Strap Hold');
update public.exercises set
  library_paths = ARRAY['flexibility/stretching']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulder Capsule Stretch');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hip CARs');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulder CARs');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Thoracic Opener');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Dead Bug Mobility');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('World''s Greatest Stretch Walk');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Deep Squat Hold');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Wrist Mobility Circles');
update public.exercises set
  library_paths = ARRAY['flexibility/mobility']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Breathe and avoid forcing end range.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Scapular CARs');
update public.exercises set
  library_paths = ARRAY['bodyweight/calisthenics','bodyweight/back','strength/back']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Muscle-Up');
update public.exercises set
  library_paths = ARRAY['bodyweight/chest','bodyweight/arms','strength/triceps']::text[],
  difficulty = coalesce(difficulty, 'intermediate'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Dip');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Handstand Hold');
update public.exercises set
  library_paths = ARRAY['bodyweight/quadriceps','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pistol Squat');
update public.exercises set
  library_paths = ARRAY['bodyweight/chest','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Archer Push-Up');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Pseudo Planche Lean');
update public.exercises set
  library_paths = ARRAY['bodyweight/core','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('L-Sit');
update public.exercises set
  library_paths = ARRAY['bodyweight/back','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Ring Row');
update public.exercises set
  library_paths = ARRAY['bodyweight/chest','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Ring Dip');
update public.exercises set
  library_paths = ARRAY['bodyweight/quadriceps','bodyweight/calisthenics']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Shrimp Squat');
update public.exercises set
  library_paths = ARRAY['bodyweight/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Australian Pull-Up');
update public.exercises set
  library_paths = ARRAY['bodyweight/chest','cardio/jumping']::text[],
  difficulty = coalesce(difficulty, 'advanced'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Clapping Push-Up');
update public.exercises set
  library_paths = ARRAY['bodyweight/full-body','cardio/hiit']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Bear Crawl');
update public.exercises set
  library_paths = ARRAY['bodyweight/full-body']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Crab Walk');
update public.exercises set
  library_paths = ARRAY['bodyweight/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Use regressions until the full skill is stable.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then ARRAY['core']::text[] else secondary_muscles end
where is_system = true and lower(name) = lower('Wall Sit');
update public.exercises set
  library_paths = ARRAY['strength/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Back Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/back']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Back Drill 2');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulders Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulders Drill 2');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulders Drill 3');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulders Drill 4');
update public.exercises set
  library_paths = ARRAY['bodyweight/shoulders']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Shoulders Drill 5');
update public.exercises set
  library_paths = ARRAY['bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Arms Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/arms']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Arms Drill 2');
update public.exercises set
  library_paths = ARRAY['bodyweight/quadriceps']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Quadriceps Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hamstrings Glutes Drill 1');
update public.exercises set
  library_paths = ARRAY['bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hamstrings Glutes Drill 2');
update public.exercises set
  library_paths = ARRAY['bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hamstrings Glutes Drill 3');
update public.exercises set
  library_paths = ARRAY['bodyweight/hamstrings-glutes']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Hamstrings Glutes Drill 4');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 2');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 3');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 4');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 5');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 6');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 7');
update public.exercises set
  library_paths = ARRAY['bodyweight/calves']::text[],
  difficulty = coalesce(difficulty, 'beginner'),
  tips = coalesce(tips, 'Keep quality high; stop before form breaks down.'),
  image_key = coalesce(image_key, null),
  description = coalesce(description, null),
  secondary_muscles = case when secondary_muscles = '{}' then '{}' else secondary_muscles end
where is_system = true and lower(name) = lower('Calves Drill 8');

insert into public.exercises (
  name, category, primary_muscles, secondary_muscles, equipment, exercise_type,
  movement_pattern, instructions, met_value, is_system, difficulty, tips, description, image_key, library_paths
)
select v.* from (values
('Barbell Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'horizontal_press', 'Perform Barbell Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, 'barbell-bench-press', ARRAY['strength/chest']::text[]),
('Incline Barbell Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'horizontal_press', 'Perform Incline Barbell Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, 'incline-barbell-bench-press', ARRAY['strength/chest']::text[]),
('Decline Barbell Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'horizontal_press', 'Perform Decline Barbell Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, 'decline-barbell-bench-press', ARRAY['strength/chest']::text[]),
('Dumbbell Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'horizontal_press', 'Perform Dumbbell Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, 'dumbbell-bench-press', ARRAY['strength/chest']::text[]),
('Incline Dumbbell Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'horizontal_press', 'Perform Incline Dumbbell Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, 'incline-dumbbell-bench-press', ARRAY['strength/chest']::text[]),
('Decline Dumbbell Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'horizontal_press', 'Perform Decline Dumbbell Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Dumbbell Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'isolation', 'Perform Dumbbell Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Incline Dumbbell Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'isolation', 'Perform Incline Dumbbell Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Cable Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'cable', 'strength', 'isolation', 'Perform Cable Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Low Cable Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'cable', 'strength', 'isolation', 'Perform Low Cable Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('High Cable Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'cable', 'strength', 'isolation', 'Perform High Cable Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Pec Deck Fly', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'machine', 'strength', 'isolation', 'Perform Pec Deck Fly with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Chest Press Machine', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'machine', 'strength', 'horizontal_press', 'Perform Chest Press Machine with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4.5, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Smith Machine Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'machine', 'strength', 'horizontal_press', 'Perform Smith Machine Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4.5, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Push-Up', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_press', 'Perform Push-Up with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 8, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Incline Push-Up', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_press', 'Perform Incline Push-Up with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 6, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Decline Push-Up', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_press', 'Perform Decline Push-Up with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 8, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Diamond Push-Up', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_press', 'Perform Diamond Push-Up with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 8, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Wide-Grip Push-Up', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_press', 'Perform Wide-Grip Push-Up with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 7, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Chest Dip', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders','core']::text[], 'bodyweight', 'bodyweight', 'vertical_press', 'Perform Chest Dip with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 8, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','bodyweight/chest']::text[]),
('Chest Squeeze Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'dumbbell', 'strength', 'horizontal_press', 'Perform Chest Squeeze Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4, true, 'beginner', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Floor Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'horizontal_press', 'Perform Floor Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 4.5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Close-Grip Bench Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'horizontal_press', 'Perform Close-Grip Bench Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest','strength/triceps']::text[]),
('Landmine Press', 'Chest', ARRAY['chest']::text[], ARRAY['triceps','shoulders']::text[], 'barbell', 'strength', 'vertical_press', 'Perform Landmine Press with controlled tempo. Keep shoulders stable and stop if you feel sharp joint pain.', 5, true, 'intermediate', 'Keep wrists stacked over elbows at the bottom of the press.', null, null, ARRAY['strength/chest']::text[]),
('Pull-Up', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'pull-up bar', 'bodyweight', 'vertical_pull', 'Set a stable brace, then perform Pull-Up with a full controlled range. Avoid jerking the weight.', 8, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','bodyweight/back','bodyweight/calisthenics']::text[]),
('Chin-Up', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'pull-up bar', 'bodyweight', 'vertical_pull', 'Set a stable brace, then perform Chin-Up with a full controlled range. Avoid jerking the weight.', 8, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','bodyweight/back','bodyweight/calisthenics']::text[]),
('Lat Pulldown', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'vertical_pull', 'Set a stable brace, then perform Lat Pulldown with a full controlled range. Avoid jerking the weight.', 5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Close-Grip Lat Pulldown', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'vertical_pull', 'Set a stable brace, then perform Close-Grip Lat Pulldown with a full controlled range. Avoid jerking the weight.', 5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Wide-Grip Lat Pulldown', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'vertical_pull', 'Set a stable brace, then perform Wide-Grip Lat Pulldown with a full controlled range. Avoid jerking the weight.', 5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Seated Cable Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Seated Cable Row with a full controlled range. Avoid jerking the weight.', 5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Bent-Over Barbell Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Bent-Over Barbell Row with a full controlled range. Avoid jerking the weight.', 5.5, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Pendlay Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Pendlay Row with a full controlled range. Avoid jerking the weight.', 6, true, 'advanced', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('One-Arm Dumbbell Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'dumbbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform One-Arm Dumbbell Row with a full controlled range. Avoid jerking the weight.', 5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Chest-Supported Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'dumbbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Chest-Supported Row with a full controlled range. Avoid jerking the weight.', 4.5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('T-Bar Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform T-Bar Row with a full controlled range. Avoid jerking the weight.', 5.5, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Straight-Arm Pulldown', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'isolation', 'Set a stable brace, then perform Straight-Arm Pulldown with a full controlled range. Avoid jerking the weight.', 4, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Conventional Deadlift', 'Back', ARRAY['back','hamstrings','glutes']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'hinge', 'Set a stable brace, then perform Conventional Deadlift with a full controlled range. Avoid jerking the weight.', 6, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','strength/hamstrings','strength/glutes']::text[]),
('Sumo Deadlift', 'Back', ARRAY['back','hamstrings','glutes']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'hinge', 'Set a stable brace, then perform Sumo Deadlift with a full controlled range. Avoid jerking the weight.', 6, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','strength/glutes','strength/quadriceps']::text[]),
('Trap Bar Deadlift', 'Back', ARRAY['back','hamstrings','glutes']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'hinge', 'Set a stable brace, then perform Trap Bar Deadlift with a full controlled range. Avoid jerking the weight.', 6, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','strength/quadriceps']::text[]),
('Romanian Deadlift', 'Back', ARRAY['back','hamstrings','glutes']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'hinge', 'Set a stable brace, then perform Romanian Deadlift with a full controlled range. Avoid jerking the weight.', 5.5, true, 'intermediate', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/hamstrings','strength/glutes','strength/back']::text[]),
('Back Extension', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'machine', 'strength', 'isolation', 'Set a stable brace, then perform Back Extension with a full controlled range. Avoid jerking the weight.', 3.5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','strength/core']::text[]),
('Face Pull', 'Back', ARRAY['shoulders','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Face Pull with a full controlled range. Avoid jerking the weight.', 3.5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/shoulders','strength/back']::text[]),
('Inverted Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'bodyweight', 'bodyweight', 'horizontal_pull', 'Set a stable brace, then perform Inverted Row with a full controlled range. Avoid jerking the weight.', 6, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back','bodyweight/back']::text[]),
('Meadows Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'barbell', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Meadows Row with a full controlled range. Avoid jerking the weight.', 5, true, 'advanced', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Single-Arm Cable Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'cable', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Single-Arm Cable Row with a full controlled range. Avoid jerking the weight.', 4.5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Machine Row', 'Back', ARRAY['lats','back']::text[], ARRAY['biceps','core']::text[], 'machine', 'strength', 'horizontal_pull', 'Set a stable brace, then perform Machine Row with a full controlled range. Avoid jerking the weight.', 4.5, true, 'beginner', 'Lead with the elbows and keep the neck neutral.', null, null, ARRAY['strength/back']::text[]),
('Overhead Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'barbell', 'strength', 'vertical_press', 'Raise or press with control in Overhead Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'intermediate', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Seated Dumbbell Shoulder Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'vertical_press', 'Raise or press with control in Seated Dumbbell Shoulder Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Standing Dumbbell Shoulder Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'vertical_press', 'Raise or press with control in Standing Dumbbell Shoulder Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Arnold Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'vertical_press', 'Raise or press with control in Arnold Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'intermediate', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Lateral Raise', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'isolation', 'Raise or press with control in Lateral Raise. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Cable Lateral Raise', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'cable', 'strength', 'isolation', 'Raise or press with control in Cable Lateral Raise. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Front Raise', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'isolation', 'Raise or press with control in Front Raise. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Rear Delt Fly', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'isolation', 'Raise or press with control in Rear Delt Fly. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Reverse Pec Deck', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'machine', 'strength', 'isolation', 'Raise or press with control in Reverse Pec Deck. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Upright Row', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'barbell', 'strength', 'vertical_pull', 'Raise or press with control in Upright Row. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'intermediate', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Machine Shoulder Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'machine', 'strength', 'vertical_press', 'Raise or press with control in Machine Shoulder Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Push Press', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'barbell', 'strength', 'vertical_press', 'Raise or press with control in Push Press. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'advanced', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Cable Front Raise', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'cable', 'strength', 'isolation', 'Raise or press with control in Cable Front Raise. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Bent-Over Reverse Fly', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'dumbbell', 'strength', 'isolation', 'Raise or press with control in Bent-Over Reverse Fly. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'beginner', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders']::text[]),
('Pike Push-Up', 'Shoulders', ARRAY['shoulders']::text[], ARRAY['triceps','core']::text[], 'bodyweight', 'bodyweight', 'vertical_press', 'Raise or press with control in Pike Push-Up. Keep ribs down and avoid shrugging excessively.', 4.5, true, 'intermediate', 'Use a moderate weight that keeps tension on the delts.', null, null, ARRAY['strength/shoulders','bodyweight/shoulders']::text[]),
('Barbell Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'barbell', 'strength', 'isolation', 'Curl through a full range in Barbell Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('EZ-Bar Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'barbell', 'strength', 'isolation', 'Curl through a full range in EZ-Bar Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Dumbbell Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'dumbbell', 'strength', 'isolation', 'Curl through a full range in Dumbbell Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Hammer Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'dumbbell', 'strength', 'isolation', 'Curl through a full range in Hammer Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Incline Dumbbell Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'dumbbell', 'strength', 'isolation', 'Curl through a full range in Incline Dumbbell Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Preacher Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'barbell', 'strength', 'isolation', 'Curl through a full range in Preacher Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Concentration Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'dumbbell', 'strength', 'isolation', 'Curl through a full range in Concentration Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Cable Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'cable', 'strength', 'isolation', 'Curl through a full range in Cable Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Reverse Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'barbell', 'strength', 'isolation', 'Curl through a full range in Reverse Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Spider Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'dumbbell', 'strength', 'isolation', 'Curl through a full range in Spider Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Bayesian Cable Curl', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'cable', 'strength', 'isolation', 'Curl through a full range in Bayesian Cable Curl without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps']::text[]),
('Chin-Up Hold', 'Arms', ARRAY['biceps']::text[], ARRAY['forearms']::text[], 'pull-up bar', 'strength', 'isolation', 'Curl through a full range in Chin-Up Hold without swinging the torso.', 3.5, true, 'beginner', 'Keep elbows close to your sides unless the variation requires otherwise.', null, null, ARRAY['strength/biceps','bodyweight/arms']::text[]),
('Triceps Pushdown', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'cable', 'strength', 'isolation', 'Extend the elbows fully in Triceps Pushdown while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Rope Pushdown', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'cable', 'strength', 'isolation', 'Extend the elbows fully in Rope Pushdown while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Overhead Triceps Extension', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'dumbbell', 'strength', 'isolation', 'Extend the elbows fully in Overhead Triceps Extension while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Skull Crusher', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'barbell', 'strength', 'isolation', 'Extend the elbows fully in Skull Crusher while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Triceps Kickback', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'dumbbell', 'strength', 'isolation', 'Extend the elbows fully in Triceps Kickback while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Bench Dip', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'bodyweight', 'bodyweight', 'isolation', 'Extend the elbows fully in Bench Dip while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps','bodyweight/arms']::text[]),
('Cable Overhead Extension', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'cable', 'strength', 'isolation', 'Extend the elbows fully in Cable Overhead Extension while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('JM Press', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'barbell', 'strength', 'isolation', 'Extend the elbows fully in JM Press while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps']::text[]),
('Diamond Push-Up Hold', 'Arms', ARRAY['triceps']::text[], ARRAY['shoulders','chest']::text[], 'bodyweight', 'bodyweight', 'isolation', 'Extend the elbows fully in Diamond Push-Up Hold while keeping upper arms stable.', 3.5, true, 'beginner', 'Avoid flaring elbows wildly; control the eccentric.', null, null, ARRAY['strength/triceps','bodyweight/arms']::text[]),
('Wrist Curl', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'dumbbell', 'strength', 'isolation', 'Train grip and forearm endurance with Wrist Curl. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Reverse Wrist Curl', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'dumbbell', 'strength', 'isolation', 'Train grip and forearm endurance with Reverse Wrist Curl. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Farmer Carry', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'dumbbell', 'strength', 'isolation', 'Train grip and forearm endurance with Farmer Carry. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Dead Hang', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'pull-up bar', 'bodyweight', 'isolation', 'Train grip and forearm endurance with Dead Hang. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms','bodyweight/arms']::text[]),
('Plate Pinch Hold', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'other', 'strength', 'isolation', 'Train grip and forearm endurance with Plate Pinch Hold. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Towel Pull-Up Hold', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'pull-up bar', 'bodyweight', 'isolation', 'Train grip and forearm endurance with Towel Pull-Up Hold. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms','bodyweight/arms']::text[]),
('Behind-the-Back Wrist Curl', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'barbell', 'strength', 'isolation', 'Train grip and forearm endurance with Behind-the-Back Wrist Curl. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Gripper Squeeze', 'Arms', ARRAY['forearms']::text[], ARRAY['grip']::text[], 'other', 'strength', 'isolation', 'Train grip and forearm endurance with Gripper Squeeze. Use smooth reps.', 3, true, 'beginner', 'Stop if you feel sharp pain in the wrists.', null, null, ARRAY['strength/forearms']::text[]),
('Barbell Back Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'barbell', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Barbell Back Squat.', 6, true, 'intermediate', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','strength/glutes']::text[]),
('Front Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'barbell', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Front Squat.', 6, true, 'advanced', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Goblet Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'dumbbell', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Goblet Squat.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','bodyweight/quadriceps']::text[]),
('Leg Press', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'machine', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Leg Press.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','strength/glutes']::text[]),
('Hack Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'machine', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Hack Squat.', 6, true, 'intermediate', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Leg Extension', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'machine', 'strength', 'isolation', 'Brace your core and keep knees tracking over toes in Leg Extension.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Bulgarian Split Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'dumbbell', 'strength', 'lunge', 'Brace your core and keep knees tracking over toes in Bulgarian Split Squat.', 6, true, 'intermediate', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','strength/glutes','bodyweight/quadriceps']::text[]),
('Walking Lunge', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'bodyweight', 'bodyweight', 'lunge', 'Brace your core and keep knees tracking over toes in Walking Lunge.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','bodyweight/quadriceps','bodyweight/full-body']::text[]),
('Reverse Lunge', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'dumbbell', 'strength', 'lunge', 'Brace your core and keep knees tracking over toes in Reverse Lunge.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','strength/glutes']::text[]),
('Step-Up', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'dumbbell', 'strength', 'lunge', 'Brace your core and keep knees tracking over toes in Step-Up.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','strength/glutes']::text[]),
('Heels-Elevated Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'dumbbell', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Heels-Elevated Squat.', 6, true, 'intermediate', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Sissy Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'bodyweight', 'bodyweight', 'squat', 'Brace your core and keep knees tracking over toes in Sissy Squat.', 6, true, 'advanced', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps','bodyweight/quadriceps']::text[]),
('Smith Machine Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'machine', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Smith Machine Squat.', 6, true, 'beginner', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Belt Squat', 'Legs', ARRAY['quadriceps']::text[], ARRAY['glutes','hamstrings','core']::text[], 'machine', 'strength', 'squat', 'Brace your core and keep knees tracking over toes in Belt Squat.', 6, true, 'intermediate', 'Use a depth you can control without rounding the lower back.', null, null, ARRAY['strength/quadriceps']::text[]),
('Stiff-Leg Deadlift', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'barbell', 'strength', 'hinge', 'Hinge or bridge with control in Stiff-Leg Deadlift. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings','strength/glutes']::text[]),
('Lying Leg Curl', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'machine', 'strength', 'hinge', 'Hinge or bridge with control in Lying Leg Curl. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings']::text[]),
('Seated Leg Curl', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'machine', 'strength', 'hinge', 'Hinge or bridge with control in Seated Leg Curl. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings']::text[]),
('Nordic Hamstring Curl', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'bodyweight', 'bodyweight', 'hinge', 'Hinge or bridge with control in Nordic Hamstring Curl. Feel tension in the posterior chain.', 5, true, 'advanced', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings','bodyweight/hamstrings-glutes']::text[]),
('Hip Thrust', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'barbell', 'strength', 'hinge', 'Hinge or bridge with control in Hip Thrust. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','strength/hamstrings']::text[]),
('Glute Bridge', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'bodyweight', 'bodyweight', 'hinge', 'Hinge or bridge with control in Glute Bridge. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[]),
('Single-Leg Glute Bridge', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'bodyweight', 'bodyweight', 'hinge', 'Hinge or bridge with control in Single-Leg Glute Bridge. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[]),
('Cable Kickback', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'cable', 'strength', 'hinge', 'Hinge or bridge with control in Cable Kickback. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes']::text[]),
('Good Morning', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'barbell', 'strength', 'hinge', 'Hinge or bridge with control in Good Morning. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings','strength/back']::text[]),
('Single-Leg Romanian Deadlift', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'dumbbell', 'strength', 'hinge', 'Hinge or bridge with control in Single-Leg Romanian Deadlift. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/hamstrings','strength/glutes']::text[]),
('Kettlebell Swing', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'kettlebell', 'strength', 'hinge', 'Hinge or bridge with control in Kettlebell Swing. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','strength/hamstrings','cardio/hiit']::text[]),
('Reverse Hyperextension', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'machine', 'strength', 'hinge', 'Hinge or bridge with control in Reverse Hyperextension. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','strength/hamstrings']::text[]),
('Cable Pull-Through', 'Posterior', ARRAY['hamstrings','glutes']::text[], ARRAY['back','core']::text[], 'cable', 'strength', 'hinge', 'Hinge or bridge with control in Cable Pull-Through. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','strength/hamstrings']::text[]),
('Frog Pump', 'Posterior', ARRAY['glutes','hamstrings']::text[], ARRAY['back','core']::text[], 'bodyweight', 'bodyweight', 'hinge', 'Hinge or bridge with control in Frog Pump. Feel tension in the posterior chain.', 5, true, 'intermediate', 'Keep a soft knee bend on hinge variations.', null, null, ARRAY['strength/glutes','bodyweight/hamstrings-glutes']::text[]),
('Standing Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'machine', 'strength', 'isolation', 'Pause briefly at the top of Standing Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves']::text[]),
('Seated Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'machine', 'strength', 'isolation', 'Pause briefly at the top of Seated Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves']::text[]),
('Leg Press Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'machine', 'strength', 'isolation', 'Pause briefly at the top of Leg Press Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves']::text[]),
('Donkey Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'machine', 'strength', 'isolation', 'Pause briefly at the top of Donkey Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves']::text[]),
('Single-Leg Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'bodyweight', 'bodyweight', 'isolation', 'Pause briefly at the top of Single-Leg Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves','bodyweight/calves']::text[]),
('Smith Machine Calf Raise', 'Legs', ARRAY['calves']::text[], '{}', 'machine', 'strength', 'isolation', 'Pause briefly at the top of Smith Machine Calf Raise and control the lowering phase.', 3.5, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves']::text[]),
('Jump Rope Calf Bounce', 'Legs', ARRAY['calves']::text[], '{}', 'rope', 'cardio', 'isolation', 'Pause briefly at the top of Jump Rope Calf Bounce and control the lowering phase.', 8, true, 'beginner', 'Train both bent-knee and straight-knee variations over the week.', null, null, ARRAY['strength/calves','cardio/jumping']::text[]),
('Plank', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Plank. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Side Plank', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Side Plank. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Crunch', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Crunch. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Reverse Crunch', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Reverse Crunch. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Hanging Leg Raise', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'pull-up bar', 'bodyweight', 'core', 'Keep a braced midsection throughout Hanging Leg Raise. Breathe steadily.', 3.5, true, 'intermediate', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core','bodyweight/calisthenics']::text[]),
('Captain''s Chair Leg Raise', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'machine', 'strength', 'core', 'Keep a braced midsection throughout Captain''s Chair Leg Raise. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core']::text[]),
('Bicycle Crunch', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Bicycle Crunch. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Russian Twist', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Russian Twist. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Ab Wheel Rollout', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'other', 'strength', 'core', 'Keep a braced midsection throughout Ab Wheel Rollout. Breathe steadily.', 3.5, true, 'intermediate', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core']::text[]),
('Dead Bug', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Dead Bug. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core','flexibility/mobility']::text[]),
('Mountain Climber', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Mountain Climber. Breathe steadily.', 8, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','cardio/hiit','bodyweight/full-body','bodyweight/core']::text[]),
('Hollow Body Hold', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Hollow Body Hold. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core','bodyweight/calisthenics']::text[]),
('Cable Crunch', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'cable', 'strength', 'core', 'Keep a braced midsection throughout Cable Crunch. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core']::text[]),
('Hanging Knee Raise', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'pull-up bar', 'bodyweight', 'core', 'Keep a braced midsection throughout Hanging Knee Raise. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','bodyweight/core']::text[]),
('Pallof Press', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'cable', 'strength', 'core', 'Keep a braced midsection throughout Pallof Press. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core']::text[]),
('Bird Dog', 'Core', ARRAY['core','abs']::text[], ARRAY['obliques']::text[], 'bodyweight', 'bodyweight', 'core', 'Keep a braced midsection throughout Bird Dog. Breathe steadily.', 3.5, true, 'beginner', 'Quality reps beat rushing through core work.', null, null, ARRAY['strength/core','flexibility/back-spine']::text[]),
('Running', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Running at a sustainable intensity for your fitness level.', 9.8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Interval Run', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Interval Run at a sustainable intensity for your fitness level.', 11, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Tempo Run', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Tempo Run at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Hill Sprints', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Hill Sprints at a sustainable intensity for your fitness level.', 12, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Treadmill Run', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'treadmill', 'cardio', 'locomotion', 'Complete Treadmill Run at a sustainable intensity for your fitness level.', 9.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Easy Jog', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Easy Jog at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Fartlek Run', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Fartlek Run at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Track Repeats', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Track Repeats at a sustainable intensity for your fitness level.', 11, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/running']::text[]),
('Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Walk at a sustainable intensity for your fitness level.', 3.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Brisk Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Brisk Walk at a sustainable intensity for your fitness level.', 4.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Incline Treadmill Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'treadmill', 'cardio', 'locomotion', 'Complete Incline Treadmill Walk at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Power Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Power Walk at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Hiking', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Hiking at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Ruck Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'other', 'cardio', 'locomotion', 'Complete Ruck Walk at a sustainable intensity for your fitness level.', 6.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Recovery Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Recovery Walk at a sustainable intensity for your fitness level.', 3, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Stair Walk', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Stair Walk at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/walking']::text[]),
('Cycling', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Cycling at a sustainable intensity for your fitness level.', 7.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Stationary Bike', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Stationary Bike at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Spin Class Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Spin Class Intervals at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Outdoor Bike Hills', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Outdoor Bike Hills at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Easy Spin', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Easy Spin at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Cadence Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Cadence Intervals at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Recumbent Bike', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Recumbent Bike at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Assault Bike', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Assault Bike at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/cycling']::text[]),
('Rowing Machine', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Rowing Machine at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Row Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Row Intervals at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Steady State Row', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Steady State Row at a sustainable intensity for your fitness level.', 6.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Row Sprints', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Row Sprints at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Technique Row', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Technique Row at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Mixed Row Pyramid', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Mixed Row Pyramid at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Damper Cap Row', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Damper Cap Row at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Row + Walk Recoveries', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rower', 'cardio', 'locomotion', 'Complete Row + Walk Recoveries at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/rowing']::text[]),
('Freestyle Swim', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Freestyle Swim at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Swim Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Swim Intervals at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Backstroke', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Backstroke at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Breaststroke', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Breaststroke at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Kickboard Drill', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Kickboard Drill at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Open Water Swim', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Open Water Swim at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Swim Easy Laps', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Swim Easy Laps at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Pull Buoy Swim', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Pull Buoy Swim at a sustainable intensity for your fitness level.', 6.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/swimming']::text[]),
('Elliptical', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete Elliptical at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Stair Climber', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete Stair Climber at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('SkiErg', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete SkiErg at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Arc Trainer', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete Arc Trainer at a sustainable intensity for your fitness level.', 6.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Treadmill Incline Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'treadmill', 'cardio', 'locomotion', 'Complete Treadmill Incline Intervals at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Fan Bike Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bike', 'cardio', 'locomotion', 'Complete Fan Bike Intervals at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Seated Elliptical', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete Seated Elliptical at a sustainable intensity for your fitness level.', 5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('ClimbMill', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'machine', 'cardio', 'locomotion', 'Complete ClimbMill at a sustainable intensity for your fitness level.', 8.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/machines']::text[]),
('Burpees', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete Burpees at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body','bodyweight/calisthenics']::text[]),
('HIIT Circuit', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete HIIT Circuit at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body']::text[]),
('Tabata Bodyweight', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete Tabata Bodyweight at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body']::text[]),
('Jumping Jacks', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete Jumping Jacks at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body']::text[]),
('High Knees', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete High Knees at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body']::text[]),
('Skater Jumps', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'bodyweight', 'locomotion', 'Complete Skater Jumps at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit','bodyweight/full-body']::text[]),
('Battle Ropes', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'other', 'cardio', 'locomotion', 'Complete Battle Ropes at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit']::text[]),
('KB Snatch Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'kettlebell', 'cardio', 'locomotion', 'Complete KB Snatch Intervals at a sustainable intensity for your fitness level.', 10, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/hiit']::text[]),
('Jump Rope', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rope', 'cardio', 'locomotion', 'Complete Jump Rope at a sustainable intensity for your fitness level.', 11, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping']::text[]),
('Double Unders', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rope', 'cardio', 'locomotion', 'Complete Double Unders at a sustainable intensity for your fitness level.', 12, true, 'advanced', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping']::text[]),
('Box Jump', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'cardio', 'locomotion', 'Complete Box Jump at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping','bodyweight/full-body']::text[]),
('Broad Jump', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'cardio', 'locomotion', 'Complete Broad Jump at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping','bodyweight/full-body']::text[]),
('Tuck Jump', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'cardio', 'locomotion', 'Complete Tuck Jump at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping','bodyweight/full-body']::text[]),
('Lateral Bound', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'cardio', 'locomotion', 'Complete Lateral Bound at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping','bodyweight/full-body']::text[]),
('Jump Rope Intervals', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'rope', 'cardio', 'locomotion', 'Complete Jump Rope Intervals at a sustainable intensity for your fitness level.', 11, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping']::text[]),
('Depth Jump', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'bodyweight', 'cardio', 'locomotion', 'Complete Depth Jump at a sustainable intensity for your fitness level.', 9, true, 'advanced', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/jumping','bodyweight/full-body']::text[]),
('Basketball Pickup', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Basketball Pickup at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Soccer Scrimmage', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Soccer Scrimmage at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Tennis Rally', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Tennis Rally at a sustainable intensity for your fitness level.', 7, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Badminton Game', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Badminton Game at a sustainable intensity for your fitness level.', 6.5, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Martial Arts Sparring', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Martial Arts Sparring at a sustainable intensity for your fitness level.', 9, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Volleyball Game', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Volleyball Game at a sustainable intensity for your fitness level.', 6, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Shadow Boxing', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Shadow Boxing at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Agility Ladder Drills', 'Cardio', ARRAY['full body']::text[], ARRAY['core','legs']::text[], 'none', 'cardio', 'locomotion', 'Complete Agility Ladder Drills at a sustainable intensity for your fitness level.', 8, true, 'beginner', 'Warm up first and keep landings soft on jumping work.', null, null, ARRAY['cardio/sports']::text[]),
('Full Body Stretch Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Full Body Stretch Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('World''s Greatest Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through World''s Greatest Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Cat-Cow Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Cat-Cow Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Child''s Pose to Down Dog', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Child''s Pose to Down Dog. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Standing Forward Fold Sequence', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Standing Forward Fold Sequence. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Thread the Needle Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Thread the Needle Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Supine Twist Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Supine Twist Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Dynamic Warm-Up Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Dynamic Warm-Up Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/full-body']::text[]),
('Doorway Chest Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Doorway Chest Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Cross-Body Shoulder Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Cross-Body Shoulder Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Overhead Triceps Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Overhead Triceps Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Wall Angels', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Wall Angels. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Open Book Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Open Book Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Pec Minor Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Pec Minor Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Sleeper Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Sleeper Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Band Dislocate', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Band Dislocate. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/chest-shoulders']::text[]),
('Cat-Cow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Cat-Cow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Child''s Pose', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Child''s Pose. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Thread the Needle', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Thread the Needle. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Seated Spinal Twist', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Seated Spinal Twist. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Knee-to-Chest Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Knee-to-Chest Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Prone Press-Up', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Prone Press-Up. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Standing Side Bend', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Standing Side Bend. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('Sphinx Pose', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Sphinx Pose. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/back-spine']::text[]),
('90/90 Hip Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through 90/90 Hip Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Pigeon Pose', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Pigeon Pose. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Frog Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Frog Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Couch Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Couch Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Butterfly Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Butterfly Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Hip Flexor Lunge Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Hip Flexor Lunge Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Figure-Four Stretch', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Figure-Four Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Adductor Rock Back', 'Mobility', ARRAY['hips','glutes']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Adductor Rock Back. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hips']::text[]),
('Seated Hamstring Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Seated Hamstring Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Standing Hamstring Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Standing Hamstring Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Supine Hamstring Strap Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Supine Hamstring Strap Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Quad Couch Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Quad Couch Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('IT Band Cross-Over Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through IT Band Cross-Over Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Calf Wall Stretch', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Calf Wall Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Downward Dog Hamstring Focus', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Downward Dog Hamstring Focus. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Single-Leg Forward Fold', 'Mobility', ARRAY['hamstrings']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Single-Leg Forward Fold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/hamstrings-legs']::text[]),
('Ankle Circles', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Ankle Circles. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Knee-Over-Toe Rock', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Knee-Over-Toe Rock. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Banded Ankle Distraction', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Banded Ankle Distraction. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Calf Stretch on Step', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Calf Stretch on Step. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Tibialis Raise Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Tibialis Raise Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Ankle Alphabet', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Ankle Alphabet. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Wall Ankle Mobilization', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Wall Ankle Mobilization. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Seated Plantar Flex Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Seated Plantar Flex Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/ankles']::text[]),
('Yoga Flow', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Yoga Flow. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Sun Salutation A', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Sun Salutation A. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Downward-Facing Dog', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Downward-Facing Dog. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Warrior II', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Warrior II. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Tree Pose', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Tree Pose. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Bridge Pose Yoga', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Bridge Pose Yoga. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Low Lunge Yoga', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Low Lunge Yoga. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Savasana Breath', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Savasana Breath. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/yoga']::text[]),
('Static Full Body Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Static Full Body Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Neck Side Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Neck Side Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Standing Quad Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Standing Quad Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Seated Butterfly Hold', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Seated Butterfly Hold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Lying Twist Hold', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Lying Twist Hold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Chest Opener Hold', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Chest Opener Hold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Hamstring Strap Hold', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Hamstring Strap Hold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Shoulder Capsule Stretch', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Shoulder Capsule Stretch. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/stretching']::text[]),
('Hip CARs', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Hip CARs. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Shoulder CARs', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Shoulder CARs. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Thoracic Opener', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Thoracic Opener. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Dead Bug Mobility', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Dead Bug Mobility. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('World''s Greatest Stretch Walk', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through World''s Greatest Stretch Walk. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Deep Squat Hold', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Deep Squat Hold. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Wrist Mobility Circles', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Wrist Mobility Circles. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Scapular CARs', 'Mobility', ARRAY['full body']::text[], '{}', 'mat', 'other', 'mobility', 'Move slowly through Scapular CARs. Ease off if you feel sharp pain.', 2.5, true, 'beginner', 'Breathe and avoid forcing end range.', null, null, ARRAY['flexibility/mobility']::text[]),
('Muscle-Up', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'pull-up bar', 'bodyweight', 'calisthenics', 'Progress gradually on Muscle-Up. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/calisthenics','bodyweight/back','strength/back']::text[]),
('Dip', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Dip. Prioritize clean positions over reps.', 6, true, 'intermediate', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/chest','bodyweight/arms','strength/triceps']::text[]),
('Handstand Hold', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Handstand Hold. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/shoulders','bodyweight/calisthenics']::text[]),
('Pistol Squat', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Pistol Squat. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/quadriceps','bodyweight/calisthenics']::text[]),
('Archer Push-Up', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Archer Push-Up. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/chest','bodyweight/calisthenics']::text[]),
('Pseudo Planche Lean', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Pseudo Planche Lean. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/shoulders','bodyweight/calisthenics']::text[]),
('L-Sit', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on L-Sit. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/core','bodyweight/calisthenics']::text[]),
('Ring Row', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Ring Row. Prioritize clean positions over reps.', 6, true, 'beginner', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/back','bodyweight/calisthenics']::text[]),
('Ring Dip', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Ring Dip. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/chest','bodyweight/calisthenics']::text[]),
('Shrimp Squat', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Shrimp Squat. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/quadriceps','bodyweight/calisthenics']::text[]),
('Australian Pull-Up', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Australian Pull-Up. Prioritize clean positions over reps.', 6, true, 'beginner', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/back']::text[]),
('Clapping Push-Up', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Clapping Push-Up. Prioritize clean positions over reps.', 6, true, 'advanced', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/chest','cardio/jumping']::text[]),
('Bear Crawl', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Bear Crawl. Prioritize clean positions over reps.', 6, true, 'beginner', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/full-body','cardio/hiit']::text[]),
('Crab Walk', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Crab Walk. Prioritize clean positions over reps.', 6, true, 'beginner', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/full-body']::text[]),
('Wall Sit', 'Bodyweight', ARRAY['full body']::text[], ARRAY['core']::text[], 'bodyweight', 'bodyweight', 'calisthenics', 'Progress gradually on Wall Sit. Prioritize clean positions over reps.', 6, true, 'beginner', 'Use regressions until the full skill is stable.', null, null, ARRAY['bodyweight/quadriceps']::text[]),
('Calves Drill 1', 'Strength', ARRAY['full body']::text[], '{}', 'dumbbell', 'strength', 'general', 'Perform Calves Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['strength/calves']::text[]),
('Back Drill 1', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Back Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/back']::text[]),
('Back Drill 2', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Back Drill 2 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/back']::text[]),
('Shoulders Drill 1', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Shoulders Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/shoulders']::text[]),
('Shoulders Drill 2', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Shoulders Drill 2 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/shoulders']::text[]),
('Shoulders Drill 3', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Shoulders Drill 3 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/shoulders']::text[]),
('Shoulders Drill 4', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Shoulders Drill 4 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/shoulders']::text[]),
('Shoulders Drill 5', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Shoulders Drill 5 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/shoulders']::text[]),
('Arms Drill 1', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Arms Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/arms']::text[]),
('Arms Drill 2', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Arms Drill 2 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/arms']::text[]),
('Quadriceps Drill 1', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Quadriceps Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/quadriceps']::text[]),
('Hamstrings Glutes Drill 1', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Hamstrings Glutes Drill 1 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/hamstrings-glutes']::text[]),
('Hamstrings Glutes Drill 2', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Hamstrings Glutes Drill 2 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/hamstrings-glutes']::text[]),
('Hamstrings Glutes Drill 3', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Hamstrings Glutes Drill 3 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/hamstrings-glutes']::text[]),
('Hamstrings Glutes Drill 4', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Hamstrings Glutes Drill 4 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/hamstrings-glutes']::text[]),
('Calves Drill 2', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 2 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 3', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 3 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 4', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 4 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 5', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 5 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 6', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 6 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 7', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 7 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[]),
('Calves Drill 8', 'Bodyweight', ARRAY['full body']::text[], '{}', 'bodyweight', 'bodyweight', 'general', 'Perform Calves Drill 8 with controlled form for the prescribed time or reps.', 3.5, true, 'beginner', 'Keep quality high; stop before form breaks down.', null, null, ARRAY['bodyweight/calves']::text[])
) as v(name, category, primary_muscles, secondary_muscles, equipment, exercise_type, movement_pattern, instructions, met_value, is_system, difficulty, tips, description, image_key, library_paths)
where not exists (
  select 1 from public.exercises e where lower(e.name) = lower(v.name)
);
