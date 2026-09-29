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
```

`EXPO_PUBLIC_SUPABASE_KEY` is also accepted as an alias.

Never put the service-role key or database password in the app.

## Database

Schema lives in `supabase/migrations/`.

Apply the latest migration in the Supabase SQL Editor (Dashboard → SQL), or with the Supabase CLI after linking the project:

```bash
npx supabase db push
```

The core migration creates profiles, goals, foods, food_entries, exercises, workouts, measurements, RLS policies, and a starter exercise catalog.

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

Expo Go works for current packages. When you need a custom native build:

```bash
npx expo install expo-dev-client
npx eas-cli@latest build --profile development --platform android
```
