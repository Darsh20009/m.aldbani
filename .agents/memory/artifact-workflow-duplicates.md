---
name: Duplicate artifact workflows
description: Why restarting a workflow by a guessed "artifacts/*" name can create/duplicate canvas-managed workflows, and how orphaned processes can hold ports after a failed restart.
---

This project (and possibly others with a canvas/mockup-sandbox setup) has two parallel sets of workflows targeting the same underlying services:

- Plain workflows defined in `.replit` (e.g. `API Server`, `Start application`) — removable via `removeWorkflow`.
- Canvas/artifact-managed workflows named like `artifacts/<dir>: <label>` (e.g. `artifacts/api-server: API Server`, `artifacts/m-aldbani: web`, `artifacts/mockup-sandbox: Component Preview Server`) — these are tied to registered artifacts and CANNOT be removed via `removeWorkflow` (`PROHIBITED_ACTION`).

**Why:** If both sets try to bind the same port (e.g. 8080, 23559), one will fail with `EADDRINUSE`/"Port already in use". Restarting the failing one again doesn't help if a previous process is still alive and holding the port (workflow marked "failed" doesn't guarantee the child process actually exited).

**How to apply:**
- Don't guess or invent `artifacts/*` workflow names hoping to fix a failure — check `listWorkflows()` first to see what actually exists.
- If a workflow keeps failing with a port-in-use error even after restart, check for orphaned processes with `ss -ltnp | grep <port>` or `ps aux | grep vite`/`node`, and `kill -9` the stale PID before restarting.
- When both a plain `.replit` workflow and an artifact-managed workflow exist for the same service, remove the plain one (it's the duplicate) and keep the artifact-managed one, since the latter can't be deleted anyway.
