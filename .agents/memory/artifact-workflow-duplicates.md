---
name: Artifact workflow — combined command
description: How to run both services after platform auto-registered artifacts with new port assignments
---

When the platform auto-registers artifacts (automatic_updates: "Added artifact / Configured workflows changed"), the preview router switches to artifact-managed ports. For this project:
- m-aldbani web: port **23559** (artifact.toml [services.env] PORT=23559, BASE_PATH=/)
- api-server: port **8080**

**Why the API server standalone workflow fails:** port 8080 detection times out in a standalone artifact workflow (same root cause as the old plain workflow).

**Fix:** Configure `artifacts/m-aldbani: web` with a combined command that backgrounds the API server:
```
bash -c 'pnpm --filter @workspace/api-server run dev > /tmp/api-server.log 2>&1 & PORT=23559 BASE_PATH=/ pnpm --filter @workspace/m-aldbani run dev'
```
waitForPort: 23559. Leave `artifacts/api-server: API Server` not started.

**Steps when this breaks:**
1. `removeWorkflow({ name: "Start application" })` — remove the old plain workflow
2. `lsof -ti :5000 :8080 :23559 | xargs kill -9` — kill orphaned processes
3. `configureWorkflow({ name: "artifacts/m-aldbani: web", command: "...", waitForPort: 23559 })`
4. `WorkflowsRestart("artifacts/m-aldbani: web")`
