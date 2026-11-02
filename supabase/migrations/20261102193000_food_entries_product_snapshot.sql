-- Snapshot product image + optional micronutrients on food log entries.
-- Preserves matched product visuals after foods catalog changes.

alter table public.food_entries
  add column if not exists image_url text,
  add column if not exists basis_unit text
    check (basis_unit is null or basis_unit in ('g', 'ml', 'serving')),
  add column if not exists fiber_g numeric(10, 2)
    check (fiber_g is null or fiber_g >= 0),
  add column if not exists sugars_g numeric(10, 2)
    check (sugars_g is null or sugars_g >= 0),
  add column if not exists saturated_fat_g numeric(10, 2)
    check (saturated_fat_g is null or saturated_fat_g >= 0),
  add column if not exists sodium_mg numeric(10, 2)
    check (sodium_mg is null or sodium_mg >= 0);

comment on column public.food_entries.image_url is
  'Product image URL snapshotted at log time (e.g. Open Food Facts).';
comment on column public.food_entries.fiber_g is
  'Optional fiber for the logged amount; null means unavailable (not zero).';
comment on column public.food_entries.sugars_g is
  'Optional sugars for the logged amount; null means unavailable.';
comment on column public.food_entries.saturated_fat_g is
  'Optional saturated fat for the logged amount; null means unavailable.';
comment on column public.food_entries.sodium_mg is
  'Optional sodium (mg) for the logged amount; null means unavailable.';

-- Backfill images from linked catalog foods when still available.
update public.food_entries e
set image_url = f.image_url
from public.foods f
where e.food_id = f.id
  and e.image_url is null
  and f.image_url is not null;

-- Copy basis_unit from foods when entry lacks it.
update public.food_entries e
set basis_unit = f.basis_unit
from public.foods f
where e.food_id = f.id
  and e.basis_unit is null
  and f.basis_unit is not null;
