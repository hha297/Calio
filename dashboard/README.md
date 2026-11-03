# Trackwise — Public Dashboard (main website)

Official marketing site for Trackwise (`https://trackwise.one`).

This is the **main public web** package. It is separate from:

- `admin/` — internal Admin console
- the Expo mobile app at the repo root

It does **not** depend on the mobile app or Admin console running.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Lucide React
- Fonts: Bricolage Grotesque (display), Geist (body), JetBrains Mono (metrics)

## Setup

```bash
cd dashboard
cp .env.example .env.local
npm install
npm run dev
```

Local URL: [http://localhost:3001](http://localhost:3001)

Port `3001` avoids colliding with the Admin console on `3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Serve production build on port 3001 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## Configuration

Public env vars (see `.env.example`):

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (default `https://trackwise.one`)
- `NEXT_PUBLIC_GOOGLE_PLAY_URL` / `NEXT_PUBLIC_APP_STORE_URL` — empty → Coming soon badges
- `NEXT_PUBLIC_SUPPORT_EMAIL` — optional support contact
- `NEXT_PUBLIC_TWITTER_URL` / `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_GITHUB_URL` — optional social links (footer only renders configured URLs)

Never put secrets in `NEXT_PUBLIC_*` variables.

## Pages

- `/` — marketing homepage
- `/features` — detailed feature overview
- `/privacy` — draft Privacy Policy
- `/terms` — draft Terms of Use
- `/support` — Support Center
- `/feedback` — feedback form (mock submission)
- `/about` — short about page

## Notes

- Store listings and legal drafts are intentionally incomplete until owner confirmation.
- Feedback form validates in-browser only; it does not transmit data until a backend is connected.
- Brand assets are copied from `../assets/images/branding/`.
