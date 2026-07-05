import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Link } from "wouter";
import { ScrollProgress } from "../ScrollProgress";
import { useLanguage } from "../../hooks/use-language";
import { useSiteSettings } from "../../hooks/use-site-settings";
import { LogoMark } from "../Logo";

export function RootLayout({ children }: { children: ReactNode }) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const settings = useSiteSettings();

  const footerLinks = [
    { href: "/about",     en: "About",     ar: "من أنا" },
    { href: "/portfolio", en: "Portfolio",  ar: "الأعمال" },
    { href: "/services",  en: "Services",   ar: "الخدمات" },
    { href: "/articles",  en: "Articles",   ar: "المقالات" },
    { href: "/contact",   en: "Contact",    ar: "اتصل بي" },
    { href: "/book",      en: "Book",       ar: "احجز استشارة" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="border-t border-border py-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-10">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-10 ${isRTL ? "md:flex-row-reverse" : ""}`}>

            <div className={`flex flex-col items-center gap-4 ${isRTL ? "md:items-end" : "md:items-start"}`}>
              <div className="flex items-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={t(settings.siteNameEn, settings.siteNameAr)} className="h-10 w-auto object-contain" />
                ) : (
                  <LogoMark size={40} className="text-primary" />
                )}
              </div>
              <p className="text-sm max-w-xs text-center text-muted-foreground">
                {t(settings.footerTextEn || "Business Development · Operations · Brand Strategy", 
                   settings.footerTextAr || "تطوير أعمال · عمليات · استراتيجية علامة تجارية")}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center justify-center text-sm font-medium">
              {footerLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className="text-muted-foreground transition-colors duration-200 hover:text-primary">
                  {t(l.en, l.ar)}
                </Link>
              ))}
            </div>

            <div className={`text-center ${isRTL ? "md:text-start" : "md:text-end"}`}>
              <p className="text-sm text-muted-foreground font-medium">
                © {new Date().getFullYear()} {t(settings.siteNameEn, settings.siteNameAr)}
              </p>
              <p className="text-xs mt-1.5 text-muted-foreground/70">
                {t("All rights reserved.", "جميع الحقوق محفوظة.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
