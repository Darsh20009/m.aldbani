import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

export interface AuthRequest extends Request {
  user?: { id: string; role: string; name: string; email: string; tokenVersion?: number };
}

export function signToken(payload: {
  id: string;
  role: string;
  name: string;
  email: string;
  tokenVersion?: number;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      name: string;
      email: string;
      tokenVersion?: number;
    };

    // If the token carries a version, validate it against the DB so that
    // "logout all devices" (which increments tokenVersion) takes effect immediately.
    if (decoded.tokenVersion !== undefined && decoded.id !== "fallback-admin-id") {
      const dbUser = await User.findById(decoded.id).select("tokenVersion").lean();
      if (!dbUser || dbUser.tokenVersion !== decoded.tokenVersion) {
        res.status(401).json({ error: "انتهت جلستك. يرجى تسجيل الدخول مجدداً." });
        return;
      }
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await requireAuth(req, res, async () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
