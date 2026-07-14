# M-ALDBANI Platform | منصة محمد الدباني

Personal brand platform for Mohammed Al-Dabbani — bilingual (AR/EN) consulting & business development site with client portal, admin CRM, and community.

## Run & Operate

- The "Start application" workflow runs both services: the API server (port 8080, backgrounded) and the Vite frontend (port 5000, webview). Vite proxies `/api` and `/uploads` to `localhost:8080`.
  - Only port 5000 is workflow-monitored/forwarded; a single combined workflow is used because the platform's port-detection didn't pick up a standalone 8080 workflow even though the server bound `0.0.0.0` correctly (see Gotchas).
- `pnpm --filter @workspace/api-server run dev` — API server alone (port 8080, MongoDB Atlas)
- `pnpm --filter @workspace/m-aldbani run dev` — React frontend alone (port 5000)
- `pnpm --filter @workspace/api-server exec tsx src/seed.ts` — Re-seed MongoDB with demo data
- Required secret: `MONGODB_URI` (MongoDB Atlas connection string). Optional secrets for full functionality: `GOOGLE_CLIENT_SECRET` (Google sign-in), `MOONSHOT_API_KEY` (AI assistant), `SMTP_PASS` (email sending), `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`/`ADMIN_PHONE` (seed admin account) — not yet configured.

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

## Auth: Google & Apple Sign In

- Google: server-verified OAuth (`google-auth-library`), not client-only JS. Client ID stored in `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend) — same public value, no client secret needed/stored.
- Apple: Sign in with Apple JS SDK loaded in `index.html`, wired in `src/pages/auth/login.tsx`. Services ID stored in `APPLE_CLIENT_ID` (backend) and `VITE_APPLE_CLIENT_ID` (frontend) — currently `maldbani.site`.
- Apple Developer domain/Return URL association must be kept in sync with the live Replit domain (or custom domain) whenever it changes, or Apple Sign In will fail silently.

## AI Assistant ("دباني AI")

- Backend: `artifacts/api-server/src/lib/moonshot.ts` (Moonshot/Kimi client) + `artifacts/api-server/src/routes/ai.ts` (client + admin agent routes).
- Client chat (`/api/ai/client-chat`): friendly Gulf-Arabic brand assistant, streaming, no tools.
- Admin chat (`/api/ai/admin-chat`, admin-only): full agentic assistant with tool-calling over leads/clients/consultations/messages/dashboard stats — can query and act on the DB directly.
- Both are Arabic-only Gulf tone by design (system prompts explicitly forbid non-Arabic words).
- Uses `MOONSHOT_API_KEY` secret + `api.moonshot.ai` (international endpoint, not `.cn`).

## Pointers

- See `pnpm-workspace` skill for workspace structure
- See `lib/api-spec/openapi.yaml` for full API contract
