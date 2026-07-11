import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import appleSignin from "apple-signin-auth";
import { User } from "../models/User";
import { signToken, requireAuth, AuthRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

const ADMIN_PHONE    = process.env.ADMIN_PHONE    || "+966552469643";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
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

/* ── Register ─────────────────────────────────── */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "الاسم والبريد وكلمة المرور مطلوبة" });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) { res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل" }); return; }
    const user = await User.create({ name, email, password, phone, role: "client", provider: "local" });
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Register error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

/* ── Login ────────────────────────────────────── */
router.post("/login", async (req: Request, res: Response) => {
  const { phone, email, password } = req.body;
  const identifier = (phone || email || "").trim();
  if (!identifier || !password) {
    res.status(400).json({ error: "بيانات الدخول مطلوبة" });
    return;
  }
  const digits9 = (p: string) => p.replace(/\D/g, "").slice(-9);

  if (
    (digits9(identifier) === digits9(ADMIN_PHONE) || identifier === ADMIN_EMAIL) &&
    password === ADMIN_PASSWORD
  ) {
    const token = signToken({ id: FALLBACK_ADMIN.id, role: "admin", name: FALLBACK_ADMIN.name, email: FALLBACK_ADMIN.email });
    res.json({ token, user: FALLBACK_ADMIN });
    return;
  }

  try {
    const user = await User.findOne(
      identifier.includes("@") ? { email: identifier } : { phone: identifier }
    );
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      return;
    }
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }
});

/* ── Google OAuth (server-side redirect flow — Authorized redirect URIs) ── */
function googleRedirectClient(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
  const redirectUri = `${proto}://${host}/api/auth/google/callback`;
  return { client: new OAuth2Client({ clientId, clientSecret, redirectUri }), redirectUri };
}

/** Step 1: redirect the browser to Google's consent screen. */
router.get("/google", (req: Request, res: Response) => {
  const ctx = googleRedirectClient(req);
  if (!ctx) { res.status(503).send("تسجيل الدخول بـGoogle غير مفعّل حالياً"); return; }
  const url = ctx.client.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });
  res.redirect(url);
});

