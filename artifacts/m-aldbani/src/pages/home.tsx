import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 15 });
  useEffect(() => { if (inView) motionVal.set(target); }, [inView, target, motionVal]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; }), [spring, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { target: 8,  suffix: "+", en: "Years Experience",  ar: "سنوات خبرة" },
    { target: 50, suffix: "+", en: "Brands Launched",   ar: "علامة أُطلقت" },
    { target: 2,  suffix: "M+",en: "Customers Served",  ar: "عميل خُدم" },
    { target: 3,  suffix: "",  en: "Industries",        ar: "قطاعات" },
  ];

  const pillars = [
    { num: "01", en: "Business Development", ar: "تطوير الأعمال", descEn: "From concept to full commercial launch — strategy, execution, and scale.", descAr: "من الفكرة إلى الإطلاق التجاري الكامل — استراتيجية وتنفيذ وتوسع." },
    { num: "02", en: "Operations Management", ar: "إدارة العمليات", descEn: "Operational excellence through KPIs, team leadership, and quality systems.", descAr: "التميز التشغيلي عبر مؤشرات الأداء وقيادة الفرق وأنظمة الجودة." },
    { num: "03", en: "Brand Strategy", ar: "استراتيجية العلامة", descEn: "Build brands that resonate — identity, positioning, and market differentiation.", descAr: "بناء علامات تجارية مؤثرة — هوية وتموضع وتميز في السوق." },
  ];

  return (
    <RootLayout>

      {/* ── HERO : full-screen dark ──────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0d1034 0%, #111827 55%, #1a0a2e 100%)" }}
      >
        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b5bdb 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
                style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)" }} />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-5 border border-white/10">
                <img src={logoPath} alt="m-aldbani" className="h-28 w-auto object-contain" />
              </div>
            </div>
          </motion.div>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/15 text-white/60 text-xs font-bold tracking-[0.2em] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("Available for Consulting — Riyadh, KSA", "متاح للاستشارات — الرياض، المملكة العربية السعودية")}
          </motion.div>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-none tracking-tight mb-6"
          >
            {t("Mohammed", "محمد")}
            <br />
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t("Al-Dabbani", "الدباني")}
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/50 text-base md:text-lg max-w-xl mb-4 leading-relaxed"
          >
            {t(
              "Brand Manager & Business Development Specialist with 8+ years in the F&B sector.",
              "مدير علامة تجارية ومتخصص تطوير أعمال بخبرة تزيد عن 8 سنوات في قطاع الأغذية والمشروبات."
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/25 text-xs tracking-[0.35em] uppercase mb-10"
          >
            EXPERIENCE · INNOVATION · IMPACT
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/book">
              <Button size="lg" className="h-14 px-10 font-bold text-sm rounded-xl border-0 text-white"
                style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)", boxShadow: "0 8px 32px rgba(99,102,241,.4)" }}>
                {t("Book Consultation", "احجز استشارة")}
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-14 px-10 font-bold text-sm rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/40 bg-transparent">
                {t("My Story", "قصتي")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.04))" }} />

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="py-0 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-l border-border">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-r border-border py-12 px-8 group hover:bg-slate-50 transition-colors"
              >
                <p className="text-4xl md:text-5xl font-bold font-heading mb-2"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <CountUp target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
                  {t(s.en, s.ar)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ─────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 mb-4">
              {t("What I Do", "ماذا أقدم")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
              {t("Three Areas of Expertise", "ثلاثة محاور للتخصص")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white p-10 flex flex-col gap-6 group hover:bg-slate-50 transition-colors"
              >
                <span className="text-6xl font-bold font-mono leading-none"
                  style={{ background: "linear-gradient(135deg, #e0e7ff, #ede9fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {p.num}
                </span>
                <div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                    {t(p.en, p.ar)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(p.descEn, p.descAr)}
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="h-0.5 w-0 group-hover:w-12 transition-all duration-500 rounded-full"
                    style={{ background: "linear-gradient(90deg, #3b5bdb, #7c3aed)" }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#f8faff" }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 mb-4">
                {t("Who I Am", "من أنا")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 leading-tight">
                {t("Turning ideas into real businesses", "تحويل الأفكار إلى أعمال حقيقية")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t(
                  "I specialize in building brands and operations in the F&B sector from the ground up. From founding Matcha Power to managing Fuji Cafe's brand — my work spans strategy, identity, and execution.",
                  "أتخصص في بناء العلامات التجارية والعمليات في قطاع الأغذية والمشروبات من الصفر. من تأسيس ماتشا باور إلى إدارة علامة فوجي كافية — يمتد عملي من الاستراتيجية إلى الهوية والتنفيذ."
                )}
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-2 border-slate-200 font-bold hover:border-blue-500 hover:text-blue-600 transition-all">
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              {[
                { yr: "2025 – Now",      en: "Brand Manager",            ar: "مدير العلامة التجارية",        org: "Fuji Cafe" },
                { yr: "2024 – 2025",     en: "Operations & BD Manager",  ar: "مدير العمليات والتطوير",      org: "Fuji Cafe" },
                { yr: "2022 – 2024",     en: "Branch Manager",           ar: "مدير فرع",                    org: "Namq Beverages" },
                { yr: "2018 – 2022",     en: "Branch Manager",           ar: "مدير فرع",                    org: "Al-Awaji Markets" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:border-blue-200 hover:shadow-sm transition-all group"
                >
                  <span className="text-xs font-mono text-muted-foreground w-24 flex-shrink-0">{item.yr}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate">
                      {t(item.en, item.ar)}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.org}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROJECT HIGHLIGHT ───────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 mb-12 text-center">
              {t("Featured Project", "مشروع مميز")}
            </p>
            <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100">
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, #0d1034 0%, #1e1b4b 100%)" }} />
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
              <div className="relative z-10 p-10 md:p-14 text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    🍵
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full bg-blue-500/10">
                        {t("Founder", "مؤسس")}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold font-heading mb-3">
                      {t("Matcha Power", "ماتشا باور")}
                    </h3>
                    <p className="text-white/55 leading-relaxed max-w-lg text-sm">
                      {t(
                        "Founded from idea to full operational launch. Built the complete brand vision, business model, and customer experience.",
                        "تأسيس من الفكرة وحتى الإطلاق التشغيلي الكامل. بناء رؤية العلامة ونموذج العمل وتجربة العميل بالكامل."
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link href="/portfolio">
                      <Button className="h-12 px-7 font-bold text-sm rounded-xl border-0 text-white"
                        style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)" }}>
                        {t("View Work", "استعرض الأعمال")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <img src={logoPath} alt="m-aldbani" className="h-16 w-auto object-contain mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-5 leading-tight">
              {t("Let's build", "لنبني")}
              {" "}
              <span style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("together.", "معاً.")}
              </span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              {t(
                "Ready to elevate your brand and operations? Let's talk.",
                "هل أنت مستعد للارتقاء بعلامتك التجارية وعملياتك؟ لنتحدث."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="h-14 px-10 font-bold text-sm rounded-xl border-0 text-white"
                  style={{ background: "linear-gradient(135deg, #3b5bdb, #7c3aed)", boxShadow: "0 8px 32px rgba(99,102,241,.25)" }}>
                  {t("Book Free Consultation", "احجز استشارة مجانية")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 font-bold text-sm rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600">
                  {t("Get in Touch", "تواصل معي")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
