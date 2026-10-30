-- Persist diet preset + macro percentages alongside gram targets.
-- Fiber target is independent of the C/P/F 100% distribution.
-- Consumed fiber is not stored on food_entries yet — Diary shows intake as unavailable.

alter table public.goals
  add column if not exists diet_preset text
    check (
      diet_preset is null
      or diet_preset in (
        'balanced',
        'low_carb',
        'high_protein',
        'keto',
        'atkins',
        'paleo',
        'mediterranean',
        'dash',
        'custom'
      )
    ),
  add column if not exists carbs_pct integer
    check (carbs_pct is null or (carbs_pct >= 0 and carbs_pct <= 100)),
  add column if not exists protein_pct integer
    check (protein_pct is null or (protein_pct >= 0 and protein_pct <= 100)),
  add column if not exists fat_pct integer
    check (fat_pct is null or (fat_pct >= 0 and fat_pct <= 100)),
  add column if not exists fiber_g integer
    check (fiber_g is null or fiber_g >= 0);

alter table public.goals
  drop constraint if exists goals_macro_pct_sum_chk;

alter table public.goals
  add constraint goals_macro_pct_sum_chk
  check (
    carbs_pct is null
    or protein_pct is null
    or fat_pct is null
    or (carbs_pct + protein_pct + fat_pct = 100)
  );

comment on column public.goals.diet_preset is
  'Calio diet preset id (application starting point, not a medical prescription).';
comment on column public.goals.fiber_g is
  'Daily fiber target in grams; independent of carb/protein/fat percentages.';
