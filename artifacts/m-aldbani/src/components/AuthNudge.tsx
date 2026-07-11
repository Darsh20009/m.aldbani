/**
 * AuthNudge — a sleek floating card that appears on the home page for
 * non-logged-in visitors, offering quick Google / Apple sign-in.
 * Appears after 4 seconds, can be dismissed, never re-appears in the
 * same browser session.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation } from "wouter";
import { useAuth, type User } from "../hooks/use-auth";
import { useLanguage } from "../hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { LogoBrandImage } from "./Logo";

const GOLD   = "#C7AC70";
const DARK   = "#0F1118";
const DISMISS_KEY = "md_auth_nudge_dismissed";

export function AuthNudge() {
  const { user, login: setAuth } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const isRTL = language === "ar";

  const [visible, setVisible]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading]   = useState(false);

  /* ── Show after 4 s, only if not logged-in and not already dismissed ── */
  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const id = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(id);
  }, [user]);

  /* ── Hide if user logs in elsewhere ── */
  useEffect(() => { if (user) setVisible(false); }, [user]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  /* ── Google ── */
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(err.error || "فشل تسجيل الدخول");
        }
        const data = await res.json() as { token: string; user: User };
        setAuth(data.token, data.user);
        toast({ title: t("Welcome!", "مرحباً بك!"), description: `أهلاً ${data.user.name}` });
        setLocation(data.user.role === "admin" ? "/admin" : "/client");
      } catch (err) {
        toast({
          title: t("Google sign-in failed", "فشل تسجيل الدخول بـGoogle"),
          description: err instanceof Error ? err.message : t("Try again", "حاول مجدداً"),
          variant: "destructive",
        });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast({
        title: t("Google sign-in failed", "فشل تسجيل الدخول بـGoogle"),
        description: t("Try again or use phone/email", "حاول مجدداً أو استخدم رقم الجوال"),
        variant: "destructive",
      });
    },
  });

  /* ── Apple ── */
  const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!appleClientId) return;
    const init = () => {
      window.AppleID?.auth.init({
        clientId: appleClientId,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });
    };
    if (window.AppleID) init();
    else {
      const iv = setInterval(() => { if (window.AppleID) { init(); clearInterval(iv); } }, 200);
      return () => clearInterval(iv);
    }
  }, [appleClientId]);

  const handleApple = async () => {
    if (!appleClientId || !window.AppleID) {
      toast({ title: t("Apple Sign In unavailable", "تسجيل Apple غير متاح") });
      return;
    }
    setAppleLoading(true);
    try {
      const data = await window.AppleID.auth.signIn();
      const res = await fetch("/api/auth/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: data.authorization.id_token, user: data.user }),
      });
      if (!res.ok) throw new Error("فشل تسجيل الدخول بـApple");
      const result = await res.json() as { token: string; user: User };
      setAuth(result.token, result.user);
      toast({ title: "مرحباً بك!", description: `أهلاً ${result.user.name}` });
      setLocation(result.user.role === "admin" ? "/admin" : "/client");
    } catch (err) {
      toast({
        title: t("Apple sign-in failed", "فشل تسجيل الدخول بـApple"),
        description: err instanceof Error ? err.message : t("Try again", "حاول مجدداً"),
        variant: "destructive",
      });
    } finally {
      setAppleLoading(false);
    }
  };

  if (user) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="auth-nudge"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            position: "fixed",
            bottom: 28,
            right: isRTL ? undefined : 28,
            left: isRTL ? 28 : undefined,
            zIndex: 999,
            width: 300,
            background: DARK,
            borderRadius: 20,
            padding: "22px 20px 20px",
            border: `1px solid rgba(199,172,112,0.25)`,
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          {/* Top gradient accent */}
          <div style={{
            position: "absolute", top: 0, left: 16, right: 16, height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            borderRadius: 999,
          }} />

          {/* Dismiss */}
          <button
            onClick={dismiss}
            style={{
              position: "absolute", top: 12,
              right: isRTL ? undefined : 12,
              left: isRTL ? 12 : undefined,
              background: "rgba(255,255,255,0.07)",
              border: "none", borderRadius: 8, cursor: "pointer",
              color: "#9CA3AF", width: 26, height: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={13} />
          </button>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <LogoBrandImage size={28} style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }} />
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>
                {t("Welcome back", "مرحباً بك")}
              </p>
              <p style={{ color: GOLD, fontSize: 11, margin: 0, opacity: 0.8 }}>
                {t("Sign in to access your portal", "سجّل دخولك للوصول إلى بوابتك")}
              </p>
            </div>
          </div>

          {/* Google */}
          <button
            disabled={googleLoading}
            onClick={() => googleLogin()}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, height: 42,
              background: "#fff", borderRadius: 10, border: "none",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              marginBottom: 9, opacity: googleLoading ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {googleLoading ? <Loader2 size={15} className="animate-spin" /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span style={{ color: "#374151" }}>
              {googleLoading ? t("Signing in…", "جاري الدخول…") : t("Continue with Google", "المتابعة بـGoogle")}
            </span>
          </button>

          {/* Apple */}
          <button
            disabled={appleLoading}
            onClick={handleApple}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, height: 42,
              background: "#000", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              fontWeight: 600, fontSize: 13, color: "#fff",
              cursor: "pointer", marginBottom: 14,
              opacity: appleLoading ? 0.6 : 1, transition: "opacity 0.2s",
            }}
          >
            {appleLoading ? <Loader2 size={15} className="animate-spin" /> : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.27.07 2.15.75 2.88.77 1.06-.16 2.06-.87 3.22-.82 1.38.09 2.42.67 3.09 1.77-2.85 1.71-2.18 5.4.56 6.44-.66 1.68-1.55 3.35-2.75 4.7zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            )}
            {appleLoading ? t("Signing in…", "جاري الدخول…") : t("Continue with Apple", "المتابعة بـApple")}
          </button>

          {/* Divider + link */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              {t("or", "أو")}
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <a
            href="/auth/login"
            style={{
              display: "block", textAlign: "center",
              fontSize: 12, fontWeight: 600,
              color: GOLD, textDecoration: "none",
              opacity: 0.85,
            }}
          >
            {t("Sign in with phone / email →", "تسجيل الدخول بالجوال / البريد ←")}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
