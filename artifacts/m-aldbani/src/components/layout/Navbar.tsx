import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full navbar-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-primary/20 shadow-sm group-hover:shadow-primary/20 group-hover:border-primary/50 transition-all duration-300">
            <img src={logoPath} alt="M-ALDBANI" className="h-full w-full object-cover" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-foreground hidden sm:block">
            M-ALDBANI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/about",     en: "About",     ar: "من أنا" },
            { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
            { href: "/services",  en: "Services",   ar: "الخدمات" },
            { href: "/articles",  en: "Articles",   ar: "المقالات" },
            { href: "/community", en: "Community",  ar: "المجتمع" },
            { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {t(item.en, item.ar)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:border-primary hover:text-primary transition-all"
            aria-label="Toggle language"
          >
            {language === "en" ? "AR" : "EN"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === "admin" ? "/admin" : "/client"}>
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-semibold text-xs">
                  {user.role === "admin" ? t("Admin", "الإدارة") : t("Portal", "البوابة")}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive text-xs">
                {t("Logout", "خروج")}
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-semibold">
                {t("Client Login", "دخول العملاء")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
