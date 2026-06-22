import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";
import { Button } from "@/components/ui/button";

export function ClientLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const navItems = [
    { href: "/client", label: t("Dashboard", "الرئيسية"), icon: "📊" },
    { href: "/client/consultations", label: t("Consultations", "الاستشارات"), icon: "🗓️" },
    { href: "/client/messages", label: t("Messages", "الرسائل"), icon: "💬" },
    { href: "/client/files", label: t("Files", "الملفات"), icon: "📁" },
    { href: "/client/invoices", label: t("Invoices", "الفواتير"), icon: "🧾" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground dark">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-card/30 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoPath} alt="M-ALDBANI" className="h-8 w-8 object-contain" />
            <span className="font-heading font-bold">Client Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full border-white/10 text-white/70 hover:text-white" onClick={() => { logout(); setLocation("/"); }}>
            {t("Logout", "تسجيل خروج")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold font-heading">{t("Welcome back", "مرحباً بعودتك")}, {user.name.split(' ')[0]}</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")} className="border-white/10">
              {t("Back to Website", "العودة للموقع")}
            </Button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
