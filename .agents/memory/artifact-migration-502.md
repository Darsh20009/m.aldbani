---
name: Artifact auto-registration breaks plain workflow routing
description: When the platform auto-registers .replit-artifact/artifact.toml files as real artifacts mid-session, the old plain workflow starts 502ing
---

This project originally ran everything through one plain `.replit` workflow ("Start application": Vite on 5000, api-server backgrounded). It also had `.replit-artifact/artifact.toml` files on disk (for m-aldbani web on port 23559, api-server on 8080, mockup-sandbox on 8081) that looked vestigial/inactive — until the platform auto-registered them as real artifacts mid-session (`automatic_updates` messages: "Added artifact: ..." + "Configured workflows changed: Added artifacts/*: ... workflows").

The moment that happened, the public dev domain started 502ing on every request even though the old plain workflow's Vite server on port 5000 was completely healthy (`curl 127.0.0.1:5000` → 200). The platform's router had switched to expecting the artifact-managed services (e.g. m-aldbani on port 23559 per its `router = "path"` artifact.toml), which weren't running yet.

**Why:** Once real artifacts exist for a project, the deployment/preview router (`deployment.router = "application"` in `.replit`) routes by the artifact.toml port/path mapping, not the plain workflow's port — so a healthy plain workflow on the "old" port becomes invisible to the router.

**How to apply:** If a "site returns 502 / can't be reached" report coincides with (or follows) an `automatic_updates` message about artifacts being added, don't keep restarting the old plain workflow — this is the `artifact-workflow-duplicates.md` scenario. Remove the plain workflow (`removeWorkflow`) and start the new `artifacts/<dir>: <label>` workflows instead. Watch for `EADDRINUSE` from orphaned processes left over from the plain workflow (kill via `lsof -ti :<port> | xargs kill -9`) before the artifact workflow can bind the same port.
