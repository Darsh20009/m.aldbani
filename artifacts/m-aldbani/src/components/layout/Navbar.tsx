import { Link, useLocation } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about",     en: "About",     ar: "من أنا" },
  { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
  { href: "/articles",  en: "Articles",   ar: "المقالات" },
  { href: "/community", en: "Community",  ar: "المجتمع" },
  { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
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

  const isHeroPage = location === "/";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHeroPage
            ? "bg-[#0A1628]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-[72px] items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="rounded-xl bg-white px-2 py-1.5 transition-all duration-300 group-hover:scale-105 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              <img
                src={logoPath}
                alt="m-aldbani"
                className="h-9 w-auto object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
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
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? "text-white bg-white/10"
                      : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(item.en, item.ar)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 text-white/60 hover:border-amber-400/60 hover:text-amber-300 transition-all duration-200 bg-white/[0.05] hover:bg-white/[0.08]"
            >
              {language === "en" ? "عربي" : "EN"}
            </motion.button>

            {/* Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href={user.role === "admin" ? "/admin" : "/client"}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] transition-all duration-200"
                  >
                    {user.role === "admin" ? t("Admin Panel", "لوحة التحكم") : t("My Portal", "بوابتي")}
                  </motion.button>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  {t("Logout", "خروج")}
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] transition-all duration-200"
                >
                  {t("Client Login", "دخول العملاء")}
                </motion.button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                className="block w-5 h-0.5 bg-white/70 rounded-full origin-center"
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                className="block w-5 h-0.5 bg-white/70 rounded-full"
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                className="block w-5 h-0.5 bg-white/70 rounded-full origin-center"
              />
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
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[72px] left-4 right-4 z-40 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            style={{ background: "rgba(8,14,30,0.96)", backdropFilter: "blur(24px)" }}
          >
            <div className="p-4 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    location === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {t(item.en, item.ar)}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/[0.08] mt-3">
                {user ? (
                  <>
                    <Link href={user.role === "admin" ? "/admin" : "/client"} onClick={() => setMenuOpen(false)}>
                      <button className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white mb-2">
                        {user.role === "admin" ? t("Admin Panel", "لوحة التحكم") : t("My Portal", "بوابتي")}
                      </button>
                    </Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 transition-colors">
                      {t("Logout", "خروج")}
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white">
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
