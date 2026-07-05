import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices, useListProjects, useListArticles } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, Sparkles, Star, ChevronRight, Quote, ExternalLink, Play, CheckCircle, Award, TrendingUp, Users, Target } from "lucide-react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

/* ══════════════════════════════════════════
   SECTION: ANIMATED HERO BACKGROUND
══════════════════════════════════════════ */
function HeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #060e1e 0%, #0a1628 50%, #0d1e3a 100%)" }} />

      {/* Blue orb */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute orb-blue"
        style={{ width: 800, height: 800, top: "-20%", left: "-15%", opacity: 1 }}
      />
      {/* Purple orb */}
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute orb-purple"
        style={{ width: 700, height: 700, top: "10%", right: "-15%", opacity: 1 }}
      />
      {/* Gold orb */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        className="absolute orb-gold"
        style={{ width: 500, height: 500, bottom: "0%", left: "35%", opacity: 1 }}
      />

      {/* Geometric dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }}
      />

      {/* Bottom fade to off-white */}
      <div className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #FAF8F4)" }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: FLOATING STAT CARD
══════════════════════════════════════════ */
function FloatStat({ value, en, ar, delay = 0 }: { value: string; en: string; ar: string; delay?: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -3 }}
      className="flex flex-col items-center gap-1 px-5 py-4 rounded-2xl cursor-default"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-2xl font-black text-white leading-none font-heading">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(180,200,255,0.55)" }}>
        {t(en, ar)}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SECTION: MARQUEE STRIP
