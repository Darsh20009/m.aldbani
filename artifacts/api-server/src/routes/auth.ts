import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken, requireAuth, AuthRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

const ADMIN_PHONE    = process.env.ADMIN_PHONE    || "+966552469643";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";
const ADMIN_NAME     = process.env.ADMIN_NAME     || "Mohammed Al-Dabbani";
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@m-aldbani.com";

const FALLBACK_ADMIN = {
  id: "fallback-admin-id",
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  role: "admin" as const,
  phone: ADMIN_PHONE,
  avatar: null,
  createdAt: new Date("2024-01-01"),
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
    const user = await User.create({ name, email, password, phone, role: "client" });
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Register error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { phone, email, password } = req.body;
  const identifier = (phone || email || "").trim();

  if (!identifier || !password) {
    res.status(400).json({ error: "Phone and password are required" });
    return;
  }

  // Normalize phone: strip spaces/dashes for comparison
  const normalize = (p: string) => p.replace(/[\s\-]/g, "");

  // Fallback admin — phone or email match, works without MongoDB
  if (
    (normalize(identifier) === normalize(ADMIN_PHONE) || identifier === ADMIN_EMAIL) &&
    password === ADMIN_PASSWORD
  ) {
    const token = signToken({ id: FALLBACK_ADMIN.id, role: "admin", name: FALLBACK_ADMIN.name, email: FALLBACK_ADMIN.email });
    res.json({ token, user: FALLBACK_ADMIN });
    return;
  }

  // Try MongoDB for other users (by phone or email)
  try {
    const user = await User.findOne(
      identifier.includes("@") ? { email: identifier } : { phone: identifier }
    );
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "Logged out" });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const jwtUser = req.user!;

  // Fallback admin — return from JWT payload without hitting DB
  if (jwtUser.id === FALLBACK_ADMIN.id || jwtUser.email === ADMIN_EMAIL) {
    res.json({ ...FALLBACK_ADMIN, id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role });
    return;
  }

  try {
    const user = await User.findById(jwtUser.id).select("-password");
    if (!user) {
      // Return JWT payload as fallback so the session stays alive
      res.json({ id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role, phone: "", avatar: null, createdAt: new Date() });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt });
  } catch (err) {
    logger.error({ err }, "Get me error");
    // Return JWT payload so the UI doesn't break
    res.json({ id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role, phone: "", avatar: null, createdAt: new Date() });
  }
});

export default router;
