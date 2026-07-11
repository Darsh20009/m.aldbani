---
name: Mongoose .lean() skips schema defaults
description: Why a field with a schema default can still read as undefined, breaking equality checks (e.g. auth tokenVersion)
---

`.lean()` queries return plain JS objects straight from MongoDB — they skip Mongoose document hydration, so schema-level `default:` values are NOT applied for fields missing on the stored document. A document created/seeded before a field existed (or inserted via raw driver) will come back as `undefined` for that field even though the schema declares a default.

**Why:** This caused a real bug — an auth middleware compared a JWT's `tokenVersion` (defaulted to 0 at sign time) against `User.findById(...).lean().tokenVersion`, which was `undefined` for pre-existing users, so `undefined !== 0` failed every request right after login ("session expired" immediately).

**How to apply:** When comparing/using a field read via `.lean()`, coalesce with `?? <schemaDefault>` explicitly, or backfill existing documents (`updateMany({ field: { $exists: false } }, { $set: { field: default } })`) rather than trusting the schema default to apply on read.
