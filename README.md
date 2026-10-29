# Calio

Calio is a friendly Expo mobile app for food, calories, workouts, goals, and progress.
Calorie and activity numbers are estimates for everyday tracking — not medical measurements.

## Prerequisites

- Node.js 22+
- npm
- A physical Android or iPhone
- [Expo Go for SDK 57](https://expo.dev/go)

## Install

```bash
npm install
```

## Environment

Create `.env.local`:

```text
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Optional — Create Food image uploads (unsigned Cloudinary preset)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

`EXPO_PUBLIC_SUPABASE_KEY` is also accepted as an alias.

Never put the service-role key, database password, or Cloudinary API secret in the app.
Food images use an **unsigned** Cloudinary upload preset only (no API secret on device).

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
message, and enter its 8-digit code in Calio.

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

Scan the QR code with Expo Go (SDK 57). Use `--tunnel` only if LAN discovery fails:

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
- `src/theme/` — Calio design tokens (DESIGN.MD)
- `src/stores/` — Zustand for active workout UI only
- TanStack Query for server state
- Supabase Auth + Postgres + RLS

## Brand assets

Official logos:

- `assets/brand/logo-light.png` — lime lockup for light screens
- `assets/brand/logo-on-primary.png` — lime on purple for splash/icon moments

## Development builds

Google OAuth must be tested in a development build because the callback uses the
native `calio://auth/callback` scheme. Expo Go has its own scheme and is not the
end-to-end OAuth target configured in Supabase.

Before building, confirm the selected `.env.local` is the Cloud Supabase project
where Google is enabled. The local Docker provider configuration is separate and
does not inherit the Cloud Client ID/Secret. Keep the Google Client Secret only in
the Supabase provider settings, never in the app or an `EXPO_PUBLIC_*` variable.

Create and install an Android development build:

```bash
npx expo install expo-dev-client
npx eas-cli@latest build --profile development --platform android
```

Then start Metro for that build, open the installed Calio development client, and
test both Sign in and Sign up with Google:

```bash
npx expo start --dev-client --tunnel
```

Test these cases on a physical phone: cancel the Google browser, complete login
from a terminated app, tap the Google button repeatedly, relaunch after success,
and use both a new Google account and an existing account whose identity-linking
behavior is configured by Supabase. A new/incomplete profile must enter setup;
an already-complete profile must enter the dashboard through normal bootstrap.
