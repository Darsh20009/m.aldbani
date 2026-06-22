---
name: Mongoose async pre-hooks
description: Mongoose 9.x pre-save async hooks must not call next()
---

In Mongoose 9.x, async pre-save hooks should NOT call next(). Remove the next parameter entirely.

Wrong:
  UserSchema.pre("save", async function(next) { ...; next(); });

Correct:
  UserSchema.pre("save", async function() { ...; });

**Why:** Mongoose 9 changed hook behavior — calling next() as a function throws "next is not a function" TypeError.
