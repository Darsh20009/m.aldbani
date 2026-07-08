import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Link } from "wouter";
import { ScrollProgress } from "../ScrollProgress";
import { useLanguage } from "../../hooks/use-language";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { WhatsAppTab } from "../WhatsAppTab";

const BLACK    = "#0F0F10";
const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";
const GRAPHITE = "#3A3A3A";

const footerNav = [
  { href: "/about",     en: "About",     ar: "من أنا"   },
  { href: "/portfolio", en: "Work",       ar: "الأعمال"  },
  { href: "/services",  en: "Services",   ar: "الخدمات"  },
  { href: "/articles",  en: "Articles",   ar: "المقالات" },
  { href: "/community", en: "Community",  ar: "المجتمع"  },
  { href: "/contact",   en: "Contact",    ar: "اتصل بي"  },
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
      <footer style={{ background: BLACK }}>

        {/* Gold top strip */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isRTL ? "text-right" : "text-left"}`}>

            {/* Brand */}
            <div className={`${isRTL ? "items-end" : "items-start"} flex flex-col`}>
              <div className="mb-6">
                <p className="text-white font-black text-lg tracking-wide">MOHAMMED</p>
                <p className="font-black text-lg tracking-wide" style={{ color: GOLD }}>AL-DABBANI</p>
                <p className="text-xs tracking-[0.2em] mt-1 uppercase" style={{ color: TITANIUM }}>
                  {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة · F&B · المملكة")}
                </p>
              </div>

              <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: TITANIUM }}>
                {t(
                  "Business Development · Operations · Brand Strategy",
                  "تطوير أعمال · عمليات · استراتيجية علامة تجارية"
                )}
              </p>

              {/* Contact */}
              <div className="space-y-2.5">
                {settings.email && (
                  <a href={`mailto:${settings.email}`}
                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                    style={{ color: TITANIUM }}>
                    <Mail size={13} style={{ color: GOLD }} />
                    {settings.email}
                  </a>
                )}
                {settings.phone && (
                  <a href={`tel:${settings.phone}`}
                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
                    style={{ color: TITANIUM }} dir="ltr">
                    <Phone size={13} style={{ color: GOLD }} />
                    {settings.phone}
                  </a>
                )}
                {settings.address && (
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: TITANIUM }}>
                    <MapPin size={13} style={{ color: GOLD }} />
                    {settings.address}
                  </div>
                )}
              </div>

              {/* Social */}
              {(settings.linkedin || settings.twitter || settings.instagram) && (
                <div className="flex items-center gap-2.5 mt-6">
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 border"
                      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                      <Linkedin size={14} style={{ color: TITANIUM }} />
                    </a>
                  )}
                  {settings.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 border"
                      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                      <Twitter size={14} style={{ color: TITANIUM }} />
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 border"
                      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                      <Instagram size={14} style={{ color: TITANIUM }} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: GOLD }}>
                {t("Navigation", "التنقل")}
              </p>
              <ul className="space-y-3">
                {footerNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm transition-colors hover:text-white flex items-center gap-2 group"
                      style={{ color: TITANIUM }}>
                      <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: GOLD }} />
                      {t(l.en, l.ar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: TITANIUM }}>
                {t("Portal", "البوابة")}
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/book",          en: "Book Session",   ar: "احجز جلسة"   },
                  { href: "/auth/login",    en: "Client Login",   ar: "دخول العملاء" },
                  { href: "/auth/register", en: "Request Access", ar: "طلب الوصول"   },
                  { href: "/community",     en: "Community",      ar: "المجتمع"       },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm transition-colors hover:text-white flex items-center gap-2 group"
                      style={{ color: TITANIUM }}>
                      <span className="w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: GOLD }} />
                      {t(l.en, l.ar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-8 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <p className="text-xs" style={{ color: TITANIUM }}>
              © {new Date().getFullYear()} Mohammed Al-Dabbani. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
            </p>
            <p className="text-xs font-semibold" style={{ color: GOLD }}>
              {t("Experience · Innovation · Impact", "الخبرة · الابتكار · الأثر")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
