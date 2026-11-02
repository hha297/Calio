-- Allow admins to update profile display fields (Admin user CRUD).
-- Status changes remain via admin_set_account_status RPC.

create policy "profiles_update_admin"
  on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
