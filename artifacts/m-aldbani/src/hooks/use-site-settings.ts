import { useState, useEffect } from "react";

export interface HeroStat { value: string; labelEn: string; labelAr: string; }
export interface ExpertiseItem { icon: string; titleEn: string; titleAr: string; descEn: string; descAr: string; }
export interface SkillItem { labelEn: string; labelAr: string; pct: number; }
export interface CareerItem { year: string; titleEn: string; titleAr: string; org: string; current: boolean; }
export interface FeaturedStat { num: string; labelEn: string; labelAr: string; }
export interface MarqueeItem { en: string; ar: string; }

export interface SiteSettingsData {
  // Global palette
  lightSectionBgColor: string;
  darkSectionBgColor: string;
  accentGoldColor: string;
  accentGoldLightColor: string;

  // Section visibility
  showMarquee: boolean;
  showExpertise: boolean;
  showSkills: boolean;
  showCareer: boolean;
  showFeaturedProject: boolean;
  showContact: boolean;
  showPortfolioOnHome: boolean;

  // Marquee
  marqueeItems: MarqueeItem[];

  // Expertise
  expertiseItems: ExpertiseItem[];

  // Skills
  skillItems: SkillItem[];

  // Career
  careerItems: CareerItem[];

  // Hero
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

  // Featured project
  featuredTitleEn: string;
  featuredTitleAr: string;
  featuredSubtitleEn: string;
  featuredSubtitleAr: string;
  featuredDescEn: string;
  featuredDescAr: string;
  featuredEmoji: string;
  featuredRoleEn: string;
  featuredRoleAr: string;
  featuredDateEn: string;
  featuredDateAr: string;
  featuredTags: string[];
  featuredStats: FeaturedStat[];
  featuredImageUrl: string;

  // About
  aboutBioEn: string;
  aboutBioAr: string;
  experienceYears: number;

  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  address: string;

  // Branding
  siteNameEn: string;
  siteNameAr: string;
  taglineEn: string;
  taglineAr: string;
  logoUrl: string;
  footerTextEn: string;
  footerTextAr: string;
}

export const SETTINGS_DEFAULTS: SiteSettingsData = {
  lightSectionBgColor: "#FAF6EF",
  darkSectionBgColor: "#0A1628",
  accentGoldColor: "#B8860B",
  accentGoldLightColor: "#D4A017",

  showMarquee: true,
  showExpertise: true,
  showSkills: true,
  showCareer: true,
  showFeaturedProject: true,
  showContact: true,
  showPortfolioOnHome: false,

  marqueeItems: [
    { en: "Brand Strategy",        ar: "استراتيجية العلامة" },
    { en: "Business Development",  ar: "تطوير الأعمال" },
    { en: "Operations Management", ar: "إدارة العمليات" },
    { en: "F&B Sector",            ar: "قطاع F&B" },
    { en: "Market Analysis",       ar: "تحليل السوق" },
    { en: "Team Leadership",       ar: "قيادة الفرق" },
    { en: "Customer Experience",   ar: "تجربة العميل" },
    { en: "Entrepreneurship",      ar: "ريادة الأعمال" },
  ],

  expertiseItems: [
    { icon: "📈", titleEn: "Business Development", titleAr: "تطوير الأعمال",
      descEn: "Business models, market entry, partnerships, and revenue strategy built to scale.",
      descAr: "نماذج أعمال ودخول السوق وشراكات واستراتيجية إيرادات قابلة للتوسع." },
    { icon: "⚙️", titleEn: "Operations Management", titleAr: "إدارة العمليات",
      descEn: "KPI frameworks, staff development, quality systems, and operational discipline.",
      descAr: "مؤشرات أداء وتطوير كوادر وأنظمة جودة وانضباط تشغيلي." },
    { icon: "🎯", titleEn: "Brand Strategy", titleAr: "استراتيجية العلامة",
      descEn: "Identity, positioning, loyalty systems, and experiences that outlast campaigns.",
      descAr: "هوية وتموضع وأنظمة ولاء وتجارب تستمر أبعد من الحملات." },
  ],

  skillItems: [
    { labelEn: "Brand Strategy",        labelAr: "استراتيجية العلامة", pct: 95 },
    { labelEn: "Business Development",  labelAr: "تطوير الأعمال",      pct: 90 },
    { labelEn: "Operations Management", labelAr: "إدارة العمليات",     pct: 88 },
    { labelEn: "Team Leadership",       labelAr: "قيادة الفرق",        pct: 92 },
    { labelEn: "Market Analysis",       labelAr: "تحليل السوق",        pct: 82 },
    { labelEn: "Customer Experience",   labelAr: "تجربة العميل",       pct: 87 },
  ],

  careerItems: [
    { year: "2025 – Present", titleEn: "Brand Manager",            titleAr: "مدير العلامة التجارية",  org: "Thamarat Al-Khayr — Fuji Cafe",   current: true  },
    { year: "2024 – 2025",    titleEn: "Operations & BD Manager",  titleAr: "مدير العمليات والتطوير", org: "Thamarat Al-Khayr — Fuji Cafe",   current: false },
    { year: "2022 – 2024",    titleEn: "Branch Manager",           titleAr: "مدير فرع",               org: "Namq for Beverages Co.",          current: false },
    { year: "2018 – 2022",    titleEn: "Branch Manager",           titleAr: "مدير فرع",               org: "Al-Awaji Commercial Markets",     current: false },
  ],

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

  featuredTitleEn: "Matcha Power",
  featuredTitleAr: "ماتشا باور",
  featuredSubtitleEn: "Entrepreneurial Venture",
  featuredSubtitleAr: "المشروع الريادي",
  featuredDescEn: "Founded and led from concept to full operational launch — brand identity, business model, market research, team building, and commercial rollout.",
  featuredDescAr: "تأسيس وقيادة من المفهوم إلى الإطلاق الكامل — هوية العلامة ونموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري.",
  featuredEmoji: "🍵",
  featuredRoleEn: "Founder & CEO",
  featuredRoleAr: "مؤسس ورئيس تنفيذي",
  featuredDateEn: "May 2025 – May 2026",
  featuredDateAr: "مايو 2025 – مايو 2026",
  featuredTags: ["Brand Identity", "Business Model", "Market Research", "Operations", "Team Leadership"],
  featuredStats: [
    { num: "0→1",  labelEn: "Launch",      labelAr: "إطلاق" },
    { num: "360°", labelEn: "Brand",        labelAr: "هوية" },
    { num: "5+",   labelEn: "Focus Areas",  labelAr: "محاور" },
    { num: "1Y",   labelEn: "Journey",      labelAr: "رحلة" },
  ],
  featuredImageUrl: "",

  aboutBioEn: "",
  aboutBioAr: "",
  experienceYears: 8,
  email: "Moh.aldbani@gmail.com",
  phone: "+966 552 469 643",
  whatsapp: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  address: "Riyadh, Saudi Arabia",
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
  const [settings, setSettings] = useState<SiteSettingsData>(cached ?? SETTINGS_DEFAULTS);

  useEffect(() => {
    if (cached) { setSettings(cached); return; }
    fetch("/api/settings")
      .then(r => r.json())
      .then((d: Partial<SiteSettingsData>) => {
        const merged = { ...SETTINGS_DEFAULTS, ...d };
        cached = merged;
        setSettings(merged);
      })
      .catch(() => {});
  }, []);

  return settings;
}

export function invalidateSiteSettingsCache() {
  cached = null;
}
