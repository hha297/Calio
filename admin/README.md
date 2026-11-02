# Trackwise Admin

Standalone Next.js (App Router) operations console for the Trackwise Supabase project. It shares Auth users with the Expo mobile app. There is no public signup — only accounts with an `admin` row in `public.user_roles` can sign in.

## Prerequisites

- Same Supabase project as mobile (local Docker or hosted)
- Migration `20261102220000_admin_roles_and_security.sql` applied
- Node.js 20+ and npm

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Auth Admin email lookup |

Never put the service role key in `NEXT_PUBLIC_*` or the mobile app.

For local Supabase, use values from `npx supabase status`.

## Bootstrap the first admin

`public.user_roles` is **read-only in the Table Editor** for normal clients (RLS: select only). Role writes go through RPCs / SQL as postgres or service_role — not manual row edits with the anon key.

Until at least one admin exists, run this **once** as postgres/service_role (SQL Editor → role `postgres`, or `psql`), replacing the UUID with your Auth user id:

```sql
select public.admin_bootstrap_grant('00000000-0000-0000-0000-000000000000');
```

Local seed (`supabase/seed.sql`, applied on `db reset`) creates:

- email: `test@admin.com`
- password: `testadmin`
- role: `admin`

After that, promote/demote via Admin → Users (calls `admin_set_role`). The last admin cannot be demoted.

## Develop

```bash
cd admin
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with email/password for an admin account.

Useful scripts:

```bash
npm run typecheck
npm run lint
npm run build
```

## Modules

- **Dashboard** — user counts, engagement proxies from food/workout activity, catalog totals
- **Exercises / Foods** — system catalog CRUD, soft-archive, exercise image upload to `exercise-images`
- **Users** — roles (`admin` / `tester`), suspend/restore, audit-backed RPCs
- **User data** — read-only food logs, workouts, measurements, goals, templates
- **System** — feature flags, audit log viewer, catalog health

## Sync system exercise content (local)

After migrations, local DB rows may still be short stubs. Refresh coaching copy + Storage images from the mobile catalog:

```bash
# from repo root, with local Supabase env exported (or in .env.local)
npm run sync:exercises
```

This upserts `description` / instructions / tips / mistakes / safety, sets `image_key` + `image_storage_path`, and uploads matching files from `assets/images/workout/exercises/` into the `exercise-images` bucket.

## Vercel

- Set project **Root Directory** to `admin`
- Configure the three env vars above
- Do not enable public auth signup for the shared Supabase project for admin onboarding

## Mobile entry

The Expo app shows Account → Admin dashboard when:

1. `EXPO_PUBLIC_ADMIN_URL` points at this deployment (e.g. `https://admin.example.com` or `http://localhost:3000`)
2. The signed-in user has `user_roles.role = 'admin'`

The link opens the browser; login is separate (no tokens in the URL).
