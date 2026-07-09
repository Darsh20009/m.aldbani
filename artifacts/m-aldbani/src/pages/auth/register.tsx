import { useLanguage } from "../../hooks/use-language";
import { useAuth, type User } from "../../hooks/use-auth";
import { useRegister } from "@workspace/api-client-react";
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
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().optional(),
  password: z.string().min(6),
});
type F = z.infer<typeof schema>;

export default function Register() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const mut = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: F) => {
    mut.mutate({ data }, {
      onSuccess: (res: { token: string; user: User }) => {
        setAuth(res.token, res.user);
        toast({
          title: t("Account Created", "تم إنشاء الحساب"),
          description: t("Welcome to the client portal.", "مرحباً بك في بوابة العملاء."),
        });
        setLocation("/client");
      },
      onError: () => {
        toast({
          title: t("Registration Failed", "فشل التسجيل"),
          description: t("Email may already be in use.", "قد يكون البريد الإلكتروني مستخدماً بالفعل."),
          variant: "destructive",
        });
      },
    });
  };

  const fieldStyle = (err?: object) => ({
    background: "white",
    borderColor: err ? "#ef4444" : `${GOLD}30`,
    color: NAVY,
  });
  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = GOLD);
  const blurHandler = (err?: object) => (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = err ? "#ef4444" : `${GOLD}30`);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: NAVY }}>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-black leading-none opacity-[0.04]"
            style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: 280, color: GOLD, letterSpacing: -8 }}>
            انضمام
          </span>
        </div>

        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/">
            <div className="inline-flex rounded-xl bg-white px-3 py-2 cursor-pointer"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
              <img src={logoPath} alt="m-aldbani" className="h-9 w-auto object-contain"
                style={{ mixBlendMode: "multiply" }} />
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: GOLD }}>
              {t("Client Portal", "بوابة العملاء")}
            </p>
          </div>
          <h2 className="font-heading font-black text-white text-4xl leading-tight mb-4">
            {t("Request\nAccess", "طلب\nالانضمام")}
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(240,220,180,0.55)" }}>
            {t(
              "Create a private account to access your consultations, files, and project updates in one secure place.",
              "أنشئ حساباً خاصاً للوصول إلى استشاراتك وملفاتك وتحديثات مشاريعك في مكان آمن واحد."
            )}
          </p>

          {/* 3 feature points */}
          <div className="mt-8 space-y-3">
            {[
              { icon: "📁", en: "Access shared files & documents", ar: "الوصول للملفات والمستندات المشتركة" },
              { icon: "📅", en: "Track your consultations",         ar: "متابعة الاستشارات" },
              { icon: "💬", en: "Direct messaging with Mohammed",   ar: "تواصل مباشر مع محمد" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base">{f.icon}</span>
                <span className="text-sm" style={{ color: "rgba(240,220,180,0.5)" }}>{t(f.en, f.ar)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p className="text-xs italic" style={{ color: `${GOLD}60` }}>
            {t("\"Experience, innovation, and impact.\"", "«الخبرة والابتكار والأثر.»")}
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
                {t("New Account", "حساب جديد")}
              </span>
            </div>
            <h1 className="text-3xl font-black font-heading" style={{ color: NAVY }}>
              {t("Request Access", "طلب الانضمام")}
            </h1>
            <p className="text-sm mt-2" style={{ color: "#6B5A3E" }}>
              {t("Fill in your details to create a client account.", "أدخل بياناتك لإنشاء حساب عميل.")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                {t("Full Name", "الاسم الكامل")}
              </label>
              <input
                type="text"
                placeholder={t("John Doe", "محمد عبدالله") as string}
                {...register("name")}
                className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                style={fieldStyle(errors.name)}
                onFocus={focusHandler}
                onBlur={blurHandler(errors.name)}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{t("Name is required", "الاسم مطلوب")}</p>}
            </div>

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
                style={fieldStyle(errors.email)}
                onFocus={focusHandler}
                onBlur={blurHandler(errors.email)}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{t("Valid email required", "البريد الإلكتروني غير صحيح")}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>
                {t("Phone Number", "رقم الجوال")}{" "}
                <span className="font-normal text-xs" style={{ color: "#A0856A" }}>
                  {t("(optional)", "(اختياري)")}
                </span>
              </label>
              <input
                type="tel"
                placeholder="+966 5X XXX XXXX"
                {...register("phone")}
                className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all"
                style={fieldStyle()}
                onFocus={focusHandler}
                onBlur={blurHandler()}
              />
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
                style={fieldStyle(errors.password)}
                onFocus={focusHandler}
                onBlur={blurHandler(errors.password)}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{t("Min 6 characters", "6 أحرف على الأقل")}</p>}
            </div>

            <div className="pt-1">
              <motion.button
                type="submit"
                disabled={mut.isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-xl font-bold text-sm transition-opacity disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: NAVY }}
              >
                {mut.isPending
                  ? t("Creating account…", "جاري إنشاء الحساب…")
                  : t("Create Account", "إنشاء حساب")}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t text-center text-sm" style={{ borderColor: `${GOLD}20`, color: "#6B5A3E" }}>
            {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
            <Link href="/auth/login" className="font-bold" style={{ color: GOLD }}>
              {t("Sign In →", "تسجيل الدخول ←")}
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs font-medium" style={{ color: `${GOLD}60` }}>
              ← {t("Back to website", "العودة للموقع")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
