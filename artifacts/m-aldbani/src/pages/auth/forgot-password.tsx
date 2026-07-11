import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { LogoBrandImage } from "../../components/Logo";

export default function ForgotPassword() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === "ar";
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft;

  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError(t("Email is required", "البريد الإلكتروني مطلوب")); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || t("Something went wrong", "حدث خطأ ما"));
      }
      setSent(true);
    } catch (err) {
      toast({
        title: t("Failed", "فشل الإرسال"),
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
          {sent ? (
            /* ── Success state ── */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}>
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-heading mb-3">
                {t("Check your email", "تحقق من بريدك")}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {t(
                  `We sent a password reset link to ${email}. Check your inbox and spam folder.`,
                  `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. تحقق من صندوق الوارد والبريد المزعج.`
                )}
              </p>
              <Link href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#7C3AED] transition-colors">
                <ArrowBack size={14} />
                {t("Back to Sign In", "العودة لتسجيل الدخول")}
              </Link>
            </motion.div>
          ) : (
            /* ── Form ── */
            <>
              <h1 className="text-2xl font-black text-slate-900 font-heading mb-2">
                {t("Forgot Password?", "نسيت كلمة المرور؟")}
              </h1>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {t(
                  "Enter your email address and we'll send you a link to reset your password.",
                  "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور."
                )}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {t("Email Address", "البريد الإلكتروني")}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      style={{ [isRTL ? "right" : "left"]: "14px" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full h-12 rounded-xl border bg-white text-sm outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      style={{
                        borderColor: error ? "#EF4444" : "#E2E8F0",
                        color: "#0F172A",
                        paddingLeft: isRTL ? "14px" : "40px",
                        paddingRight: isRTL ? "40px" : "14px",
                      }}
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <span>⚠</span> {error}
                    </p>
                  )}
                </div>

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> {t("Sending…", "جاري الإرسال…")}</>
                  ) : (
                    t("Send Reset Link", "إرسال رابط إعادة التعيين")
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
