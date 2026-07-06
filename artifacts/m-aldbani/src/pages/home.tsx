import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices, useListArticles } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, Sparkles, Star, ExternalLink } from "lucide-react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

/* ══════════════════════════════════════════════════════
   CREATIVE HOME — EDITORIAL MAGAZINE FAKHAMA
══════════════════════════════════════════════════════ */

/* ─── Marquee Strip ─── */
function Marquee({ items }: { items: { en: string; ar: string }[] }) {
  const { t, language } = useLanguage();
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden" style={{ background: "#F0EDE8", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div className={`marquee-track py-3 ${language === "ar" ? "marquee-track-rtl" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap select-none">
            <span className="w-[3px] h-[3px] rounded-full" style={{ background: "#2563EB", display: "inline-block" }} />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">{t(item.en, item.ar)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Article Card ─── */
function ArticleCard({ article, i }: { article: any; i: number }) {
  const { language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.6 }}>
      <Link href={`/articles/${article.slug}`}>
        <div className="group cursor-pointer">
          <div className="overflow-hidden rounded-2xl mb-4 relative"
            style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))" }}>
            {article.coverImage ? (
              <img src={article.coverImage} alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl opacity-20">📝</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
                {language === "ar" ? (article.categoryAr || article.category || "مقال") : (article.category || "Article")}
              </span>
            </div>
          </div>
          <h3 className="font-black text-slate-900 font-heading leading-snug group-hover:text-[#2563EB] transition-colors mb-2">
            {language === "ar" ? (article.titleAr || article.title) : article.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2">
            {language === "ar" ? (article.excerptAr || article.excerpt) : article.excerpt}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══ MAIN PAGE ══ */
export default function Home() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const isRTL = language === "ar";
  const { data: rawServices } = useListServices();
  const { data: rawArticles } = useListArticles();
  const services = Array.isArray(rawServices) ? rawServices.slice(0, 6) : [];
  const articles = Array.isArray(rawArticles) ? rawArticles.slice(0, 3) : [];
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const heroStats = settings.heroStats?.length ? settings.heroStats : [
    { value: "8+",  labelEn: "Years Experience", labelAr: "سنوات خبرة" },
    { value: "50+", labelEn: "Brands Built",      labelAr: "علامة تجارية" },
    { value: "2M+", labelEn: "Customers Reached", labelAr: "عميل وصلنا إليه" },
    { value: "3",   labelEn: "Key Sectors",       labelAr: "قطاعات رئيسية" },
  ];

  return (
    <RootLayout>

      {/* ══════════════════════════════════════
          HERO — EDITORIAL ASYMMETRIC
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden" style={{ background: "#FAF8F4" }}>

        {/* HUGE Arabic watermark — the creative element */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-black leading-none text-slate-900"
            style={{
              fontSize: "clamp(12rem, 35vw, 32rem)",
              opacity: 0.028,
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              letterSpacing: "-0.04em",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isRTL ? "الدباني" : "ALDBANI"}
          </span>
        </div>

        {/* Diagonal light gradient top-right */}
        <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
          style={{
            background: "linear-gradient(225deg, rgba(37,99,235,0.045) 0%, transparent 60%)",
          }} />

        {/* Fine grid lines — editorial feel */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }} />

        {/* ── Hero Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-24">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL ? "" : ""}`}>

            {/* LEFT: Text Content */}
            <div className={isRTL ? "order-2" : "order-1"}>

              {/* Gold badge */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-10"
              >
                <div className="h-[1px] w-8"
                  style={{ background: "linear-gradient(90deg, #B8860B, transparent)" }} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]"
                  style={{ color: "#B8860B" }}>
                  {t("Brand Manager · F&B · KSA", "مدير علامة تجارية · F&B · المملكة")}
                </span>
              </motion.div>

              {/* Name — massive editorial */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="font-black leading-[0.9] text-slate-900 font-heading mb-6"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", letterSpacing: "-0.04em" }}>
                  {isRTL ? (
                    <>
                      محمد<br />
                      <span style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>الدباني</span>
                    </>
                  ) : (
                    <>
                      Mohammed<br />
                      <span style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>Al-Dabbani</span>
                    </>
                  )}
                </h1>
              </motion.div>

              {/* Separator line with dot */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-6 origin-left"
              >
                <div className="flex-1 max-w-[80px] h-[1px]" style={{ background: "linear-gradient(90deg, #2563EB, transparent)" }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2563EB" }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-slate-500 max-w-lg leading-relaxed mb-10 text-lg"
              >
                {t(
                  "8+ years leading F&B brands and operations across Saudi Arabia — bridging vision with full commercial execution.",
                  "أكثر من ٨ سنوات في قيادة علامات F&B والعمليات في المملكة — أجسر بين الرؤية والتنفيذ التجاري الكامل."
                )}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className={`flex items-center gap-4 flex-wrap mb-16 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Link href="/book">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Sparkles size={15} />
                    {t("Book Free Consultation", "احجز استشارة مجانية")}
                  </motion.button>
                </Link>
                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 font-bold text-slate-700 hover:text-[#2563EB] transition-colors group"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {t("See Work", "شاهد الأعمال")}
                    <ArrowIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats — horizontal strip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className={`grid grid-cols-4 gap-3 pt-8 ${isRTL ? "" : ""}`}
                style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                {heroStats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 + i * 0.07 }}
                    className="text-center"
                  >
                    <div className="font-black text-slate-900 font-heading leading-none mb-1"
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                      {s.value}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                      {t(s.labelEn, s.labelAr)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Floating Logo Visual */}
            <div className={`flex items-center justify-center ${isRTL ? "order-1" : "order-2"}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Outer ring decoration */}
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "conic-gradient(from 0deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15), rgba(37,99,235,0.15))",
                    transform: "scale(1.35)",
                    filter: "blur(2px)",
                  }} />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid rgba(37,99,235,0.12)",
                    transform: "scale(1.2)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                  style={{
                    width: "clamp(260px, 35vw, 380px)",
                    height: "clamp(260px, 35vw, 380px)",
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: "2rem",
                    boxShadow: "0 24px 80px rgba(37,99,235,0.12), 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-[2rem] pointer-events-none"
                    style={{ background: "radial-gradient(circle at 30% 20%, rgba(37,99,235,0.06), transparent 60%)" }} />

                  <img
                    src={logoImg}
                    alt="Mohammed Al-Dabbani"
                    style={{ width: "65%", objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 16px rgba(37,99,235,0.15))" }}
                  />

                  <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))",
                      border: "1px solid rgba(37,99,235,0.12)",
                    }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-500">
                      {t("Available for consultation", "متاح للاستشارة")}
                    </span>
                  </div>
                </motion.div>

                {/* Floating accent cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="absolute -top-4 -right-4 px-4 py-2.5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
                  }}
                >
                  <p className="text-white text-[11px] font-black uppercase tracking-wider">F&B Expert</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="absolute -bottom-3 -left-4 px-4 py-2.5 rounded-xl bg-white"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(37,99,235,0.1)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
                    <p className="text-slate-800 text-[11px] font-black">KSA · Riyadh</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {t("Scroll", "اسحب")}
          </div>
          <div className="w-[1px] h-8" style={{ background: "linear-gradient(to bottom, #2563EB, transparent)" }} />
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      {settings.showMarquee && settings.marqueeItems?.length > 0 && (
        <Marquee items={settings.marqueeItems} />
      )}

      {/* ═══ STATS BAND — Bold editorial ═══ */}
      <section style={{ background: "#0a1628" }} className="py-16 px-6 overflow-hidden relative">
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden`}
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {heroStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center py-10 px-6 text-center"
                style={{ background: "rgba(10,22,40,0.9)" }}
              >
                <span className="font-black leading-none mb-3"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  {s.value}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                  {t(s.labelEn, s.labelAr)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES — Numbered editorial ═══ */}
      {services.length > 0 && (
        <section className="py-24 px-6" style={{ background: "#FAF8F4" }}>
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`flex items-end justify-between mb-16 flex-wrap gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3"
                  style={{ color: "#B8860B" }}>
                  {t("What I Offer", "ماذا أقدم")}
                </p>
                <h2 className="font-black text-slate-900 font-heading"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>
                  {t("Consulting\nServices", "الخدمات\nالاستشارية")}
                </h2>
              </div>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 font-bold text-sm text-slate-600 hover:text-[#2563EB] transition-colors group"
                >
                  {t("View All", "جميع الخدمات")}
                  <ArrowIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Numbered grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative bg-white rounded-3xl p-8 overflow-hidden cursor-default"
                  style={{ border: "1px solid rgba(0,0,0,0.06)", transition: "all 0.3s ease" }}
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(37,99,235,0.1)", borderColor: "rgba(37,99,235,0.15)" }}
                >
                  {/* Big number background */}
                  <div className="absolute top-4 right-6 font-black text-slate-900 leading-none pointer-events-none select-none"
                    style={{
                      fontSize: "5rem",
                      opacity: 0.04,
                      fontFamily: "'Sora', sans-serif",
                    }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10">
                    {/* Number pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black mb-5"
                      style={{
                        background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))",
                        color: "#2563EB",
                      }}>
                      <span style={{ opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))" }}>
                        {service.icon || "⚡"}
                      </div>
                      <h3 className="font-black text-slate-900 font-heading text-lg leading-tight pt-1">
                        {language === "ar" ? service.titleAr : service.title}
                      </h3>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {language === "ar" ? service.descriptionAr : service.description}
                    </p>

                    <Link href="/book">
                      <div className="inline-flex items-center gap-2 text-[#2563EB] text-sm font-bold group-hover:gap-3 transition-all">
                        {t("Book Now", "احجز الآن")}
                        <ArrowIcon size={14} />
                      </div>
                    </Link>
                  </div>

                  {/* Bottom gradient bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED PROJECT — Dark cinematic ═══ */}
      {settings.showFeaturedProject && (
        <section className="py-24 px-6 relative overflow-hidden"
          style={{ background: "#0a1628" }}>
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 80% at 70% 50%, rgba(37,99,235,0.12), transparent)" }} />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-400 mb-7"
                  style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)" }}>
                  <span>{settings.featuredEmoji || "🏆"}</span>
                  {t(settings.featuredSubtitleEn || "Featured Project", settings.featuredSubtitleAr || "مشروع مميز")}
                </div>
                <h3 className="font-black text-white font-heading mb-5"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.15 }}>
                  {t(settings.featuredTitleEn || "Al-Baik Brand Expansion", settings.featuredTitleAr || "توسعة علامة البيك")}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  {t(settings.featuredDescEn || "Led full brand development and operations.", settings.featuredDescAr || "قيادة تطوير العلامة التجارية والعمليات.")}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(settings.featuredTags || ["Brand Strategy", "F&B", "Operations"]).map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: "rgba(37,99,235,0.15)", color: "#93C5FD" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(settings.featuredStats || [
                    { num: "120%", labelEn: "Revenue Growth", labelAr: "نمو الإيرادات" },
                    { num: "18mo", labelEn: "Delivery Time",  labelAr: "وقت التسليم" },
                  ]).map((s, i) => (
                    <div key={i} className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-2xl font-black text-white mb-1">{s.num}</p>
                      <p className="text-xs text-slate-400">{t(s.labelEn, s.labelAr)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative lg:min-h-[420px] overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))" }}>
                {settings.featuredImageUrl ? (
                  <img src={settings.featuredImageUrl} alt="featured" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-10">{settings.featuredEmoji || "🏆"}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ CAREER TIMELINE ═══ */}
      {settings.showCareer && settings.careerItems?.length > 0 && (
        <section className="py-24 px-6" style={{ background: "#FAF8F4" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: "#B8860B" }}>
                {t("Experience", "الخبرة")}
              </p>
              <h2 className="font-black text-slate-900 font-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                {t("Career Journey", "مسيرة العمل")}
              </h2>
            </motion.div>
            <div className="space-y-4">
              {settings.careerItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`flex items-center gap-5 p-6 rounded-2xl ${isRTL ? "flex-row-reverse" : ""} ${
                    item.current ? "bg-white" : ""
                  }`}
                  style={item.current ? {
                    border: "1px solid rgba(37,99,235,0.12)",
                    boxShadow: "0 4px 20px rgba(37,99,235,0.06)",
                  } : {
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    item.current ? "bg-brand-gradient shadow-[0_4px_16px_rgba(37,99,235,0.3)]" : "bg-slate-100"
                  }`}>
                    {item.current
                      ? <Star size={14} className="text-white" fill="white" />
                      : <div className="w-2 h-2 rounded-full bg-slate-300" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center justify-between gap-3 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div>
                        <h4 className="font-bold text-slate-900 font-heading">{t(item.titleEn, item.titleAr)}</h4>
                        <p className="text-sm text-slate-400 mt-0.5">{item.org}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.current && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
                            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
                            {t("Now", "حالياً")}
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-400">{item.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ARTICLES ═══ */}
      {articles.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex items-end justify-between mb-14 flex-wrap gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: "#B8860B" }}>
                  {t("Knowledge", "المعرفة")}
                </p>
                <h2 className="font-black text-slate-900 font-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                  {t("Latest Articles", "أحدث المقالات")}
                </h2>
              </div>
              <Link href="/articles">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 font-bold text-sm text-slate-600 hover:text-[#2563EB] transition-colors group">
                  {t("All Articles", "جميع المقالات")}
                  <ArrowIcon size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((a, i) => <ArticleCard key={a.id} article={a} i={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA — Final dark luxury ═══ */}
      <section className="relative overflow-hidden py-32 px-6" style={{ background: "#060e1e" }}>
        {/* Background word */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="font-black text-white select-none"
            style={{ fontSize: "clamp(8rem, 25vw, 22rem)", opacity: 0.025, letterSpacing: "-0.06em", fontFamily: "'Sora', sans-serif" }}>
            {t("VISION", "رؤية")}
          </span>
        </div>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(37,99,235,0.1), transparent)" }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center mb-8">
              <div className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={logoImg} alt="m-aldbani" className="h-16 w-auto object-contain" />
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">
              {t("Let's Work Together", "لنعمل معاً")}
            </p>

            <h2 className="font-black text-white font-heading mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
              {t("Ready to Transform\nYour Business?", "جاهز لتحويل\nأعمالك؟")}
            </h2>

            <p className="text-slate-400 mb-10 leading-relaxed">
              {t(
                "Book a free consultation and let's craft a strategy that delivers measurable results.",
                "احجز استشارة مجانية ولنضع استراتيجية تحقق نتائج ملموسة."
              )}
            </p>

            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full font-bold text-white text-base"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  boxShadow: "0 12px 40px rgba(37,99,235,0.5)",
                }}
              >
                <Sparkles size={16} />
                {t("Book Free Consultation", "احجز استشارة مجانية")}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
