# نخبة (Nakhba) — Contemporary Luxury E-Commerce

## Project Overview
A premium Arabic-first luxury e-commerce platform. Monorepo with React/Vite frontend (`apps/vibe-app`), Express 5 backend (`apps/api-server`), Drizzle ORM + PostgreSQL (`packages/db`), and a contract-first OpenAPI layer (`packages/api-spec`, `packages/api-zod`, `packages/api-client-react`).

## Architecture
- **Frontend**: React 19 + Vite, Tailwind CSS 4, Framer Motion, TanStack Query, Wouter — port 5000
- **Backend**: Express 5, Drizzle ORM, Pino logging — port 3000
- **Database**: PostgreSQL via Replit managed DB (DATABASE_URL secret)
- **Auth**: Custom JWT (bcryptjs passwords + Google/Facebook OAuth)
- **Proxy**: Vite dev server proxies `/api` → `localhost:3000`

## Design Identity — v3.0
- **Brand color**: `#EA580C` (orange ramp, 10 steps)
- **Luxury accents**: Gold `#d4af37`, Bronze `#B8763E`, Ink `#1A1410`
- **Surface**: Warm champagne `#FBFAF8`
- **Fonts**: Reem Kufi Fun (display/headings), IBM Plex Sans Arabic (UI/body)
- **Grid**: 4-pt geometric base
- **Direction**: RTL (Arabic-first)

## Running
- `Project` workflow runs both apps in parallel
- Backend: `cd apps/api-server && pnpm run build && PORT=3000 node dist/index.mjs`
- Frontend: `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/vibe-app run dev`

## Secrets Required
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `JWT_SECRET` — JWT signing secret (set)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, for Google OAuth
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` — optional, for Facebook OAuth

## User Preferences
- RTL layout, Arabic language UI
- Luxury dark cinematic aesthetic for brand/accent sections
- Gold (#d4af37) as luxury accent color throughout
