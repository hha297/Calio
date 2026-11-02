# Trackwise Admin — agent instructions

Standalone Next.js App Router console under `admin/`. Shares the mobile app’s Supabase Auth/Postgres project. Do not put the service role key in `NEXT_PUBLIC_*` or client components.

## Scope

- Own `package.json` / lockfile; deploy with Vercel root directory `admin/`.
- Auth: email/password via `@supabase/ssr` cookies. No public signup.
- Authorization: `public.user_roles` + `is_admin()` / security-definer RPCs. Never trust `user_metadata` for privilege.
- Catalog and Storage writes run only after `requireAdmin()` on the server (user JWT + admin RLS, or service role for Auth Admin email lookup).

## Key paths

- App routes: `src/app/`
- Domain actions/queries: `src/features/`
- Supabase clients: `src/lib/supabase/`
- Gate: `src/lib/auth.ts` (`requireAdmin`)
- Schema: `../supabase/migrations/` (roles, audit, flags, archive columns)

## Rules

- Prefer additive migrations; do not rewrite applied history.
- Soft-archive catalog rows with `archived_at` when FKs exist.
- Food entry macros/names are snapshots — catalog edits must not rewrite history.
- Engagement KPIs are proxies from food/workout writes; do not invent session DAU.
- Do not apply remote/production migrations or deploy without explicit approval.
