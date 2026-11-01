-- Exercise library coaching content v4 lives in the app catalog:
--   src/features/workout/catalog/system-exercises.json
-- App merge prefers higher content_version so enriched local copy wins over
-- older remote stubs. This migration documents the content bump only.

comment on column public.exercises.content_version is
  'Coaching-copy revision. App catalog v4+ wins over older remote stubs when merging.';

comment on column public.exercises.common_mistakes is
  'Common technique errors and quick corrections for system/custom exercises.';

comment on column public.exercises.safety_notes is
  'Safety boundaries and stop signals. Estimates only — not medical advice.';
