import {
  motion, useInView, useScroll, useTransform,
  useSpring, useMotionValue, AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

/* ─────────────────────────────────────────────────────────
   MAGNETIC BUTTON — cursor attraction on hover
───────────────────────────────────────────────────────── */
function MagneticBtn({
  children, className, style, href, onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current!;
    const { left, top, width, height } = el.getBoundingClientRect();
    mx.set((e.clientX - left - width / 2) * 0.28);
    my.set((e.clientY - top - height / 2) * 0.28);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const btn = (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );

  return href ? <Link href={href}>{btn}</Link> : btn;
}

/* ─────────────────────────────────────────────────────────
   FADE IN ON SCROLL
───────────────────────────────────────────────────────── */
function FadeIn({
  children, delay = 0, className = "", dir = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  dir?: "up" | "left" | "right";
}) {
  const initial =
    dir === "left" ? { opacity: 0, x: -28 }
    : dir === "right" ? { opacity: 0, x: 28 }
    : { opacity: 0, y: 22 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / 1500, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────
   SKILL BAR — animated fill on scroll entry
───────────────────────────────────────────────────────── */
function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-blue-700 mb-3">
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLanguage();

  /* Parallax on hero photo */
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(heroScroll, [0, 1], [0, -80]);
  const textY  = useTransform(heroScroll, [0, 1], [0, 40]);

  return (
    <RootLayout>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: "#0B1437", minHeight: "90vh" }}>
        {/* subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }} />
        {/* glow accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 100% 0%, rgba(37,99,235,0.16) 0%, transparent 55%)" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-8 lg:px-16 h-full">
          <div className="grid lg:grid-cols-2 items-center gap-0" style={{ minHeight: "90vh" }}>

            {/* TEXT */}
            <motion.div style={{ y: textY }} className="py-20 lg:py-0 lg:pr-16 order-2 lg:order-1">

              {/* logo — white container on dark bg */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="mb-10 inline-flex rounded-xl bg-white px-3 py-2"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                <img src={logoPath} alt="m-aldbani" className="h-8 w-auto object-contain"
                  style={{ mixBlendMode: "multiply" }} />
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5"
                style={{ color: "rgba(148,163,255,0.75)" }}>
                {t("Brand Manager · Business Development · F&B", "مدير علامة تجارية · تطوير أعمال · F&B")}
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading font-black text-white leading-[0.95] tracking-tight mb-5"
                style={{ fontSize: "clamp(48px, 7vw, 88px)" }}>
                {t("Mohammed\nAl-Dabbani", "محمد\nالدباني")}
              </motion.h1>

              <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.44, duration: 0.55 }}
                className="h-[3px] w-14 rounded-full mb-7"
                style={{ background: "linear-gradient(90deg,#3b82f6,#7c3aed)" }} />

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.6 }}
                className="leading-relaxed mb-9 max-w-[420px] text-base"
                style={{ color: "rgba(203,213,225,0.7)" }}>
                {t(
                  "8+ years leading brands and operations in Saudi Arabia's F&B sector — from strategy and identity to full commercial execution.",
                  "أكثر من 8 سنوات في قيادة العلامات والعمليات بقطاع الأغذية في المملكة — من الاستراتيجية والهوية إلى التنفيذ التجاري الكامل."
                )}
              </motion.p>

              {/* Stats strip */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.6 }}
                className="grid grid-cols-4 divide-x rounded-xl overflow-hidden border mb-9"
                style={{
                  borderColor: "rgba(255,255,255,0.09)",
                  background: "rgba(255,255,255,0.04)",
                  divideColor: "rgba(255,255,255,0.06)",
                }}>
                {[
                  { n: 8,  s: "+", en: "Years",     ar: "سنوات" },
                  { n: 50, s: "+", en: "Brands",     ar: "علامة" },
                  { n: 2,  s: "M+",en: "Customers",  ar: "عميل" },
                  { n: 3,  s: "",  en: "Industries", ar: "قطاعات" },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center py-4 px-2"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <span className="text-2xl font-black font-heading text-white">
                      <CountUp to={st.n} suffix={st.s} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: "rgba(148,163,255,0.55)" }}>
                      {t(st.en, st.ar)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA — magnetic */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.74, duration: 0.55 }}
                className="flex flex-wrap gap-3 mb-9">
                <MagneticBtn
                  href="/book"
                  className="h-13 px-8 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", height: "52px" }}
                >
                  {t("Book a Consultation", "احجز استشارة")}
                </MagneticBtn>
                <MagneticBtn
                  href="/about"
                  className="h-13 px-8 rounded-lg font-bold text-sm transition-all hover:bg-white/10 cursor-pointer border"
                  style={{ height: "52px", color: "rgba(203,213,225,0.85)", borderColor: "rgba(255,255,255,0.14)" }}
                >
                  {t("My Profile", "ملفي الشخصي")}
                </MagneticBtn>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(148,163,255,0.45)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                {t("Available for projects · Riyadh, KSA 🇸🇦", "متاح للمشاريع · الرياض، المملكة العربية السعودية 🇸🇦")}
              </motion.div>
            </motion.div>

            {/* PHOTO — parallax + float badge */}
            <motion.div
              style={{ y: photoY }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-end justify-center order-1 lg:order-2 pt-16"
            >
              <div className="relative w-full max-w-[380px]">
                <div className="relative overflow-hidden"
                  style={{ borderRadius: "18px 18px 0 0", aspectRatio: "3/4" }}>
                  <img src={photoPath} alt="Mohammed Al-Dabbani"
                    className="w-full h-full object-cover object-top" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                    style={{ background: "linear-gradient(to top, #0B1437 0%, transparent 100%)" }} />
                </div>
                <div className="border border-t-0 rounded-b-2xl px-5 py-4"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <p className="font-bold text-white text-sm">{t("Mohammed Al-Dabbani", "محمد الدباني")}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,255,0.55)" }}>
                    {t("Brand Manager · F&B Sector", "مدير العلامة التجارية · قطاع F&B")}
                  </p>
                </div>

                {/* floating project badge */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -left-12 rounded-2xl px-4 py-3 border"
                  style={{
                    background: "rgba(10,14,48,0.92)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🍵</span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {t("Matcha Power", "ماتشا باور")}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(148,163,255,0.6)" }}>
                        {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* floating KPI badge */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  className="absolute bottom-24 -right-10 rounded-2xl px-4 py-3 border"
                  style={{
                    background: "rgba(10,14,48,0.92)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: "rgba(148,163,255,0.5)" }}>
                    {t("Current Role", "الدور الحالي")}
                  </p>
                  <p className="text-xs font-bold text-white whitespace-nowrap">
                    {t("Brand Manager", "مدير العلامة")}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px]" style={{ color: "#34d399" }}>
                      {t("Active", "نشط")}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TICKER MARQUEE
      ══════════════════════════════════════════════ */}
      <div className="border-y border-slate-100 bg-white overflow-hidden py-3.5">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap w-max"
        >
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
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300 flex items-center gap-10">
                {item}
                <span className="text-blue-300/35">◆</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          EXPERTISE + SKILLS
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left: expertise cards */}
            <div>
              <FadeIn>
                <Label>{t("Core Expertise", "التخصصات الأساسية")}</Label>
                <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight mb-10">
                  {t("What I bring\nto every project", "ما أحضره\nلكل مشروع")}
                </h2>
              </FadeIn>

              <div className="space-y-4">
                {[
                  {
                    n: "01", color: "#2563eb",
                    en: "Business Development",   ar: "تطوير الأعمال",
                    dEn: "From zero to commercial launch — business models, market entry, partnerships, and revenue strategy built to scale.",
                    dAr: "من الصفر إلى الإطلاق — نماذج أعمال ودخول السوق وشراكات واستراتيجية إيرادات.",
                    icon: "📈",
                  },
                  {
                    n: "02", color: "#7c3aed",
                    en: "Operations Management",   ar: "إدارة العمليات",
                    dEn: "KPI frameworks, staff development, quality systems, and operational discipline at scale.",
                    dAr: "مؤشرات أداء وتطوير كوادر وأنظمة جودة وانضباط تشغيلي على نطاق واسع.",
                    icon: "⚙️",
                  },
                  {
                    n: "03", color: "#0ea5e9",
                    en: "Brand Strategy",          ar: "استراتيجية العلامة",
                    dEn: "Identity, positioning, customer loyalty systems, and differentiated experiences that outlast campaigns.",
                    dAr: "هوية وتموضع وأنظمة ولاء وتجارب متميزة تستمر أبعد من الحملات.",
                    icon: "🎯",
                  },
                ].map((p, i) => (
                  <FadeIn key={i} delay={i * 0.08}>
                    <div
                      className="group flex gap-5 p-6 border border-slate-100 rounded-2xl bg-white
                                 hover:border-transparent hover:shadow-xl transition-all duration-350 cursor-default"
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 16px 48px ${p.color}1a`)}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${p.color}12` }}>
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-bold text-slate-900 text-base group-hover:text-[var(--c)] transition-colors"
                            style={{ "--c": p.color } as React.CSSProperties}>
                            {t(p.en, p.ar)}
                          </h3>
                          <span className="text-[10px] font-mono font-bold" style={{ color: p.color, opacity: 0.4 }}>
                            {p.n}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{t(p.dEn, p.dAr)}</p>
                        <div className="mt-3 h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-500"
                          style={{ background: `linear-gradient(90deg,${p.color},transparent)` }} />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Right: skill bars */}
            <div>
              <FadeIn dir="right">
                <Label>{t("Skill Proficiency", "مستوى المهارات")}</Label>
                <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight mb-10">
                  {t("Technical\nCompetencies", "الكفاءات\nالتقنية")}
                </h2>
              </FadeIn>

              <FadeIn dir="right" delay={0.1}>
                <div className="space-y-6">
                  {[
                    { label: t("Brand Strategy", "استراتيجية العلامة") as string,  pct: 95, color: "#2563eb" },
                    { label: t("Business Development", "تطوير الأعمال") as string, pct: 90, color: "#7c3aed" },
                    { label: t("Operations Management", "إدارة العمليات") as string, pct: 88, color: "#0ea5e9" },
                    { label: t("Team Leadership", "قيادة الفرق") as string,         pct: 92, color: "#10b981" },
                    { label: t("Market Analysis", "تحليل السوق") as string,         pct: 82, color: "#f59e0b" },
                    { label: t("Customer Experience", "تجربة العميل") as string,   pct: 87, color: "#ec4899" },
                  ].map((sk, i) => (
                    <SkillBar key={i} {...sk} />
                  ))}
                </div>
              </FadeIn>

              {/* Certifications */}
              <FadeIn dir="right" delay={0.2} className="mt-10">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    {t("Certifications", "الشهادات")}
                  </p>
                  <div className="space-y-3">
                    {[
                      { icon: "🏆", en: "Brand Management — Coursera",          ar: "إدارة العلامات — Coursera" },
                      { icon: "📊", en: "Digital Marketing — Google",            ar: "التسويق الرقمي — Google" },
                      { icon: "🧠", en: "Strategic Management — LinkedIn",       ar: "الإدارة الاستراتيجية — LinkedIn" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-base">{c.icon}</span>
                        <span className="text-sm font-medium text-slate-700">{t(c.en, c.ar)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CAREER — dark
      ══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#0B1437" }}>
        <div className="absolute top-0 left-0 w-[350px] h-[350px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.12), transparent 60%)" }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 100% 100%, rgba(124,58,237,0.1), transparent 60%)" }} />

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
            <FadeIn dir="left">
              <Label>
                <span style={{ color: "rgba(148,163,255,0.7)" }}>
                  {t("Professional History", "التاريخ المهني")}
                </span>
              </Label>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-5 leading-tight">
                {t("8 Years of\nLeadership", "8 سنوات\nمن القيادة")}
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(203,213,225,0.5)" }}>
                {t(
                  "A steady progression through operations and brand leadership across Saudi Arabia's F&B industry.",
                  "تقدم متواصل في قيادة العمليات والعلامة في صناعة الأغذية السعودية."
                )}
              </p>
              <Link href="/about">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-bold"
                  style={{ color: "#60a5fa" }}>
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </motion.button>
              </Link>
            </FadeIn>

            <div className="space-y-3">
              {[
                { yr: "2025 – Present", en: "Brand Manager", ar: "مدير العلامة التجارية", org: "Thamarat Al-Khayr — Fuji Cafe", current: true },
                { yr: "2024 – 2025", en: "Operations & BD Manager", ar: "مدير العمليات والتطوير", org: "Thamarat Al-Khayr — Fuji Cafe", current: false },
                { yr: "2022 – 2024", en: "Branch Manager", ar: "مدير فرع", org: "Namq for Beverages Co.", current: false },
                { yr: "2018 – 2022", en: "Branch Manager", ar: "مدير فرع", org: "Al-Awaji Commercial Markets", current: false },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="flex items-start gap-5 p-5 rounded-xl border transition-colors duration-300 cursor-default"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div className="flex-shrink-0 w-[108px] pt-0.5">
                      <span className="text-xs font-mono" style={{ color: "rgba(148,163,255,0.45)" }}>
                        {item.yr}
                      </span>
                    </div>
                    <div className="flex-shrink-0 mt-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.current ? "bg-emerald-400" : "bg-slate-600"}`} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t(item.en, item.ar)}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,255,0.45)" }}>{item.org}</p>
                      {item.current && (
                        <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          {t("Current Position", "المنصب الحالي")}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PROJECT
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <FadeIn className="mb-12">
            <Label>{t("Featured Project", "مشروع مميز")}</Label>
            <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight">
              {t("Entrepreneurial Venture", "المشروع الريادي")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-default"
              style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
            >
              <div className="grid md:grid-cols-[6px_1fr_auto]">
                <div className="hidden md:block"
                  style={{ background: "linear-gradient(to bottom, #2563eb, #7c3aed)" }} />
                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🍵</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                      </span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black font-heading text-slate-900 mb-3">
                    {t("Matcha Power", "ماتشا باور")}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm max-w-xl mb-6">
                    {t(
                      "Founded and led from concept to full operational launch — brand identity, business model, market research, team building, and commercial rollout.",
                      "تأسيس وقيادة من المفهوم إلى الإطلاق التشغيلي الكامل — هوية العلامة ونموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري."
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(t(
                      ["Brand Identity", "Business Model", "Market Research", "Operations", "Team Leadership"],
                      ["هوية العلامة", "نموذج العمل", "بحث السوق", "العمليات", "قيادة الفريق"]
                    ) as string[]).map(tag => (
                      <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center p-8 border-t md:border-t-0 md:border-l border-slate-100">
                  <MagneticBtn
                    href="/portfolio"
                    className="h-11 px-7 rounded-xl font-bold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer"
                  >
                    {t("View Work →", "عرض الأعمال ←")}
                  </MagneticBtn>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT CTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn dir="left">
              <Label>{t("Let's Work Together", "لنتعاون معاً")}</Label>
              <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight mb-5">
                {t("Ready to elevate\nyour brand?", "هل أنت مستعد\nللارتقاء بعلامتك؟")}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {t(
                  "Strategic consulting, brand development, and operational leadership — available for serious engagements.",
                  "استشارة استراتيجية وتطوير علامة وقيادة تشغيلية — متاح للتعاونات الجادة."
                )}
              </p>
              <div className="space-y-4 text-sm">
                {[
                  { icon: "📧", text: "Moh.aldbani@gmail.com", href: "mailto:Moh.aldbani@gmail.com" },
                  { icon: "📱", text: "+966 552 469 643", href: "tel:+966552469643" },
                  { icon: "📍", text: t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية") as string, href: null },
                ].map((c, i) => (
                  <div key={i}>
                    {c.href ? (
                      <a href={c.href} className="flex items-center gap-4 group">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all text-base flex-shrink-0">
                          {c.icon}
                        </span>
                        <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{c.text}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-base flex-shrink-0">{c.icon}</span>
                        <span className="font-medium text-slate-500">{c.text}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn dir="right" delay={0.12}>
              <div className="rounded-2xl overflow-hidden border border-slate-200"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
                <div className="px-8 py-6" style={{ background: "#0B1437" }}>
                  <div className="inline-flex rounded-lg bg-white px-3 py-2">
                    <img src={logoPath} alt="md" className="h-8 w-auto object-contain"
                      style={{ mixBlendMode: "multiply" }} />
                  </div>
                </div>
                <div className="bg-white px-8 py-8">
                  <p className="text-slate-500 text-sm leading-relaxed mb-2 italic">
                    {t(
                      "\"Experience, innovation, and impact — the standard I hold every project to.\"",
                      "«الخبرة والابتكار والأثر — المعيار الذي أحكم به على كل مشروع.»"
                    )}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                    — {t("Mohammed Al-Dabbani", "محمد الدباني")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <MagneticBtn
                      href="/book"
                      className="w-full h-12 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                    >
                      {t("Book a Consultation", "احجز استشارة")}
                    </MagneticBtn>
                    <MagneticBtn
                      href="/contact"
                      className="w-full h-12 rounded-xl font-bold text-sm text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      {t("Send a Message", "أرسل رسالة")}
                    </MagneticBtn>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
