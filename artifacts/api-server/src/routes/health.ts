import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

/** Fast ping — used by the frontend to detect cold-start spin-up time */
router.get("/ping", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

export default router;
