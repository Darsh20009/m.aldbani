import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";
import { Button } from "@/components/ui/button";

export function ClientLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">{t("Loading…", "جارٍ التحميل…")}</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/client",               label: t("Dashboard",      "الرئيسية"),  icon: "📊" },
    { href: "/client/consultations", label: t("Consultations",  "الاستشارات"), icon: "🗓️" },
    { href: "/client/messages",      label: t("Messages",       "الرسائل"),   icon: "💬" },
    { href: "/client/files",         label: t("Files",          "الملفات"),   icon: "📁" },
    { href: "/client/invoices",      label: t("Invoices",       "الفواتير"),  icon: "🧾" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/40 text-foreground">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg overflow-hidden border border-primary/20 shadow-sm group-hover:border-primary/50 transition-all">
              <img src={logoPath} alt="M-ALDBANI" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-primary leading-none">M-ALDBANI</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t("Client Portal", "بوابة العميل")}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors cursor-pointer text-sm font-medium">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
              {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground">{user.name ?? user.email ?? ""}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => { logout(); setLocation("/"); }}
          >
            {t("Logout", "تسجيل خروج")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <header className="h-16 border-b border-border px-6 md:px-8 flex items-center justify-between bg-card shadow-sm">
          <h1 className="text-lg font-bold font-heading">
            {t("Welcome back", "مرحباً بعودتك")}, {(user.name ?? "").split(" ")[0]}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="text-muted-foreground hover:text-primary text-xs">
            {t("← Website", "← الموقع")}
          </Button>
        </header>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
