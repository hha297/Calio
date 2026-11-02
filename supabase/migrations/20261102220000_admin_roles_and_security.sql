-- Trackwise Admin: roles, account status, catalog archive, audit logs, feature flags,
-- security-definer helpers, and admin RLS. Additive only.

-- ---------- roles ----------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'admin', 'tester')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, role)
);

create index if not exists user_roles_role_idx on public.user_roles (role);

create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

alter table public.user_roles enable row level security;

-- Users can read their own roles (mobile/admin UI gating). Never allow client writes.
create policy "user_roles_select_own"
  on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id);

-- ---------- account status ----------
alter table public.profiles
  add column if not exists account_status text not null default 'active'
    check (account_status in ('active', 'suspended'));

comment on column public.profiles.account_status is
  'Admin-managed account gate. active = normal access; suspended = blocked from app use.';

-- ---------- catalog soft-archive ----------
alter table public.exercises
  add column if not exists archived_at timestamptz;

alter table public.foods
  add column if not exists archived_at timestamptz;

create index if not exists exercises_archived_at_idx
  on public.exercises (archived_at)
  where archived_at is not null;

create index if not exists foods_archived_at_idx
  on public.foods (archived_at)
  where archived_at is not null;

-- Hide archived system catalog from normal clients; own custom rows still visible to owner.
drop policy if exists "exercises_select_visible" on public.exercises;
create policy "exercises_select_visible" on public.exercises
  for select to authenticated
  using (
    (
      is_system = true
      and archived_at is null
    )
    or user_id = auth.uid()
  );

drop policy if exists "foods_select_visible" on public.foods;
create policy "foods_select_visible" on public.foods
  for select to authenticated
  using (
    archived_at is null
    and (is_public = true or user_id = auth.uid() or user_id is null)
  );

-- ---------- audit logs (append-only for admins) ----------
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  reason text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);

create index if not exists admin_audit_logs_actor_idx
  on public.admin_audit_logs (actor_id, created_at desc);

alter table public.admin_audit_logs enable row level security;

-- ---------- feature flags ----------
create table if not exists public.feature_flags (
  key text primary key,
  description text,
  enabled boolean not null default false,
  tester_only boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users (id) on delete set null
);

create trigger feature_flags_set_updated_at
before update on public.feature_flags
for each row execute function public.set_updated_at();

alter table public.feature_flags enable row level security;

