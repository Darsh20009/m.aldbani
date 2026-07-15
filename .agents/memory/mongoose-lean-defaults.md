---
name: Mongoose schema defaults don't retroactively apply to stored docs
description: Why a field with a schema `default:` can still read as undefined on old/seeded documents, breaking strict equality checks (e.g. auth tokenVersion, provider)
---

Schema-level `default:` only fires when Mongoose creates/saves a NEW document. It never backfills documents already sitting in MongoDB. Any doc inserted before the field existed, seeded via raw driver/insertMany, or saved by an older code path will have that field genuinely missing — reading it (via `.lean()` OR a normal hydrated query) returns `undefined`, not the schema default.

**Why:** Hit this twice on the same project: (1) auth middleware compared JWT `tokenVersion` (0) against `User.findById().lean().tokenVersion` which was `undefined` for pre-existing users → every request failed right after login; (2) password-reset flow checked `user.provider !== "local"` to gate OAuth accounts, but two seeded users had no `provider` field at all, so `undefined !== "local"` was true and the reset email was silently skipped for real local accounts.

**How to apply:** Never trust strict equality against a field that has a schema default — either coalesce (`user.field ?? defaultValue`) or invert the check to only exclude known non-default values (e.g. `provider === "google" || provider === "apple"` instead of `provider !== "local"`). Also backfill existing documents once found: `updateMany({ field: { $exists: false } }, { $set: { field: default } })`.
