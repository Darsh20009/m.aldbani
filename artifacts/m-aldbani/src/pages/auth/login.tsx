import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowLeft, ArrowRight, Phone, Lock } from "lucide-react";
import { useState } from "react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

const schema = z.object({
  phone:    z.string().min(9, "رقم الجوال مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
type F = z.infer<typeof schema>;

export default function Login() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const mut = useLogin();
  const [showPwd, setShowPwd] = useState(false);
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: F) => {
    mut.mutate({ data: { phone: data.phone, password: data.password } as any }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({ title: t("Welcome back!", "مرحباً بعودتك!") });
        setLocation(res.user.role === "admin" ? "/admin" : "/client");
      },
      onError: () => {
        toast({
          title: t("Login Failed", "فشل تسجيل الدخول"),
          description: t("Invalid phone or password.", "رقم الجوال أو كلمة المرور غير صحيحة."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? "rtl" : "ltr"}>

      {/* ── LEFT / RIGHT BRANDING PANEL ── */}
      <div className="hidden lg:flex flex-col w-[48%] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #060e1e 0%, #0a1628 60%, #0d1e3a 100%)" }}>

        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute orb-blue"
          style={{ width: 600, height: 600, top: "-20%", left: "-20%" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute orb-purple"
          style={{ width: 500, height: 500, bottom: "-15%", right: "-15%" }}
        />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link href="/">
              <div className="inline-flex items-center gap-3 cursor-pointer group">
                <div className="rounded-xl bg-white/10 p-2.5 group-hover:bg-white/15 transition-colors backdrop-blur-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                  <img src={logoImg} alt="m-aldbani" className="h-8 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-heading">m-aldbani</p>
                  <p className="text-blue-400 text-[10px] font-semibold">محمد الدباني</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, #2563EB, #7C3AED)" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  {t("Client Portal", "بوابة العملاء")}
                </span>
              </div>

              <h2 className="font-black text-white font-heading mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
                {t("Welcome\nBack", "مرحباً\nبعودتك")}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed max-w-xs mb-10">
                {t(
                  "Sign in to your private client dashboard to track consultations, files, and progress.",
                  "سجّل دخولك إلى لوحة العميل الخاصة لمتابعة الاستشارات والملفات والتقدم."
                )}
              </p>

              {/* Feature list */}
              {[
                { en: "Track all consultations", ar: "متابعة جميع الاستشارات" },
                { en: "Access shared files",     ar: "الوصول للملفات المشتركة" },
                { en: "View invoices & history", ar: "عرض الفواتير والسجل"     },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}>
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{t(item.en, item.ar)}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-slate-500 text-xs">
              {t('"Experience, Innovation, Impact."', '«الخبرة، الابتكار، الأثر.»')}
            </p>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-1">— Mohammed Al-Dabbani</p>
          </motion.div>
        </div>
      </div>

      {/* ── FORM PANEL ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-16"
        style={{ background: "#FAF8F4" }}>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <Link href="/">
              <div className="rounded-xl bg-white p-2.5 cursor-pointer shadow-sm"
                style={{ border: "1px solid rgba(37,99,235,0.1)" }}>
                <img src={logoImg} alt="m-aldbani" className="h-8 w-auto object-contain" />
              </div>
            </Link>
            <div>
              <p className="font-bold text-slate-900 text-sm">m-aldbani</p>
              <p className="text-blue-600 text-[10px]">محمد الدباني</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 font-heading mb-2">
              {t("Sign In", "تسجيل الدخول")}
            </h1>
            <p className="text-slate-500 text-sm">
              {t("Enter your credentials to access your portal.", "أدخل بياناتك للوصول إلى بوابتك.")}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm bg-white border transition-all hover:shadow-md hover:border-slate-300"
              style={{ border: "1px solid #E2E8F0", color: "#374151" }}
              onClick={() => toast({ title: t("Coming Soon", "قريباً"), description: t("Google login will be available soon.", "تسجيل الدخول بـ Google قريباً.") })}
            >
              {/* Google icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("Continue with Google", "المتابعة بـ Google")}
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
              style={{ background: "#000", color: "white", border: "1px solid #000" }}
              onClick={() => toast({ title: t("Coming Soon", "قريباً"), description: t("Apple login will be available soon.", "تسجيل الدخول بـ Apple قريباً.") })}
            >
              {/* Apple icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {t("Continue with Apple", "المتابعة بـ Apple")}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">{t("or sign in with phone", "أو عبر رقم الجوال")}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                {t("Mobile Number", "رقم الجوال")}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400"
                  style={{ [isRTL ? "right" : "left"]: "14px" }} />
                <input
                  type="tel"
                  placeholder="+966 5X XXX XXXX"
                  {...register("phone")}
                  className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  style={{
                    borderColor: errors.phone ? "#EF4444" : "#E2E8F0",
                    color: "#0F172A",
                    paddingLeft: isRTL ? "14px" : "40px",
                    paddingRight: isRTL ? "40px" : "14px",
                    direction: "ltr",
                  }}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1.5">{t("Mobile number required", "رقم الجوال مطلوب")}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                {t("Password", "كلمة المرور")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400"
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
                    paddingLeft: isRTL ? "40px" : "40px",
                    paddingRight: isRTL ? "40px" : "40px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ [isRTL ? "left" : "right"]: "14px" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{t("Password required", "كلمة المرور مطلوبة")}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={mut.isPending}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
              }}
            >
              {mut.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("Signing in…", "جاري الدخول…")}
                </div>
              ) : (
                <>
                  <Sparkles size={15} />
                  {t("Sign In", "تسجيل الدخول")}
                </>
              )}
            </motion.button>
          </form>

          {/* Footer links */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center space-y-3">
            <p className="text-sm text-slate-500">
              {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
              <Link href="/auth/register"
                className="font-bold text-[#2563EB] hover:text-[#7C3AED] transition-colors">
                {t("Request Access →", "اطلب الوصول ←")}
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#2563EB] transition-colors">
              <ArrowIcon size={13} />
              {t("Back to website", "العودة للموقع")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
