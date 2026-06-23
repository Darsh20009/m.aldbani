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
      initial={{ opacity: 0, y: 18 }}
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
    const duration = 1600;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
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
          HERO
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 min-h-[88vh] items-center gap-0">

            {/* Left — Text */}
            <div className="py-16 lg:py-0 lg:pr-16 border-b lg:border-b-0 lg:border-r border-slate-100">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-10"
              >
                <img src={logoPath} alt="m-aldbani" className="h-10 w-auto object-contain" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-5"
              >
                {t("Brand Manager · Business Development", "مدير علامة تجارية · تطوير أعمال")}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading font-black leading-[1.0] tracking-tight text-slate-900 mb-6"
                style={{ fontSize: "clamp(44px, 6.5vw, 80px)" }}
              >
                {t("Mohammed\nAl-Dabbani", "محمد\nالدباني")}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.55 }}
                className="w-14 h-[3px] rounded-full mb-7"
                style={{ background: "linear-gradient(90deg, #1d4ed8, #6d28d9)" }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-slate-500 leading-relaxed text-base max-w-sm mb-10"
              >
                {t(
                  "8+ years of experience in the F&B sector specializing in brand management, business development, and operations leadership in Saudi Arabia.",
                  "أكثر من 8 سنوات من الخبرة في قطاع الأغذية والمشروبات متخصصاً في إدارة العلامات التجارية وتطوير الأعمال وقيادة العمليات في المملكة العربية السعودية."
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-12"
              >
                <Link href="/book">
                  <button className="h-12 px-8 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" }}>
                    {t("Book a Consultation", "احجز استشارة")}
                  </button>
                </Link>
                <Link href="/about">
                  <button className="h-12 px-8 rounded-lg font-bold text-sm text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
                    {t("My Profile", "ملفي الشخصي")}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72 }}
                className="flex items-center gap-2 text-xs text-slate-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t("Available for new projects · Riyadh, Saudi Arabia", "متاح لمشاريع جديدة · الرياض، المملكة العربية السعودية")}
              </motion.div>
            </div>

            {/* Right — Photo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center py-12 lg:pl-16"
            >
              <div className="relative w-full max-w-[400px]">
                {/* accent rectangle */}
                <div className="absolute -top-5 -right-5 w-full h-full rounded-2xl border-2 border-blue-100" />

                {/* photo */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-100"
                  style={{ aspectRatio: "3/4", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
                  <img
                    src={photoPath}
                    alt="Mohammed Al-Dabbani"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* subtle bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)" }} />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-white text-sm font-bold">
                      {t("Mohammed Al-Dabbani", "محمد الدباني")}
                    </p>
                    <p className="text-white/65 text-xs">
                      {t("Riyadh, Saudi Arabia 🇸🇦", "الرياض، المملكة العربية السعودية 🇸🇦")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { n: 8,  s: "+", en: "Years of Experience",  ar: "سنوات خبرة" },
              { n: 50, s: "+", en: "Brands Launched",      ar: "علامة أُطلقت" },
              { n: 2,  s: "M+",en: "Customers Served",     ar: "عميل خُدم" },
              { n: 3,  s: "",  en: "Industries",           ar: "قطاعات عمل" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.07}
                className={`py-10 px-8 border-r border-slate-100 last:border-r-0 ${i >= 2 ? "border-t md:border-t-0" : ""}`}>
                <p className="text-4xl font-black font-heading text-slate-900 mb-1">
                  <CountUp to={s.n} suffix={s.s} />
                </p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  {t(s.en, s.ar)}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          AREAS OF EXPERTISE
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <FadeIn className="mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-700 mb-3">
              {t("Areas of Expertise", "مجالات التخصص")}
            </p>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-900">
              {t("What I specialize in", "ما أتخصص فيه")}
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                en: "Business Development",
                ar: "تطوير الأعمال",
                dEn: "Designing and executing business strategies from concept to full market launch, including partnerships, pricing models, and revenue planning.",
                dAr: "تصميم وتنفيذ استراتيجيات الأعمال من المفهوم إلى الإطلاق الكامل، بما يشمل الشراكات ونماذج التسعير وتخطيط الإيرادات.",
              },
              {
                n: "02",
                en: "Operations Management",
                ar: "إدارة العمليات",
                dEn: "Building operational frameworks with measurable KPIs, staff development programs, quality control systems, and efficiency optimization.",
                dAr: "بناء أطر تشغيلية بمؤشرات أداء قابلة للقياس وبرامج تطوير الكوادر وأنظمة ضبط الجودة وتحسين الكفاءة.",
              },
              {
                n: "03",
                en: "Brand Strategy",
                ar: "استراتيجية العلامة",
                dEn: "Crafting brand identity, market positioning, and customer experience ecosystems that build long-term loyalty and market differentiation.",
                dAr: "بناء هوية العلامة والتموضع السوقي ومنظومة تجربة العملاء التي تُرسّخ الولاء طويل الأمد والتميز في السوق.",
              },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group bg-white border border-slate-200 rounded-xl p-8 h-full hover:border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold font-mono text-slate-300 tracking-widest">{p.n}</span>
                    <div className="w-8 h-[2px] rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
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
          CAREER HISTORY
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-[320px_1fr] gap-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-700 mb-3">
                {t("Professional History", "التاريخ المهني")}
              </p>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-900 mb-5">
                {t("Career Experience", "الخبرة المهنية")}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {t(
                  "A progression through leadership roles in Saudi Arabia's F&B sector, from branch management to brand strategy.",
                  "تدرّج في أدوار قيادية بقطاع الأغذية والمشروبات في المملكة العربية السعودية، من إدارة الفروع إلى استراتيجية العلامة التجارية."
                )}
              </p>
              <Link href="/about">
                <button className="text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
                  {t("View Full Biography →", "السيرة الكاملة ←")}
                </button>
              </Link>
            </FadeIn>

            <div className="space-y-3">
              {[
                {
                  yr: "2025 – Present",
                  en: "Brand Manager",
                  ar: "مدير العلامة التجارية",
                  org: "Thamarat Al-Khayr Co. — Fuji Cafe",
                  current: true,
                },
                {
                  yr: "2024 – 2025",
                  en: "Operations & Business Development Manager",
                  ar: "مدير العمليات وتطوير الأعمال",
                  org: "Thamarat Al-Khayr Co. — Fuji Cafe",
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
                  <div className="flex items-start gap-5 p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                    <div className="flex-shrink-0 w-[100px] pt-0.5">
                      <span className="text-xs font-mono text-slate-400">{item.yr}</span>
                    </div>
                    <div className="flex-shrink-0 mt-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${item.current ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{t(item.en, item.ar)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.org}</p>
                      {item.current && (
                        <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
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
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <FadeIn className="mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-700 mb-3">
              {t("Featured Project", "مشروع مميز")}
            </p>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-900">
              {t("Entrepreneurial Venture", "المشروع الريادي")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-400">
              <div className="grid md:grid-cols-[auto_1fr_auto] gap-0 items-center">
                {/* left accent */}
                <div className="hidden md:block w-1.5 self-stretch rounded-none"
                  style={{ background: "linear-gradient(to bottom, #1d4ed8, #6d28d9)" }} />

                {/* content */}
                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                      {t("Founder & CEO", "مؤسس ورئيس تنفيذي")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black font-heading text-slate-900 mb-3">
                    {t("Matcha Power", "ماتشا باور")}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm max-w-xl mb-6">
                    {t(
                      "Led the full founding journey from concept to operational launch: brand identity, business model design, market research, team building, and commercial rollout.",
                      "قاد رحلة التأسيس الكاملة من الفكرة إلى الإطلاق التشغيلي: هوية العلامة وتصميم نموذج العمل وبحث السوق وبناء الفريق والإطلاق التجاري."
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

                {/* right CTA */}
                <div className="p-8 border-t md:border-t-0 md:border-l border-slate-100 flex items-center justify-center">
                  <Link href="/portfolio">
                    <button className="h-11 px-6 rounded-lg font-bold text-sm text-blue-700 border border-blue-200 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300 whitespace-nowrap">
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
          CONTACT CTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-700 mb-4">
                  {t("Get In Touch", "تواصل معي")}
                </p>
                <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-900 mb-5 leading-tight">
                  {t("Ready to work together?", "هل أنت مستعد للتعاون؟")}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8 text-sm">
                  {t(
                    "Whether you need strategic consulting, brand development, or operational guidance — I'm available for serious engagements.",
                    "سواء كنت بحاجة إلى استشارة استراتيجية أو تطوير علامة أو توجيه تشغيلي — أنا متاح للتعاونات الجادة."
                  )}
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 w-4">📧</span>
                    <a href="mailto:Moh.aldbani@gmail.com" className="text-slate-700 hover:text-blue-700 transition-colors font-medium">
                      Moh.aldbani@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 w-4">📱</span>
                    <a href="tel:+966552469643" className="text-slate-700 hover:text-blue-700 transition-colors font-medium">
                      +966 552 469 643
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 w-4">📍</span>
                    <span className="text-slate-500">
                      {t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية")}
                    </span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                  <img src={logoPath} alt="m-aldbani" className="h-12 w-auto object-contain mb-6" />
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {t(
                      "\"Experience, innovation, and impact — these are not just words. They are the standard I hold my work to.\"",
                      "«الخبرة والابتكار والأثر — ليست مجرد كلمات. إنها المعيار الذي أحكم به على عملي.»"
                    )}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    — {t("Mohammed Al-Dabbani", "محمد الدباني")}
                  </p>
                  <div className="mt-8 flex flex-col gap-3">
                    <Link href="/book">
                      <button className="w-full h-12 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" }}>
                        {t("Book a Consultation", "احجز استشارة")}
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="w-full h-12 rounded-lg font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
                        {t("Send a Message", "أرسل رسالة")}
                      </button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
