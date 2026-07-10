import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import { AdminEmailPrompt, useAdminEmailPrompt } from "../admin/AdminEmailPrompt";
import { LogoBrandImage } from "../../components/Logo";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { AdminAIAgent } from "../ai/AdminAIAgent";
import {
  LayoutDashboard, Target, Users, CalendarDays, Briefcase, FileText,
  Settings, BarChart3, LogOut, Menu, X, Globe, SlidersHorizontal, Mail,
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
        <div className="flex flex-col items-center gap-4">
          <LogoBrandImage size={52} className="float-logo opacity-80" />
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Loading…</span>
          </div>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-[68px] flex items-center px-4 border-b border-border/60 shrink-0"
        style={{ background: "linear-gradient(135deg, #08102E 0%, #0F1E56 100%)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <LogoBrandImage size={34} className="flex-shrink-0 logo-img-nav" />
          <div>
            <p className="font-heading font-bold text-sm text-white leading-none tracking-wide">M-ALDBANI</p>
            <p className="text-[10px] text-white/40 mt-0.5 tracking-wider uppercase">Admin CRM</p>
          </div>
        </Link>
        <button
          className="ml-auto md:hidden text-white/50 hover:text-white transition-colors"
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? "text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                style={active ? {
                  background: "linear-gradient(135deg, #0F1E56, #2563EB)",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
                } : {}}
              >
                <Icon size={16} className={active ? "text-white" : "text-muted-foreground"} />
                <span>{t(item.label, item.labelAr)}</span>
                {active && <div className="ml-auto w-1 h-4 rounded-full bg-white/40" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/60 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all mb-1">
          <Globe size={15} />
          <span>{t("View Website", "عرض الموقع")}</span>
        </Link>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2 border-t border-border/40 pt-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #0F1E56, #7C3AED)" }}
          >
            {(user.name ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); setLocation("/"); }}
            className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
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
          <button className="text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <LogoBrandImage size={28} className="logo-img-nav" />
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

      {/* ── دباني AI Agent ────────────────────── */}
      <AdminAIAgent />
    </div>
  );
}
