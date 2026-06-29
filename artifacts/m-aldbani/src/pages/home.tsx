import {
  motion, useInView, useScroll, useTransform, useSpring, useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

/* ── MAGNETIC BUTTON ───────────────────────────────────────── */
function MagBtn({ children, href, className, style }: {
  children: React.ReactNode; href?: string;
  className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.28);
    my.set((e.clientY - r.top - r.height / 2) * 0.28);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  const btn = (
    <motion.button ref={ref} style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </motion.button>
  );
  return href ? <Link href={href}>{btn}</Link> : btn;
}

/* ── FADE IN ───────────────────────────────────────────────── */
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

/* ── COUNTER ───────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const s = Date.now();
    const t = () => {
      const p = Math.min((Date.now() - s) / 1600, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(t);
    };
    requestAnimationFrame(t);
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ── SKILL BAR ─────────────────────────────────────────────── */
function SkillBar({ label, pct, color = "#B8860B" }: { label: string; pct: number; color?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { language } = useLanguage();
  const isRTL = language === "ar";
  return (
    <div ref={ref}>
      {/* Label row — swap order in RTL so label stays near its end */}
      <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        <span className="text-sm font-semibold" style={{ color: "#3D2B0F" }}>{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
      </div>
      {/* Track: always LTR so scaleX origin is predictable */}
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "#E8DDD0", direction: "ltr" }}>
        <motion.div
          className="h-full w-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, #D4A017)`,
            transformOrigin: isRTL ? "right center" : "left center",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? pct / 100 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

/* ── GEOMETRIC DIVIDER ─────────────────────────────────────── */
function GeoDivider({ flip = false, color = "#B8860B" }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 1200 32" preserveAspectRatio="none"
      style={{ transform: flip ? "rotate(180deg)" : "none" }}>
      {Array.from({ length: 30 }, (_, i) => (
        <polygon key={i}
          points={`${40 * i + 20},4 ${40 * i + 40},16 ${40 * i + 20},28 ${40 * i},16`}
          fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLanguage();
  const settings = useSiteSettings();

  const heroBg     = settings.heroBgColor          || "#0A1628";
  const heroGold   = settings.heroAccentColor      || "#B8860B";
  const heroGoldLt = settings.heroAccentLightColor || "#D4A017";
  const heroShowPhoto  = settings.heroShowPhoto !== false;
  const heroPhotoSrc   = settings.heroPhotoUrl || photoPath;
  const heroShowBadge  = settings.heroShowFloatingBadge !== false;

  const lightBg = settings.lightSectionBgColor  || "#FAF6EF";
  const darkBg  = settings.darkSectionBgColor   || "#0A1628";
  const sGold   = settings.accentGoldColor      || "#B8860B";
  const sGoldLt = settings.accentGoldLightColor || "#D4A017";

  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(heroP, [0, 1], [0, -70]);
  const textY  = useTransform(heroP, [0, 1], [0, 38]);

  return (
    <RootLayout>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden"
        style={{ background: heroBg, minHeight: "92vh" }}>

        <div className="absolute inset-y-0 right-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ width: "55%" }}>
          <span className="font-heading font-black leading-none"
            style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: "clamp(220px, 32vw, 380px)",
              color: heroGold, opacity: 0.04, letterSpacing: "-10px", userSelect: "none" }}>
            الدباني
          </span>
        </div>

        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, transparent, ${heroGold}, transparent)` }} />
        <div className="absolute top-0 right-0 w-[40%] h-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 100% 30%, rgba(184,134,11,0.08) 0%, transparent 60%)` }} />

        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] items-center gap-0"
            style={{ minHeight: "92vh" }}>

            {/* TEXT */}
            <motion.div style={{ y: textY }} className="py-20 lg:py-0 lg:pr-16 order-2 lg:order-1 relative z-10">

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="mb-10 inline-flex rounded-xl bg-white px-3 py-2"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                <img src={logoPath} alt="m-aldbani" className="h-8 w-auto object-contain"
                  style={{ mixBlendMode: "multiply" }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 flex-shrink-0" style={{ background: heroGold }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: heroGold }}>
                  {t(settings.heroBadgeEn, settings.heroBadgeAr)}
                </p>
              </motion.div>

              <div className="mb-6">
                <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading font-black text-white leading-[0.92] tracking-tight"
                  style={{ fontSize: "clamp(52px, 7.5vw, 92px)" }}>
                  {t(settings.heroTitleEn, settings.heroTitleAr)}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                  className="font-heading font-bold mt-3"
                  style={{ fontSize: "clamp(18px, 2.5vw, 28px)", color: heroGold, opacity: 1,
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif", letterSpacing: "0.02em" }}>
                  {t(settings.heroTitleAr, settings.heroTitleEn)}
                </motion.p>
              </div>

              <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.52, duration: 0.6 }}
                className="h-[2px] w-16 rounded-full mb-7"
                style={{ background: `linear-gradient(90deg, ${heroGold}, ${heroGoldLt}, transparent)` }} />

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.6 }}
                className="leading-relaxed mb-9 max-w-[400px] text-base"
                style={{ color: "rgba(240,220,180,0.65)" }}>
                {t(settings.heroSubtitleEn, settings.heroSubtitleAr)}
              </motion.p>

              {settings.heroStats.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.6 }}
                  className="mb-9 overflow-hidden rounded-xl border"
                  style={{ display: "grid", gridTemplateColumns: `repeat(${settings.heroStats.length}, 1fr)`,
                    borderColor: `${heroGold}25`, background: `${heroGold}08` }}>
                  {settings.heroStats.map((st, i) => (
                    <div key={i} className="flex flex-col items-center py-4 px-1"
                      style={{ borderRight: i < settings.heroStats.length - 1 ? `1px solid ${heroGold}20` : "none" }}>
                      <span className="text-2xl font-black font-heading" style={{ color: heroGoldLt }}>{st.value}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                        style={{ color: `${heroGold}70` }}>
                        {t(st.labelEn, st.labelAr)}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.76, duration: 0.55 }}
                className="flex flex-wrap gap-3 mb-9">
                <MagBtn href="/book"
                  className="font-bold text-sm cursor-pointer rounded-xl px-8 transition-opacity hover:opacity-90"
                  style={{ height: 52, background: `linear-gradient(135deg, ${heroGold}, ${heroGoldLt})`, color: heroBg }}>
                  {t("Book a Consultation", "احجز استشارة")}
                </MagBtn>
                <MagBtn href="/about"
                  className="font-bold text-sm cursor-pointer rounded-xl px-8 border transition-colors hover:border-amber-400 hover:text-amber-300"
                  style={{ height: 52, borderColor: `${heroGold}40`, color: "rgba(240,220,180,0.75)" }}>
                  {t("My Profile", "ملفي الشخصي")}
                </MagBtn>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-xs" style={{ color: `${heroGold}60` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                {t("Available · Riyadh, Saudi Arabia 🇸🇦", "متاح · الرياض، المملكة العربية السعودية 🇸🇦")}
              </motion.div>
            </motion.div>

            {/* PHOTO */}
            {heroShowPhoto && (
              <motion.div style={{ y: photoY, alignSelf: "stretch" }}
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex flex-col items-end justify-end order-1 lg:order-2 h-full relative">
                <div className="relative w-full h-full flex flex-col justify-end" style={{ minHeight: "92vh" }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={heroPhotoSrc} alt="Mohammed Al-Dabbani"
                      className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `linear-gradient(to right, ${heroBg} 0%, ${heroBg}80 15%, transparent 45%)` }} />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `linear-gradient(to top, ${heroBg} 0%, ${heroBg}40 20%, transparent 50%)` }} />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at center, rgba(184,134,11,0.06) 0%, transparent 70%)` }} />
                  </div>
                  <div className="relative z-10 p-8 pb-10">
                    <div className="inline-flex flex-col border-l-2 pl-4" style={{ borderColor: heroGold }}>
                      <span className="font-bold text-white text-base leading-tight">
                        {t(settings.heroTitleEn, settings.heroTitleAr)}
                      </span>
                      <span className="text-xs mt-1" style={{ color: `${heroGoldLt}90` }}>
                        {t(settings.heroBadgeEn, settings.heroBadgeAr)}
                      </span>
                    </div>
                  </div>
                  {heroShowBadge && (
                    <motion.div animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-12 right-4 z-20 rounded-2xl px-4 py-3 border"
                      style={{ background: "rgba(10,22,40,0.92)", borderColor: `${heroGold}30`,
                        backdropFilter: "blur(12px)", boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${heroGold}15` }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{settings.heroFloatingBadgeEmoji}</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {t(settings.heroFloatingBadgeTitleEn, settings.heroFloatingBadgeTitleAr)}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: `${heroGold}80` }}>
                            {t(settings.heroFloatingBadgeSubtitleEn, settings.heroFloatingBadgeSubtitleAr)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${heroGold}50, transparent)` }} />
      </section>

      {/* ════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════ */}
      {settings.showMarquee !== false && settings.marqueeItems.length > 0 && (
        <>
          <div style={{ background: lightBg, paddingTop: 8, paddingBottom: 8 }}>
            <GeoDivider color={sGold} />
          </div>
          <div style={{ background: lightBg, borderBottom: `1px solid ${sGold}25` }} className="overflow-hidden py-3.5">
            <motion.div animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 whitespace-nowrap w-max">
              {[...Array(2)].map((_, rep) =>
                settings.marqueeItems.map((item, i) => (
                  <span key={`${rep}-${i}`}
                    className="text-[11px] font-bold uppercase tracking-[0.28em] flex items-center gap-12"
                    style={{ color: `${sGold}70` }}>
                    {t(item.en, item.ar)}
                    <span style={{ color: `${sGold}40` }}>◇</span>
                  </span>
                ))
              )}
            </motion.div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════
          EXPERTISE + SKILLS
      ════════════════════════════════════════════ */}
      {(settings.showExpertise !== false || settings.showSkills !== false) && (
        <section className="py-24" style={{ background: lightBg }}>
          <div className="container mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-20 items-start">

              {/* Expertise */}
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
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 280, damping: 26 }}
                          className="group flex gap-5 p-6 rounded-2xl border cursor-default transition-all duration-300"
                          style={{ background: "white", borderColor: `${sGold}20` }}
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

              {/* Skills */}
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
        <>
          <div style={{ background: darkBg, paddingTop: 8, paddingBottom: 8 }}>
            <GeoDivider flip color={sGold} />
          </div>
          <section className="py-24 relative overflow-hidden" style={{ background: darkBg }}>
            <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
              style={{ background: `radial-gradient(circle at 0% 0%, ${sGold}0a, transparent 60%)` }} />
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
                  <p className="text-sm leading-relaxed mb-8"
                    style={{ color: "rgba(240,220,180,0.45)" }}>
                    {t(
                      "A steady progression through operations and brand leadership across the Kingdom.",
                      "تقدم متواصل في العمليات وقيادة العلامات في المملكة."
                    )}
                  </p>
                  <Link href="/about">
                    <motion.button whileHover={{ x: 5 }} className="text-sm font-bold" style={{ color: sGoldLt }}>
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
        </>
      )}

      {/* ════════════════════════════════════════════
          FEATURED PROJECT
      ════════════════════════════════════════════ */}
      {settings.showFeaturedProject !== false && (
        <section className="py-28 relative overflow-hidden" style={{ background: darkBg }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${sGold}50, transparent)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${sGold}30, transparent)` }} />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
              style={{ background: `radial-gradient(circle, ${sGold}, transparent 70%)` }} />
            <div className="absolute -bottom-20 right-0 select-none"
              style={{ fontSize: 280, fontWeight: 900, lineHeight: 1, color: sGold, opacity: 0.03, letterSpacing: -8 }}>
              {settings.featuredEmoji}
            </div>
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
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)` }}>
                  <div className="absolute top-0 left-10 right-10 h-[1px]"
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

                  <p className="text-base leading-relaxed mb-10 max-w-lg"
                    style={{ color: "rgba(240,220,170,0.6)" }}>
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
                  {settings.featuredImageUrl ? (
                    <img src={settings.featuredImageUrl} alt={settings.featuredTitleEn}
                      className="w-full h-full object-cover rounded-xl" style={{ maxHeight: 280 }} />
                  ) : (
                    <motion.div animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-[120px] leading-none mb-6 select-none"
                      style={{ filter: `drop-shadow(0 20px 40px ${sGold}30)` }}>
                      {settings.featuredEmoji}
                    </motion.div>
                  )}

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
          PORTFOLIO ON HOME (optional)
      ════════════════════════════════════════════ */}
      {settings.showPortfolioOnHome === true && (
        <section className="py-16" style={{ background: lightBg }}>
          <div className="container mx-auto px-8 lg:px-16 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: sGold }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: sGold }}>
                  {t("Selected Works", "الأعمال المختارة")}
                </p>
                <div className="h-px w-8" style={{ background: sGold }} />
              </div>
              <Link href="/portfolio">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-sm mt-4"
                  style={{ background: `linear-gradient(135deg, ${sGold}, ${sGoldLt})`, color: darkBg }}>
                  {t("View Full Portfolio →", "← عرض كامل الأعمال")}
                </motion.button>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          CONTACT CTA
      ════════════════════════════════════════════ */}
      {settings.showContact !== false && (
        <section className="py-24 relative overflow-hidden" style={{ background: darkBg }}>
          <div className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${sGold}40, transparent)` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${sGold}08, transparent 65%)` }} />

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
                        {t(settings.address, settings.address)}
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
                      <img src={logoPath} alt="md" className="h-8 w-auto object-contain"
                        style={{ mixBlendMode: "multiply" }} />
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
                      <MagBtn href="/book"
                        className="w-full font-bold text-sm cursor-pointer rounded-xl hover:opacity-90 transition-opacity"
                        style={{ height: 48, background: `linear-gradient(135deg, ${sGold}, ${sGoldLt})`, color: darkBg }}>
                        {t("Book a Consultation", "احجز استشارة")}
                      </MagBtn>
                      <MagBtn href="/contact"
                        className="w-full font-bold text-sm cursor-pointer rounded-xl border transition-colors hover:border-amber-400"
                        style={{ height: 48, borderColor: `${sGold}30`, color: "rgba(240,220,180,0.7)" }}>
                        {t("Send a Message", "أرسل رسالة")}
                      </MagBtn>
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
