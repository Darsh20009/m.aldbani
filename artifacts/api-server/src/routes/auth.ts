import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { signToken, requireAuth, AuthRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "Logged out" });
});

router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt });
  } catch (err) {
    logger.error({ err }, "Get me error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
