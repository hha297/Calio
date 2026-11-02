-- Target muscle tags for user/system workout templates (multi-select).

alter table public.workout_templates
  add column if not exists target_muscles text[] not null default '{}'::text[];

comment on column public.workout_templates.target_muscles is
  'Primary muscle focus tags for discovery (e.g. chest, back). Empty = unspecified.';
