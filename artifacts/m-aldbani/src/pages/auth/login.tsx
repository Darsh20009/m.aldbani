import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";

const GOLD  = "#B8860B";
const GOLD2 = "#D4A017";
const NAVY  = "#0A1628";
const CREAM = "#FAF6EF";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});
type F = z.infer<typeof schema>;

export default function Login() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const mut = useLogin();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: F) => {
    mut.mutate({ data }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({ title: t("Welcome back", "مرحباً بعودتك") });
        setLocation(res.user.role === "admin" ? "/admin" : "/client");
      },
      onError: () => {
        toast({
          title: t("Login Failed", "فشل تسجيل الدخول"),
          description: t("Invalid email or password.", "البريد الإلكتروني أو كلمة المرور غير صحيحة."),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL — dark navy branding ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: NAVY }}>

        {/* background Arabic watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black leading-none opacity-[0.04]"
            style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: 280, color: GOLD, letterSpacing: -8 }}>
            دخول
          </span>
        </div>

        {/* top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

        {/* logo */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/">
            <div className="inline-flex rounded-xl bg-white px-3 py-2 cursor-pointer"
              style={{ boxShadow: `0 2px 16px rgba(0,0,0,0.3)` }}>
              <img src={logoPath} alt="m-aldbani" className="h-9 w-auto object-contain"
                style={{ mixBlendMode: "multiply" }} />
            </div>
          </Link>
        </motion.div>

        {/* center content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: GOLD }}>
              {t("Client Portal", "بوابة العملاء")}
            </p>
          </div>
          <h2 className="font-heading font-black text-white text-4xl leading-tight mb-4">
            {t("Welcome\nBack", "مرحباً\nبعودتك")}
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(240,220,180,0.55)" }}>
            {t(
              "Sign in to your private client dashboard to track consultations, files, and progress.",
              "سجّل دخولك إلى لوحة العميل الخاصة لمتابعة الاستشارات والملفات والتقدم."
            )}
          </p>
        </motion.div>

        {/* bottom quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-xs italic" style={{ color: `${GOLD}60` }}>
            {t(
              "\"Experience, innovation, and impact.\"",
              "«الخبرة والابتكار والأثر.»"
            )}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: `${GOLD}40` }}>
            — Mohammed Al-Dabbani
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex flex-col justify-center items-center px-8 py-16" style={{ background: CREAM }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md">

          {/* mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/">
              <div className="inline-flex rounded-xl bg-white px-3 py-2">
                <img src={logoPath} alt="m-aldbani" className="h-9 w-auto object-contain"
                  style={{ mixBlendMode: "multiply" }} />
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6" style={{ background: GOLD }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
                {t("Secure Access", "وصول آمن")}
              </span>
            </div>
            <h1 className="text-3xl font-black font-heading" style={{ color: NAVY }}>
              {t("Client Login", "تسجيل الدخول")}
            </h1>
            <p className="text-sm mt-2" style={{ color: "#6B5A3E" }}>
              {t("Enter your credentials to continue.", "أدخل بياناتك للمتابعة.")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                {t("Email Address", "البريد الإلكتروني")}
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                {...register("email")}
                className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: "white",
                  borderColor: errors.email ? "#ef4444" : `${GOLD}30`,
                  color: NAVY,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : `${GOLD}30`)}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{t("Valid email required", "البريد الإلكتروني مطلوب")}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                {t("Password", "كلمة المرور")}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: "white",
                  borderColor: errors.password ? "#ef4444" : `${GOLD}30`,
                  color: NAVY,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = errors.password ? "#ef4444" : `${GOLD}30`)}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{t("Min 6 characters", "6 أحرف على الأقل")}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={mut.isPending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-xl font-bold text-sm transition-opacity disabled:opacity-70"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: NAVY }}
            >
              {mut.isPending
                ? t("Signing in…", "جاري تسجيل الدخول…")
                : t("Sign In", "تسجيل الدخول")}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm" style={{ borderColor: `${GOLD}20`, color: "#6B5A3E" }}>
            {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
            <Link href="/auth/register"
              className="font-bold transition-colors" style={{ color: GOLD }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => ((e.target as HTMLElement).style.color = GOLD2)}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => ((e.target as HTMLElement).style.color = GOLD)}>
              {t("Request Access →", "اطلب الوصول ←")}
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs font-medium transition-colors" style={{ color: `${GOLD}60` }}>
              ← {t("Back to website", "العودة للموقع")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
