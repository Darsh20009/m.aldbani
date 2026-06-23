import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

/* ─── animated counter ───────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const val = useSpring(raw, { stiffness: 45, damping: 14 });
  useEffect(() => { if (inView) raw.set(to); }, [inView, to, raw]);
  useEffect(() => val.on("change", (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; }), [val, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ─── scroll reveal ──────────────────────────────────── */
const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } } };
const cascade = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <RootLayout>

      {/* ════════════════════════════════════════════════════
          HERO — split layout, photo + text
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-white flex items-center overflow-hidden">
        {/* subtle top-right glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(37,99,235,0.07) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-8 lg:px-16 py-24 w-full">
          <div className={`grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px] gap-16 xl:gap-24 items-center ${isAr ? "lg:grid-cols-[440px_1fr] xl:grid-cols-[500px_1fr]" : ""}`}>

            {/* ── LEFT: text ──────────────────────────────── */}
            <motion.div
              variants={cascade}
              initial="hidden"
              animate="show"
              className={`order-2 lg:order-1 ${isAr ? "text-right" : ""}`}
            >
              {/* label */}
              <motion.div variants={rise} className={`flex items-center gap-3 mb-8 ${isAr ? "flex-row-reverse justify-end" : ""}`}>
                <div className="h-px w-10 rounded-full"
                  style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
                <span className="text-[11px] font-extrabold tracking-[0.3em] uppercase"
                  style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {t("Brand Manager · Business Development · F&B", "مدير علامة تجارية · تطوير أعمال · F&B")}
                </span>
              </motion.div>

              {/* name */}
              <motion.h1
                variants={rise}
                className="font-heading font-black leading-[0.92] tracking-tight mb-8"
                style={{ fontSize: "clamp(52px,8vw,96px)" }}
              >
                {t("Mohammed", "محمد")}
                <br />
                <span style={{
                  background: "linear-gradient(135deg,#1d4ed8 0%,#7c3aed 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {t("Al-Dabbani", "الدباني")}
                </span>
              </motion.h1>

              {/* tagline */}
              <motion.p variants={rise}
                className="text-lg text-foreground/50 max-w-md leading-relaxed mb-10">
                {t(
                  "8+ years building F&B brands from the ground up — from strategy and identity to full commercial launch.",
                  "أكثر من 8 سنوات في بناء علامات F&B من الصفر — من الاستراتيجية والهوية إلى الإطلاق التجاري الكامل."
                )}
              </motion.p>

              {/* inline stats */}
              <motion.div variants={rise}
                className="grid grid-cols-3 gap-0 border border-border rounded-2xl overflow-hidden mb-10">
                {[
                  { n: 8,  s: "+", en: "Years",    ar: "سنوات" },
                  { n: 50, s: "+", en: "Brands",    ar: "علامة" },
                  { n: 2,  s: "M+",en: "Customers", ar: "عميل" },
                ].map((st, i) => (
                  <div key={i}
                    className={`flex flex-col items-center py-5 px-4 ${i < 2 ? "border-r border-border" : ""}`}>
                    <span className="text-3xl font-black font-heading leading-none"
                      style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      <CountUp to={st.n} suffix={st.s} />
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold mt-1 uppercase tracking-wide">
                      {t(st.en, st.ar)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={rise} className="flex flex-wrap gap-4">
                <Link href="/book">
                  <button className="group relative h-14 px-8 rounded-xl font-bold text-sm text-white overflow-hidden shadow-lg"
                    style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 8px 30px rgba(37,99,235,.35)" }}>
                    <span className="relative z-10">{t("Book Consultation", "احجز استشارة")}</span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="h-14 px-8 rounded-xl font-bold text-sm border-2 border-slate-200 text-foreground hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                    {t("My Story →", "قصتي ←")}
                  </button>
                </Link>
              </motion.div>

              {/* motto */}
              <motion.p variants={rise}
                className="mt-8 text-[10px] tracking-[0.35em] uppercase text-foreground/25 font-bold">
                EXPERIENCE · INNOVATION · IMPACT
              </motion.p>
            </motion.div>

            {/* ── RIGHT: photo ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 relative flex justify-center"
            >
              {/* decorative backing */}
              <div className="absolute bottom-0 right-0 w-[88%] h-[92%] rounded-3xl"
                style={{
                  background: "linear-gradient(145deg,#1d4ed8,#7c3aed)",
                  transform: "translate(14px, 14px)",
                  opacity: 0.15,
                }} />
              <div className="absolute bottom-0 right-0 w-[88%] h-[92%] rounded-3xl"
                style={{
                  background: "linear-gradient(145deg,#1d4ed8,#7c3aed)",
                  transform: "translate(7px, 7px)",
                  opacity: 0.08,
                }} />

              {/* photo frame */}
              <div className="relative w-full max-w-[440px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-white"
                style={{ aspectRatio: "3/4" }}>
                {/* bg for contrast */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, #e8edf8 0%, #d1d9f0 100%)" }} />
                <img
                  src={photoPath}
                  alt="Mohammed Al-Dabbani"
                  className="relative z-10 w-full h-full object-cover object-top"
                />
                {/* bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 z-20"
                  style={{ background: "linear-gradient(to top, rgba(13,16,52,0.5), transparent)" }} />
                {/* name chip at bottom */}
                <div className="absolute bottom-5 left-5 right-5 z-30">
                  <p className="text-white text-sm font-bold">
                    {t("Mohammed Al-Dabbani", "محمد الدباني")}
                  </p>
                  <p className="text-white/60 text-xs">
                    {t("Brand Manager — Riyadh, KSA", "مدير علامة تجارية — الرياض، المملكة العربية السعودية")}
                  </p>
                </div>
              </div>

              {/* floating logo card */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-10 ${isAr ? "-right-5" : "-left-5"} bg-white rounded-2xl shadow-xl border border-slate-100 p-3`}
              >
                <img src={logoPath} alt="m-aldbani" className="h-10 w-auto object-contain" />
              </motion.div>

              {/* status badge */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className={`absolute bottom-24 ${isAr ? "-right-6" : "-left-6"} bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-2.5 flex items-center gap-2`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  {t("Available · Riyadh 🇸🇦", "متاح · الرياض 🇸🇦")}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          MARQUEE STRIP
      ════════════════════════════════════════════════════ */}
      <div className="border-y border-border overflow-hidden py-4 bg-slate-50">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap w-max"
        >
          {[...Array(2)].map((_, rep) =>
            [
              t("Brand Strategy", "استراتيجية العلامة"),
              t("Business Development", "تطوير الأعمال"),
              t("Operations Management", "إدارة العمليات"),
              t("F&B Sector", "قطاع الأغذية والمشروبات"),
              t("Market Analysis", "تحليل السوق"),
              t("Team Leadership", "قيادة الفرق"),
              t("Customer Experience", "تجربة العميل"),
              t("Growth Strategy", "استراتيجية النمو"),
            ].map((item, i) => (
              <span key={`${rep}-${i}`} className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-10">
                {item}
                <span className="text-primary">✦</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════
          EXPERTISE — numbered cards
      ════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={cascade}
            className="mb-16"
          >
            <motion.p variants={rise}
              className="text-[11px] font-extrabold tracking-[0.3em] uppercase mb-3"
              style={{ color: "#2563eb" }}>
              {t("Core Expertise", "التخصصات الأساسية")}
            </motion.p>
            <motion.h2 variants={rise} className="text-4xl md:text-5xl font-black font-heading leading-tight max-w-lg">
              {t("What I bring to the table", "ماذا أقدم لك")}
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                en: "Business Development",
                ar: "تطوير الأعمال",
                dEn: "From zero to full commercial launch. I design the strategy, build the model, and execute the growth plan.",
                dAr: "من الصفر إلى الإطلاق التجاري الكامل. أصمم الاستراتيجية وأبني النموذج وأنفذ خطة النمو.",
                color: "#2563eb",
              },
              {
                num: "02",
                en: "Operations Management",
                ar: "إدارة العمليات",
                dEn: "Build systems that scale. KPI frameworks, team development, quality standards, and daily operational excellence.",
                dAr: "بناء أنظمة قابلة للتوسع. مؤشرات أداء، تطوير فرق، معايير جودة، وتميز تشغيلي يومي.",
                color: "#7c3aed",
              },
              {
                num: "03",
                en: "Brand Strategy",
                ar: "استراتيجية العلامة",
                dEn: "Craft brands that resonate. Visual identity, market positioning, customer experience, and loyalty ecosystems.",
                dAr: "بناء علامات تؤثر. هوية بصرية، تموضع في السوق، تجربة عملاء، ومنظومة ولاء.",
                color: "#0ea5e9",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group relative border border-border rounded-2xl p-8 bg-white hover:shadow-xl transition-all duration-500 overflow-hidden cursor-default"
              >
                {/* hover fill */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at top right, ${p.color}08, transparent 70%)` }} />

                <span className="block font-black font-heading text-[56px] leading-none mb-6"
                  style={{ color: p.color, opacity: 0.12 }}>
                  {p.num}
                </span>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {t(p.en, p.ar)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(p.dEn, p.dAr)}
                </p>
                <div className="mt-8 h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-700"
                  style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EXPERIENCE — horizontal timeline
      ════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-border bg-slate-50">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={cascade}
            className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <motion.p variants={rise}
                className="text-[11px] font-extrabold tracking-[0.3em] uppercase mb-3 text-blue-600">
                {t("Career Journey", "المسيرة المهنية")}
              </motion.p>
              <motion.h2 variants={rise} className="text-4xl md:text-5xl font-black font-heading">
                {t("8 Years of Growth", "8 سنوات من التطور")}
              </motion.h2>
            </div>
            <motion.div variants={rise}>
              <Link href="/about">
                <button className="h-11 px-6 rounded-xl font-bold text-sm border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all">
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            {[
              { yr: "2025 – Now",      en: "Brand Manager",           ar: "مدير العلامة التجارية",      org: "Thamarat Al-Khayr — Fuji Cafe",     tag: t("Current", "حالياً"),   c: "#2563eb" },
              { yr: "2024 – 2025",     en: "Operations & BD Manager", ar: "مدير العمليات والتطوير",     org: "Thamarat Al-Khayr — Fuji Cafe",     tag: "1 yr",  c: "#7c3aed" },
              { yr: "2022 – 2024",     en: "Branch Manager",          ar: "مدير فرع",                   org: "Namq for Beverages",                tag: "2 yrs", c: "#0ea5e9" },
              { yr: "2018 – 2022",     en: "Branch Manager",          ar: "مدير فرع",                   org: "Al-Awaji Commercial Markets",       tag: "4 yrs", c: "#10b981" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="group flex items-center gap-6 p-5 bg-white rounded-2xl border border-border hover:border-blue-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-1.5 h-10 rounded-full flex-shrink-0"
                  style={{ background: item.c }} />
                <div className="w-28 flex-shrink-0 hidden md:block">
                  <span className="text-xs font-mono text-muted-foreground font-semibold">{item.yr}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:text-blue-600 transition-colors">
                    {t(item.en, item.ar)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.org}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${item.c}14`, color: item.c }}>
                  {item.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PROJECT — Matcha Power
      ════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-extrabold tracking-[0.3em] uppercase mb-12 text-blue-600 text-center">
            {t("Featured Project", "مشروع مميز")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden border border-slate-800"
            style={{ background: "linear-gradient(135deg, #0a0e27 0%, #0f1123 50%, #150d2a 100%)" }}
          >
            {/* glows */}
            <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,.25), transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,.15), transparent 70%)" }} />

            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row gap-10 items-start md:items-center">
              {/* icon */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border border-white/10"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                🍵
              </div>

              {/* content */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest border border-violet-500/40 text-violet-300 px-3 py-1 rounded-full bg-violet-500/10">
                    {t("Founder & Developer", "مؤسس ومطور")}
                  </span>
                  <span className="text-xs text-white/35 font-mono">
                    {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black font-heading mb-4">
                  {t("Matcha Power", "ماتشا باور")}
                </h3>
                <p className="text-white/45 leading-relaxed max-w-xl text-sm">
                  {t(
                    "Founded from idea to full operational launch. Built the complete brand vision, business model, customer experience, and growth strategy from scratch.",
                    "تأسيس من الفكرة وحتى الإطلاق التشغيلي الكامل. بناء رؤية العلامة ونموذج العمل وتجربة العميل واستراتيجية النمو من الصفر."
                  )}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {(t(
                    ["Brand Identity", "Business Model", "Market Research", "Growth Strategy", "Customer Experience"],
                    ["هوية العلامة", "نموذج العمل", "بحث السوق", "استراتيجية النمو", "تجربة العميل"]
                  ) as string[]).map(tag => (
                    <span key={tag} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-white/50"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* cta */}
              <Link href="/portfolio" className="flex-shrink-0">
                <button className="h-12 px-7 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-white/50 transition-all whitespace-nowrap"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  {t("View Portfolio", "استعرض الأعمال")}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA — final
      ════════════════════════════════════════════════════ */}
      <section className="py-28 border-t border-border bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img src={logoPath} alt="m-aldbani" className="h-14 w-auto object-contain mb-8 opacity-90" />
              <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight mb-4">
                {t("Ready to build something", "هل أنت مستعد")}
                <br />
                <span style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {t("extraordinary?", "لبناء شيء استثنائي؟")}
                </span>
              </h2>
              <p className="text-foreground/45 mb-8 leading-relaxed">
                {t(
                  "Let's discuss how I can help grow your brand and transform your operations.",
                  "دعنا نتحدث عن كيفية مساعدتي في تنمية علامتك التجارية وتحويل عملياتك."
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/book">
                  <button className="h-13 px-8 py-3.5 rounded-xl font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 8px 30px rgba(37,99,235,.3)" }}>
                    {t("Book Free Consultation", "احجز استشارة مجانية")}
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="h-13 px-8 py-3.5 rounded-xl font-bold text-sm border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all">
                    {t("Get in Touch", "تواصل معي")}
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative hidden md:block"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100"
                style={{ aspectRatio: "4/3" }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(145deg,#e8edf8,#d1d9f0)" }} />
                <img src={photoPath} alt="Mohammed Al-Dabbani"
                  className="relative z-10 w-full h-full object-cover object-top" />
                <div className="absolute inset-0 z-20 pointer-events-none"
                  style={{ background: "linear-gradient(to right, rgba(255,255,255,0.4), transparent 40%)" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
