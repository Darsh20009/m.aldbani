import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowLeft, ArrowRight, Phone, Mail, Lock, Star } from "lucide-react";
import { useState } from "react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

/* ────────────────────────────────────── */

type Mode = "phone" | "email";

const phoneSchema = z.object({
  identifier: z.string().min(9, "رقم الجوال مطلوب"),
  password:   z.string().min(1, "كلمة المرور مطلوبة"),
});
const emailSchema = z.object({
  identifier: z.string().email("البريد الإلكتروني غير صحيح"),
  password:   z.string().min(1, "كلمة المرور مطلوبة"),
});
type F = z.infer<typeof phoneSchema>;

export default function Login() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const mut = useLogin();
  const [showPwd, setShowPwd] = useState(false);
  const [mode, setMode] = useState<Mode>("phone");
  const isRTL = language === "ar";
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<F>({
    resolver: zodResolver(mode === "phone" ? phoneSchema : emailSchema),
  });

  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  const onSubmit = (data: F) => {
    const payload = mode === "email"
      ? { email: data.identifier, password: data.password }
      : { phone: data.identifier, password: data.password };

    mut.mutate({ data: payload as any }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({ title: t("Welcome back!", "مرحباً بعودتك!") });
        setLocation(res.user.role === "admin" ? "/admin" : "/client");
      },
      onError: () => {
        toast({
          title: t("Login Failed", "فشل تسجيل الدخول"),
          description: mode === "phone"
            ? t("Invalid phone or password.", "رقم الجوال أو كلمة المرور غير صحيحة.")
            : t("Invalid email or password.", "البريد أو كلمة المرور غير صحيحة."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "#FAF8F4" }}>

      {/* ═══ LEFT BRANDING PANEL ═══ */}
      <div className="hidden lg:flex flex-col w-[46%] relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #060e1e 0%, #0a1628 60%, #0d1e3a 100%)" }}>

        {/* Animated gradient orb */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute orb-blue"
          style={{ width: 700, height: 700, top: "-25%", left: "-25%", opacity: 0.6 }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          className="absolute orb-purple"
          style={{ width: 600, height: 600, bottom: "-20%", right: "-20%", opacity: 0.5 }}
        />

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #2563EB, #7C3AED)" }} />

        {/* Huge watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="font-black text-white select-none"
            style={{ fontSize: "12rem", opacity: 0.03, fontFamily: "'IBM Plex Sans Arabic', sans-serif", letterSpacing: "-0.04em" }}>
            {isRTL ? "MD" : "MD"}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Link href="/">
              <div className="inline-flex items-center gap-3 cursor-pointer group">
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/15 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                  <img src={logoImg} alt="m-aldbani" className="h-9 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-heading">m-aldbani</p>
                  <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider">محمد الدباني</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Center */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #2563EB, #7C3AED)" }} />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">
                  {t("Client Portal", "بوابة العملاء")}
                </span>
              </div>

              <h2 className="font-black text-white font-heading mb-5"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
                {t("Welcome\nBack", "مرحباً\nبعودتك")}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-10">
                {t(
                  "Access your private dashboard to track consultations, files, and invoices.",
                  "ادخل لوحة التحكم الخاصة بك لمتابعة الاستشارات والملفات والفواتير."
                )}
              </p>

              {/* Feature list */}
              {[
                { en: "Consultation tracking",   ar: "متابعة الاستشارات" },
                { en: "Shared file access",       ar: "الوصول للملفات"     },
                { en: "Invoices & payment history", ar: "الفواتير والمدفوعات" },
                { en: "Direct messaging",         ar: "المراسلة المباشرة"  },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }} />
                  <span className="text-slate-400 text-sm">{t(item.en, item.ar)}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom quote */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <p className="text-slate-500 text-xs italic leading-relaxed">
              {t('"Experience, Innovation, Impact."', '«الخبرة، الابتكار، الأثر.»')}
            </p>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1.5">— Mohammed Al-Dabbani</p>
          </motion.div>
        </div>
      </div>

      {/* ═══ FORM PANEL ═══ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <Link href="/">
              <div className="rounded-xl bg-white p-2.5 cursor-pointer"
                style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <img src={logoImg} alt="m-aldbani" className="h-8 w-auto object-contain" />
              </div>
            </Link>
            <div>
              <p className="font-bold text-slate-900 text-sm font-heading">m-aldbani</p>
              <p className="text-[#2563EB] text-[10px] font-semibold">محمد الدباني</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 font-heading mb-1.5">
              {t("Sign In", "تسجيل الدخول")}
            </h1>
            <p className="text-slate-500 text-sm">
              {t("Access your client portal.", "ادخل إلى بوابة العملاء الخاصة بك.")}
            </p>
          </div>

          {/* Social login */}
          <div className="space-y-3 mb-6">
            <button type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm bg-white transition-all hover:shadow-md"
              style={{ border: "1px solid #E2E8F0", color: "#374151" }}
              onClick={() => toast({ title: t("Coming Soon", "قريباً"), description: t("Google login coming soon.", "تسجيل Google قريباً.") })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("Continue with Google", "المتابعة بـ Google")}
            </button>
            <button type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "#000", color: "white" }}
              onClick={() => toast({ title: t("Coming Soon", "قريباً"), description: t("Apple login coming soon.", "تسجيل Apple قريباً.") })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {t("Continue with Apple", "المتابعة بـ Apple")}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              {t("or continue with", "أو تابع بـ")}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Mode Toggle — Email / Phone */}
          <div className="flex rounded-xl overflow-hidden mb-6 p-1"
            style={{ background: "#F1EDE7", border: "1px solid rgba(0,0,0,0.06)" }}>
            {([
              { id: "phone", icon: Phone,   labelEn: "Mobile",  labelAr: "جوال"  },
              { id: "email", icon: Mail,    labelEn: "Email",   labelAr: "بريد"  },
            ] as const).map(({ id, icon: Icon, labelEn, labelAr }) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => switchMode(id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors relative"
                style={{
                  color: mode === id ? "#0F172A" : "#94A3B8",
                }}
              >
                {mode === id && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg bg-white"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={14} />
                  {t(labelEn, labelAr)}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" key={mode}>
            {/* Identifier field */}
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                {mode === "phone" ? t("Mobile Number", "رقم الجوال") : t("Email Address", "البريد الإلكتروني")}
              </label>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    style={{ [isRTL ? "right" : "left"]: "14px" }}
                  >
                    {mode === "phone" ? <Phone size={16} /> : <Mail size={16} />}
                  </motion.span>
                </AnimatePresence>
                <input
                  key={`input-${mode}`}
                  type={mode === "phone" ? "tel" : "email"}
                  placeholder={mode === "phone" ? "+966 5X XXX XXXX" : "name@example.com"}
                  autoComplete={mode === "email" ? "email" : "tel"}
                  dir={mode === "phone" ? "ltr" : undefined}
                  {...register("identifier")}
                  className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  style={{
                    borderColor: errors.identifier ? "#EF4444" : "#E2E8F0",
                    color: "#0F172A",
                    paddingLeft: isRTL ? "14px" : "40px",
                    paddingRight: isRTL ? "40px" : "14px",
                  }}
                />
              </div>
              {errors.identifier && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 mt-1.5 flex items-center gap-1"
                >
                  <span>⚠</span> {String(errors.identifier.message)}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <label className="text-sm font-bold text-slate-700">{t("Password", "كلمة المرور")}</label>
                <Link href="/auth/forgot-password">
                  <span className="text-xs text-[#2563EB] font-semibold hover:text-[#7C3AED] transition-colors cursor-pointer">
                    {t("Forgot?", "نسيت؟")}
                  </span>
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  style={{ [isRTL ? "right" : "left"]: "14px" }} />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  style={{
                    borderColor: errors.password ? "#EF4444" : "#E2E8F0",
                    color: "#0F172A",
                    paddingLeft: "40px",
                    paddingRight: "40px",
                  }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ [isRTL ? "left" : "right"]: "14px" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">⚠ {String(errors.password.message)}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={mut.isPending}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
              }}
            >
              {mut.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("Signing in…", "جاري الدخول…")}
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  {t("Sign In", "تسجيل الدخول")}
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 text-center space-y-4" style={{ borderTop: "1px solid #E2E8F0" }}>
            <p className="text-sm text-slate-500">
              {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
              <Link href="/auth/register"
                className="font-bold text-[#2563EB] hover:text-[#7C3AED] transition-colors">
                {t("Request Access →", "← اطلب الوصول")}
              </Link>
            </p>
            <Link href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#2563EB] transition-colors">
              <ArrowBack size={13} />
              {t("Back to website", "العودة للموقع")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
