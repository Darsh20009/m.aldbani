import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { target: 8,  suffix: "+", labelEn: "Years Experience",  labelAr: "سنوات خبرة" },
    { target: 50, suffix: "+", labelEn: "Brands Launched",   labelAr: "علامة أُطلقت" },
    { target: 2,  suffix: "M+",labelEn: "Customers Served",  labelAr: "عميل تم خدمته" },
    { target: 3,  suffix: "",  labelEn: "Major Industries",  labelAr: "قطاعات رئيسية" },
  ];

  const pillars = [
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
          <rect x="4" y="20" width="8" height="16" rx="2" fill="url(#p1)"/>
          <rect x="16" y="12" width="8" height="24" rx="2" fill="url(#p1)" fillOpacity="0.7"/>
          <rect x="28" y="4" width="8" height="32" rx="2" fill="url(#p1)" fillOpacity="0.5"/>
          <defs><linearGradient id="p1" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2563EB"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
        </svg>
      ),
      en: "Business Development",
      ar: "تطوير الأعمال",
      descEn: "From concept to full commercial launch — strategy, branding, and execution.",
      descAr: "من الفكرة حتى الإطلاق التجاري الكامل — استراتيجية وهوية وتنفيذ.",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
          <circle cx="20" cy="20" r="14" stroke="url(#p2)" strokeWidth="2" strokeDasharray="4 2"/>
          <circle cx="20" cy="20" r="8" fill="url(#p2)" fillOpacity="0.15"/>
          <circle cx="20" cy="20" r="3" fill="url(#p2)"/>
          <line x1="20" y1="6" x2="20" y2="14" stroke="url(#p2)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="34" y1="20" x2="26" y2="20" stroke="url(#p2)" strokeWidth="2" strokeLinecap="round"/>
          <defs><linearGradient id="p2" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2563EB"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
        </svg>
      ),
      en: "Operations Management",
      ar: "إدارة العمليات",
      descEn: "Operational excellence: KPIs, team leadership, and quality standards.",
      descAr: "التميز التشغيلي: مؤشرات الأداء وقيادة الفرق ومعايير الجودة.",
    },
    {
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
          <path d="M20 5 L35 14 L35 26 L20 35 L5 26 L5 14 Z" stroke="url(#p3)" strokeWidth="2" fill="url(#p3)" fillOpacity="0.08"/>
          <path d="M20 12 L28 17 L28 23 L20 28 L12 23 L12 17 Z" fill="url(#p3)" fillOpacity="0.2"/>
          <circle cx="20" cy="20" r="3" fill="url(#p3)"/>
          <defs><linearGradient id="p3" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2563EB"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
        </svg>
      ),
      en: "Brand Strategy",
      ar: "استراتيجية العلامة",
      descEn: "Build brands that convert — visual identity, positioning, and growth.",
      descAr: "بناء علامات تجارية تُحوِّل — هوية بصرية وتموضع ونمو.",
    },
  ];

  const timeline = [
    { yearEn: "Oct 2025 – Now", yearAr: "أكتوبر 2025 – الآن", titleEn: "Brand Manager", titleAr: "مدير العلامة التجارية", orgEn: "Fuji Cafe", orgAr: "فوجي كافية" },
    { yearEn: "Oct 2024 – Oct 2025", yearAr: "أكت 2024 – أكت 2025", titleEn: "Operations & BD Manager", titleAr: "مدير العمليات وتطوير الأعمال", orgEn: "Fuji Cafe", orgAr: "فوجي كافية" },
    { yearEn: "2022 – Oct 2024", yearAr: "2022 – أكتوبر 2024", titleEn: "Branch Manager", titleAr: "مدير فرع", orgEn: "Namq Beverages", orgAr: "نمق للمشروبات" },
    { yearEn: "2018 – 2022", yearAr: "2018 – 2022", titleEn: "Branch Manager", titleAr: "مدير فرع", orgEn: "Al-Awaji Markets", orgAr: "العواجي التجارية" },
  ];

  return (
    <RootLayout>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        <AnimatedBackground />

        <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left — text */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="order-2 lg:order-1 text-center lg:text-start"
          >
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary mb-6 border border-primary/20 px-4 py-2 rounded-full bg-primary/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("Business Development · F&B Sector", "تطوير الأعمال · قطاع الأغذية والمشروبات")}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl xl:text-7xl font-bold font-heading leading-[1.05] mb-6 tracking-tight"
            >
              {t("Mohammed", "محمد")}
              <br />
              <span className="gradient-text">{t("Al-Dabbani", "الدباني")}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-foreground/55 max-w-lg mb-4 leading-relaxed mx-auto lg:mx-0"
            >
              {t(
                "8+ years building brands, launching operations from zero, and turning ideas into scalable F&B ventures.",
                "أكثر من 8 سنوات في بناء العلامات التجارية وتأسيس العمليات من الصفر وتحويل الأفكار إلى مشاريع F&B قابلة للتوسع."
              )}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-[11px] font-bold tracking-[0.3em] text-foreground/35 uppercase mb-10"
            >
              EXPERIENCE · INNOVATION · IMPACT
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/book">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 h-14 text-sm border-0 shadow-lg shadow-primary/30">
                  <span className="relative z-10">{t("Book Consultation", "احجز استشارة")}</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="font-bold px-8 h-14 text-sm border-2 border-foreground/15 hover:border-primary hover:text-primary transition-all">
                  {t("My Story", "قصتي")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-24px] rounded-full border border-dashed border-primary/15"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-48px] rounded-full border border-dashed border-secondary/10"
              />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-white shadow-2xl shadow-primary/10 flex items-center justify-center border border-primary/8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-secondary/3" />
                <img
                  src={logoPath}
                  alt="m-aldbani"
                  className="relative z-10 w-[85%] h-[85%] object-contain"
                />
              </div>

              {/* floating badges */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl shadow-primary/10 px-4 py-3 border border-border flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground/70">{t("Available", "متاح")}</span>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl shadow-primary/10 px-4 py-3 border border-border"
              >
                <span className="text-xs font-bold gradient-text">Riyadh 🇸🇦</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-foreground/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-foreground/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-[0.03]" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-border border border-border rounded-3xl overflow-hidden bg-white shadow-sm">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center justify-center py-10 px-6 relative group hover:bg-primary/2 transition-colors"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-1/2 bg-gradient-to-r from-primary to-secondary transition-all duration-500" />
                <p className="text-4xl md:text-5xl font-bold font-heading gradient-text mb-2">
                  <CountUp target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-medium tracking-wide text-center">
                  {t(s.labelEn, s.labelAr)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PILLARS ════════════════════════════════════════════ */}
      <section className="py-24 relative bg-[#FAFBFF]">
        <div className="container mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
              {t("What I Do", "ماذا أقدم")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold font-heading">
              {t("Three Core Pillars", "ثلاثة محاور رئيسية")}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/8 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full transition-all duration-500 group-hover:from-primary/10" />
                <div className="relative z-10">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t(p.en, p.ar)}</h3>
                  <p className="text-foreground/55 leading-relaxed text-sm">{t(p.descEn, p.descAr)}</p>
                </div>
                <div className="mt-6 pt-5 border-t border-border/60 flex justify-between items-center">
                  <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("Learn more →", "اعرف أكثر ←")}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <svg className="w-3 h-3 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE TIMELINE ════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/4 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl" />

        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
                {t("Career Journey", "المسيرة المهنية")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                {t("Experience Timeline", "الجدول الزمني للخبرة")}
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent md:-translate-x-0.5" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`flex items-center gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`hidden md:block md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "text-right pr-10" : "text-left pl-10"}`}>
                      <p className="text-xs font-mono text-primary font-bold tracking-wider">
                        {t(item.yearEn, item.yearAr)}
                      </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/20 hidden md:block" />

                    <div className={`flex-1 pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}>
                      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                        <p className="text-xs font-mono text-primary font-bold tracking-wider mb-1 md:hidden">
                          {t(item.yearEn, item.yearAr)}
                        </p>
                        <h4 className="font-bold text-base group-hover:text-primary transition-colors">
                          {t(item.titleEn, item.titleAr)}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(item.orgEn, item.orgAr)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link href="/about">
                <Button variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-bold px-8 h-12 transition-all">
                  {t("Full Biography →", "السيرة الكاملة ←")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECT ═══════════════════════════════════ */}
      <section className="py-24 bg-[#FAFBFF]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-[2rem] overflow-hidden bg-white border border-border shadow-lg"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-bl from-primary/8 to-secondary/4 rounded-full blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-gradient-to-tr from-secondary/6 to-transparent rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-start gap-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-4xl border border-primary/10">
                  🍵
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                    {t("Featured Project", "مشروع مميز")}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-heading mb-3">
                  {t("Matcha Power", "ماتشا باور")}
                </h3>
                <p className="text-foreground/60 mb-6 leading-relaxed max-w-xl">
                  {t(
                    "Founded from idea to full operational launch. Built the brand vision, business model, and customer experience from scratch.",
                    "تأسيس المشروع من الفكرة وحتى الإطلاق التشغيلي الكامل. بناء رؤية العلامة ونموذج العمل وتجربة العميل من الصفر."
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t(
                    ["Brand Identity", "Market Research", "Operations", "Growth Strategy"],
                    ["هوية العلامة", "بحث السوق", "العمليات", "استراتيجية النمو"]
                  ) as string[]).map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold border border-primary/15">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 self-center">
                <Link href="/portfolio">
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 h-12 border-0 shadow-md shadow-primary/20 whitespace-nowrap">
                    {t("View Portfolio", "استعرض الأعمال")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-secondary/4" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563EB" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaGrid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <img src={logoPath} alt="m-aldbani" className="h-20 w-auto object-contain" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight">
              {t("Ready to build", "هل أنت مستعد")}
              <br />
              <span className="gradient-text">{t("something great?", "لبناء شيء عظيم؟")}</span>
            </h2>
            <p className="text-foreground/55 text-lg mb-10 max-w-xl mx-auto">
              {t(
                "Let's discuss how I can help grow your brand and operations.",
                "دعنا نتحدث عن كيفية مساعدتي في تنمية علامتك التجارية وعملياتك."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-10 h-14 text-sm border-0 shadow-xl shadow-primary/25">
                  {t("Book Free Consultation", "احجز استشارة مجانية")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-bold px-10 h-14 text-sm border-2 border-foreground/15 hover:border-primary hover:text-primary">
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
