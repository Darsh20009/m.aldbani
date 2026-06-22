import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../hooks/use-language";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/auth/login");
      } else if (user.role !== "admin") {
        setLocation("/client");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading…</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin",                label: "Dashboard",     icon: "📊" },
    { href: "/admin/leads",          label: "Leads CRM",     icon: "🎯" },
    { href: "/admin/clients",        label: "Clients",       icon: "👥" },
    { href: "/admin/consultations",  label: "Consultations", icon: "🗓️" },
    { href: "/admin/projects",       label: "Portfolio",     icon: "💻" },
    { href: "/admin/articles",       label: "Articles",      icon: "📝" },
    { href: "/admin/services",       label: "Services",      icon: "⚙️" },
    { href: "/admin/analytics",      label: "Analytics",     icon: "📈" },
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
              <p className="text-[10px] text-muted-foreground mt-0.5">Admin System</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => { logout(); setLocation("/"); }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
