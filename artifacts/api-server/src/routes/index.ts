import { Router, type IRouter } from "express";
import healthRouter    from "./health";
import authRouter      from "./auth";
import publicRouter    from "./public";
import clientRouter    from "./client";
import adminRouter     from "./admin";
import communityRouter from "./community";
import aiRouter        from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",      authRouter);
router.use("/ai",        aiRouter);
router.use("/client",    clientRouter);
router.use("/admin",     adminRouter);
router.use("/community", communityRouter);
router.use("/",          publicRouter);

export default router;
