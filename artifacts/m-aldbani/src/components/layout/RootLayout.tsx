import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Link } from "wouter";
import { ScrollProgress } from "../ScrollProgress";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import { useLanguage } from "../../hooks/use-language";

export function RootLayout({ children }: { children: ReactNode }) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const footerLinks = [
    { href: "/about",     en: "About",     ar: "من أنا" },
    { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
    { href: "/articles",  en: "Articles",   ar: "المقالات" },
    { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
    { href: "/book",      en: "Book",       ar: "احجز" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-12" style={{ background: "#0A1628" }}>
        <div className="container mx-auto px-6">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}>

            <div className={`flex flex-col items-center gap-3 ${isRTL ? "md:items-end" : "md:items-start"}`}>
              <div className="rounded-xl bg-white/10 p-2 inline-flex border border-white/10">
                <img src={logoPath} alt="m-aldbani" className="h-9 w-auto object-contain brightness-0 invert" />
              </div>
              <p className="text-xs max-w-xs text-center" style={{ color: "rgba(240,220,180,0.35)" }}>
                {t("Business Development · Operations · Brand Strategy", "تطوير الأعمال · العمليات · استراتيجية العلامة")}
              </p>
            </div>

            <div className="flex flex-wrap gap-5 items-center justify-center text-sm font-medium">
              {footerLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className="transition-colors duration-200 hover:text-amber-300"
                  style={{ color: "rgba(240,220,180,0.45)" }}>
                  {t(l.en, l.ar)}
                </Link>
              ))}
            </div>

            <div className={`text-center ${isRTL ? "md:text-start" : "md:text-end"}`}>
              <p className="text-xs" style={{ color: "rgba(240,220,180,0.3)" }}>
                © {new Date().getFullYear()} {t("Mohammed Al-Dabbani", "محمد الدباني")}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(240,220,180,0.2)" }}>
                {t("All rights reserved", "جميع الحقوق محفوظة")}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-[11px]" style={{ color: "rgba(240,220,180,0.2)" }}>
              {t("Made by", "صنع بواسطة")}{" "}
              <a
                href="https://qiroxstudio.online"
                target="_blank"
                rel="noreferrer"
                className="font-semibold hover:text-amber-300 transition-colors duration-200"
                style={{ color: "rgba(240,220,180,0.35)" }}
              >
                Qirox Studio
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
