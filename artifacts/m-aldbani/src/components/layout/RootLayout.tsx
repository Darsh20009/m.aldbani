import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Link } from "wouter";
import { ScrollProgress } from "../ScrollProgress";
import { useLanguage } from "../../hooks/use-language";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";
import { WhatsAppTab } from "../WhatsAppTab";

const footerNav = [
  { href: "/about",     en: "About",     ar: "من أنا" },
  { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
  { href: "/services",  en: "Services",   ar: "الخدمات" },
  { href: "/articles",  en: "Articles",   ar: "المقالات" },
  { href: "/community", en: "Community",  ar: "المجتمع" },
  { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
];

export function RootLayout({ children }: { children: ReactNode }) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const settings = useSiteSettings();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <WhatsAppTab />
      <main className="flex-1 pt-[72px]">
        {children}
      </main>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{ background: "linear-gradient(135deg, #060e1e 0%, #0a1628 80%)" }}>

        {/* Top gradient strip */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.4), rgba(124,58,237,0.4), transparent)" }} />

        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-8 py-14">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-10 ${isRTL ? "text-right" : "text-left"}`}>

            {/* Brand column */}
            <div className={`md:col-span-2 ${isRTL ? "items-end" : "items-start"} flex flex-col`}>
              {/* Logo — always visible */}
              <div className="rounded-2xl p-3 mb-5 inline-flex"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="logo" className="h-12 w-auto object-contain" />
                ) : (
                  <img src={logoImg} alt="m-aldbani" className="h-12 w-auto object-contain" />
                )}
              </div>

              <h3 className="text-white font-black text-lg font-heading mb-1">
                {t(settings.siteNameEn, settings.siteNameAr)}
              </h3>
              <p className="text-slate-400 text-sm mb-5 max-w-xs leading-relaxed">
                {t(
                  settings.footerTextEn || "Business Development · Operations · Brand Strategy",
                  settings.footerTextAr || "تطوير أعمال · عمليات · استراتيجية علامة تجارية"
                )}
              </p>

              {/* Contact info */}
              <div className="space-y-2.5">
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    <Mail size={14} className="text-[#2563EB] flex-shrink-0" />
                    {settings.email}
                  </a>
                )}
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors" dir="ltr">
                    <Phone size={14} className="text-[#2563EB] flex-shrink-0" />
                    {settings.phone}
                  </a>
                )}
                {settings.address && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <MapPin size={14} className="text-[#2563EB] flex-shrink-0" />
                    {settings.address}
                  </div>
                )}
              </div>

              {/* Social links */}
              {(settings.linkedin || settings.twitter || settings.instagram) && (
                <div className="flex items-center gap-3 mt-5">
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.2)" }}>
                      <Linkedin size={15} className="text-blue-400" />
                    </a>
                  )}
                  {settings.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.2)" }}>
                      <Twitter size={15} className="text-blue-400" />
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.2)" }}>
                      <Instagram size={15} className="text-blue-400" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-5">
                {t("Navigation", "التنقل")}
              </p>
              <ul className="space-y-3">
                {footerNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-[#2563EB] transition-all duration-200" />
                      {t(l.en, l.ar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7C3AED] mb-5">
                {t("Portal", "البوابة")}
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/auth/login",    en: "Client Login",    ar: "دخول العملاء" },
                  { href: "/auth/register", en: "Request Access",  ar: "طلب الوصول"   },
                  { href: "/book",          en: "Book Session",    ar: "احجز جلسة"    },
                  { href: "/community",     en: "Community",       ar: "المجتمع"       },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-[#7C3AED] transition-all duration-200" />
                      {t(l.en, l.ar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t px-8 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} {t(settings.siteNameEn, settings.siteNameAr)}. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
            </p>
            <p className="text-xs font-medium"
              style={{ background: "linear-gradient(90deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t("Experience · Innovation · Impact", "الخبرة · الابتكار · الأثر")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
