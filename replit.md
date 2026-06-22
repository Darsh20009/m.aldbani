# M-ALDBANI Platform | منصة محمد الدباني

Personal brand platform for Mohammed Al-Dabbani — bilingual (AR/EN) consulting & business development site with client portal, admin CRM, and community.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080, MongoDB Atlas)
- `pnpm --filter @workspace/m-aldbani run dev` — React frontend (port 23559)
- `pnpm --filter @workspace/api-server exec tsx src/seed.ts` — Re-seed MongoDB with demo data

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, Wouter, React Query
- API: Express 5
- DB: **MongoDB Atlas** + Mongoose (NOT PostgreSQL — `lib/db` is unused)
- Auth: JWT (`SESSION_SECRET`), bcryptjs
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)

## Where things live

- `artifacts/m-aldbani/` — React frontend (PWA)
- `artifacts/api-server/` — Express API
- `artifacts/api-server/src/models/` — Mongoose models
- `artifacts/api-server/src/routes/` — API routes (auth, public, client, admin, community)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/src/generated/` — Generated React Query hooks + Zod schemas

## Architecture decisions

- MongoDB over PostgreSQL — document model suits varied content (projects, articles, services)
- JWT in localStorage — client portal and admin use Bearer token auth
- Bilingual via `LanguageProvider` — RTL/LTR toggled dynamically on `<html dir>`
- Off-white light theme (`#FAF8F4`) — brand color scheme with `#2563EB` blue and `#7C3AED` purple
- PWA — `manifest.json`, `sw.js` service worker, `apple-touch-icon` for iOS Add to Home Screen

## Product

- **Public**: Home, About, Portfolio, Services, Articles, Community (social feed), Contact, Booking
- **Client Portal**: Dashboard, Consultations, Messages, Files, Invoices
- **Admin CRM**: Dashboard (KPIs), Leads, Clients, Consultations, Portfolio, Articles, Services, Analytics

## User preferences

- Off-white background (#FAF8F4), not dark theme
- Logo (`attached_assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png`) must appear everywhere: navbar, hero, footer, portal sidebars, PWA icons
- Arabic RTL + English LTR bilingual — `t(en, ar)` helper from `useLanguage()`
- PWA support required — installable as app on mobile

## Gotchas

- Mongoose 9.x pre-save async hooks: do NOT call `next()` — just `return` early. Calling `next()` throws "next is not a function".
- Hooks in `src/hooks/`, components in `src/components/layout/` — use `../../hooks/` not `../hooks/` in layout files.
- MongoDB seed: `pnpm exec tsx src/seed.ts` from `artifacts/api-server/`
- GitHub push requires a project task (main agent git operations are sandboxed). Task #1 created for this.
- Admin login: `admin@m-aldbani.com` / `Admin@2024`

## Pointers

- See `pnpm-workspace` skill for workspace structure
- See `lib/api-spec/openapi.yaml` for full API contract
