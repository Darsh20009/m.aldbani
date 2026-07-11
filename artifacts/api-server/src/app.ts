import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectMongoDB } from "./lib/mongodb";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB on startup
connectMongoDB().catch((err) => {
  logger.error({ err }, "Failed to connect to MongoDB — continuing without DB");
});

// Ensure uploads dir exists
const uploadsDir = path.resolve(__dirname, "../../uploads");
try { mkdirSync(uploadsDir, { recursive: true }); } catch {}
app.use("/uploads", express.static(uploadsDir));

app.use("/api", router);

// ── Serve frontend static files in production ─────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../m-aldbani/dist/public");

  // Static assets (JS/CSS/images with content-hash in filename):
  //   → cache forever (immutable). Filenames change on every build so no staleness.
  // index.html:
  //   → never cache. Must always be fresh so the browser fetches the latest chunk map.
  app.use(
    express.static(frontendDist, {
      setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (/\/assets\//.test(filePath)) {
          // Vite hashes all filenames in /assets — safe to cache forever
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // SPA fallback: any non-API path that didn't match a static file gets index.html.
  // Never cache it — same reason as above.
  app.get("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
