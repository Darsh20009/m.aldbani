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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100"
      style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="container mx-auto flex h-[68px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src={logoPath}
            alt="m-aldbani"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors relative after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-600 after:to-violet-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(item.en, item.ar)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            {language === "en" ? "AR" : "EN"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === "admin" ? "/admin" : "/client"}>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-xs border-0">
                  {user.role === "admin" ? t("Admin", "الإدارة") : t("Portal", "البوابة")}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive text-xs">
                {t("Logout", "خروج")}
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold border-0 shadow-sm">
                {t("Client Login", "دخول العملاء")}
              </Button>
            </Link>
          )}

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 px-6 pb-4 space-y-3"
          >
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-slate-600 hover:text-blue-600 py-2">
                {t(item.en, item.ar)}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
