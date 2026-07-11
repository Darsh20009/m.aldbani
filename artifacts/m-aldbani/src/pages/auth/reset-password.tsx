import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../../hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { LogoBrandImage } from "../../components/Logo";

export default function ResetPassword() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const isRTL = language === "ar";
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft;

  const [token, setToken]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [errors, setErrors]         = useState<{ password?: string; confirm?: string }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (password.length < 8)
      errs.password = t("At least 8 characters", "8 أحرف على الأقل");
    if (password !== confirm)
      errs.confirm = t("Passwords don't match", "كلمتا المرور غير متطابقتين");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      toast({ title: t("Invalid link", "رابط غير صالح"), description: t("Please use the link from your email.", "استخدم الرابط من بريدك الإلكتروني."), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || t("Something went wrong", "حدث خطأ ما"));
      }
      setDone(true);
      setTimeout(() => setLocation("/auth/login"), 3000);
    } catch (err) {
      toast({
        title: t("Failed", "فشل"),
        description: err instanceof Error ? err.message : t("Try again", "حاول مجدداً"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      dir={isRTL ? "rtl" : "ltr"} style={{ background: "#FAF8F4" }}>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <Link href="/">
            <LogoBrandImage size={40} className="cursor-pointer flex-shrink-0"
              style={{ filter: "drop-shadow(0 2px 8px rgba(37,99,235,0.35))" }} />
          </Link>
          <div>
            <p className="font-bold text-slate-900 text-sm font-heading">m-aldbani</p>
            <p className="text-[#2563EB] text-[10px] font-semibold">محمد الدباني</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}>
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-heading mb-3">
                {t("Password Updated!", "تم تحديث كلمة المرور!")}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {t("Your password has been reset successfully. Redirecting you to login…", "تم إعادة تعيين كلمة المرور بنجاح. سيتم تحويلك لتسجيل الدخول…")}
              </p>
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-900 font-heading mb-2">
                {t("Set New Password", "تعيين كلمة مرور جديدة")}
              </h1>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {t("Choose a strong new password for your account.", "اختر كلمة مرور قوية جديدة لحسابك.")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {t("New Password", "كلمة المرور الجديدة")}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      style={{ [isRTL ? "right" : "left"]: "14px" }} />
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      style={{
                        borderColor: errors.password ? "#EF4444" : "#E2E8F0",
                        color: "#0F172A",
                        paddingLeft: isRTL ? "40px" : "40px",
                        paddingRight: "40px",
                      }}
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      style={{ [isRTL ? "left" : "right"]: "14px" }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {t("Confirm Password", "تأكيد كلمة المرور")}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      style={{ [isRTL ? "right" : "left"]: "14px" }} />
                    <input
                      type={showConf ? "text" : "password"}
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })); }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      style={{
                        borderColor: errors.confirm ? "#EF4444" : "#E2E8F0",
                        color: "#0F172A",
                        paddingLeft: isRTL ? "40px" : "40px",
                        paddingRight: "40px",
                      }}
                    />
                    <button type="button" onClick={() => setShowConf(v => !v)}
                      className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      style={{ [isRTL ? "left" : "right"]: "14px" }}>
                      {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.confirm}</p>}
                </div>

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> {t("Saving…", "جاري الحفظ…")}</>
                  ) : (
                    t("Reset Password", "إعادة تعيين كلمة المرور")
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#2563EB] transition-colors">
                  <ArrowBack size={13} />
                  {t("Back to Sign In", "العودة لتسجيل الدخول")}
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
