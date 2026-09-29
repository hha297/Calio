-- Fix body_measurements unique key for setup weight upsert.
-- The core schema created a non-unique index named body_measurements_user_day_idx,
-- so the later "create unique index if not exists" with the same name was a no-op.
-- Without a unique constraint, upsert onConflict: 'user_id,measured_on' fails with:
-- "there is no unique or exclusion constraint matching the ON CONFLICT specification"

drop index if exists public.body_measurements_user_day_idx;

create unique index if not exists body_measurements_user_measured_on_uidx
  on public.body_measurements (user_id, measured_on);