/** Step 2: Google redirects back here with ?code=... (Authorized redirect URI). */
router.get("/google/callback", async (req: Request, res: Response) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
  const frontendOrigin = `${proto}://${host}`;
  const ctx = googleRedirectClient(req);
  const code = req.query.code as string | undefined;
  const oauthError = req.query.error as string | undefined;

  if (!ctx || oauthError || !code) {
    res.redirect(`${frontendOrigin}/auth/login?error=google`);
    return;
  }

  try {
    const { tokens } = await ctx.client.getToken(code);
    if (!tokens.id_token) throw new Error("no id_token returned");
    const ticket = await ctx.client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("no email in payload");

    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const picture = payload.picture || "";
    const sub = payload.sub;

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, avatar: picture, provider: "google", role: "client", password: "" });
    } else if (!user.googleId) {
      user.googleId = sub;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.redirect(`${frontendOrigin}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    logger.error({ err }, "Google OAuth redirect callback error");
    res.redirect(`${frontendOrigin}/auth/login?error=google`);
  }
});

router.post("/google", async (req: Request, res: Response) => {
  try {
    const { credential, access_token } = req.body as { credential?: string; access_token?: string };
    if (!credential && !access_token) { res.status(400).json({ error: "رمز Google مطلوب" }); return; }

    let email = "", name = "", picture = "", sub = "";

    if (credential) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) { res.status(503).json({ error: "تسجيل الدخول بـGoogle غير مفعّل حالياً" }); return; }
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload?.email) { res.status(400).json({ error: "لم نتمكن من التحقق من حساب Google" }); return; }
      email   = payload.email;
      name    = payload.name || email.split("@")[0];
      picture = payload.picture || "";
      sub     = payload.sub;
    } else if (access_token) {
      const infoRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
      if (!infoRes.ok) { res.status(401).json({ error: "رمز Google منتهي أو غير صحيح" }); return; }
      const info = await infoRes.json() as { email?: string; name?: string; picture?: string; id?: string };
      if (!info.email) { res.status(400).json({ error: "لم نتمكن من جلب بيانات Google" }); return; }
      email   = info.email;
      name    = info.name || email.split("@")[0];
      picture = info.picture || "";
      sub     = info.id || email;
    }

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, avatar: picture, provider: "google", role: "client", password: "" });
    } else if (!user.googleId) {
      user.googleId = sub;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt } });
  } catch (err) {
    logger.error({ err }, "Google OAuth error");
    res.status(401).json({ error: "فشل التحقق من حساب Google" });
  }
});

/* ── Apple Sign In ────────────────────────────── */
router.post("/apple", async (req: Request, res: Response) => {
  try {
    const { id_token, user: appleUserData } = req.body as {
      id_token: string;
      user?: { name?: { firstName?: string; lastName?: string }; email?: string };
    };
    if (!id_token) { res.status(400).json({ error: "رمز Apple مطلوب" }); return; }

    const clientId = process.env.APPLE_CLIENT_ID;
    if (!clientId) { res.status(503).json({ error: "تسجيل الدخول بـApple غير مفعّل حالياً — يرجى إعداد متطلبات Apple Developer" }); return; }

    const appleIdTokenClaims = await appleSignin.verifyIdToken(id_token, {
      audience: clientId,
      ignoreExpiration: false,
    });

    const email = appleIdTokenClaims.email || appleUserData?.email || "";
    const appleId = appleIdTokenClaims.sub;
    if (!appleId) { res.status(400).json({ error: "لم نتمكن من التحقق من حساب Apple" }); return; }

    let user = await User.findOne({ $or: [{ appleId }, ...(email ? [{ email }] : [])] });
    if (!user) {
      const firstName = appleUserData?.name?.firstName ?? "";
      const lastName  = appleUserData?.name?.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim() || (email ? email.split("@")[0] : "مستخدم Apple");
      user = await User.create({
        name,
        email:    email || `${appleId}@apple.placeholder`,
        appleId,
        provider: "apple",
        role:     "client",
        password: "",
      });
    } else if (!user.appleId) {
      user.appleId = appleId;
      await user.save();
    }

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Apple Sign In error");
    res.status(401).json({ error: "فشل التحقق من حساب Apple" });
  }
});

/** Client-side Google OAuth: accepts access_token from @react-oauth/google */
router.post("/google", async (req: Request, res: Response) => {
  const { access_token } = req.body as { access_token?: string };
  if (!access_token) { res.status(400).json({ error: "access_token مطلوب" }); return; }
  try {
    const r = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${encodeURIComponent(access_token)}`);
    if (!r.ok) { res.status(401).json({ error: "رمز Google غير صالح" }); return; }
    const info = await r.json() as { id: string; email?: string; name?: string; picture?: string };
    const { id: sub, email, name: rawName, picture = "" } = info;
    if (!email) { res.status(401).json({ error: "لم يتم العثور على البريد الإلكتروني" }); return; }
    const name = rawName || email.split("@")[0];
    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, avatar: picture, provider: "google", role: "client", password: "" });
    } else if (!user.googleId) {
      user.googleId = sub;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt } });
  } catch (err) {
    logger.error({ err }, "Google client-side auth error");
    res.status(401).json({ error: "فشل تسجيل الدخول بـGoogle" });
  }
});

/* ── Logout ───────────────────────────────────── */
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "تم تسجيل الخروج" });
});

/* ── Me ───────────────────────────────────────── */
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const jwtUser = req.user!;
  if (jwtUser.id === FALLBACK_ADMIN.id || jwtUser.email === ADMIN_EMAIL) {
    res.json({ ...FALLBACK_ADMIN, id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role });
    return;
  }
  try {
    const user = await User.findById(jwtUser.id).select("-password");
    if (!user) {
      res.json({ id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role, phone: "", avatar: null, createdAt: new Date() });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt });
  } catch (err) {
    logger.error({ err }, "Get me error");
    res.json({ id: jwtUser.id, name: jwtUser.name, email: jwtUser.email, role: jwtUser.role, phone: "", avatar: null, createdAt: new Date() });
  }
});

export default router;
