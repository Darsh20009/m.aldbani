import { motion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices, useListArticles } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

/* ─── fade-up helper: only on initial view, no per-card complexity ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Marquee ─── */
function Marquee({ items }: { items: { en: string; ar: string }[] }) {
  const { t, language } = useLanguage();
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden"
      style={{ borderTop: "1px solid #E5E0D8", background: "#F0EDE8" }}>
      <div className={`marquee-track py-3 gap-10 ${language === "ar" ? "marquee-track-rtl" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap select-none">
            <span className="w-[3px] h-[3px] rounded-full bg-slate-400 inline-block" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              {t(item.en, item.ar)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const isRTL = language === "ar";
  const { data: rawServices } = useListServices();
  const { data: rawArticles } = useListArticles();
  const services = Array.isArray(rawServices) ? rawServices.slice(0, 6) : [];
  const articles = Array.isArray(rawArticles) ? rawArticles.slice(0, 4) : [];
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const stats = settings.heroStats?.length ? settings.heroStats : [
    { value: "8+",  labelEn: "Years",     labelAr: "سنة" },
    { value: "50+", labelEn: "Brands",    labelAr: "علامة" },
    { value: "2M+", labelEn: "Customers", labelAr: "عميل" },
    { value: "3",   labelEn: "Sectors",   labelAr: "قطاع" },
  ];

  return (
    <RootLayout>

      {/* ══════════════════════════════════════════
          HERO — TYPOGRAPHIC STATEMENT
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden"
        style={{ background: "#FAF8F4" }}
      >
        {/* Hairline top rule under nav */}
        <div className="absolute top-[72px] left-0 right-0 h-px bg-slate-200" />

        {/* Main content grid */}
        <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-12">

          {/* Label row */}
          <motion.div {...fadeUp(0)} className={`flex items-center gap-4 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="h-px w-12 bg-slate-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
              {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة تجارية · F&B · المملكة العربية السعودية")}
            </span>
          </motion.div>

          {/* NAME — the entire hero IS the name */}
          <div className="mb-6">
            {isRTL ? (
              <>
                <motion.div {...fadeUp(0.1)}>
                  <div
                    className="font-black leading-[0.88] text-slate-900 font-heading"
                    style={{ fontSize: "clamp(4rem, 14vw, 11rem)", letterSpacing: "-0.04em" }}
                  >
                    محمد
                  </div>
                </motion.div>
                <motion.div {...fadeUp(0.18)}>
                  {/* The gradient rule between name parts */}
                  <div className="my-3" style={{ height: 3, background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)", maxWidth: "100%" }} />
                </motion.div>
                <motion.div {...fadeUp(0.22)}>
                  <div
                    className="font-black leading-[0.88] font-heading"
                    style={{
                      fontSize: "clamp(4rem, 14vw, 11rem)",
                      letterSpacing: "-0.04em",
                      background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    الدباني
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div {...fadeUp(0.1)}>
                  <div
                    className="font-black leading-[0.88] text-slate-900 font-heading"
                    style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)", letterSpacing: "-0.04em" }}
                  >
                    Mohammed
                  </div>
                </motion.div>
                <motion.div {...fadeUp(0.18)}>
                  <div className="my-3" style={{ height: 3, background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }} />
                </motion.div>
                <motion.div {...fadeUp(0.22)}>
                  <div
                    className="font-black leading-[0.88] font-heading"
                    style={{
                      fontSize: "clamp(3.5rem, 12vw, 10rem)",
                      letterSpacing: "-0.04em",
                      background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Al-Dabbani
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Bottom row: subtitle + CTA */}
          <motion.div
            {...fadeUp(0.35)}
            className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pt-8 ${isRTL ? "lg:flex-row-reverse" : ""}`}
            style={{ borderTop: "1px solid #E5E0D8" }}
          >
            {/* Left: description + CTA */}
            <div className={`max-w-lg ${isRTL ? "text-right" : ""}`}>
              <p className="text-slate-500 leading-relaxed mb-6" style={{ fontSize: "1.05rem" }}>
                {t(
                  "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution.",
                  "أكثر من ٨ سنوات في قيادة علامات F&B وعمليات المطاعم في المملكة — من الفكرة إلى التنفيذ التجاري الكامل."
                )}
              </p>
              <div className={`flex items-center gap-5 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <Link href="/book">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
                    }}
                  >
                    {t("Book Free Consultation", "احجز استشارة مجانية")}
                  </motion.button>
                </Link>
                <Link href="/portfolio">
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#2563EB] transition-colors group">
                    {t("View Work", "شاهد الأعمال")}
                    <ArrowIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div className={`flex items-end gap-8 lg:gap-10 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
              {stats.map((s, i) => (
                <div key={i} className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div
                    className="font-black leading-none font-heading"
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">
                    {t(s.labelEn, s.labelAr)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Logo stamp — bottom corner */}
        <motion.div
          {...fadeUp(0.5)}
          className={`max-w-7xl mx-auto w-full px-6 lg:px-12 flex ${isRTL ? "justify-start" : "justify-end"} mt-4`}
        >
          <div className="opacity-20 hover:opacity-40 transition-opacity">
            <img src={logoImg} alt="m-aldbani" className="h-12 w-auto object-contain" />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      {settings.showMarquee && settings.marqueeItems?.length > 0 && (
        <Marquee items={settings.marqueeItems} />
      )}

      {/* ══════════════════════════════════════════
          SERVICES — Numbered rows, not cards
      ══════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24 px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex items-end justify-between mb-16 gap-6 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
                  {t("Services", "الخدمات")}
                </p>
                <h2 className="font-black text-slate-900 font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
                  {t("What I Do", "ماذا أقدم")}
                </h2>
              </div>
              <Link href="/services">
                <button className={`flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#2563EB] transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}>
                  {t("All Services", "جميع الخدمات")}
                  <ArrowIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Rows */}
            <div style={{ borderTop: "1px solid #E5E0D8" }}>
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="group"
                  style={{ borderBottom: "1px solid #E5E0D8" }}
                >
                  <Link href="/book">
                    <div className={`flex items-center gap-6 py-6 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
                      style={{ transition: "background 0.2s" }}>

                      {/* Number */}
                      <span className="text-[12px] font-black text-slate-300 font-heading w-8 flex-shrink-0 group-hover:text-[#2563EB] transition-colors"
                        style={{ fontVariantNumeric: "tabular-nums" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Icon */}
                      <span className="text-xl flex-shrink-0 w-8 text-center">{service.icon || "—"}</span>

                      {/* Title + desc */}
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                        <p className="font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors font-heading">
                          {language === "ar" ? service.titleAr : service.title}
                        </p>
                        <p className="text-slate-400 text-sm mt-0.5 line-clamp-1 hidden md:block">
                          {language === "ar" ? service.descriptionAr : service.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight
                        size={18}
                        className="flex-shrink-0 text-slate-200 group-hover:text-[#2563EB] transition-colors"
                        style={{ transform: isRTL ? "scaleX(-1)" : "none" }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CAREER — Timeline as editorial list
      ══════════════════════════════════════════ */}
      {settings.showCareer && settings.careerItems?.length > 0 && (
        <section className="py-24 px-6 lg:px-12" style={{ background: "#FAF8F4" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
                {t("Experience", "الخبرة")}
              </p>
              <h2 className="font-black text-slate-900 font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
                {t("Career", "المسيرة")}
              </h2>
            </motion.div>

            <div style={{ borderTop: "1px solid #E5E0D8" }}>
              {settings.careerItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={`flex items-start gap-6 py-5 ${isRTL ? "flex-row-reverse" : ""}`}
                  style={{ borderBottom: "1px solid #E5E0D8" }}
                >
                  <span className="text-[11px] font-black text-slate-300 pt-0.5 w-16 flex-shrink-0 font-heading">
                    {item.year}
                  </span>
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <p className={`font-bold text-slate-900 font-heading ${item.current ? "" : ""}`}>
                      {t(item.titleEn, item.titleAr)}
                      {item.current && (
                        <span className="inline-block ml-2 mr-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white align-middle"
                          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
                          {t("Now", "حالياً")}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">{item.org}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FEATURED PROJECT — Bold dark panel
      ══════════════════════════════════════════ */}
      {settings.showFeaturedProject && (
        <section className="py-24 px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
                {t("Featured", "مميز")}
              </p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#0a1628" }}
              >
                <div className="grid lg:grid-cols-2">
                  <div className="p-10 lg:p-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400 mb-6">
                      {t(settings.featuredSubtitleEn || "Case Study", settings.featuredSubtitleAr || "دراسة حالة")}
                    </p>
                    <h3 className="font-black text-white font-heading mb-5"
                      style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", lineHeight: 1.1 }}>
                      {t(settings.featuredTitleEn || "Brand Transformation", settings.featuredTitleAr || "تحويل العلامة التجارية")}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-sm">
                      {t(settings.featuredDescEn || "A deep-dive engagement.", settings.featuredDescAr || "تدخل استراتيجي معمق.")}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-10">
                      {(settings.featuredTags || ["Brand Strategy", "F&B", "KSA"]).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: "rgba(37,99,235,0.15)", color: "#93C5FD" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(settings.featuredStats || [
                        { num: "120%", labelEn: "Revenue Growth", labelAr: "نمو الإيرادات" },
                        { num: "18mo", labelEn: "Timeline",       labelAr: "المدة الزمنية" },
                      ]).map((s, i) => (
                        <div key={i} className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                          <p className="font-black text-white font-heading" style={{ fontSize: "1.75rem" }}>{s.num}</p>
                          <p className="text-xs text-slate-400 mt-1">{t(s.labelEn, s.labelAr)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative min-h-[300px] lg:min-h-0 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" }}>
                    {settings.featuredImageUrl ? (
                      <img src={settings.featuredImageUrl} alt="project" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span style={{ fontSize: "8rem" }}>{settings.featuredEmoji || "🏆"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          ARTICLES — Editorial grid
      ══════════════════════════════════════════ */}
      {articles.length > 0 && (
        <section className="py-24 px-6 lg:px-12" style={{ background: "#FAF8F4" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex items-end justify-between mb-16 gap-6 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
                  {t("Writing", "الكتابة")}
                </p>
                <h2 className="font-black text-slate-900 font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
                  {t("Articles", "المقالات")}
                </h2>
              </div>
              <Link href="/articles">
                <button className={`flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#2563EB] transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}>
                  {t("All Articles", "جميع المقالات")}
                  <ArrowIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Editorial grid: 1 large + 3 stacked */}
            <div className={`grid lg:grid-cols-3 gap-8 ${isRTL ? "" : ""}`}>

              {/* Large featured article */}
              {articles[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2"
                >
                  <Link href={`/articles/${articles[0].slug}`}>
                    <div className="group cursor-pointer h-full flex flex-col">
                      <div className="overflow-hidden rounded-xl mb-5 flex-shrink-0"
                        style={{ aspectRatio: "16/9", background: "#E8E4DE" }}>
                        {articles[0].coverImage ? (
                          <img src={articles[0].coverImage} alt={articles[0].title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <span style={{ fontSize: "4rem" }}>📝</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-black text-slate-900 font-heading leading-tight group-hover:text-[#2563EB] transition-colors"
                        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}>
                        {language === "ar" ? (articles[0].titleAr || articles[0].title) : articles[0].title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                        {language === "ar" ? (articles[0].excerptAr || articles[0].excerpt) : articles[0].excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Stacked smaller articles */}
              <div className="flex flex-col gap-6" style={{ borderTop: articles.length > 1 ? "1px solid #E5E0D8" : "none" }}>
                {articles.slice(1).map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="group"
                    style={{ borderBottom: "1px solid #E5E0D8", paddingBottom: "1.25rem" }}
                  >
                    <Link href={`/articles/${article.slug}`}>
                      <div className="cursor-pointer">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                          {language === "ar" ? (article.categoryAr || article.category || "مقال") : (article.category || "Article")}
                        </p>
                        <h4 className="font-bold text-slate-900 leading-snug group-hover:text-[#2563EB] transition-colors text-sm font-heading">
                          {language === "ar" ? (article.titleAr || article.title) : article.title}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          CTA — Full dark, typographic, confident
      ══════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden" style={{ background: "#0a1628" }}>
        {/* Single large background text — confidence, not decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
          <span
            className="font-black text-white select-none"
            style={{
              fontSize: "clamp(10rem, 28vw, 24rem)",
              opacity: 0.025,
              letterSpacing: "-0.06em",
              fontFamily: "'Sora', sans-serif",
              lineHeight: 1,
            }}
          >
            {isRTL ? "ابدأ" : "START"}
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Overline */}
            <div className={`flex items-center gap-4 mb-10 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="h-px w-10" style={{ background: "#2563EB" }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                {t("Next Step", "الخطوة التالية")}
              </span>
            </div>

            {/* Statement */}
            <h2 className="font-black text-white font-heading mb-12"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              {isRTL ? (
                <>
                  جاهز<br />
                  <span style={{
                    background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>لنبدأ؟</span>
                </>
              ) : (
                <>
                  Ready to<br />
                  <span style={{
                    background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>Transform?</span>
                </>
              )}
            </h2>

            <div className={`flex items-center gap-6 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link href="/book">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
                  }}
                >
                  {t("Book Free Consultation", "احجز استشارة مجانية")}
                </motion.button>
              </Link>
              <Link href="/contact">
                <button className={`flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}>
                  {t("Or get in touch", "أو تواصل معي")}
                  <ArrowIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
