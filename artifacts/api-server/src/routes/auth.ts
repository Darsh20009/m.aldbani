import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import appleSignin from "apple-signin-auth";
import { User } from "../models/User";
import { signToken, requireAuth, AuthRequest } from "../middlewares/auth";
import { logger } from "../lib/logger";
import { sendEmail, renderBrandedEmail } from "../lib/email";

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
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email, tokenVersion: user.tokenVersion ?? 0 });
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
    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email, tokenVersion: user.tokenVersion ?? 0 });
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

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email, tokenVersion: user.tokenVersion ?? 0 });
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

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email, tokenVersion: user.tokenVersion ?? 0 });
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

    const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email, tokenVersion: user.tokenVersion ?? 0 });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    logger.error({ err }, "Apple Sign In error");
    res.status(401).json({ error: "فشل التحقق من حساب Apple" });
  }
});

/* ── Forgot Password ──────────────────────────── */
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) { res.status(400).json({ error: "البريد الإلكتروني مطلوب" }); return; }

  // Always respond with 200 so we don't leak whether the email exists
  res.json({ message: "إذا كان البريد مسجلاً، ستصلك رسالة خلال دقائق" });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.provider !== "local") return; // only local accounts can reset password

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
    const host  = (req.headers["x-forwarded-host"] as string) || req.get("host");
    const resetUrl = `${proto}://${host}/auth/reset-password?token=${token}`;

    const html = renderBrandedEmail({
      dir: "rtl", lang: "ar",
      title: "إعادة تعيين كلمة المرور",
      preheader: "طلبت إعادة تعيين كلمة المرور لحسابك",
      bodyHtml: `
        <p style="margin:0 0 20px;color:#3a3733;font-size:16px;line-height:1.8;font-family:Arial,sans-serif">
          مرحباً <strong>${user.name}</strong>،
        </p>
        <p style="margin:0 0 28px;color:#3a3733;font-size:15px;line-height:1.75;font-family:Arial,sans-serif">
          تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. انقر على الزر أدناه لاختيار كلمة مرور جديدة.
          الرابط صالح لمدة <strong>ساعة واحدة</strong> فقط.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px">
          <tr>
            <td style="border-radius:12px;background:linear-gradient(135deg,#2563EB,#7C3AED);text-align:center">
              <a href="${resetUrl}"
                style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:700;
                       text-decoration:none;font-family:Arial,sans-serif;letter-spacing:0.02em">
                إعادة تعيين كلمة المرور
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 8px;color:#9a9590;font-size:12px;line-height:1.6;font-family:Arial,sans-serif">
          إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة — حسابك بأمان تام.
        </p>
        <p style="margin:0;color:#b8b3ac;font-size:11px;font-family:Arial,sans-serif;word-break:break-all">
          ${resetUrl}
        </p>
      `,
    });

    await sendEmail({
      to: user.email,
      subject: "إعادة تعيين كلمة المرور — منصة محمد الدباني",
      html,
      text: `إعادة تعيين كلمة المرور\n\nانقر هنا: ${resetUrl}\n\nالرابط صالح لساعة واحدة.`,
    });

    logger.info({ email: user.email }, "Password reset email sent");
  } catch (err) {
    logger.error({ err }, "Forgot password error");
  }
});

/* ── Reset Password ───────────────────────────── */
router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password) { res.status(400).json({ error: "البيانات مطلوبة" }); return; }
  if (password.length < 8) { res.status(400).json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }); return; }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "الرابط غير صالح أو انتهت صلاحيته. اطلب رابطاً جديداً." });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // invalidate all existing sessions
    await user.save();

    logger.info({ userId: user.id }, "Password reset successfully");
    res.json({ message: "تم إعادة تعيين كلمة المرور بنجاح" });
  } catch (err) {
    logger.error({ err }, "Reset password error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

/* ── Logout ───────────────────────────────────── */
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "تم تسجيل الخروج" });
});

/* ── Logout all devices — increments tokenVersion to invalidate every session ── */
router.post("/logout-all", requireAuth, async (req: AuthRequest, res: Response) => {
  const jwtUser = req.user!;
  if (jwtUser.id === "fallback-admin-id") {
    res.json({ message: "تم تسجيل الخروج من جميع الأجهزة" });
    return;
  }
  try {
    await User.findByIdAndUpdate(jwtUser.id, { $inc: { tokenVersion: 1 } });
    res.json({ message: "تم تسجيل الخروج من جميع الأجهزة بنجاح" });
  } catch (err) {
    logger.error({ err }, "Logout all error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
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
