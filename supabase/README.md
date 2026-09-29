# Supabase

Schema changes belong in `migrations/` and are applied with the Supabase CLI. Dashboard edits are not the source of truth.

No tables are created in this milestone. Auth uses Supabase Auth only.

When a user-owned table is added:

1. Add a SQL migration in `migrations/`.
2. Enable row level security in that migration.
3. Add policies that limit rows to the signed-in user (`auth.uid()`).
4. Grant only the privileges the app needs.

Do not put the service-role key, database password, or other secrets in the mobile app or in this directory.

`functions/` is for Edge Functions that must run with server-only credentials. `seed/` is for local development data.
