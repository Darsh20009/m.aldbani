import { Link } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about",     en: "About",     ar: "من أنا" },
    { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
    { href: "/articles",  en: "Articles",   ar: "المقالات" },
    { href: "/community", en: "Community",  ar: "المجتمع" },
    { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full navbar-blur">
      <div className="container mx-auto flex h-18 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src={logoPath}
            alt="m-aldbani"
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors relative after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(item.en, item.ar)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground/70 hover:border-primary hover:text-primary transition-all"
          >
            {language === "en" ? "AR" : "EN"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === "admin" ? "/admin" : "/client"}>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs border-0">
                  {user.role === "admin" ? t("Admin", "الإدارة") : t("Portal", "البوابة")}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive text-xs">
                {t("Logout", "خروج")}
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white font-semibold border-0 shadow-md shadow-primary/20">
                {t("Client Login", "دخول العملاء")}
              </Button>
            </Link>
          )}

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border px-6 pb-4 space-y-3"
          >
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-foreground/70 hover:text-primary py-2">
                {t(item.en, item.ar)}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
