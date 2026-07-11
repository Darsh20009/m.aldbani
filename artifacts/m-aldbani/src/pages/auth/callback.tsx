import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

/**
 * Landing page for the server-side Google OAuth redirect flow
 * (Authorized redirect URIs). The backend exchanges the auth code,
 * mints our own JWT, then redirects here with ?token=...
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { login: setAuth } = useAuth();
  const { toast } = useToast();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setLocation("/auth/login?error=google");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("failed to fetch user");
        const user = await res.json();
        setAuth(token, user);
        toast({ title: "مرحباً بك!", description: `أهلاً ${user.name}` });
        setLocation(user.role === "admin" ? "/admin" : "/client");
      } catch {
        toast({
          title: "فشل تسجيل الدخول",
          description: "تعذّر إكمال تسجيل الدخول بـ Google، حاول مجدداً",
          variant: "destructive",
        });
        setLocation("/auth/login?error=google");
      }
    })();
  }, [setAuth, setLocation, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF8F4" }}>
      <Loader2 size={28} className="animate-spin text-blue-500" />
      <p className="text-sm text-slate-500">جاري تسجيل الدخول…</p>
    </div>
  );
}
