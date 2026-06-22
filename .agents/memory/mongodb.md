---
name: MongoDB setup
description: This project uses MongoDB Atlas + Mongoose, not PostgreSQL + Drizzle
---

MongoDB Atlas is used via MONGODB_URI secret. Mongoose models are in artifacts/api-server/src/models/. The lib/db package (PostgreSQL/Drizzle) is NOT used.

Seed script: artifacts/api-server/src/seed.ts — run with `pnpm exec tsx src/seed.ts` from api-server directory.
Admin: admin@m-aldbani.com / Admin@2024
JWT auth uses SESSION_SECRET env var.

**Why:** User chose MongoDB for a personal brand platform; more flexible document model for varied content types.
