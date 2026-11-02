-- Extend body_measurements for circumference tracking (U.S. Navy BF inputs + optional sites).
-- Storage units: circumferences in cm, weight in kg (convert for display/input by preference).
-- Derived Navy estimates are computed in the app from stored inputs + profile height/sex;
-- body_fat_percent may hold a snapshot estimate with composition_method identifying source.

alter table public.body_measurements
  add column if not exists neck_cm numeric(6, 2)
    check (neck_cm is null or (neck_cm >= 15 and neck_cm <= 60)),
  add column if not exists hip_cm numeric(6, 2)
    check (hip_cm is null or (hip_cm >= 50 and hip_cm <= 200)),
  add column if not exists bicep_cm numeric(6, 2)
    check (bicep_cm is null or (bicep_cm >= 10 and bicep_cm <= 80)),
  add column if not exists thigh_cm numeric(6, 2)
    check (thigh_cm is null or (thigh_cm >= 20 and thigh_cm <= 120)),
  add column if not exists composition_method text
    check (
      composition_method is null
      or composition_method in ('manual', 'us_navy_v1')
    ),
  add column if not exists fat_mass_kg numeric(7, 3)
    check (fat_mass_kg is null or fat_mass_kg >= 0),
  add column if not exists lean_mass_kg numeric(7, 3)
    check (lean_mass_kg is null or lean_mass_kg >= 0),
  add column if not exists ffmi numeric(6, 2)
    check (ffmi is null or ffmi >= 0);

comment on column public.body_measurements.neck_cm is 'Neck circumference in cm (Navy method input).';
comment on column public.body_measurements.hip_cm is 'Hip circumference in cm (required for female Navy formula).';
comment on column public.body_measurements.bicep_cm is 'Optional upper-arm circumference in cm.';
comment on column public.body_measurements.thigh_cm is 'Optional thigh circumference in cm.';
comment on column public.body_measurements.composition_method is
  'How body_fat_percent / derived masses were produced: manual entry or us_navy_v1 estimate.';
comment on column public.body_measurements.fat_mass_kg is 'Snapshot fat mass kg when composition was estimated.';
comment on column public.body_measurements.lean_mass_kg is 'Snapshot lean mass kg when composition was estimated.';
comment on column public.body_measurements.ffmi is 'Snapshot FFMI when composition was estimated.';
