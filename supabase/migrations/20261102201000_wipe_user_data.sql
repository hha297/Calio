-- Wipe the authenticated user's Calio data while keeping the Auth identity.
-- Caller identity comes only from auth.uid(); never accept a client-supplied user id.

create or replace function public.wipe_own_user_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Child → parent order for FKs that do not cascade from the user row.
  delete from public.food_favorites where user_id = uid;
  delete from public.exercise_favorites where user_id = uid;
  delete from public.food_entries where user_id = uid;
  delete from public.foods where user_id = uid;

  -- workouts → workout_exercises → workout_sets (cascade)
  delete from public.workouts where user_id = uid;

  -- user templates → variations → template exercises (cascade); leave system templates
  delete from public.workout_templates
  where user_id = uid and is_system = false;

  -- custom exercises only (never system catalog rows)
  delete from public.exercises
  where user_id = uid and is_system = false;

  delete from public.body_measurements where user_id = uid;
  delete from public.goals where user_id = uid;
  delete from public.onboarding_progress where user_id = uid;

  -- Keep Auth identity (auth.users) and sensible display prefs (units, preferences jsonb).
  -- Clear tracking / setup fields so the user can complete account setup again while signed in.
  update public.profiles
  set
    display_name = split_part(coalesce((select email from auth.users where id = uid), 'Calio'), '@', 1),
    height_cm = null,
    sex = null,
    birth_date = null,
    activity_level = null,
    onboarding_completed_at = null,
    avatar_url = null
    -- units and preferences intentionally preserved
  where id = uid;
end;
$$;

comment on function public.wipe_own_user_data() is
  'Deletes the caller''s Calio rows (food, workouts, goals, measurements, custom catalog) and resets setup fields. Keeps auth.users, units, and preferences. Uses auth.uid() only.';

revoke all on function public.wipe_own_user_data() from public;
grant execute on function public.wipe_own_user_data() to authenticated;
