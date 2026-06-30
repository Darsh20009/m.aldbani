import {
  motion, useInView, useScroll, useTransform, AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";

/* ── ANIMATED MESH BACKGROUND ──────────────────────────────── */
function MeshBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base dark gradient */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #060d1a 0%, #0a1628 40%, #0d1f3c 100%)" }} />
      {/* Orb 1 — blue */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: 700, height: 700, top: "-15%", left: "-10%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)",
        }}
      />
      {/* Orb 2 — gold */}
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, top: "10%", right: "-8%",
          background: "radial-gradient(circle, rgba(184,134,11,0.12) 0%, transparent 65%)",
        }}
      />
      {/* Orb 3 — violet */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 50, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, bottom: "5%", left: "30%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
        }}
      />
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
    </div>
  );
}

/* ── FLOATING STAT CARD ────────────────────────────────────── */
function FloatCard({ value, label, delay = 0, className = "" }: {
  value: string; label: string; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -3 }}
      className={`rounded-2xl px-5 py-4 backdrop-blur-xl border border-white/10 ${className}`}
      style={{ background: "rgba(255,255,255,0.05)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-[11px] font-semibold mt-1.5 uppercase tracking-widest" style={{ color: "rgba(240,220,180,0.55)" }}>{label}</p>
    </motion.div>
  );
}

/* ── REVEAL ─────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "", dir = "up" as "up" | "left" | "right" }) {
  const init = dir === "left" ? { opacity: 0, x: -32 }
    : dir === "right" ? { opacity: 0, x: 32 }
      : { opacity: 0, y: 28 };
  return (
    <motion.div initial={init} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ── COUNTER ────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - s) / 1600, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ── SKILL BAR ──────────────────────────────────────────────── */
