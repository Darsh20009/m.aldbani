---
name: API server port-detection workaround
description: Why the API server runs backgrounded inside the frontend workflow instead of its own workflow
---

A standalone Replit workflow for the Express API server (port 8080, `pnpm --filter @workspace/api-server run dev`) reliably times out with `didn't open port 8080` even though the server logs "Server listening"/"Connected to MongoDB Atlas" and binds `0.0.0.0` correctly (verified with manual `curl` returning 200). This reproduced across multiple restarts with `app.listen(port, "0.0.0.0", cb)`.

**Why:** Likely a platform-side port-detection/forwarding quirk specific to this project's artifact-based service layout (each service has its own `.replit-artifact/artifact.toml` declaring ports); a plain `configureWorkflow`-created workflow for the same port doesn't get detected the same way an artifact-managed service would.

**How to apply:** Run both services from one workflow instead of two — background the API server and foreground the Vite frontend (the only port that needs platform detection, since Vite proxies `/api` and `/uploads` to `localhost:8080` internally):
`bash -c 'pnpm --filter @workspace/api-server run dev > /tmp/api-server.log 2>&1 & pnpm --filter @workspace/m-aldbani run dev'` with `waitForPort: 5000`. Check `/tmp/api-server.log` if the API needs debugging.
