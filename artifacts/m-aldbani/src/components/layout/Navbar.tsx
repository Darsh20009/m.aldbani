import { Link, useLocation } from "wouter";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import mdLogoBlack from "@assets/Screenshot_2026-07-09_at_2.14.54_AM_1783552521055.png";

const navLinks = [
  { href: "/about",     en: "About",      ar: "من أنا"    },
  { href: "/portfolio", en: "Work",        ar: "الأعمال"  },
  { href: "/services",  en: "Services",    ar: "الخدمات"  },
  { href: "/articles",  en: "Articles",    ar: "المقالات" },
  { href: "/community", en: "Community",   ar: "المجتمع"  },
  { href: "/contact",   en: "Contact",     ar: "اتصل بي"  },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isRTL = language === "ar";

  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu]")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT — Logo pill */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="navbar-pill flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0F0F10] flex items-center justify-center flex-shrink-0">
                <img src={mdLogoBlack} alt="MD" className="w-10 h-10 object-cover scale-110" />
              </div>
              <span className="text-[13px] font-bold text-[#0F0F10] tracking-tight pr-1">
                M-ALDBANI
              </span>
            </motion.div>
          </Link>

          {/* RIGHT — Language + Hamburger */}
          <div className="flex items-center gap-2" data-menu>
            {/* Language toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-black/10 bg-white/90 text-[#3A3A3A] hover:border-black/25 transition-all backdrop-blur-md"
            >
              {language === "en" ? "عربي" : "EN"}
            </motion.button>

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-[#0F0F10] text-white flex items-center justify-center transition-all hover:bg-[#3A3A3A]"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={16} />
              ) : (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="0" y="0"  width="16" height="2" rx="1" fill="white" />
                  <rect x="0" y="5"  width="12" height="2" rx="1" fill="white" />
                  <rect x="0" y="10" width="8"  height="2" rx="1" fill="white" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Dropdown menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-menu
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed top-[72px] z-40 w-56 rounded-2xl shadow-2xl overflow-hidden ${isRTL ? "left-5" : "right-5"}`}
            style={{
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Gold top strip */}
            <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, #C7AC70, #8C9198)" }} />

            <div className="p-2">
              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: isRTL ? -4 : 4, backgroundColor: "rgba(0,0,0,0.04)" }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${
                      location === item.href
                        ? "text-[#C7AC70] bg-[#C7AC70]/8"
                        : "text-[#0F0F10]"
                    }`}
                  >
                    {t(item.en, item.ar)}
                    {location === item.href && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C7AC70]" />
                    )}
                  </motion.div>
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 h-px bg-black/6 mx-2" />

              {/* CTA */}
              <Link href="/book" onClick={() => setMenuOpen(false)}>
                <div className="mx-2 mb-1 py-2.5 px-4 rounded-xl bg-[#0F0F10] text-white text-[13px] font-bold text-center cursor-pointer hover:bg-[#3A3A3A] transition-colors">
                  {t("Book Consultation", "احجز استشارة")}
                </div>
              </Link>

              {user ? (
                <>
                  <Link href={user.role === "admin" ? "/admin" : "/client"} onClick={() => setMenuOpen(false)}>
                    <div className="mx-2 mt-1 py-2.5 px-4 rounded-xl border border-black/10 text-[#3A3A3A] text-[13px] font-semibold text-center cursor-pointer hover:bg-black/4 transition-colors">
                      {user.role === "admin" ? t("Admin", "التحكم") : t("Portal", "البوابة")}
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full mt-1 py-2 px-4 text-[12px] text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    {t("Logout", "خروج")}
                  </button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <div className="mx-2 mt-1 mb-1 py-2.5 px-4 rounded-xl border border-black/10 text-[#3A3A3A] text-[13px] font-semibold text-center cursor-pointer hover:bg-black/4 transition-colors">
                    {t("Login", "دخول")}
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
