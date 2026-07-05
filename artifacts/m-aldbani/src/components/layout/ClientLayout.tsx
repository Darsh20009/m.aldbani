import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { LogoMark } from "../Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CalendarDays, MessageSquare, FolderOpen, Receipt, LogOut, ArrowLeft, ArrowRight } from "lucide-react";

export function ClientLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const settings = useSiteSettings();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">{t("Loading…", "جارٍ التحميل…")}</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/client",               label: t("Dashboard",      "الرئيسية"),  icon: LayoutDashboard },
    { href: "/client/consultations", label: t("Consultations",  "الاستشارات"), icon: CalendarDays },
    { href: "/client/messages",      label: t("Messages",       "الرسائل"),   icon: MessageSquare },
    { href: "/client/files",         label: t("Files",          "الملفات"),   icon: FolderOpen },
    { href: "/client/invoices",      label: t("Invoices",       "الفواتير"),  icon: Receipt },
  ];

  const ArrowIcon = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/30 text-foreground">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />
            ) : (
              <LogoMark size={32} />
            )}
            <div>
              <p className="font-heading font-bold text-sm text-foreground leading-none">{language === "ar" ? settings.siteNameAr : settings.siteNameEn}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{t("Client Portal", "بوابة العميل")}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all cursor-pointer text-sm font-medium group">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground">{user.name ?? user.email ?? ""}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm"
            onClick={() => { logout(); setLocation("/"); }}
          >
            <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {t("Logout", "تسجيل خروج")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50">
        <header className="h-20 border-b border-border px-6 md:px-8 flex items-center justify-between bg-card shadow-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold font-heading">
            {t("Welcome back", "مرحباً بعودتك")}, {(user.name ?? "").split(" ")[0]}
          </h1>
          <Button variant="outline" size="sm" onClick={() => setLocation("/")} className="text-muted-foreground hover:text-primary text-xs bg-transparent border-border hover:bg-muted/50 transition-colors">
            <ArrowIcon className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
            {t("Back to Website", "العودة للموقع")}
          </Button>
        </header>
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
