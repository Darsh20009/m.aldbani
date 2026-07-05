import { Link, useLocation } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { LogoMark } from "../Logo";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/about",     en: "About",     ar: "من أنا" },
  { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
  { href: "/services",  en: "Services",   ar: "الخدمات" },
  { href: "/articles",  en: "Articles",   ar: "المقالات" },
  { href: "/community", en: "Community",  ar: "المجتمع" },
  { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const settings = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isRTL = language === "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="transition-all duration-300 group-hover:scale-105">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={t(settings.siteNameEn, settings.siteNameAr)}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <LogoMark size={40} />
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(item.en, item.ar)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-200 bg-card hover:bg-muted"
            >
              {language === "en" ? "عربي" : "EN"}
            </motion.button>

            {/* Book & Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/book">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {t("Book Consultation", "حجز استشارة")}
                </motion.button>
              </Link>
              
              {user ? (
                <>
                  <Link href={user.role === "admin" ? "/admin" : "/client"}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition-all duration-200"
                    >
                      {user.role === "admin" ? t("Admin", "لوحة التحكم") : t("Portal", "البوابة")}
                    </motion.button>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    {t("Logout", "خروج")}
                  </button>
                </>
              ) : (
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition-all duration-200"
                  >
                    {t("Login", "تسجيل الدخول")}
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl overflow-hidden border border-border shadow-xl bg-background/95 backdrop-blur-xl"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    location === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t(item.en, item.ar)}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border mt-4 flex flex-col gap-2">
                <Link href="/book" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-base font-medium bg-primary text-primary-foreground">
                    {t("Book Consultation", "حجز استشارة")}
                  </button>
                </Link>
                
                {user ? (
                  <>
                    <Link href={user.role === "admin" ? "/admin" : "/client"} onClick={() => setMenuOpen(false)}>
                      <button className="w-full py-3 rounded-xl text-base font-medium border border-border bg-card text-foreground">
                        {user.role === "admin" ? t("Admin Panel", "لوحة التحكم") : t("My Portal", "بوابتي")}
                      </button>
                    </Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-colors">
                      {t("Logout", "خروج")}
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-base font-medium border border-border bg-card text-foreground">
                      {t("Client Login", "دخول العملاء")}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
