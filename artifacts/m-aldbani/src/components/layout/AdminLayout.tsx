import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import { AdminEmailPrompt, useAdminEmailPrompt } from "../admin/AdminEmailPrompt";
import { LogoMark } from "../../components/Logo";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";
import { useSiteSettings } from "../../hooks/use-site-settings";
import {
  LayoutDashboard,
  Target,
  Users,
  CalendarDays,
  Briefcase,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Globe,
  SlidersHorizontal,
  Mail,
} from "lucide-react";

const navItems = [
  { href: "/admin",               label: "Dashboard",     labelAr: "الرئيسية",           icon: LayoutDashboard },
  { href: "/admin/leads",         label: "Leads CRM",     labelAr: "العملاء المحتملون",  icon: Target },
  { href: "/admin/clients",       label: "Clients",       labelAr: "العملاء",             icon: Users },
  { href: "/admin/consultations", label: "Consultations", labelAr: "الاستشارات",          icon: CalendarDays },
  { href: "/admin/projects",      label: "Portfolio",     labelAr: "المشاريع",            icon: Briefcase },
  { href: "/admin/articles",      label: "Articles",      labelAr: "المقالات",            icon: FileText },
  { href: "/admin/services",      label: "Services",      labelAr: "الخدمات",             icon: Settings },
  { href: "/admin/email",         label: "Send Email",    labelAr: "إرسال بريد",          icon: Mail },
  { href: "/admin/analytics",     label: "Analytics",     labelAr: "التحليلات",           icon: BarChart3 },
  { href: "/admin/settings",      label: "Site Settings", labelAr: "إعدادات الموقع",      icon: SlidersHorizontal },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();
  const settings = useSiteSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { show: showEmailPrompt, dismiss: dismissEmailPrompt } = useAdminEmailPrompt();

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/auth/login");
      else if (user.role !== "admin") setLocation("/client");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border/60 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl overflow-hidden border border-primary/20 shadow-sm group-hover:border-primary/40 transition-all shrink-0 flex items-center justify-center bg-white p-1">
            <img src={settings.logoUrl || logoImg} alt="M-ALDBANI" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-primary leading-none">M-ALDBANI</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide uppercase">Admin CRM</p>
          </div>
        </Link>
        <button
          className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={16} className={active ? "text-white" : "text-muted-foreground"} />
                <span>{t(item.label, item.labelAr)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/60 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-1">
          <Globe size={15} />
          <span>{t("View Website", "عرض الموقع")}</span>
        </Link>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 border-t border-border/40 pt-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {(user.name ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); setLocation("/"); }}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F4F1] text-foreground" dir="ltr">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-border/60 shadow-sm fixed h-screen z-10 left-0">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-60 bg-white border-r border-border/60 shadow-lg z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="md:hidden h-14 bg-white border-b border-border/60 flex items-center px-4 gap-3 shadow-sm">
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg overflow-hidden border border-primary/20 flex items-center justify-center bg-white p-0.5">
              <img src={settings.logoUrl || logoImg} alt="M-ALDBANI" className="h-full w-full object-contain" />
            </div>
            <span className="font-heading font-bold text-sm text-primary">M-ALDBANI</span>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-7 overflow-auto">
          {children}
        </main>
      </div>

      {showEmailPrompt && user?.role === "admin" && (
        <AdminEmailPrompt onDone={dismissEmailPrompt} />
      )}
    </div>
  );
}
