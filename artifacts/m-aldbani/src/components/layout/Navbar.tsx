import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoPath} alt="M-ALDBANI" className="h-10 w-10 object-contain" />
          <span className="font-heading text-lg font-bold tracking-tight text-white hidden sm:block">
            M-ALDBANI
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("About", "من أنا")}</Link>
          <Link href="/portfolio" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("Portfolio", "الأعمال")}</Link>
          <Link href="/services" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("Services", "الخدمات")}</Link>
          <Link href="/articles" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("Articles", "المقالات")}</Link>
          <Link href="/community" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("Community", "المجتمع")}</Link>
          <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t("Contact", "اتصل بي")}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-xs font-semibold px-2 py-1 rounded border border-white/20 hover:bg-white/10 transition-colors"
          >
            {language === "en" ? "AR" : "EN"}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={user.role === "admin" ? "/admin" : "/client"}>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  {t("Dashboard", "لوحة التحكم")}
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-primary text-white hover:bg-primary/90 hidden sm:flex">
                {t("Client Login", "تسجيل الدخول")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
