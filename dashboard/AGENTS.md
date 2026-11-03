# Trackwise Dashboard (public site) — agent instructions

Standalone Next.js App Router marketing site under `dashboard/`. This is the main public web for Trackwise users and prospects (`trackwise.one`) — **not** the Admin console in `admin/`.

## Scope

- Own `package.json` / lockfile; run independently on port 3001 by default (Admin uses 3000).
- Follow root `DESIGN.MD` and Trackwise brand (`#00D95F`, bone canvas, Bricolage / Geist / JetBrains Mono).
- Advertise only features that exist in the mobile app. Prefer Coming soon / TODO over invented claims.
- Keep store URLs, support email, and social links config-driven; empty values must not create broken links.

## Key paths

- Routes: `src/app/`
- Layout / nav / footer: `src/components/layout/`, `src/components/navigation/`
- Marketing sections & phone mockups: `src/components/sections/`, `src/components/mockups/`
- Site config: `src/config/site.ts`
- Copy: `src/content/`

## Rules

- Do not deploy, change DNS, or wire production backends without explicit approval.
- Do not put secrets in `NEXT_PUBLIC_*`.
- Legal pages remain drafts until owner review; keep visible draft notices and TODO placeholders.
- Feedback stays mock-first until a real endpoint exists — never claim delivery falsely.
