import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  lightSectionBgColor: string;
  darkSectionBgColor: string;
  accentGoldColor: string;
  accentGoldLightColor: string;
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

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    lightSectionBgColor:  { type: String, default: "#FAF6EF" },
    darkSectionBgColor:   { type: String, default: "#0A1628" },
    accentGoldColor:      { type: String, default: "#B8860B" },
    accentGoldLightColor: { type: String, default: "#D4A017" },
    heroTitleEn: { type: String, default: "Mohammed Al-Dabbani" },
    heroTitleAr: { type: String, default: "محمد الدباني" },
    heroSubtitleEn: { type: String, default: "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution." },
    heroSubtitleAr: { type: String, default: "أكثر من 8 سنوات في قيادة علامات F&B والعمليات في المملكة — من الرؤية إلى التنفيذ التجاري الكامل." },
    heroBadgeEn: { type: String, default: "Brand Manager · Business Development" },
    heroBadgeAr: { type: String, default: "مدير علامة تجارية · تطوير أعمال" },
    heroStats: {
      type: [{ value: String, labelEn: String, labelAr: String }],
      default: [
        { value: "8+", labelEn: "Years",      labelAr: "سنوات" },
        { value: "50+", labelEn: "Brands",    labelAr: "علامة" },
        { value: "2M+", labelEn: "Customers", labelAr: "عميل" },
        { value: "3",   labelEn: "Industries",labelAr: "قطاعات" },
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
    aboutBioEn: { type: String, default: "" },
    aboutBioAr: { type: String, default: "" },
    experienceYears: { type: Number, default: 8 },
    email:     { type: String, default: "info@m-aldbani.com" },
    phone:     { type: String, default: "" },
    whatsapp:  { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    twitter:   { type: String, default: "" },
    instagram: { type: String, default: "" },
    address:   { type: String, default: "" },
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
