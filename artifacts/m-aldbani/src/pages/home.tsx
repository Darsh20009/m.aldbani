import {
  motion, useInView, useScroll, useTransform, useSpring, useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

/* ── GOLD + CREAM PALETTE ──────────────────────────────── */
const GOLD    = "#B8860B";
const GOLD_LT = "#D4A017";
const NAVY    = "#0A1628";
const CREAM   = "#FAF6EF";
const WARM    = "#F0E9DC";

/* ── MAGNETIC BUTTON ───────────────────────────────────── */
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

/* ── FADE IN ───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "", dir = "up" as "up"|"left"|"right" }) {
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

/* ── COUNTER ───────────────────────────────────────────── */
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

/* ── SKILL BAR ─────────────────────────────────────────── */
function SkillBar({ label, pct, color = GOLD }: { label: string; pct: number; color?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-semibold" style={{ color: "#3D2B0F" }}>{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: "#E8DDD0" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${GOLD_LT})` }} />
      </div>
    </div>
  );
}

/* ── GEOMETRIC DIVIDER SVG ─────────────────────────────── */
function GeoDivider({ flip = false }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 1200 32" preserveAspectRatio="none"
      style={{ transform: flip ? "rotate(180deg)" : "none" }}>
      {/* a row of small diamonds */}
      {Array.from({ length: 30 }, (_, i) => (
        <polygon key={i}
          points={`${40 * i + 20},4 ${40 * i + 40},16 ${40 * i + 20},28 ${40 * i},16`}
          fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.35" />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLanguage();

  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(heroP, [0, 1], [0, -70]);
  const textY  = useTransform(heroP, [0, 1], [0,  38]);

  return (
    <RootLayout>

      {/* ════════════════════════════════════════════
          HERO — full dark navy, warm Arab identity
      ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden"
        style={{ background: NAVY, minHeight: "92vh" }}>

        {/* Arabic watermark — design element, NOT text */}
        <div className="absolute inset-y-0 right-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ width: "55%" }}>
          <span className="font-heading font-black leading-none"
            style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              fontSize: "clamp(220px, 32vw, 380px)",
              color: GOLD,
              opacity: 0.04,
              letterSpacing: "-10px",
              userSelect: "none",
            }}>
            الدباني
          </span>
        </div>

        {/* top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        {/* glow */}
        <div className="absolute top-0 right-0 w-[40%] h-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 100% 30%, rgba(184,134,11,0.08) 0%, transparent 60%)` }} />

        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] items-center gap-0"
            style={{ minHeight: "92vh" }}>

            {/* TEXT */}
            <motion.div style={{ y: textY }} className="py-20 lg:py-0 lg:pr-16 order-2 lg:order-1 relative z-10">

              {/* logo */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="mb-10 inline-flex rounded-xl bg-white px-3 py-2"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
                <img src={logoPath} alt="m-aldbani" className="h-8 w-auto object-contain"
                  style={{ mixBlendMode: "multiply" }} />
              </motion.div>

              {/* label */}
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 flex-shrink-0" style={{ background: GOLD }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.35em]"
                  style={{ color: GOLD }}>
                  {t("Brand Manager · Business Development", "مدير علامة تجارية · تطوير أعمال")}
                </p>
              </motion.div>

              {/* Big name — English + Arabic stacked */}
              <div className="mb-6">
                <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading font-black text-white leading-[0.92] tracking-tight"
                  style={{ fontSize: "clamp(52px, 7.5vw, 92px)" }}>
                  {t("Mohammed\nAl-Dabbani", "محمد\nالدباني")}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="font-heading font-bold mt-3"
                  style={{
                    fontSize: "clamp(18px, 2.5vw, 28px)",
                    color: GOLD, opacity: 1,
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    letterSpacing: "0.02em",
                  }}>
                  {t("محمد الدباني", "Mohammed Al-Dabbani")}
                </motion.p>
              </div>

              {/* gold separator */}
              <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.52, duration: 0.6 }}
                className="h-[2px] w-16 rounded-full mb-7"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LT}, transparent)` }} />

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.6 }}
                className="leading-relaxed mb-9 max-w-[400px] text-base"
                style={{ color: "rgba(240,220,180,0.65)" }}>
                {t(
                  "8+ years leading F&B brands and operations across the Kingdom — from vision to full commercial execution.",
                  "أكثر من 8 سنوات في قيادة علامات F&B والعمليات في المملكة — من الرؤية إلى التنفيذ التجاري الكامل."
                )}
              </motion.p>

              {/* Stats — gold accent */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="grid grid-cols-4 mb-9 overflow-hidden rounded-xl border"
                style={{ borderColor: `${GOLD}25`, background: `${GOLD}08` }}>
                {[
                  { n: 8,  s: "+", en: "Years",     ar: "سنوات" },
                  { n: 50, s: "+", en: "Brands",     ar: "علامة" },
                  { n: 2,  s: "M+",en: "Customers",  ar: "عميل" },
                  { n: 3,  s: "",  en: "Industries", ar: "قطاعات" },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center py-4 px-1"
                    style={{ borderRight: i < 3 ? `1px solid ${GOLD}20` : "none" }}>
                    <span className="text-2xl font-black font-heading" style={{ color: GOLD_LT }}>
                      <CountUp to={st.n} suffix={st.s} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: "rgba(212,160,23,0.5)" }}>
                      {t(st.en, st.ar)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.76, duration: 0.55 }}
                className="flex flex-wrap gap-3 mb-9">
                <MagBtn href="/book"
                  className="font-bold text-sm cursor-pointer rounded-xl px-8 transition-opacity hover:opacity-90"
                  style={{ height: 52, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LT})`, color: NAVY }}>
                  {t("Book a Consultation", "احجز استشارة")}
                </MagBtn>
                <MagBtn href="/about"
                  className="font-bold text-sm cursor-pointer rounded-xl px-8 border transition-colors hover:border-amber-400 hover:text-amber-300"
                  style={{ height: 52, borderColor: `${GOLD}40`, color: "rgba(240,220,180,0.75)" }}>
                  {t("My Profile", "ملفي الشخصي")}
                </MagBtn>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-xs"
                style={{ color: `${GOLD}60` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                {t("Available · Riyadh, Saudi Arabia 🇸🇦", "متاح · الرياض، المملكة العربية السعودية 🇸🇦")}
              </motion.div>
            </motion.div>

            {/* PHOTO — edge-to-edge */}
            <motion.div style={{ y: photoY }}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex flex-col items-end justify-end order-1 lg:order-2 h-full relative"
              style={{ alignSelf: "stretch" }}>

              <div className="relative w-full h-full flex flex-col justify-end" style={{ minHeight: "92vh" }}>
                {/* full-height photo */}
                <div className="absolute inset-0 overflow-hidden">
                  <img src={photoPath} alt="Mohammed Al-Dabbani"
                    className="w-full h-full object-cover object-top" />
                  {/* gradient overlay — left fade into navy */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${NAVY} 0%, ${NAVY}80 15%, transparent 45%)` }} />
                  {/* gradient overlay — bottom */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${NAVY} 0%, ${NAVY}40 20%, transparent 50%)` }} />
                  {/* gold tint overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at center, rgba(184,134,11,0.06) 0%, transparent 70%)` }} />
                </div>

                {/* name plate at bottom */}
                <div className="relative z-10 p-8 pb-10">
                  <div className="inline-flex flex-col border-l-2 pl-4"
                    style={{ borderColor: GOLD }}>
                    <span className="font-bold text-white text-base leading-tight">
                      {t("Mohammed Al-Dabbani", "محمد الدباني")}
                    </span>
                    <span className="text-xs mt-1" style={{ color: `${GOLD_LT}90` }}>
                      {t("Brand Manager · F&B Sector", "مدير العلامة التجارية · قطاع F&B")}
                    </span>
                  </div>
                </div>

                {/* floating Matcha badge */}
                <motion.div animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 right-4 z-20 rounded-2xl px-4 py-3 border"
                  style={{
                    background: "rgba(10,22,40,0.92)",
                    borderColor: `${GOLD}30`,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}15`,
                  }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🍵</span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {t("Matcha Power", "ماتشا باور")}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: `${GOLD}80` }}>
                        {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
      </section>

      {/* GEOMETRIC DIVIDER */}
      <div style={{ background: CREAM, paddingTop: 8, paddingBottom: 8 }}>
        <GeoDivider />
      </div>

      {/* ════════════════════════════════════════════
          MARQUEE — warm cream bg
      ════════════════════════════════════════════ */}
      <div style={{ background: CREAM, borderBottom: `1px solid ${GOLD}25` }}
        className="overflow-hidden py-3.5">
        <motion.div animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap w-max">
          {[...Array(2)].map((_, rep) =>
            [
              t("Brand Strategy", "استراتيجية العلامة"),
              t("Business Development", "تطوير الأعمال"),
              t("Operations Management", "إدارة العمليات"),
              t("F&B Sector", "قطاع F&B"),
              t("Market Analysis", "تحليل السوق"),
              t("Team Leadership", "قيادة الفرق"),
              t("Customer Experience", "تجربة العميل"),
              t("Entrepreneurship", "ريادة الأعمال"),
            ].map((item, i) => (
              <span key={`${rep}-${i}`}
                className="text-[11px] font-bold uppercase tracking-[0.28em] flex items-center gap-12"
                style={{ color: `${GOLD}70` }}>
                {item}
                <span style={{ color: `${GOLD}40` }}>◇</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════
          EXPERTISE + SKILLS — warm cream
      ════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: CREAM }}>
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Expertise */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: GOLD }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
                    {t("Core Expertise", "التخصصات الأساسية")}
                  </p>
                </div>
                <h2 className="text-3xl md:text-[44px] font-black font-heading leading-tight mb-10"
                  style={{ color: NAVY }}>
                  {t("What I bring\nto every project", "ما أحضره\nلكل مشروع")}
                </h2>
              </Reveal>

              <div className="space-y-4">
                {[
                  {
                    num: "01", icon: "📈",
                    en: "Business Development",   ar: "تطوير الأعمال",
                    dEn: "Business models, market entry, partnerships, and revenue strategy built to scale.",
                    dAr: "نماذج أعمال ودخول السوق وشراكات واستراتيجية إيرادات قابلة للتوسع.",
                  },
                  {
                    num: "02", icon: "⚙️",
                    en: "Operations Management",  ar: "إدارة العمليات",
                    dEn: "KPI frameworks, staff development, quality systems, and operational discipline.",
                    dAr: "مؤشرات أداء وتطوير كوادر وأنظمة جودة وانضباط تشغيلي.",
                  },
                  {
                    num: "03", icon: "🎯",
                    en: "Brand Strategy",         ar: "استراتيجية العلامة",
                    dEn: "Identity, positioning, loyalty systems, and experiences that outlast campaigns.",
                    dAr: "هوية وتموضع وأنظمة ولاء وتجارب تستمر أبعد من الحملات.",
                  },
                ].map((p, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 26 }}
                      className="group flex gap-5 p-6 rounded-2xl border cursor-default transition-all duration-300"
                      style={{ background: "white", borderColor: `${GOLD}20` }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}60`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${GOLD}15`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}20`;
                        (e.currentTarget as HTMLElement).style.boxShadow = "";
                      }}>
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${GOLD}12` }}>
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-bold text-base" style={{ color: NAVY }}>
                            {t(p.en, p.ar)}
                          </h3>
                          <span className="text-[10px] font-mono font-bold" style={{ color: `${GOLD}50` }}>
                            {p.num}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#6B5A3E" }}>
                          {t(p.dEn, p.dAr)}
                        </p>
                        <div className="mt-3 h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-500"
                          style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <Reveal dir="right">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ background: GOLD }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
                    {t("Skill Proficiency", "مستوى المهارات")}
                  </p>
                </div>
                <h2 className="text-3xl md:text-[44px] font-black font-heading leading-tight mb-10"
                  style={{ color: NAVY }}>
                  {t("Technical\nCompetencies", "الكفاءات\nالتقنية")}
                </h2>
              </Reveal>

              <Reveal dir="right" delay={0.1}>
                <div className="space-y-5">
                  {[
                    { label: t("Brand Strategy", "استراتيجية العلامة") as string,     pct: 95 },
                    { label: t("Business Development", "تطوير الأعمال") as string,    pct: 90 },
                    { label: t("Operations Management", "إدارة العمليات") as string,  pct: 88 },
                    { label: t("Team Leadership", "قيادة الفرق") as string,            pct: 92 },
                    { label: t("Market Analysis", "تحليل السوق") as string,            pct: 82 },
                    { label: t("Customer Experience", "تجربة العميل") as string,      pct: 87 },
                  ].map((sk, i) => <SkillBar key={i} {...sk} />)}
                </div>
              </Reveal>

              <Reveal dir="right" delay={0.2} className="mt-10">
                <div className="rounded-2xl border p-6"
                  style={{ background: "white", borderColor: `${GOLD}20` }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-5"
                    style={{ color: `${GOLD}80` }}>
                    {t("Certifications & Courses", "الشهادات والدورات")}
                  </p>
                  <div className="space-y-3">
                    {[
                      { icon: "🏆", en: "Brand Management — Coursera",    ar: "إدارة العلامات — Coursera" },
                      { icon: "📊", en: "Digital Marketing — Google",      ar: "التسويق الرقمي — Google" },
                      { icon: "🧠", en: "Strategic Management — LinkedIn", ar: "الإدارة الاستراتيجية — LinkedIn" },
                      { icon: "🌱", en: "Entrepreneurship — MIT OpenCourseWare", ar: "ريادة الأعمال — MIT" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-base w-6 text-center">{c.icon}</span>
                        <span className="text-sm font-medium" style={{ color: "#3D2B0F" }}>
                          {t(c.en, c.ar)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* GEOMETRIC DIVIDER (flipped) */}
      <div style={{ background: NAVY, paddingTop: 8, paddingBottom: 8 }}>
        <GeoDivider flip />
      </div>

      {/* ════════════════════════════════════════════
          CAREER — dark navy + gold timeline
      ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, ${GOLD}0a, transparent 60%)` }} />

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
            <Reveal dir="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
                  {t("Professional History", "التاريخ المهني")}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-5 leading-tight">
                {t("8 Years of\nLeadership", "8 سنوات\nمن القيادة")}
              </h2>
              <p className="text-sm leading-relaxed mb-8"
                style={{ color: "rgba(240,220,180,0.45)" }}>
                {t(
                  "A steady progression through operations and brand leadership across the Kingdom.",
                  "تقدم متواصل في العمليات وقيادة العلامات في المملكة."
                )}
              </p>
              <Link href="/about">
                <motion.button whileHover={{ x: 5 }}
                  className="text-sm font-bold" style={{ color: GOLD_LT }}>
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </motion.button>
              </Link>
            </Reveal>

            <div className="relative pl-6">
              {/* vertical gold timeline line */}
              <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                style={{ background: `linear-gradient(to bottom, ${GOLD}, ${GOLD}30)` }} />

              <div className="space-y-4">
                {[
                  { yr: "2025 – Present", en: "Brand Manager", ar: "مدير العلامة التجارية", org: "Thamarat Al-Khayr — Fuji Cafe", current: true },
                  { yr: "2024 – 2025", en: "Operations & BD Manager", ar: "مدير العمليات والتطوير", org: "Thamarat Al-Khayr — Fuji Cafe", current: false },
                  { yr: "2022 – 2024", en: "Branch Manager", ar: "مدير فرع", org: "Namq for Beverages Co.", current: false },
                  { yr: "2018 – 2022", en: "Branch Manager", ar: "مدير فرع", org: "Al-Awaji Commercial Markets", current: false },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 0.09}>
                    <div className="relative flex items-start gap-5">
                      {/* gold dot */}
                      <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full border-2"
                        style={{
                          background: item.current ? GOLD_LT : NAVY,
                          borderColor: item.current ? GOLD_LT : `${GOLD}50`,
                        }} />
                      <motion.div whileHover={{ x: 6 }}
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
                        className="flex-1 p-5 rounded-xl border cursor-default transition-all duration-300"
                        style={{ background: `${GOLD}06`, borderColor: `${GOLD}18` }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}40`;
                          (e.currentTarget as HTMLElement).style.background = `${GOLD}0e`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}18`;
                          (e.currentTarget as HTMLElement).style.background = `${GOLD}06`;
                        }}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <p className="font-bold text-white text-sm">{t(item.en, item.ar)}</p>
                          <span className="text-xs font-mono" style={{ color: `${GOLD}60` }}>{item.yr}</span>
                        </div>
                        <p className="text-xs" style={{ color: `${GOLD}55` }}>{item.org}</p>
                        {item.current && (
                          <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                            style={{ background: `${GOLD}15`, color: GOLD_LT, border: `1px solid ${GOLD}30` }}>
                            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: GOLD_LT }} />
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

      {/* ════════════════════════════════════════════
          FEATURED PROJECT — full dark navy
      ════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: NAVY }}>
        {/* background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)` }} />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
          <div className="absolute -bottom-20 right-0 select-none"
            style={{
              fontFamily: "'IBM Plex Sans Arabic',sans-serif",
              fontSize: 280, fontWeight: 900, lineHeight: 1,
              color: GOLD, opacity: 0.03, letterSpacing: -8,
            }}>
            🍵
          </div>
        </div>

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          {/* eyebrow */}
          <Reveal className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
                {t("Featured Project", "مشروع مميز")}
              </p>
            </div>
            <h2 className="text-4xl md:text-[52px] font-black font-heading leading-tight text-white">
              {t("Entrepreneurial", "المشروع")}{" "}
              <span style={{ color: GOLD }}>{t("Venture", "الريادي")}</span>
            </h2>
          </Reveal>

          {/* main card — split layout */}
          <Reveal delay={0.1}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-0 rounded-3xl overflow-hidden"
              style={{ border: `1px solid ${GOLD}25`, boxShadow: `0 24px 80px rgba(0,0,0,0.5)` }}>

              {/* LEFT — content */}
              <div className="p-10 md:p-14 relative"
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)` }}>
                {/* top gold line */}
                <div className="absolute top-0 left-10 right-10 h-[1px]"
                  style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

                {/* meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                    style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}35` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                  </span>
                  <span className="text-xs font-mono" style={{ color: `${GOLD}80` }}>
                    {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                  </span>
                </div>

                {/* title */}
                <h3 className="text-4xl md:text-5xl font-black font-heading mb-5 text-white leading-tight">
                  {t("Matcha Power", "ماتشا باور")}
                </h3>

                {/* description */}
                <p className="text-base leading-relaxed mb-10 max-w-lg"
                  style={{ color: "rgba(240,220,170,0.6)" }}>
                  {t(
                    "Founded and led from concept to full operational launch — brand identity, business model, market research, team building, and commercial rollout.",
                    "تأسيس وقيادة من المفهوم إلى الإطلاق الكامل — هوية العلامة ونموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري."
                  )}
                </p>

                {/* achievement pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {(t(
                    ["Brand Identity", "Business Model", "Market Research", "Operations", "Team Leadership"],
                    ["هوية العلامة", "نموذج العمل", "بحث السوق", "العمليات", "قيادة الفريق"]
                  ) as string[]).map(tag => (
                    <span key={tag}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,220,170,0.75)", border: `1px solid ${GOLD}20` }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LT})`, color: NAVY }}>
                    {t("View Full Portfolio →", "← عرض الأعمال الكاملة")}
                  </motion.button>
                </Link>
              </div>

              {/* RIGHT — visual panel */}
              <div className="relative flex flex-col items-center justify-center p-10 lg:border-l"
                style={{ background: `linear-gradient(160deg, rgba(184,134,11,0.08) 0%, rgba(10,22,40,0.6) 100%)`, borderColor: `${GOLD}15` }}>

                {/* big emoji focal point */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[120px] leading-none mb-6 select-none"
                  style={{ filter: `drop-shadow(0 20px 40px ${GOLD}30)` }}>
                  🍵
                </motion.div>

                {/* stats grid */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                  {[
                    { num: "0→1",  label: t("Launch",    "إطلاق") },
                    { num: "360°", label: t("Brand",     "هوية") },
                    { num: "5+",   label: t("Focus Areas","محاور") },
                    { num: "1Y",   label: t("Journey",   "رحلة") },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${GOLD}15` }}>
                      <span className="text-xl font-black" style={{ color: GOLD }}>{s.num}</span>
                      <span className="text-[10px] font-semibold mt-0.5" style={{ color: "rgba(240,220,170,0.5)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONTACT CTA — dark navy close
      ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${GOLD}08, transparent 65%)` }} />

        <div className="container mx-auto px-8 lg:px-16 max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal dir="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
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
                {[
                  { icon: "📧", text: "Moh.aldbani@gmail.com", href: "mailto:Moh.aldbani@gmail.com" },
                  { icon: "📱", text: "+966 552 469 643",      href: "tel:+966552469643" },
                  { icon: "📍", text: t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية") as string, href: null },
                ].map((c, i) => (
                  <div key={i}>
                    {c.href ? (
                      <a href={c.href} className="flex items-center gap-4 group">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-base flex-shrink-0 border transition-all duration-300 group-hover:border-amber-500"
                          style={{ background: `${GOLD}10`, borderColor: `${GOLD}25` }}>
                          {c.icon}
                        </span>
                        <span className="font-medium text-white/70 group-hover:text-amber-300 transition-colors">{c.text}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-base flex-shrink-0 border"
                          style={{ background: `${GOLD}10`, borderColor: `${GOLD}25` }}>
                          {c.icon}
                        </span>
                        <span className="font-medium" style={{ color: "rgba(240,220,180,0.45)" }}>{c.text}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal dir="right" delay={0.12}>
              <div className="rounded-2xl overflow-hidden border"
                style={{ borderColor: `${GOLD}25`, boxShadow: `0 8px 40px rgba(0,0,0,0.3)` }}>
                <div className="px-8 py-6" style={{ background: `${GOLD}12`, borderBottom: `1px solid ${GOLD}20` }}>
                  <div className="inline-flex rounded-lg bg-white px-3 py-2">
                    <img src={logoPath} alt="md" className="h-8 w-auto object-contain"
                      style={{ mixBlendMode: "multiply" }} />
                  </div>
                </div>
                <div className="px-8 py-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-sm leading-relaxed mb-2 italic"
                    style={{ color: "rgba(240,220,180,0.6)" }}>
                    {t(
                      "\"Experience, innovation, and impact — the standard I hold every project to.\"",
                      "«الخبرة والابتكار والأثر — المعيار الذي أحكم به على كل مشروع.»"
                    )}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: `${GOLD}55` }}>
                    — {t("Mohammed Al-Dabbani", "محمد الدباني")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <MagBtn href="/book"
                      className="w-full font-bold text-sm cursor-pointer rounded-xl hover:opacity-90 transition-opacity"
                      style={{ height: 48, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LT})`, color: NAVY }}>
                      {t("Book a Consultation", "احجز استشارة")}
                    </MagBtn>
                    <MagBtn href="/contact"
                      className="w-full font-bold text-sm cursor-pointer rounded-xl border transition-colors hover:border-amber-400"
                      style={{ height: 48, borderColor: `${GOLD}30`, color: "rgba(240,220,180,0.7)" }}>
                      {t("Send a Message", "أرسل رسالة")}
                    </MagBtn>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
