import { Link, useLocation } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { scrollY } = useScroll();
  const isHome = location === "/";
  const dark = isHome && !scrolled;

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 70));
  }, [scrollY]);

  const navLinks = [
    { href: "/about",     en: "About",     ar: "من أنا" },
    { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
    { href: "/articles",  en: "Articles",   ar: "المقالات" },
    { href: "/community", en: "Community",  ar: "المجتمع" },
    { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
  ];

  return (
    <motion.header
      animate={dark
        ? { backgroundColor: "rgba(9,11,32,0)", borderBottomColor: "rgba(255,255,255,0.06)" }
        : { backgroundColor: "rgba(250,248,244,0.92)", borderBottomColor: "rgba(220,210,195,0.7)" }
      }
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 w-full border-b"
      style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
    >
      <div className="container mx-auto flex h-[68px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src={logoPath}
            alt="m-aldbani"
            className="h-11 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            style={{ filter: dark ? "brightness(0) invert(1)" : "none" }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors relative
                after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:w-0
                after:rounded-full after:bg-gradient-to-r after:from-blue-500 after:to-violet-500
                after:transition-all after:duration-300 hover:after:w-full
                ${dark ? "text-white/70 hover:text-white" : "text-foreground/60 hover:text-primary"}`}
            >
              {t(item.en, item.ar)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
              ${dark
                ? "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                : "border-border text-foreground/70 hover:border-primary hover:text-primary"}`}
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
              <Button size="sm" variant="ghost" onClick={logout}
                className={`text-xs ${dark ? "text-white/50 hover:text-red-400" : "text-muted-foreground hover:text-destructive"}`}>
                {t("Logout", "خروج")}
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm"
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold border-0 shadow-lg shadow-blue-500/20">
                {t("Client Login", "دخول العملاء")}
              </Button>
            </Link>
          )}

          <button
            className={`md:hidden flex flex-col gap-1.5 p-1 ${dark ? "text-white" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-0.5 transition-all rounded-full ${dark ? "bg-white" : "bg-foreground"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 transition-all rounded-full ${dark ? "bg-white" : "bg-foreground"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 transition-all rounded-full ${dark ? "bg-white" : "bg-foreground"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b px-6 pb-4 space-y-3 ${dark ? "bg-slate-900 border-white/10" : "bg-white border-border"}`}
          >
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={`block text-sm font-semibold py-2 ${dark ? "text-white/70 hover:text-white" : "text-foreground/70 hover:text-primary"}`}>
                {t(item.en, item.ar)}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
