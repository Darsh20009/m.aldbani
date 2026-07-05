import { Link, useLocation } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { LogoMark } from "../Logo";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";

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
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "navbar-scrolled" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex h-[72px] items-center justify-between px-5 lg:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative"
            >
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={t(settings.siteNameEn, settings.siteNameAr)} className="h-10 w-auto object-contain" />
              ) : (
                <LogoMark size={42} />
              )}
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            {navLinks.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.span
                    whileHover={{ y: -1 }}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 ${
                      active
                        ? "text-[#2563EB]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-[#2563EB]/8"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t(item.en, item.ar)}</span>
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 text-slate-500 hover:border-[#2563EB]/40 hover:text-[#2563EB] hover:bg-[#2563EB]/5 transition-all duration-200"
            >
              {language === "en" ? "عربي" : "EN"}
            </motion.button>

            {/* Book CTA */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link href="/book">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold btn-brand"
                >
                  <Sparkles size={13} />
                  {t("Book Consultation", "احجز استشارة")}
                </motion.button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link href={user.role === "admin" ? "/admin" : "/client"}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 shadow-sm"
                    >
                      {user.role === "admin" ? t("Admin", "التحكم") : t("Portal", "البوابة")}
                    </motion.button>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-full text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    {t("Logout", "خروج")}
                  </button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {t("Login", "دخول")}
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors text-slate-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[80px] left-4 right-4 z-40 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(37,99,235,0.12)",
            }}
          >
            {/* Gradient top strip */}
            <div className="h-1 w-full bg-brand-gradient" />

            <div className="p-5 space-y-1">
              {/* Logo inside mobile menu */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="logo" className="h-8 w-auto" />
                ) : (
                  <LogoMark size={36} />
                )}
                <div>
                  <p className="font-bold text-sm text-slate-900">{t("M-ALDBANI", "م. الدباني")}</p>
                  <p className="text-[10px] text-slate-400">{t("Business Development", "تطوير أعمال")}</p>
                </div>
              </div>

              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: isRTL ? -4 : 4 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      location === item.href
                        ? "bg-[#2563EB]/8 text-[#2563EB] font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {t(item.en, item.ar)}
                    {location === item.href && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    )}
                  </motion.div>
                </Link>
              ))}

              <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
                <Link href="/book" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl text-sm font-semibold btn-brand flex items-center justify-center gap-2">
                    <Sparkles size={14} />
                    {t("Book Consultation", "احجز استشارة")}
                  </button>
                </Link>

                {user ? (
                  <>
                    <Link href={user.role === "admin" ? "/admin" : "/client"} onClick={() => setMenuOpen(false)}>
                      <button className="w-full py-3 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-700">
                        {user.role === "admin" ? t("Admin Panel", "لوحة التحكم") : t("My Portal", "بوابتي")}
                      </button>
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      {t("Logout", "تسجيل الخروج")}
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-700">
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
