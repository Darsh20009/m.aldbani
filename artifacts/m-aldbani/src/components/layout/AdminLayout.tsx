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

  if (isLoading || !user || user.role !== "admin") return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/leads", label: "Leads CRM", icon: "🎯" },
    { href: "/admin/clients", label: "Clients", icon: "👥" },
    { href: "/admin/consultations", label: "Consultations", icon: "🗓️" },
    { href: "/admin/projects", label: "Portfolio", icon: "💻" },
    { href: "/admin/articles", label: "Articles", icon: "📝" },
    { href: "/admin/services", label: "Services", icon: "⚙️" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground dark">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-card/30 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoPath} alt="M-ALDBANI" className="h-8 w-8 object-contain" />
            <span className="font-heading font-bold text-primary">Admin System</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-sm">
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <p className="text-xs text-white/50 truncate">Administrator</p>
            </div>
          </div>
          <Button variant="outline" className="w-full border-white/10 text-white/70 hover:text-white" onClick={() => { logout(); setLocation("/"); }}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#050505]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
