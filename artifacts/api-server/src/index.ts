import app from "./app";
import { logger } from "./lib/logger";

// In production (Render/Docker) PORT is injected by the platform — respect it first.
// In development (Replit) API_PORT=8080 keeps the Express server off the Vite dev port (5000).
const rawPort =
  process.env.NODE_ENV === "production"
    ? process.env["PORT"] || process.env["API_PORT"]
    : process.env["API_PORT"] || process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "API_PORT or PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
