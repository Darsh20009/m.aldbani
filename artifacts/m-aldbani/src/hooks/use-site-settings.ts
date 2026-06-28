import { useState, useEffect } from "react";

export interface HeroStat {
  value: string;
  labelEn: string;
  labelAr: string;
}

export interface SiteSettingsData {
  heroBgColor: string;
  heroAccentColor: string;
  heroAccentLightColor: string;
  heroShowPhoto: boolean;
  heroPhotoUrl: string;
  heroShowFloatingBadge: boolean;
  heroFloatingBadgeEmoji: string;
  heroFloatingBadgeTitleEn: string;
  heroFloatingBadgeTitleAr: string;
  heroFloatingBadgeSubtitleEn: string;
  heroFloatingBadgeSubtitleAr: string;
  heroTitleEn: string;
  heroTitleAr: string;
  heroBadgeEn: string;
  heroBadgeAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  heroStats: HeroStat[];
  aboutBioEn: string;
  aboutBioAr: string;
  experienceYears: number;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  address: string;
  siteNameEn: string;
  siteNameAr: string;
  taglineEn: string;
  taglineAr: string;
  logoUrl: string;
  footerTextEn: string;
  footerTextAr: string;
}

const DEFAULTS: SiteSettingsData = {
  heroBgColor: "#0A1628",
  heroAccentColor: "#B8860B",
  heroAccentLightColor: "#D4A017",
  heroShowPhoto: true,
  heroPhotoUrl: "",
  heroShowFloatingBadge: true,
  heroFloatingBadgeEmoji: "🍵",
  heroFloatingBadgeTitleEn: "Matcha Power",
  heroFloatingBadgeTitleAr: "ماتشا باور",
  heroFloatingBadgeSubtitleEn: "Founder & CEO",
  heroFloatingBadgeSubtitleAr: "مؤسس ورئيس تنفيذي",
  heroTitleEn: "Mohammed Al-Dabbani",
  heroTitleAr: "محمد الدباني",
  heroBadgeEn: "Brand Manager · Business Development",
  heroBadgeAr: "مدير علامة تجارية · تطوير أعمال",
  heroSubtitleEn: "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution.",
  heroSubtitleAr: "أكثر من 8 سنوات في قيادة علامات F&B والعمليات في المملكة — من الرؤية إلى التنفيذ التجاري الكامل.",
  heroStats: [
    { value: "8+",  labelEn: "Years",      labelAr: "سنوات" },
    { value: "50+", labelEn: "Brands",     labelAr: "علامة" },
    { value: "2M+", labelEn: "Customers",  labelAr: "عميل" },
    { value: "3",   labelEn: "Industries", labelAr: "قطاعات" },
  ],
  aboutBioEn: "",
  aboutBioAr: "",
  experienceYears: 8,
  email: "info@m-aldbani.com",
  phone: "",
  whatsapp: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  address: "",
  siteNameEn: "M-ALDBANI",
  siteNameAr: "محمد الدباني",
  taglineEn: "Brand Manager · Business Development",
  taglineAr: "مدير علامة تجارية · تطوير أعمال",
  logoUrl: "",
  footerTextEn: "Business Development · Operations · Brand Strategy",
  footerTextAr: "تطوير أعمال · عمليات · استراتيجية علامة تجارية",
};

let cached: SiteSettingsData | null = null;

export function useSiteSettings(): SiteSettingsData {
  const [settings, setSettings] = useState<SiteSettingsData>(cached ?? DEFAULTS);

  useEffect(() => {
    if (cached) { setSettings(cached); return; }
    fetch("/api/settings")
      .then(r => r.json())
      .then((d: Partial<SiteSettingsData>) => {
        const merged = { ...DEFAULTS, ...d };
        cached = merged;
        setSettings(merged);
      })
      .catch(() => {});
  }, []);

  return settings;
}
