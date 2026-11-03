# Trackwise

Trackwise is a friendly Expo mobile app for food, calories, workouts, goals, and progress.
Calorie and activity numbers are estimates for everyday tracking — not medical measurements.

## Prerequisites

- Node.js 22+
- npm
- A physical Android or iPhone
- [Expo Go for SDK 58](https://expo.dev/go) (store build may lag a few weeks after SDK release; use a development build if needed)

## Install

```bash
npm install
```

## Environment

Create `.env.local`:

```text
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Optional — Create Food image / avatar uploads (unsigned Cloudinary preset)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# Optional — Account legal / support links (omit until real URLs exist)
# EXPO_PUBLIC_PRIVACY_POLICY_URL=https://example.com/privacy
# EXPO_PUBLIC_TERMS_OF_SERVICE_URL=https://example.com/terms
# EXPO_PUBLIC_SUPPORT_EMAIL=support@example.com
# Optional: Admin dashboard URL (Account entry for users with admin role)
# EXPO_PUBLIC_ADMIN_URL=http://localhost:3000
```

`EXPO_PUBLIC_SUPABASE_KEY` is also accepted as an alias.

Never put the service-role key, database password, or Cloudinary API secret in the app.
Food images and profile avatars use an **unsigned** Cloudinary upload preset only (no API secret on device).
Avatars are stored under the Cloudinary folder `trackwise/avatars`; only the HTTPS URL is saved on `profiles.avatar_url`.
Food, avatar, and custom-exercise uploads are gated to **1 MB** on the client.

### System exercise images

System exercises are backed by artwork under `assets/images/workout/exercises/` and served from the public Supabase Storage bucket `exercise-images` via `exercises.image_storage_path`. Custom exercises keep Cloudinary `image_url`.

Apply migration `20261101120000_exercise_images_storage.sql` if the bucket/columns are missing.

`.env.local` is gitignored and remains the default Cloud configuration. Expo reads
environment variables already set in the terminal before values from `.env.local`,
so a local test session can override Cloud without editing or replacing that file.

## Database

Schema lives in `supabase/migrations/`.

Apply the latest migration in the Supabase SQL Editor (Dashboard → SQL), or with the Supabase CLI after linking the project:

```bash
npx supabase db push
```

The core migration creates profiles, goals, foods, food_entries, exercises, workouts, measurements, RLS policies, and a starter exercise catalog.

### Account deletion (Edge Function)

Account deletion uses the `delete-account` Edge Function with the **service role** on the server. Deploy it after linking the project:

```bash
npx supabase functions deploy delete-account
```

Ensure the function has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (set automatically on hosted Supabase). Do not put the service-role key in the mobile app.

Also apply `supabase/migrations/20261029210000_profile_avatar.sql` so `profiles.avatar_url` exists.

## Local Supabase (Docker)

Docker Desktop must be open and its Linux daemon must be running. The project uses
the npm-scoped Supabase CLI; no global installation is required.

```powershell
npm run supabase:start
npm run supabase:status
```

The first start downloads the Supabase images and applies every migration. It does
not reset an existing local database. Local tools are available only on this PC:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Mailpit test inbox: `http://127.0.0.1:54324`

Auth emails are captured rather than delivered. Open Mailpit, select the newest
message, and enter its 8-digit code in Trackwise.

To use the local API from an emulator or another client that can reach this PC,
override only the current PowerShell session, then start Expo from the same shell:

```powershell
$supabase = npx --yes supabase status -o json | ConvertFrom-Json
$env:EXPO_PUBLIC_SUPABASE_URL = $supabase.API_URL
$env:EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = $supabase.PUBLISHABLE_KEY
npm start
```

Close that terminal (or remove the two session variables) to return to the Cloud
values in `.env.local`:

```powershell
Remove-Item Env:EXPO_PUBLIC_SUPABASE_URL, Env:EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm start
```

Stop local Supabase without deleting its database volume:

```powershell
npm run supabase:stop
```

Do not use `supabase db reset`, `supabase stop --no-backup`, or delete the Docker
volumes unless losing local data is intentional.

### Physical phone on 4G

Expo's `--tunnel` carries the JavaScript bundle only; it does not make the Supabase
API reachable. Use a private tailnet instead:

1. Install Tailscale on the PC and phone, and sign both into the same tailnet.
2. With local Supabase running, expose only its API gateway (not Postgres, Studio,
   or Mailpit):

   ```powershell
   tailscale serve --bg 54321
   tailscale serve status
   ```

3. Copy the HTTPS `*.ts.net` URL printed by Tailscale and start Expo in the same
   PowerShell session with that URL and the local publishable key:

   ```powershell
   $supabase = npx --yes supabase status -o json | ConvertFrom-Json
   $env:EXPO_PUBLIC_SUPABASE_URL = "https://YOUR-PC.YOUR-TAILNET.ts.net"
   $env:EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = $supabase.PUBLISHABLE_KEY
   npm start
   ```

Tailscale Serve is private to devices/users allowed by the tailnet ACL. Do not use
Tailscale Funnel or ngrok here: those would expose the local development API to the
public Internet. Stop only this HTTPS proxy later with
`tailscale serve --https=443 off`.

## Run on a phone

```bash
npm start
```

Scan the QR code with Expo Go (SDK 58). Use `--tunnel` only if LAN discovery fails:

```bash
npx expo start --tunnel
```

## Scripts

```bash
npm run typecheck
npm run lint
npm test
```

## Architecture

- `app/` — Expo Router screens (onboarding, auth, tabs, food, workout, goals, measurements)
- `src/features/` — domain hooks, schemas, adapters
- `src/theme/` — Trackwise design tokens (DESIGN.MD)
- `src/stores/` — Zustand for active workout UI only
- TanStack Query for server state
- Supabase Auth + Postgres + RLS
- `admin/` — Admin web console (own package; see `admin/README.md`)
- `dashboard/` — Public marketing site for trackwise.one (own package; see `dashboard/README.md`)

## Brand assets

Official logos:

- `assets/brand/logo-light.png` — lime lockup for light screens
- `assets/brand/logo-on-primary.png` — lime on purple for splash/icon moments

## Google OAuth (Expo Go + development builds)

The app picks the redirect URI at runtime (`src/features/auth/redirect.ts`):

| Environment | Command | Redirect URI shape |
| --- | --- | --- |
| Expo Go tunnel | `npm start` / `npm run start:clear` | `exp://<tunnel-host>.exp.direct/--/auth/callback` |
| Expo Go LAN | `npm run start:lan` | `exp://<lan-ip>:8081/--/auth/callback` |
| Development / store build | `npx expo start --dev-client` (+ installed client) | `trackwise://auth/callback` |

Do not hardcode tunnel hosts or LAN IPs in app code. In `__DEV__`, Metro logs the
resolved `redirectUri` (never tokens).

### Supabase Auth → URL Configuration

**Site URL:** `trackwise://auth/callback`

**Redirect URLs** (allowlist). Prefer wildcards for Expo Go so LAN/tunnel hosts can
change without editing the dashboard every session:

```
exp://**/--/auth/callback
exp://**
trackwise://auth/callback
trackwise://**
```

If a wildcard is rejected or OAuth still fails with a redirect error, add the
**exact** URI printed in the Metro/`[auth] redirectUri` log for that session.

Google Cloud Console must authorize only the **Supabase** callback
(`https://<project-ref>.supabase.co/auth/v1/callback`), not the app deep link.

### Environment notes

- **Tunnel (verified on Android Expo Go):** most reliable Expo Go path; deep link
  returns as `exp://*.exp.direct/--/auth/callback`.
- **LAN:** same code path, but Android Custom Tabs often fail to hand
  `exp://192.168.x.x` back to Expo Go even when Supabase created the auth user.
  Prefer tunnel for Expo Go OAuth, or use a development build.
- **Development build:** uses `trackwise://auth/callback` and is the production-like
  target. Install `expo-dev-client`, then:

```bash
npx expo install expo-dev-client
npx eas-cli@latest build --profile development --platform android
npx expo start --dev-client --tunnel
```

Before building, confirm `.env.local` points at the Cloud Supabase project where
Google is enabled. Keep the Google Client Secret only in Supabase provider
settings, never in the app or an `EXPO_PUBLIC_*` variable.

Test on a physical phone: cancel the Google browser, complete login from a
terminated app, tap Google repeatedly, relaunch after success, and use both a new
Google account and an existing account. Incomplete profiles must enter setup;
complete profiles enter the dashboard through normal bootstrap.