function SkillBar({ label, pct, color = "#B8860B" }: { label: string; pct: number; color?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: "#3D2B0F" }}>{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "#E8DDD0", direction: "ltr" }}>
        <motion.div
          className="h-full w-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, #D4A017)`, transformOrigin: "left center" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? pct / 100 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const isRTL = language === "ar";

  const heroGold   = settings.heroAccentColor      || "#B8860B";
  const heroGoldLt = settings.heroAccentLightColor || "#D4A017";
  const heroBg     = settings.heroBgColor          || "#0A1628";

  const lightBg = settings.lightSectionBgColor  || "#FAF6EF";
  const darkBg  = settings.darkSectionBgColor   || "#0A1628";
  const sGold   = settings.accentGoldColor      || "#B8860B";
  const sGoldLt = settings.accentGoldLightColor || "#D4A017";

  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(heroP, [0, 1], [0, 60]);

  const words = t("Mohammed Al-Dabbani", "محمد الدباني").split(" ");

  return (
    <RootLayout>

      {/* ════════════════════════════════════════════
          HERO — Full-width, no photo
      ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100svh", paddingTop: 72 }}>

        <MeshBg />

        {/* Top line accent */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${heroGold}60, transparent)` }} />

        <motion.div style={{ y: textY }}
          className="relative z-10 container mx-auto px-6 lg:px-16 flex flex-col items-center text-center py-20">

          {/* Logo pill */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 inline-flex items-center gap-3 rounded-2xl px-4 py-2 border"
            style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
          >
            <div className="rounded-lg bg-white px-1.5 py-1">
              <img src={logoPath} alt="m-aldbani" className="h-6 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
            </div>
            <div className="w-px h-5" style={{ background: `${heroGold}40` }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: `${heroGold}90` }}>
              {t(settings.heroBadgeEn, settings.heroBadgeAr)}
            </span>
          </motion.div>

          {/* Big heading */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-heading font-black text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(52px, 9vw, 108px)" }}
            >
              {t(settings.heroTitleEn, settings.heroTitleAr)}
            </motion.h1>
          </div>

          {/* Arabic subtitle */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-bold mb-8"
            style={{
              fontSize: "clamp(20px, 3vw, 34px)",
              background: `linear-gradient(135deg, ${heroGold}, ${heroGoldLt})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
          >
            {t(settings.heroTitleAr, settings.heroTitleEn)}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.48, duration: 0.7 }}
            className="h-px w-24 mb-8"
            style={{ background: `linear-gradient(90deg, transparent, ${heroGold}, transparent)` }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65 }}
            className="leading-relaxed mb-10 max-w-2xl text-base md:text-lg"
            style={{ color: "rgba(240,220,180,0.55)" }}
          >
            {t(settings.heroSubtitleEn, settings.heroSubtitleAr)}
          </motion.p>

          {/* Stat pills row */}
          {settings.heroStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {settings.heroStats.map((st, i) => (
                <FloatCard
                  key={i}
                  value={st.value}
                  label={t(st.labelEn, st.labelAr)}
                  delay={0.64 + i * 0.08}
                />
              ))}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.55 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${heroGold}50` }}
                whileTap={{ scale: 0.97 }}
                className="font-bold text-sm cursor-pointer rounded-2xl px-8 transition-all duration-300"
                style={{ height: 52, background: `linear-gradient(135deg, ${heroGold}, ${heroGoldLt})`, color: heroBg, boxShadow: `0 0 24px ${heroGold}30` }}
              >
                {t("Book a Consultation", "احجز استشارة")}
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.97 }}
                className="font-bold text-sm cursor-pointer rounded-2xl px-8 border transition-all duration-300"
                style={{ height: 52, borderColor: "rgba(255,255,255,0.15)", color: "rgba(240,220,180,0.75)", background: "rgba(255,255,255,0.04)" }}
              >
                {t("My Profile", "ملفي الشخصي")}
              </motion.button>
            </Link>
          </motion.div>

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.92 }}
            className="flex items-center gap-2 text-xs"
            style={{ color: `${heroGold}55` }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {t("Available · Riyadh, Saudi Arabia 🇸🇦", "متاح · الرياض، المملكة العربية السعودية 🇸🇦")}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: `${heroGold}40` }}>
            {t("Scroll", "انتقل للأسفل")}
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 rounded-full"
            style={{ background: `linear-gradient(to bottom, ${heroGold}60, transparent)` }}
          />
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #0A1628)" }} />
      </section>

      {/* ════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════ */}
      {settings.showMarquee !== false && settings.marqueeItems.length > 0 && (
        <div style={{ background: lightBg, borderBottom: `1px solid ${sGold}20` }} className="overflow-hidden py-4">
          <motion.div animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap w-max">
            {[...Array(2)].map((_, rep) =>
              settings.marqueeItems.map((item, i) => (
                <span key={`${rep}-${i}`}
                  className="text-[11px] font-bold uppercase tracking-[0.28em] flex items-center gap-12"
                  style={{ color: `${sGold}60` }}>
                  {t(item.en, item.ar)}
                  <span style={{ color: `${sGold}30` }}>◆</span>
                </span>
              ))
            )}
          </motion.div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          EXPERTISE + SKILLS
      ════════════════════════════════════════════ */}
      {(settings.showExpertise !== false || settings.showSkills !== false) && (
        <section className="py-28" style={{ background: lightBg }}>
          <div className="container mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-20 items-start">

              {settings.showExpertise !== false && settings.expertiseItems.length > 0 && (
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px w-8" style={{ background: sGold }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                        {t("Core Expertise", "التخصصات الأساسية")}
                      </p>
                    </div>
                    <h2 className="text-3xl md:text-[44px] font-black font-heading leading-tight mb-10"
                      style={{ color: darkBg }}>
                      {t("What I bring\nto every project", "ما أحضره\nلكل مشروع")}
                    </h2>
                  </Reveal>
                  <div className="space-y-4">
                    {settings.expertiseItems.map((p, i) => (
                      <Reveal key={i} delay={i * 0.08}>
                        <motion.div
                          whileHover={{ x: isRTL ? -6 : 6 }}
                          transition={{ type: "spring", stiffness: 280, damping: 26 }}
                          className="group flex gap-5 p-6 rounded-2xl border cursor-default transition-all duration-300 bg-white"
                          style={{ borderColor: `${sGold}20` }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${sGold}60`;
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${sGold}15`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${sGold}20`;
                            (e.currentTarget as HTMLElement).style.boxShadow = "";
                          }}>
                          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: `${sGold}12` }}>
                            {p.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className="font-bold text-base" style={{ color: darkBg }}>
                                {t(p.titleEn, p.titleAr)}
                              </h3>
                              <span className="text-[10px] font-mono font-bold" style={{ color: `${sGold}50` }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "#6B5A3E" }}>
                              {t(p.descEn, p.descAr)}
                            </p>
                            <div className="mt-3 h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-500"
                              style={{ background: `linear-gradient(90deg, ${sGold}, transparent)` }} />
                          </div>
                        </motion.div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {settings.showSkills !== false && settings.skillItems.length > 0 && (
                <div>
                  <Reveal dir="right">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px w-8" style={{ background: sGold }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                        {t("Skill Proficiency", "مستوى المهارات")}
                      </p>
                    </div>
                    <h2 className="text-3xl md:text-[44px] font-black font-heading leading-tight mb-10"
                      style={{ color: darkBg }}>
                      {t("Technical\nCompetencies", "الكفاءات\nالتقنية")}
                    </h2>
                  </Reveal>
                  <Reveal dir="right" delay={0.1}>
                    <div className="space-y-5">
                      {settings.skillItems.map((sk, i) => (
                        <SkillBar key={i} label={t(sk.labelEn, sk.labelAr) as string} pct={sk.pct} color={sGold} />
                      ))}
                    </div>
                  </Reveal>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          CAREER TIMELINE
      ════════════════════════════════════════════ */}
      {settings.showCareer !== false && settings.careerItems.length > 0 && (
        <section className="py-28 relative overflow-hidden" style={{ background: darkBg }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[500px] h-[500px]"
              style={{ background: `radial-gradient(circle at 0% 0%, ${sGold}0a, transparent 60%)` }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px]"
              style={{ background: `radial-gradient(circle at 100% 100%, rgba(37,99,235,0.08), transparent 60%)` }} />
          </div>
          <div className="container mx-auto px-8 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
              <Reveal dir="left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: sGold }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                    {t("Professional History", "التاريخ المهني")}
                  </p>
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-5 leading-tight">
                  {t(`${settings.experienceYears} Years of\nLeadership`, `${settings.experienceYears} سنوات\nمن القيادة`)}
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(240,220,180,0.45)" }}>
                  {t(
                    "A steady progression through operations and brand leadership across the Kingdom.",
                    "تقدم متواصل في العمليات وقيادة العلامات في المملكة."
                  )}
                </p>
                <Link href="/about">
                  <motion.button whileHover={{ x: isRTL ? -5 : 5 }} className="text-sm font-bold" style={{ color: sGoldLt }}>
                    {t("Full Biography →", "السيرة الكاملة ←")}
                  </motion.button>
                </Link>
              </Reveal>

              <div className="relative pl-6">
                <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                  style={{ background: `linear-gradient(to bottom, ${sGold}, ${sGold}30)` }} />
                <div className="space-y-4">
                  {settings.careerItems.map((item, i) => (
                    <Reveal key={i} delay={i * 0.09}>
                      <div className="relative flex items-start gap-5">
                        <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full border-2"
                          style={{ background: item.current ? sGoldLt : darkBg, borderColor: item.current ? sGoldLt : `${sGold}50` }} />
                        <motion.div whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 280, damping: 26 }}
                          className="flex-1 p-5 rounded-xl border cursor-default transition-all duration-300"
                          style={{ background: `${sGold}06`, borderColor: `${sGold}18` }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${sGold}40`;
                            (e.currentTarget as HTMLElement).style.background = `${sGold}0e`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${sGold}18`;
                            (e.currentTarget as HTMLElement).style.background = `${sGold}06`;
                          }}>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <p className="font-bold text-white text-sm">{t(item.titleEn, item.titleAr)}</p>
                            <span className="text-xs font-mono" style={{ color: `${sGold}60` }}>{item.year}</span>
                          </div>
                          <p className="text-xs" style={{ color: `${sGold}55` }}>{item.org}</p>
                          {item.current && (
                            <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                              style={{ background: `${sGold}15`, color: sGoldLt, border: `1px solid ${sGold}30` }}>
                              <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: sGoldLt }} />
                              {t("Current Position", "المنصب الحالي")}
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          FEATURED PROJECT
      ════════════════════════════════════════════ */}
      {settings.showFeaturedProject !== false && (
        <section className="py-28 relative overflow-hidden" style={{ background: darkBg }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${sGold}50, transparent)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${sGold}30, transparent)` }} />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
              style={{ background: `radial-gradient(circle, ${sGold}, transparent 70%)` }} />
          </div>

          <div className="container mx-auto px-8 lg:px-16 relative z-10">
            <Reveal className="mb-16">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: sGold }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                  {t(settings.featuredSubtitleEn, settings.featuredSubtitleAr)}
                </p>
              </div>
              <h2 className="text-4xl md:text-[52px] font-black font-heading leading-tight text-white">
                {t(settings.featuredTitleEn, settings.featuredTitleAr)}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid lg:grid-cols-[1fr_380px] gap-0 rounded-3xl overflow-hidden"
                style={{ border: `1px solid ${sGold}25`, boxShadow: `0 24px 80px rgba(0,0,0,0.5)` }}>
                <div className="p-10 md:p-14 relative"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" }}>
                  <div className="absolute top-0 left-10 right-10 h-px"
                    style={{ background: `linear-gradient(90deg, ${sGold}, transparent)` }} />
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                      style={{ background: `${sGold}20`, color: sGold, border: `1px solid ${sGold}35` }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {t(settings.featuredRoleEn, settings.featuredRoleAr)}
                    </span>
                    <span className="text-xs font-mono" style={{ color: `${sGold}80` }}>
                      {t(settings.featuredDateEn, settings.featuredDateAr)}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black font-heading mb-5 text-white leading-tight">
                    {t(settings.featuredTitleEn, settings.featuredTitleAr)}
                  </h3>
                  <p className="text-base leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(240,220,170,0.6)" }}>
                    {t(settings.featuredDescEn, settings.featuredDescAr)}
                  </p>
                  {settings.featuredTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                      {settings.featuredTags.map(tag => (
                        <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,220,170,0.75)", border: `1px solid ${sGold}20` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href="/portfolio">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-sm"
                      style={{ background: `linear-gradient(135deg, ${sGold}, ${sGoldLt})`, color: darkBg }}>
                      {t("View Full Portfolio →", "← عرض الأعمال الكاملة")}
                    </motion.button>
                  </Link>
                </div>

                <div className="relative flex flex-col items-center justify-center p-10 lg:border-l"
                  style={{ background: `linear-gradient(160deg, ${sGold}14 0%, rgba(10,22,40,0.6) 100%)`, borderColor: `${sGold}15` }}>
                  <motion.div animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[120px] leading-none mb-6 select-none"
                    style={{ filter: `drop-shadow(0 20px 40px ${sGold}30)` }}>
                    {settings.featuredEmoji}
                  </motion.div>
                  {settings.featuredStats.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 w-full max-w-[280px] mt-4">
                      {settings.featuredStats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
                          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${sGold}15` }}>
                          <span className="text-xl font-black" style={{ color: sGold }}>{s.num}</span>
                          <span className="text-[10px] font-semibold mt-0.5" style={{ color: "rgba(240,220,170,0.5)" }}>
                            {t(s.labelEn, s.labelAr)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          CONTACT CTA
      ════════════════════════════════════════════ */}
      {settings.showContact !== false && (
        <section className="py-28 relative overflow-hidden" style={{ background: darkBg }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${sGold}40, transparent)` }} />
            <div className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 100%, ${sGold}08, transparent 65%)` }} />
          </div>

          <div className="container mx-auto px-8 lg:px-16 max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <Reveal dir="left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: sGold }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                    {t("Let's Work Together", "لنتعاون معاً")}
                  </p>
                </div>
                <h2 className="text-3xl md:text-[44px] font-black font-heading text-white leading-tight mb-5">
                  {t("Ready to elevate\nyour brand?", "هل أنت مستعد\nللارتقاء بعلامتك؟")}
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(240,220,180,0.5)" }}>
                  {t(
                    "Strategic consulting, brand development, and operational leadership — available for serious engagements.",
                    "استشارة استراتيجية وتطوير علامة وقيادة تشغيلية — متاح للتعاونات الجادة."
                  )}
                </p>
                <div className="space-y-4 text-sm">
                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-4 group">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl text-base flex-shrink-0 border transition-all duration-300 group-hover:border-amber-500"
                        style={{ background: `${sGold}10`, borderColor: `${sGold}25` }}>📧</span>
                      <span className="font-medium text-white/70 group-hover:text-amber-300 transition-colors">{settings.email}</span>
                    </a>
                  )}
                  {settings.phone && (
                    <a href={`tel:${settings.phone}`} className="flex items-center gap-4 group">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl text-base flex-shrink-0 border transition-all duration-300 group-hover:border-amber-500"
                        style={{ background: `${sGold}10`, borderColor: `${sGold}25` }}>📱</span>
                      <span className="font-medium text-white/70 group-hover:text-amber-300 transition-colors">{settings.phone}</span>
                    </a>
                  )}
                  {settings.address && (
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl text-base flex-shrink-0 border"
                        style={{ background: `${sGold}10`, borderColor: `${sGold}25` }}>📍</span>
                      <span className="font-medium" style={{ color: "rgba(240,220,180,0.45)" }}>
                        {settings.address}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal dir="right" delay={0.12}>
                <div className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: `${sGold}25`, boxShadow: `0 8px 40px rgba(0,0,0,0.3)` }}>
                  <div className="px-8 py-6" style={{ background: `${sGold}12`, borderBottom: `1px solid ${sGold}20` }}>
                    <div className="inline-flex rounded-lg bg-white px-3 py-2">
                      <img src={logoPath} alt="md" className="h-8 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
                    </div>
                  </div>
                  <div className="px-8 py-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-sm leading-relaxed mb-2 italic" style={{ color: "rgba(240,220,180,0.6)" }}>
                      {t(
                        "\"Experience, innovation, and impact — the standard I hold every project to.\"",
                        "«الخبرة والابتكار والأثر — المعيار الذي أحكم به على كل مشروع.»"
                      )}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: `${sGold}55` }}>
                      — {t(settings.siteNameEn, settings.siteNameAr)}
                    </p>
                    <div className="flex flex-col gap-3">
                      <Link href="/book">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className="w-full font-bold text-sm cursor-pointer rounded-xl hover:opacity-90 transition-opacity"
                          style={{ height: 48, background: `linear-gradient(135deg, ${sGold}, ${sGoldLt})`, color: darkBg }}>
                          {t("Book a Consultation", "احجز استشارة")}
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.06)" }} whileTap={{ scale: 0.97 }}
                          className="w-full font-bold text-sm cursor-pointer rounded-xl border transition-all duration-200"
                          style={{ height: 48, borderColor: `${sGold}30`, color: "rgba(240,220,180,0.7)", background: "transparent" }}>
                          {t("Send a Message", "أرسل رسالة")}
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

    </RootLayout>
  );
}
