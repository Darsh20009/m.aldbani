---
name: Public dev-domain curl unreliable for 502 diagnosis
description: Raw shell curl to https://$REPLIT_DEV_DOMAIN can show 502 even when the app is healthy and works fine in the user's real browser
---

Diagnosing a "site doesn't work" report by curling `https://$REPLIT_DEV_DOMAIN/` (or `127.0.0.1:80` with a Host header) from the shell can show a persistent 502 across multiple workflow restarts even though:
- `curl http://127.0.0.1:<port>/` (the app's own bind) returns 200 and the Screenshot tool renders the app correctly.
- The workflow is `running` with the correct `openPorts`/`waitForPort`.
- The user, testing the same dev-domain URL in an actual browser (with a hard refresh), sees the site working.

**Why:** The public dev-domain proxy path is session/browser-oriented (per the platform's mTLS-based preview proxying) and does not appear to be reliably testable via a bare shell `curl` — a 502 from curl alone is not proof the user-facing site is actually down.

**How to apply:** Don't conclude "platform routing is broken" from shell curl to the public dev domain alone. Cross-check with the `Screenshot` tool (hits the app directly) for app health, and when in doubt, ask the user to hard-refresh (Ctrl+Shift+R) or open a fresh private window before escalating to "this is a platform bug" — that step alone has resolved apparent 502s that shell curl kept reporting.
