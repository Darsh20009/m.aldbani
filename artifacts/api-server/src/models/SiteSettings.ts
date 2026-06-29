import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  // ── GLOBAL PALETTE ──────────────────────────────────────────────
  lightSectionBgColor: string;
  darkSectionBgColor: string;
  accentGoldColor: string;
  accentGoldLightColor: string;

  // ── SECTION VISIBILITY ──────────────────────────────────────────
  showMarquee: boolean;
  showExpertise: boolean;
  showSkills: boolean;
  showCareer: boolean;
  showFeaturedProject: boolean;
  showContact: boolean;
  showPortfolioOnHome: boolean;

  // ── MARQUEE ─────────────────────────────────────────────────────
  marqueeItems: { en: string; ar: string }[];

  // ── EXPERTISE ───────────────────────────────────────────────────
  expertiseItems: { icon: string; titleEn: string; titleAr: string; descEn: string; descAr: string }[];

  // ── SKILLS ──────────────────────────────────────────────────────
  skillItems: { labelEn: string; labelAr: string; pct: number }[];

  // ── CAREER TIMELINE ─────────────────────────────────────────────
  careerItems: { year: string; titleEn: string; titleAr: string; org: string; current: boolean }[];

  // ── HERO ────────────────────────────────────────────────────────
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  heroBadgeEn: string;
  heroBadgeAr: string;
  heroStats: { value: string; labelEn: string; labelAr: string }[];
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

  // ── FEATURED PROJECT SECTION ─────────────────────────────────────
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
  featuredStats: { num: string; labelEn: string; labelAr: string }[];
  featuredImageUrl: string;

  // ── ABOUT ────────────────────────────────────────────────────────
  aboutBioEn: string;
  aboutBioAr: string;
  experienceYears: number;

  // ── CONTACT ──────────────────────────────────────────────────────
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  address: string;

  // ── BRANDING ─────────────────────────────────────────────────────
  siteNameEn: string;
  siteNameAr: string;
  taglineEn: string;
  taglineAr: string;
  logoUrl: string;
  footerTextEn: string;
  footerTextAr: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    // Global palette
    lightSectionBgColor:  { type: String, default: "#FAF6EF" },
    darkSectionBgColor:   { type: String, default: "#0A1628" },
    accentGoldColor:      { type: String, default: "#B8860B" },
    accentGoldLightColor: { type: String, default: "#D4A017" },

    // Section visibility
    showMarquee:          { type: Boolean, default: true },
    showExpertise:        { type: Boolean, default: true },
    showSkills:           { type: Boolean, default: true },
    showCareer:           { type: Boolean, default: true },
    showFeaturedProject:  { type: Boolean, default: true },
    showContact:          { type: Boolean, default: true },
    showPortfolioOnHome:  { type: Boolean, default: false },

    // Marquee
    marqueeItems: {
      type: [{ en: String, ar: String }],
      default: [
        { en: "Brand Strategy",        ar: "استراتيجية العلامة" },
        { en: "Business Development",  ar: "تطوير الأعمال" },
        { en: "Operations Management", ar: "إدارة العمليات" },
        { en: "F&B Sector",            ar: "قطاع F&B" },
        { en: "Market Analysis",       ar: "تحليل السوق" },
        { en: "Team Leadership",       ar: "قيادة الفرق" },
        { en: "Customer Experience",   ar: "تجربة العميل" },
        { en: "Entrepreneurship",      ar: "ريادة الأعمال" },
      ],
    },

    // Expertise cards
    expertiseItems: {
      type: [{ icon: String, titleEn: String, titleAr: String, descEn: String, descAr: String }],
      default: [
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
    },

    // Skill bars
    skillItems: {
      type: [{ labelEn: String, labelAr: String, pct: Number }],
      default: [
        { labelEn: "Brand Strategy",        labelAr: "استراتيجية العلامة", pct: 95 },
        { labelEn: "Business Development",  labelAr: "تطوير الأعمال",      pct: 90 },
        { labelEn: "Operations Management", labelAr: "إدارة العمليات",     pct: 88 },
        { labelEn: "Team Leadership",       labelAr: "قيادة الفرق",        pct: 92 },
        { labelEn: "Market Analysis",       labelAr: "تحليل السوق",        pct: 82 },
        { labelEn: "Customer Experience",   labelAr: "تجربة العميل",       pct: 87 },
      ],
    },

    // Career timeline
    careerItems: {
      type: [{ year: String, titleEn: String, titleAr: String, org: String, current: Boolean }],
      default: [
        { year: "2025 – Present", titleEn: "Brand Manager",            titleAr: "مدير العلامة التجارية",  org: "Thamarat Al-Khayr — Fuji Cafe",   current: true  },
        { year: "2024 – 2025",    titleEn: "Operations & BD Manager",  titleAr: "مدير العمليات والتطوير", org: "Thamarat Al-Khayr — Fuji Cafe",   current: false },
        { year: "2022 – 2024",    titleEn: "Branch Manager",           titleAr: "مدير فرع",               org: "Namq for Beverages Co.",          current: false },
        { year: "2018 – 2022",    titleEn: "Branch Manager",           titleAr: "مدير فرع",               org: "Al-Awaji Commercial Markets",     current: false },
      ],
    },

    // Hero
    heroTitleEn: { type: String, default: "Mohammed Al-Dabbani" },
    heroTitleAr: { type: String, default: "محمد الدباني" },
    heroSubtitleEn: { type: String, default: "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution." },
    heroSubtitleAr: { type: String, default: "أكثر من 8 سنوات في قيادة علامات F&B والعمليات في المملكة — من الرؤية إلى التنفيذ التجاري الكامل." },
    heroBadgeEn: { type: String, default: "Brand Manager · Business Development" },
    heroBadgeAr: { type: String, default: "مدير علامة تجارية · تطوير أعمال" },
    heroStats: {
      type: [{ value: String, labelEn: String, labelAr: String }],
      default: [
        { value: "8+",  labelEn: "Years",      labelAr: "سنوات" },
        { value: "50+", labelEn: "Brands",     labelAr: "علامة" },
        { value: "2M+", labelEn: "Customers",  labelAr: "عميل" },
        { value: "3",   labelEn: "Industries", labelAr: "قطاعات" },
      ],
    },
    heroBgColor:            { type: String, default: "#0A1628" },
    heroAccentColor:        { type: String, default: "#B8860B" },
    heroAccentLightColor:   { type: String, default: "#D4A017" },
    heroShowPhoto:          { type: Boolean, default: true },
    heroPhotoUrl:           { type: String, default: "" },
    heroShowFloatingBadge:  { type: Boolean, default: true },
    heroFloatingBadgeEmoji: { type: String, default: "🍵" },
    heroFloatingBadgeTitleEn:    { type: String, default: "Matcha Power" },
    heroFloatingBadgeTitleAr:    { type: String, default: "ماتشا باور" },
    heroFloatingBadgeSubtitleEn: { type: String, default: "Founder & CEO" },
    heroFloatingBadgeSubtitleAr: { type: String, default: "مؤسس ورئيس تنفيذي" },

    // Featured project
    featuredTitleEn:    { type: String, default: "Matcha Power" },
    featuredTitleAr:    { type: String, default: "ماتشا باور" },
    featuredSubtitleEn: { type: String, default: "Entrepreneurial Venture" },
    featuredSubtitleAr: { type: String, default: "المشروع الريادي" },
    featuredDescEn:     { type: String, default: "Founded and led from concept to full operational launch — brand identity, business model, market research, team building, and commercial rollout." },
    featuredDescAr:     { type: String, default: "تأسيس وقيادة من المفهوم إلى الإطلاق الكامل — هوية العلامة ونموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري." },
    featuredEmoji:      { type: String, default: "🍵" },
    featuredRoleEn:     { type: String, default: "Founder & CEO" },
    featuredRoleAr:     { type: String, default: "مؤسس ورئيس تنفيذي" },
    featuredDateEn:     { type: String, default: "May 2025 – May 2026" },
    featuredDateAr:     { type: String, default: "مايو 2025 – مايو 2026" },
    featuredTags:       { type: [String], default: ["Brand Identity", "Business Model", "Market Research", "Operations", "Team Leadership"] },
    featuredStats: {
      type: [{ num: String, labelEn: String, labelAr: String }],
      default: [
        { num: "0→1",  labelEn: "Launch",      labelAr: "إطلاق" },
        { num: "360°", labelEn: "Brand",        labelAr: "هوية" },
        { num: "5+",   labelEn: "Focus Areas",  labelAr: "محاور" },
        { num: "1Y",   labelEn: "Journey",      labelAr: "رحلة" },
      ],
    },
    featuredImageUrl: { type: String, default: "" },

    // About
    aboutBioEn: { type: String, default: "" },
    aboutBioAr: { type: String, default: "" },
    experienceYears: { type: Number, default: 8 },

    // Contact
    email:     { type: String, default: "Moh.aldbani@gmail.com" },
    phone:     { type: String, default: "+966 552 469 643" },
    whatsapp:  { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    twitter:   { type: String, default: "" },
    instagram: { type: String, default: "" },
    address:   { type: String, default: "Riyadh, Saudi Arabia" },

    // Branding
    siteNameEn: { type: String, default: "M-ALDBANI" },
    siteNameAr: { type: String, default: "محمد الدباني" },
    taglineEn:  { type: String, default: "Brand Manager · Business Development" },
    taglineAr:  { type: String, default: "مدير علامة تجارية · تطوير أعمال" },
    logoUrl:    { type: String, default: "" },
    footerTextEn: { type: String, default: "Business Development · Operations · Brand Strategy" },
    footerTextAr: { type: String, default: "تطوير أعمال · عمليات · استراتيجية علامة تجارية" },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