══════════════════════════════════════════ */
function MarqueeStrip({ items }: { items: { en: string; ar: string }[] }) {
  const { t, language } = useLanguage();
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-4 border-y" style={{ borderColor: "rgba(37,99,235,0.1)", background: "rgba(37,99,235,0.02)" }}>
      <div className={`marquee-track ${language === "ar" ? "marquee-track-rtl" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-slate-500 select-none">
            <span className="w-1 h-1 rounded-full bg-[#2563EB] inline-block flex-shrink-0 opacity-50" />
            {t(item.en, item.ar)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: EXPERTISE CARD
══════════════════════════════════════════ */
function ExpertiseCard({ icon, titleEn, titleAr, descEn, descAr, delay = 0 }: {
  icon: string; titleEn: string; titleAr: string; descEn: string; descAr: string; delay?: number;
}) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-7 rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "white",
        border: "1px solid rgba(37,99,235,0.1)",
        boxShadow: "0 4px 24px rgba(37,99,235,0.05)",
        transition: "all 0.35s ease",
      }}
      whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(37,99,235,0.15)" }}
    >
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))" }}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-3 font-heading">{t(titleEn, titleAr)}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{t(descEn, descAr)}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SECTION: SERVICE CARD (home preview)
══════════════════════════════════════════ */
function ServiceCard({ service, i }: { service: any; i: number }) {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl p-7 overflow-hidden cursor-default"
      style={{
        border: "1px solid rgba(37,99,235,0.1)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        transition: "all 0.35s ease",
      }}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(37,99,235,0.12)" }}
    >
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" }}>
          {service.icon || "⚡"}
        </div>
        <h3 className="font-bold text-slate-900 mb-3 text-lg font-heading">
          {language === "ar" ? service.titleAr : service.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {language === "ar" ? service.descriptionAr : service.description}
        </p>

        {service.price && (
          <div className="mt-5 flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">
              {t("From", "يبدأ من")}
            </span>
            <span className="font-black text-slate-900">{service.price} {t("SAR", "ر.س")}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SECTION: ARTICLE CARD (home preview)
══════════════════════════════════════════ */
function ArticleCard({ article, i }: { article: any; i: number }) {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/articles/${article.slug}`}>
        <div className="group bg-white rounded-2xl overflow-hidden cursor-pointer h-full"
          style={{
            border: "1px solid rgba(37,99,235,0.08)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
          }}>

          {/* Cover image */}
          <div className="relative overflow-hidden h-44">
            {article.coverImage ? (
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-brand-gradient-soft flex items-center justify-center">
                <span className="text-4xl opacity-30">📝</span>
              </div>
            )}
            {article.category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#2563EB]">
                {article.category}
              </span>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 font-heading leading-snug group-hover:text-[#2563EB] transition-colors">
              {language === "ar" ? (article.titleAr || article.title) : article.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2">
              {language === "ar" ? (article.excerptAr || article.excerpt) : article.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════ */
export default function Home() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const isRTL = language === "ar";
  const { data: rawServices } = useListServices();
  const { data: rawArticles } = useListArticles();
  const { data: rawProjects } = useListProjects();

  const services = Array.isArray(rawServices) ? rawServices.slice(0, 6) : [];
  const articles = Array.isArray(rawArticles) ? rawArticles.slice(0, 3) : [];
  const projects = Array.isArray(rawProjects) ? rawProjects.slice(0, 4) : [];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const heroStats = settings.heroStats?.length
    ? settings.heroStats
    : [
        { value: "8+",  labelEn: "Years",      labelAr: "سنوات"  },
        { value: "50+", labelEn: "Brands",     labelAr: "علامة"  },
        { value: "2M+", labelEn: "Customers",  labelAr: "عميل"   },
        { value: "3",   labelEn: "Industries", labelAr: "قطاعات" },
      ];

  return (
    <RootLayout>

      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
        <HeroBg />

        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">

          {/* Logo — large and centered in hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", transform: "scale(1.5)" }} />
              <img
                src={logoImg}
                alt="m-aldbani"
                className="relative h-28 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(37,99,235,0.25)",
            }}
          >
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
              {t(settings.heroBadgeEn || "Brand Manager · Business Development", settings.heroBadgeAr || "مدير علامة تجارية · تطوير أعمال")}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none mb-2"
            style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "white" }}
          >
            {t(settings.heroTitleEn || "Mohammed Al-Dabbani", settings.heroTitleAr || "محمد الدباني")}
          </motion.h1>

          {/* Arabic name if in English mode */}
          {language === "en" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-2xl font-bold mb-5"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                background: "linear-gradient(135deg, #B8860B, #D4A017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              محمد الدباني
            </motion.p>
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(180,200,255,0.7)" }}
          >
            {t(
              settings.heroSubtitleEn || "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution.",
              settings.heroSubtitleAr || "أكثر من 8 سنوات في قيادة علامات F&B والعمليات في المملكة — من الرؤية إلى التنفيذ التجاري الكامل."
            )}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className={`flex items-center justify-center gap-4 flex-wrap mb-14 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
                }}
              >
                <Sparkles size={16} />
                {t("Book Free Consultation", "احجز استشارة مجانية")}
              </motion.button>
            </Link>
            <Link href="/portfolio">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(220,235,255,0.9)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {t("View Portfolio", "شاهد الأعمال")}
                <ArrowIcon size={16} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            {heroStats.map((s, i) => (
              <FloatStat key={i} value={s.value} en={s.labelEn} ar={s.labelAr} delay={0.8 + i * 0.08} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          MARQUEE STRIP
      ════════════════════════════════ */}
      {settings.showMarquee && settings.marqueeItems?.length > 0 && (
        <MarqueeStrip items={settings.marqueeItems} />
      )}

      {/* ════════════════════════════════
          EXPERTISE SECTION
      ════════════════════════════════ */}
      {settings.showExpertise && settings.expertiseItems?.length > 0 && (
        <section className="py-24 px-5 bg-[#FAF8F4]">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              en="Areas of Expertise"
              ar="مجالات الخبرة"
              subEn="Strategic thinking + operational excellence across every engagement."
              subAr="تفكير استراتيجي وتميز تشغيلي في كل مشاركة."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
              {settings.expertiseItems.map((item, i) => (
                <ExpertiseCard key={i} delay={i * 0.12} {...item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ════════════════════════════════
          SERVICES PREVIEW
      ════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24 px-5 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              en="Consulting Services"
              ar="الخدمات الاستشارية"
              subEn="Comprehensive advisory packages designed for real impact."
              subAr="حزم استشارية شاملة مصممة للأثر الحقيقي."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
              {services.map((s, i) => <ServiceCard key={s.id} service={s} i={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm btn-brand`}
                >
                  {t("All Services", "جميع الخدمات")}
                  <ArrowIcon size={15} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ════════════════════════════════
          FEATURED PROJECT / CAREER
      ════════════════════════════════ */}
      {settings.showFeaturedProject && (
        <section className="py-24 px-5" style={{ background: "#FAF8F4" }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              en="Featured Work"
              ar="أبرز الأعمال"
              subEn="A deep-dive into one of my flagship projects."
              subAr="نظرة معمقة على أحد أبرز مشاريعي."
            />

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-14 rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #060e1e 0%, #0d1e3a 100%)",
                border: "1px solid rgba(37,99,235,0.15)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
              }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left content */}
                <div className="p-10 lg:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{settings.featuredEmoji}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                        {t(settings.featuredSubtitleEn, settings.featuredSubtitleAr)}
                      </p>
                      <h3 className="text-2xl font-black text-white font-heading">
                        {t(settings.featuredTitleEn, settings.featuredTitleAr)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-8 text-sm">
                    {t(settings.featuredDescEn, settings.featuredDescAr)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {settings.featuredTags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "rgba(37,99,235,0.2)", color: "#93C5FD" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {settings.featuredStats?.map((s, i) => (
                      <div key={i} className="rounded-xl p-4"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-xl font-black text-white">{s.num}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t(s.labelEn, s.labelAr)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: image or placeholder */}
                <div className="relative lg:min-h-[400px] overflow-hidden">
                  {settings.featuredImageUrl ? (
                    <img src={settings.featuredImageUrl} alt="featured" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                      style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))" }}>
                      <div className="text-7xl opacity-30">{settings.featuredEmoji}</div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-white/40">{t(settings.featuredRoleEn, settings.featuredRoleAr)}</span>
                        <span className="text-xs text-white/25">{t(settings.featuredDateEn, settings.featuredDateAr)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ════════════════════════════════
          CAREER TIMELINE
      ════════════════════════════════ */}
      {settings.showCareer && settings.careerItems?.length > 0 && (
        <section className="py-24 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              en="Career Journey"
              ar="مسيرة العمل"
              subEn="A track record built on leadership, results, and growth."
              subAr="سجل حافل بالقيادة والنتائج والنمو المستمر."
            />
            <div className="mt-14 relative">
              {/* Vertical line */}
              <div className={`absolute top-0 bottom-0 w-px ${isRTL ? "right-6" : "left-6"} hidden md:block`}
                style={{ background: "linear-gradient(to bottom, #2563EB, #7C3AED, transparent)" }} />

              <div className="space-y-6">
                {settings.careerItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`flex gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {/* Dot */}
                    <div className="hidden md:flex flex-col items-center pt-1 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        item.current
                          ? "bg-brand-gradient shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                          : "bg-white border-2 border-slate-200"
                      }`}>
                        {item.current ? <Star size={16} className="text-white" fill="white" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />}
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 p-5 rounded-2xl transition-all duration-300 ${
                      item.current
                        ? "bg-brand-gradient-soft border border-[#2563EB]/20"
                        : "bg-[#FAF8F4] border border-slate-100"
                    }`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h4 className="font-bold text-slate-900 font-heading">{t(item.titleEn, item.titleAr)}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">{item.org}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.current && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
                              {t("Current", "حالياً")}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">{item.year}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ════════════════════════════════
          ARTICLES PREVIEW
      ════════════════════════════════ */}
      {articles.length > 0 && (
        <section className="py-24 px-5 bg-[#FAF8F4]">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              en="Latest Articles"
              ar="أحدث المقالات"
              subEn="Insights, strategies, and reflections from the field."
              subAr="رؤى واستراتيجيات وتأملات من الميدان."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
              {articles.map((a, i) => <ArticleCard key={a.id} article={a} i={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/articles">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm btn-brand"
                >
                  {t("All Articles", "جميع المقالات")}
                  <ArrowIcon size={15} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ════════════════════════════════
          CTA SECTION
      ════════════════════════════════ */}
      <section className="py-24 px-5 overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #060e1e 0%, #0a1628 60%, #0d1a36 100%)" }} />
          <div className="orb-blue absolute" style={{ width: 600, height: 600, top: "-30%", left: "-10%", opacity: 0.8 }} />
          <div className="orb-purple absolute" style={{ width: 500, height: 500, bottom: "-20%", right: "-10%", opacity: 0.8 }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-8"
          >
            <img src={logoImg} alt="m-aldbani" className="h-20 w-auto object-contain opacity-90" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-black text-white mb-5 font-heading"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            {t("Ready to Transform\nYour Business?", "جاهز لتحويل\nأعمالك؟")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-slate-300 mb-10 leading-relaxed"
          >
            {t(
              "Let's build something meaningful together. Book a free consultation today.",
              "لنبني شيئاً ذا قيمة معاً. احجز استشارة مجانية اليوم."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.5)",
                }}
              >
                <Sparkles size={16} />
                {t("Book Free Consultation", "احجز استشارة مجانية")}
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(220,235,255,0.9)",
                }}
              >
                {t("Get in Touch", "تواصل معي")}
                <ArrowIcon size={15} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}

/* ══════════════════════════════════════════
   HELPER: SECTION HEADER
══════════════════════════════════════════ */
function SectionHeader({ en, ar, subEn, subAr }: { en: string; ar: string; subEn?: string; subAr?: string }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="text-center max-w-2xl mx-auto"
    >
      <h2 className="text-4xl font-black text-slate-900 mb-4 font-heading">{t(en, ar)}</h2>
      {(subEn || subAr) && (
        <p className="text-slate-500 text-lg leading-relaxed">{t(subEn ?? "", subAr ?? "")}</p>
      )}
    </motion.div>
  );
}