-- ---------- helpers ----------
create or replace function public.has_role(p_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = p_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin');
$$;

create or replace function public.is_tester()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('tester') or public.has_role('admin');
$$;

revoke all on function public.has_role(text) from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_tester() from public;
grant execute on function public.has_role(text) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_tester() to authenticated;

-- ---------- audit insert helper ----------
create or replace function public.admin_write_audit(
  p_action text,
  p_target_type text,
  p_target_id text default null,
  p_reason text default null,
  p_before jsonb default null,
  p_after jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  insert into public.admin_audit_logs (
    actor_id, action, target_type, target_id, reason, before_data, after_data
  ) values (
    auth.uid(), p_action, p_target_type, p_target_id, p_reason, p_before, p_after
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.admin_write_audit(text, text, text, text, jsonb, jsonb) from public;
grant execute on function public.admin_write_audit(text, text, text, text, jsonb, jsonb) to authenticated;

-- ---------- role management ----------
create or replace function public.admin_set_role(
  p_user_id uuid,
  p_role text,
  p_enabled boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_count integer;
  v_before jsonb;
  v_after jsonb;
begin
  if p_role not in ('admin', 'tester', 'user') then
    raise exception 'invalid role';
  end if;

  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  if p_role = 'user' then
    -- 'user' is implied by absence of elevated roles; ignore grant/revoke.
    return;
  end if;

  select coalesce(jsonb_agg(role order by role), '[]'::jsonb)
    into v_before
  from public.user_roles
  where user_id = p_user_id;

  if p_enabled then
    insert into public.user_roles (user_id, role)
    values (p_user_id, p_role)
    on conflict (user_id, role) do nothing;
  else
    if p_role = 'admin' then
      select count(*)::integer into v_admin_count
      from public.user_roles
      where role = 'admin';

      if v_admin_count <= 1 and exists (
        select 1 from public.user_roles where user_id = p_user_id and role = 'admin'
      ) then
        raise exception 'cannot remove the last admin';
      end if;
    end if;

    delete from public.user_roles
    where user_id = p_user_id
      and role = p_role;
  end if;

  select coalesce(jsonb_agg(role order by role), '[]'::jsonb)
    into v_after
  from public.user_roles
  where user_id = p_user_id;

  perform public.admin_write_audit(
    case when p_enabled then 'role.grant' else 'role.revoke' end,
    'user_roles',
    p_user_id::text,
    p_reason,
    jsonb_build_object('roles', v_before),
    jsonb_build_object('roles', v_after, 'role', p_role, 'enabled', p_enabled)
  );
end;
$$;

revoke all on function public.admin_set_role(uuid, text, boolean, text) from public;
grant execute on function public.admin_set_role(uuid, text, boolean, text) to authenticated;

create or replace function public.admin_set_account_status(
  p_user_id uuid,
  p_status text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before text;
begin
  if p_status not in ('active', 'suspended') then
    raise exception 'invalid status';
  end if;

  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  if p_user_id = auth.uid() and p_status = 'suspended' then
    raise exception 'cannot suspend yourself';
  end if;

  select account_status into v_before
  from public.profiles
  where id = p_user_id;

  if v_before is null then
    raise exception 'profile not found';
  end if;

  update public.profiles
  set account_status = p_status
  where id = p_user_id;

  perform public.admin_write_audit(
    'account.status',
    'profiles',
    p_user_id::text,
    p_reason,
    jsonb_build_object('account_status', v_before),
    jsonb_build_object('account_status', p_status)
  );
end;
$$;

revoke all on function public.admin_set_account_status(uuid, text, text) from public;
grant execute on function public.admin_set_account_status(uuid, text, text) to authenticated;

-- Bootstrap: grant admin without requiring an existing admin (service_role / SQL only).
create or replace function public.admin_bootstrap_grant(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_count integer;
begin
  select count(*)::integer into v_admin_count
  from public.user_roles
  where role = 'admin';

  if v_admin_count > 0 then
    raise exception 'bootstrap disabled: an admin already exists';
  end if;

  insert into public.user_roles (user_id, role)
  values (p_user_id, 'admin')
  on conflict (user_id, role) do nothing;

  insert into public.admin_audit_logs (actor_id, action, target_type, target_id, reason, after_data)
  values (
    p_user_id,
    'role.bootstrap',
    'user_roles',
    p_user_id::text,
    'Initial administrator bootstrap',
    jsonb_build_object('role', 'admin')
  );
end;
$$;

revoke all on function public.admin_bootstrap_grant(uuid) from public;
-- Intentionally not granted to authenticated/anon. Run as postgres/service_role in SQL.

-- ---------- admin read policies ----------
create policy "user_roles_select_admin"
  on public.user_roles
  for select to authenticated
  using (public.is_admin());

create policy "admin_audit_logs_select_admin"
  on public.admin_audit_logs
  for select to authenticated
  using (public.is_admin());

-- No update/delete policies on audit logs for authenticated (append via RPC only).

create policy "feature_flags_select_authenticated"
  on public.feature_flags
  for select to authenticated
  using (true);

create policy "feature_flags_write_admin"
  on public.feature_flags
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "profiles_select_admin"
  on public.profiles
  for select to authenticated
  using (public.is_admin());

create policy "goals_select_admin"
  on public.goals
  for select to authenticated
  using (public.is_admin());

create policy "foods_select_admin"
  on public.foods
  for select to authenticated
  using (public.is_admin());

create policy "food_entries_select_admin"
  on public.food_entries
  for select to authenticated
  using (public.is_admin());

create policy "exercises_select_admin"
  on public.exercises
  for select to authenticated
  using (public.is_admin());

create policy "workouts_select_admin"
  on public.workouts
  for select to authenticated
  using (public.is_admin());

create policy "workout_exercises_select_admin"
  on public.workout_exercises
  for select to authenticated
  using (public.is_admin());

create policy "workout_sets_select_admin"
  on public.workout_sets
  for select to authenticated
  using (public.is_admin());

create policy "body_measurements_select_admin"
  on public.body_measurements
  for select to authenticated
  using (public.is_admin());

create policy "workout_templates_select_admin"
  on public.workout_templates
  for select to authenticated
  using (public.is_admin());

create policy "onboarding_progress_select_admin"
  on public.onboarding_progress
  for select to authenticated
  using (public.is_admin());

-- System catalog writes for admins (system rows only / public system foods).
create policy "exercises_admin_insert_system"
  on public.exercises
  for insert to authenticated
  with check (public.is_admin() and is_system = true and user_id is null);

create policy "exercises_admin_update_system"
  on public.exercises
  for update to authenticated
  using (public.is_admin() and is_system = true)
  with check (public.is_admin() and is_system = true and user_id is null);

create policy "exercises_admin_delete_system"
  on public.exercises
  for delete to authenticated
  using (public.is_admin() and is_system = true);

create policy "foods_admin_insert_system"
  on public.foods
  for insert to authenticated
  with check (
    public.is_admin()
    and source = 'system'
    and user_id is null
  );

create policy "foods_admin_update_system"
  on public.foods
  for update to authenticated
  using (public.is_admin() and (source = 'system' or user_id is null))
  with check (public.is_admin());

create policy "foods_admin_delete_system"
  on public.foods
  for delete to authenticated
  using (public.is_admin() and (source = 'system' or user_id is null));

-- Storage: allow admin-authenticated writes to exercise-images (still blocked for normal users).
drop policy if exists "exercise_images_admin_insert" on storage.objects;
create policy "exercise_images_admin_insert"
  on storage.objects
  for insert to authenticated
  with check (bucket_id = 'exercise-images' and public.is_admin());

drop policy if exists "exercise_images_admin_update" on storage.objects;
create policy "exercise_images_admin_update"
  on storage.objects
  for update to authenticated
  using (bucket_id = 'exercise-images' and public.is_admin())
  with check (bucket_id = 'exercise-images' and public.is_admin());

drop policy if exists "exercise_images_admin_delete" on storage.objects;
create policy "exercise_images_admin_delete"
  on storage.objects
  for delete to authenticated
  using (bucket_id = 'exercise-images' and public.is_admin());

-- Seed a few feature flags (idempotent).
insert into public.feature_flags (key, description, enabled, tester_only)
values
  ('beta_progress_insights', 'Experimental progress insights in mobile app', false, true),
  ('admin_dashboard', 'Enables Admin Dashboard entry points', true, false)
on conflict (key) do nothing;
