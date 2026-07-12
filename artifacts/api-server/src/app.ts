import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectMongoDB } from "./lib/mongodb";
import { mkdirSync, readFileSync } from "fs";

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

  // Google/Apple client IDs are public identifiers (not secrets), but Vite
  // bakes import.meta.env.VITE_* values in at *build* time, and Render's
  // Docker builds don't receive dashboard env vars at build time. So instead
  // we read them from the actual runtime environment (which Render sets
  // correctly) and inject them into index.html on every request via a small
  // inline script the frontend reads as `window.__RUNTIME_CONFIG__`.
  function injectRuntimeConfig(html: string): string {
    const config = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
      APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || "",
      APPLE_REDIRECT_URI: process.env.APPLE_REDIRECT_URI || "",
    };
    const script = `<script>window.__RUNTIME_CONFIG__=${JSON.stringify(config)};</script>`;
    return html.includes("</head>")
      ? html.replace("</head>", `${script}</head>`)
      : script + html;
  }

  function sendIndexHtml(res: import("express").Response) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    let html: string;
    try {
      html = readFileSync(path.join(frontendDist, "index.html"), "utf-8");
    } catch (err) {
      logger.error({ err }, "Failed to read index.html");
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(injectRuntimeConfig(html));
  }

  // Static assets (JS/CSS/images with content-hash in filename):
  //   → cache forever (immutable). Filenames change on every build so no staleness.
  // index.html is excluded here — served separately above so we can inject
  // the runtime config script into it on every request.
  app.use(
    express.static(frontendDist, {
      index: false,
      setHeaders(res, filePath) {
        if (/\/assets\//.test(filePath)) {
          // Vite hashes all filenames in /assets — safe to cache forever
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  app.get("/", (_req, res) => sendIndexHtml(res));

  // SPA fallback: any non-API path that didn't match a static file gets index.html.
  app.get("/{*path}", (_req, res) => sendIndexHtml(res));
}

export default app;
