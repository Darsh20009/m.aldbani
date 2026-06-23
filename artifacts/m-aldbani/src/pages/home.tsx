import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / 1400, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <RootLayout>

      {/* ══════════════════════════════════════════════
          HERO — dark navy, full weight
      ══════════════════════════════════════════════ */}
      <section style={{ background: "#0B1437" }} className="relative overflow-hidden">
        {/* subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        {/* accent gradient top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 100% 0%, rgba(37,99,235,0.18) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 min-h-[90vh] items-center gap-0">

            {/* ── LEFT: Text ── */}
            <div className="py-20 lg:py-0 lg:pr-16 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <img src={logoPath} alt="md" className="h-10 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1) opacity(0.85)" }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6"
                style={{ color: "rgba(148,163,255,0.8)" }}
              >
                {t("Brand Manager · Business Development · F&B", "مدير علامة تجارية · تطوير أعمال · F&B")}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading font-black text-white leading-[1.0] tracking-tight mb-6"
                style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
              >
                {t("Mohammed\nAl-Dabbani", "محمد\nالدباني")}
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.42, duration: 0.6 }}
                className="h-[3px] w-16 rounded-full mb-8"
                style={{ background: "linear-gradient(90deg,#3b82f6,#7c3aed)" }}
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="leading-relaxed mb-10 max-w-md text-base"
                style={{ color: "rgba(203,213,225,0.75)" }}
              >
                {t(
                  "8+ years leading brands and operations in Saudi Arabia's F&B sector — from strategy and identity to full commercial execution.",
                  "أكثر من 8 سنوات في قيادة العلامات والعمليات بقطاع الأغذية والمشروبات في المملكة — من الاستراتيجية والهوية إلى التنفيذ التجاري الكامل."
                )}
              </motion.p>

              {/* Stats inline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-4 gap-px rounded-xl overflow-hidden border mb-10"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}
              >
                {[
                  { n: 8,  s: "+", en: "Years",      ar: "سنوات" },
                  { n: 50, s: "+", en: "Brands",      ar: "علامة" },
                  { n: 2,  s: "M+",en: "Customers",   ar: "عميل" },
                  { n: 3,  s: "",  en: "Industries",  ar: "قطاعات" },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center py-4 px-2"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <span className="text-2xl font-black font-heading text-white">
                      <CountUp to={st.n} suffix={st.s} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: "rgba(148,163,255,0.6)" }}>
                      {t(st.en, st.ar)}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link href="/book">
                  <button
                    className="h-13 px-8 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", height: "52px" }}
                  >
                    {t("Book a Consultation", "احجز استشارة")}
                  </button>
                </Link>
                <Link href="/about">
                  <button
                    className="h-13 px-8 rounded-lg font-bold text-sm transition-all hover:bg-white/10 active:scale-95 border"
                    style={{ height: "52px", color: "rgba(203,213,225,0.85)", borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    {t("My Profile", "ملفي الشخصي")}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.88 }}
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(148,163,255,0.5)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t("Available for projects · Riyadh, Saudi Arabia 🇸🇦", "متاح للمشاريع · الرياض، المملكة العربية السعودية 🇸🇦")}
              </motion.div>
            </div>

            {/* ── RIGHT: Photo ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-end justify-center order-1 lg:order-2 pt-16"
            >
              <div className="relative w-full max-w-[380px]">
                {/* photo */}
                <div className="relative overflow-hidden"
                  style={{ borderRadius: "20px 20px 0 0", aspectRatio: "3/4" }}>
                  <img
                    src={photoPath}
                    alt="Mohammed Al-Dabbani"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* subtle vignette bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                    style={{ background: "linear-gradient(to top, #0B1437 0%, transparent 100%)" }} />
                </div>

                {/* name plate below photo */}
                <div className="border border-t-0 rounded-b-2xl px-6 py-4"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <p className="font-bold text-white text-sm">
                    {t("Mohammed Al-Dabbani", "محمد الدباني")}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,255,0.6)" }}>
                    {t("Brand Manager · F&B Sector", "مدير العلامة التجارية · قطاع F&B")}
                  </p>
                </div>

                {/* floating badge */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 -left-10 rounded-xl px-4 py-2.5 border shadow-lg"
                  style={{
                    background: "rgba(11,20,55,0.9)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍵</span>
                    <div>
                      <p className="text-xs font-bold text-white">{t("Matcha Power", "ماتشا باور")}</p>
                      <p className="text-[10px]" style={{ color: "rgba(148,163,255,0.6)" }}>
                        {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE — thin accent strip
      ══════════════════════════════════════════════ */}
      <div className="bg-white border-y border-slate-100 overflow-hidden py-3.5">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap w-max"
        >
          {[...Array(2)].map((_, rep) =>
            [
              t("Brand Strategy", "استراتيجية العلامة"),
              t("Business Development", "تطوير الأعمال"),
              t("Operations Excellence", "التميّز التشغيلي"),
              t("F&B Sector", "قطاع F&B"),
              t("Market Analysis", "تحليل السوق"),
              t("Team Leadership", "قيادة الفرق"),
              t("Customer Experience", "تجربة العميل"),
              t("Entrepreneurship", "ريادة الأعمال"),
            ].map((item, i) => (
              <span key={`${rep}-${i}`}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300 flex items-center gap-10">
                {item}
                <span className="text-blue-300/40">·</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          EXPERTISE — white section, bordered cards
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <FadeIn className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-blue-700 mb-3">
              {t("Core Expertise", "التخصصات الأساسية")}
            </p>
            <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight">
              {t("What I bring to every engagement", "ما أحضره لكل تعاون")}
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01", color: "#2563eb", bg: "#eff6ff",
                en: "Business Development",
                ar: "تطوير الأعمال",
                dEn: "From zero to commercial launch — business models, market entry, partnerships, and revenue strategy built to scale.",
                dAr: "من الصفر إلى الإطلاق التجاري — نماذج أعمال ودخول السوق وشراكات واستراتيجية إيرادات قابلة للتوسع.",
                icon: "📈",
              },
              {
                num: "02", color: "#7c3aed", bg: "#f5f3ff",
                en: "Operations Management",
                ar: "إدارة العمليات",
                dEn: "KPI-driven frameworks, staff development, quality systems, and day-to-day operational discipline at scale.",
                dAr: "أطر مدفوعة بمؤشرات الأداء وتطوير الكوادر وأنظمة الجودة والانضباط التشغيلي اليومي على نطاق واسع.",
                icon: "⚙️",
              },
              {
                num: "03", color: "#0ea5e9", bg: "#f0f9ff",
                en: "Brand Strategy",
                ar: "استراتيجية العلامة",
                dEn: "Identity, positioning, customer loyalty systems, and differentiated brand experiences that outlast campaigns.",
                dAr: "هوية وتموضع وأنظمة ولاء العملاء وتجارب علامة متميزة تستمر أبعد من الحملات.",
                icon: "🎯",
              },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="group border border-slate-200 rounded-2xl p-8 bg-white cursor-default h-full
                             transition-all duration-300 hover:shadow-xl hover:border-transparent"
                  style={{ "--hover-shadow": `0 20px 60px ${p.color}1a` } as React.CSSProperties}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 60px ${p.color}20`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-3xl">{p.icon}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: p.color, opacity: 0.5 }}>
                      {p.num}
                    </span>
                  </div>
                  <div className="h-[3px] w-10 rounded-full mb-5 transition-all duration-300"
                    style={{ background: p.color }} />
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[var(--c)] transition-colors duration-300"
                    style={{ "--c": p.color } as React.CSSProperties}>
                    {t(p.en, p.ar)}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t(p.dEn, p.dAr)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CAREER — dark navy background
      ══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#0B1437" }}>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.12), transparent 60%)" }} />

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-[300px_1fr] gap-16">
            <FadeIn>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] mb-3"
                style={{ color: "rgba(148,163,255,0.7)" }}>
                {t("Professional History", "التاريخ المهني")}
              </p>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-5 leading-tight">
                {t("8 Years of\nLeadership", "8 سنوات\nمن القيادة")}
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(203,213,225,0.55)" }}>
                {t(
                  "A consistent progression through operations and brand leadership in Saudi Arabia.",
                  "تقدم متواصل في قيادة العمليات والعلامة في المملكة العربية السعودية."
                )}
              </p>
              <Link href="/about">
                <button className="text-sm font-bold transition-colors"
                  style={{ color: "#60a5fa" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#93c5fd")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#60a5fa")}>
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </button>
              </Link>
            </FadeIn>

            <div className="space-y-3">
              {[
                {
                  yr: "2025 – Present",
                  en: "Brand Manager",
                  ar: "مدير العلامة التجارية",
                  org: "Thamarat Al-Khayr — Fuji Cafe",
                  current: true,
                },
                {
                  yr: "2024 – 2025",
                  en: "Operations & Business Development Manager",
                  ar: "مدير العمليات وتطوير الأعمال",
                  org: "Thamarat Al-Khayr — Fuji Cafe",
                  current: false,
                },
                {
                  yr: "2022 – 2024",
                  en: "Branch Manager",
                  ar: "مدير فرع",
                  org: "Namq for Beverages Co.",
                  current: false,
                },
                {
                  yr: "2018 – 2022",
                  en: "Branch Manager",
                  ar: "مدير فرع",
                  org: "Al-Awaji Commercial Markets",
                  current: false,
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-5 p-5 rounded-xl border transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div className="flex-shrink-0 w-[105px] pt-0.5">
                      <span className="text-xs font-mono" style={{ color: "rgba(148,163,255,0.5)" }}>
                        {item.yr}
                      </span>
                    </div>
                    <div className="flex-shrink-0 mt-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.current ? "bg-emerald-400" : "bg-slate-600"}`} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t(item.en, item.ar)}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,255,0.5)" }}>{item.org}</p>
                      {item.current && (
                        <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          {t("Current Position", "المنصب الحالي")}
                        </span>
                      )}
                    </div>
                  </div>
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
          <FadeIn className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-blue-700 mb-3">
              {t("Featured Project", "مشروع مميز")}
            </p>
            <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight">
              {t("Entrepreneurial Venture", "المشروع الريادي")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
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
                      "Founded and led from concept to operational launch — brand identity, business model, market research, team building, and full commercial rollout.",
                      "تأسيس وقيادة من المفهوم إلى الإطلاق التشغيلي — هوية العلامة ونموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري الكامل."
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(t(
                      ["Brand Identity", "Business Model", "Market Research", "Operations", "Team Leadership"],
                      ["هوية العلامة", "نموذج العمل", "بحث السوق", "العمليات", "قيادة الفريق"]
                    ) as string[]).map(tag => (
                      <span key={tag}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center p-8 border-t md:border-t-0 md:border-l border-slate-100">
                  <Link href="/portfolio">
                    <button
                      className="h-11 px-7 rounded-xl font-bold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 whitespace-nowrap">
                      {t("View Work →", "عرض الأعمال ←")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT CTA — strong close
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-blue-700 mb-4">
                {t("Let's Work Together", "لنتعاون معاً")}
              </p>
              <h2 className="text-3xl md:text-[44px] font-black font-heading text-slate-900 leading-tight mb-5">
                {t("Ready to elevate your brand?", "هل أنت مستعد للارتقاء بعلامتك؟")}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {t(
                  "Strategic consulting, brand development, and operational leadership — available for serious engagements.",
                  "استشارة استراتيجية وتطوير علامة وقيادة تشغيلية — متاح للتعاونات الجادة."
                )}
              </p>
              <div className="space-y-4 text-sm">
                <a href="mailto:Moh.aldbani@gmail.com"
                  className="flex items-center gap-4 group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all text-base">📧</span>
                  <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                    Moh.aldbani@gmail.com
                  </span>
                </a>
                <a href="tel:+966552469643"
                  className="flex items-center gap-4 group">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all text-base">📱</span>
                  <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                    +966 552 469 643
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-base">📍</span>
                  <span className="font-medium text-slate-500">
                    {t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية")}
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-slate-200"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.07)" }}>
                {/* top navy bar */}
                <div className="px-8 py-6" style={{ background: "#0B1437" }}>
                  <img src={logoPath} alt="md" className="h-10 w-auto object-contain"
                    style={{ filter: "brightness(0) invert(1) opacity(0.9)" }} />
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
                    <Link href="/book">
                      <button className="w-full h-12 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                        style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                        {t("Book a Consultation", "احجز استشارة")}
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="w-full h-12 rounded-xl font-bold text-sm text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
                        {t("Send a Message", "أرسل رسالة")}
                      </button>
                    </Link>
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
