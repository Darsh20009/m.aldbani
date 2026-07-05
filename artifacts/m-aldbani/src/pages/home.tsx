import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices, useListProjects, useListArticles } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, Sparkles, Star, CheckCircle } from "lucide-react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

/* ─── Marquee ─── */
function MarqueeStrip({ items }: { items: { en: string; ar: string }[] }) {
  const { t, language } = useLanguage();
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-4" style={{ borderTop: "1px solid rgba(37,99,235,0.1)", borderBottom: "1px solid rgba(37,99,235,0.1)", background: "rgba(37,99,235,0.02)" }}>
      <div className={`marquee-track ${language === "ar" ? "marquee-track-rtl" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-slate-400 select-none">
            <span className="w-1 h-1 rounded-full inline-block flex-shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }} />
            {t(item.en, item.ar)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Section Header ─── */
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

/* ─── Expertise Card ─── */
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
      className="group relative p-7 rounded-2xl overflow-hidden cursor-default bg-white"
      style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 4px 24px rgba(37,99,235,0.04)", transition: "all 0.35s ease" }}
      whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(37,99,235,0.12)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

/* ─── Service Card ─── */
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
      style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", transition: "all 0.35s ease" }}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(37,99,235,0.1)" }}
    >
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))" }}>
          {service.icon || "⚡"}
        </div>
        <h3 className="font-bold text-slate-900 mb-3 text-lg font-heading">
          {language === "ar" ? service.titleAr : service.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {language === "ar" ? service.descriptionAr : service.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Article Card ─── */
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
          style={{ border: "1px solid rgba(37,99,235,0.08)", boxShadow: "0 2px 16px rgba(0,0,0,0.03)", transition: "all 0.3s ease" }}>
          <div className="relative overflow-hidden h-44">
            {article.coverImage ? (
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-brand-gradient-soft flex items-center justify-center">
                <span className="text-4xl opacity-30">📝</span>
              </div>
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

/* ══════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════ */
export default function Home() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const isRTL = language === "ar";
  const { data: rawServices } = useListServices();
  const { data: rawArticles } = useListArticles();
  const { data: rawProjects } = useListProjects();

  const services = Array.isArray(rawServices) ? rawServices.slice(0, 6) : [];
  const articles = Array.isArray(rawArticles) ? rawArticles.slice(0, 3) : [];
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const heroStats = settings.heroStats?.length ? settings.heroStats : [
    { value: "8+",  labelEn: "Years",      labelAr: "سنوات"  },
    { value: "50+", labelEn: "Brands",     labelAr: "علامة"  },
    { value: "2M+", labelEn: "Customers",  labelAr: "عميل"   },
    { value: "3",   labelEn: "Industries", labelAr: "قطاعات" },
  ];

  return (
    <RootLayout>

      {/* ══════════════════════════════════
          LUXURY HERO — OFF-WHITE FAKHAMA
      ══════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">

        {/* Off-white luxury background */}
        <div className="absolute inset-0" style={{ background: "#FAF8F4" }} />

        {/* Radial gradient center glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)",
          }} />

        {/* Subtle warm grain / noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }} />

        {/* Luxury geometric lines — top right */}
        <svg className="absolute top-0 right-0 opacity-[0.08] pointer-events-none" width="500" height="500" viewBox="0 0 500 500" fill="none">
          <circle cx="500" cy="0" r="280" stroke="url(#g1)" strokeWidth="1" fill="none" />
          <circle cx="500" cy="0" r="380" stroke="url(#g1)" strokeWidth="0.5" fill="none" />
          <circle cx="500" cy="0" r="460" stroke="url(#g1)" strokeWidth="0.5" fill="none" />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="500" y2="500">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>

        {/* Luxury geometric lines — bottom left */}
        <svg className="absolute bottom-0 left-0 opacity-[0.06] pointer-events-none" width="400" height="400" viewBox="0 0 400 400" fill="none">
          <circle cx="0" cy="400" r="220" stroke="url(#g2)" strokeWidth="1" fill="none" />
          <circle cx="0" cy="400" r="300" stroke="url(#g2)" strokeWidth="0.5" fill="none" />
          <defs>
            <linearGradient id="g2" x1="0" y1="400" x2="400" y2="0">
              <stop stopColor="#7C3AED" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating gold dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #B8860B 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }} />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center flex flex-col items-center">

          {/* Luxury badge */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(184,134,11,0.2)",
                boxShadow: "0 4px 24px rgba(184,134,11,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                backdropFilter: "blur(12px)",
              }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #B8860B, #D4A017)" }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #D4A017)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {t("Brand Manager · Business Development", "مدير علامة تجارية · تطوير أعمال")}
              </span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #B8860B, #D4A017)" }} />
            </div>
          </motion.div>

          {/* Logo — luxury floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mb-8 relative"
          >
            {/* Glow behind logo */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(184,134,11,0.08) 50%, transparent 70%)",
                transform: "scale(2.5)",
                filter: "blur(20px)",
              }} />
            <img
              src={logoImg}
              alt="m-aldbani"
              className="relative h-36 w-auto object-contain"
              style={{ filter: "drop-shadow(0 8px 40px rgba(37,99,235,0.12)) drop-shadow(0 2px 8px rgba(0,0,0,0.06))" }}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none mb-2 text-slate-900 font-heading"
            style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", letterSpacing: "-0.03em" }}
          >
            {t(settings.heroTitleEn || "Mohammed Al-Dabbani", settings.heroTitleAr || "محمد الدباني")}
          </motion.h1>

          {/* Subtitle Arabic tagline */}
          {language === "en" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                background: "linear-gradient(135deg, #B8860B 0%, #D4A017 100%)",
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
            className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-slate-500"
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
            className={`flex items-center justify-center gap-4 flex-wrap mb-16 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.3), 0 2px 8px rgba(0,0,0,0.1)",
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
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(37,99,235,0.15)",
                  color: "#1e293b",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {t("View Portfolio", "شاهد الأعمال")}
                <ArrowIcon size={16} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats — luxury floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {heroStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl cursor-default"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(37,99,235,0.1)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-2xl font-black text-slate-900 leading-none font-heading"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  {s.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t(s.labelEn, s.labelAr)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #FAF8F4)" }} />
      </section>

      {/* ═══ MARQUEE ═══ */}
      {settings.showMarquee && settings.marqueeItems?.length > 0 && (
        <MarqueeStrip items={settings.marqueeItems} />
      )}

      {/* ═══ EXPERTISE ═══ */}
      {settings.showExpertise && settings.expertiseItems?.length > 0 && (
        <section className="py-24 px-5" style={{ background: "#FAF8F4" }}>
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

      {/* ═══ SERVICES ═══ */}
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
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm btn-brand text-white">
                  {t("All Services", "جميع الخدمات")}
                  <ArrowIcon size={15} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ═══ FEATURED PROJECT ═══ */}
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
                background: "linear-gradient(135deg, #060e1e 0%, #0a1628 100%)",
                border: "1px solid rgba(37,99,235,0.15)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.1)",
              }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
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
                  <div className="flex flex-wrap gap-2 mb-8">
                    {settings.featuredTags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "rgba(37,99,235,0.2)", color: "#93C5FD" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
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
                <div className="relative lg:min-h-[400px] overflow-hidden">
                  {settings.featuredImageUrl ? (
                    <img src={settings.featuredImageUrl} alt="featured" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                      style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))" }}>
                      <div className="text-7xl opacity-30">{settings.featuredEmoji}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ═══ CAREER TIMELINE ═══ */}
      {settings.showCareer && settings.careerItems?.length > 0 && (
        <section className="py-24 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              en="Career Journey"
              ar="مسيرة العمل"
              subEn="A track record built on leadership, results, and growth."
              subAr="سجل حافل بالقيادة والنتائج والنمو المستمر."
            />
            <div className="mt-14 space-y-5">
              {settings.careerItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`flex gap-5 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      item.current ? "bg-brand-gradient shadow-[0_0_16px_rgba(37,99,235,0.3)]" : "bg-white border-2 border-slate-200"
                    }`}>
                      {item.current ? <Star size={14} className="text-white" fill="white" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                    </div>
                  </div>
                  <div className={`flex-1 p-5 rounded-2xl ${
                    item.current ? "bg-brand-gradient-soft border border-[#2563EB]/15" : "bg-[#FAF8F4] border border-slate-100"
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
        </section>
      )}

      <div className="section-divider" />

      {/* ═══ ARTICLES ═══ */}
      {articles.length > 0 && (
        <section className="py-24 px-5" style={{ background: "#FAF8F4" }}>
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
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm btn-brand text-white">
                  {t("All Articles", "جميع المقالات")}
                  <ArrowIcon size={15} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ═══ CTA SECTION — Dark luxury ═══ */}
      <section className="py-24 px-5 overflow-hidden relative">
        {/* Dark luxury background */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1f3d 50%, #0d1a30 100%)" }} />

        {/* Geometric arcs */}
        <svg className="absolute top-0 right-0 opacity-10 pointer-events-none" width="600" height="600" viewBox="0 0 600 600" fill="none">
          <circle cx="600" cy="0" r="350" stroke="url(#cg1)" strokeWidth="1" fill="none" />
          <circle cx="600" cy="0" r="500" stroke="url(#cg1)" strokeWidth="0.5" fill="none" />
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="600" y2="600">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-8"
          >
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src={logoImg} alt="m-aldbani" className="h-16 w-auto object-contain" />
            </div>
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
            transition={{ delay: 0.2 }}
            className="text-slate-300 mb-10 leading-relaxed"
          >
            {t("Let's build something meaningful together. Book a free consultation today.", "لنبني شيئاً ذا قيمة معاً. احجز استشارة مجانية اليوم.")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
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
