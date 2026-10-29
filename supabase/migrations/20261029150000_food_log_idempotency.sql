-- A client-generated key makes food logging safe to retry after an uncertain network response.
alter table public.food_entries
  add column if not exists client_request_id text,
  add column if not exists amount numeric(10, 3),
  add column if not exists amount_unit text check (amount_unit is null or amount_unit in ('g', 'ml', 'serving')),
  add column if not exists nutrition_basis text check (nutrition_basis is null or nutrition_basis in ('per100', 'serving')),
  add column if not exists basis_amount numeric(10, 3),
  add column if not exists nutrition_user_edited boolean not null default false;

alter table public.foods
  add column if not exists nutrition_basis text check (nutrition_basis is null or nutrition_basis in ('per100', 'serving')),
  add column if not exists basis_unit text check (basis_unit is null or basis_unit in ('g', 'ml', 'serving')),
  add column if not exists basis_amount numeric(10, 3),
  add column if not exists nutrition_user_edited boolean not null default false;

create unique index if not exists food_entries_user_client_request_uidx
  on public.food_entries (user_id, client_request_id);
