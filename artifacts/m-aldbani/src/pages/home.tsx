import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft } from "lucide-react";

/* ── Brand logo imports ─────────────────────────── */
import mdLogo        from "@assets/Screenshot_2026-07-09_at_2.14.54_AM_1783552521055.png";
import fujiLogo      from "@assets/Screenshot_2026-07-01_at_3.07.57_AM_1783549571265.png";
import communityLogo from "@assets/Screenshot_2026-07-01_at_3.13.59_AM_1783549571269.png";
import qiroxLogo     from "@assets/Screenshot_2026-07-09_at_1.27.26_AM_1783549658879.png";
import genmzImg      from "@assets/PHOTO-2026-07-07-01-59-22_1783549857639.jpg";

/* ── Design tokens ──────────────────────────────── */
const BG        = "#F5F5F3";
const BLACK     = "#0F0F10";
const GRAPHITE  = "#3A3A3A";
const TITANIUM  = "#8C9198";
const GOLD      = "#C7AC70";

/* ── Fade-up animation ──────────────────────────── */
const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Marquee strip ──────────────────────────────── */
function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-t border-b" style={{ borderColor: "rgba(0,0,0,0.08)", background: BLACK }}>
      <div className="marquee-track py-3 gap-12">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-5 whitespace-nowrap select-none">
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: TITANIUM }}>
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Process card ───────────────────────────────── */
function ProcessCard({
  num, title, desc, rotate = "0deg", translate = "0px,0px", zIndex = 0
}: {
  num: string; title: string; desc: string;
  rotate?: string; translate?: string; zIndex?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute rounded-2xl p-8 shadow-xl"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        transform: `rotate(${rotate}) translate(${translate})`,
        zIndex,
        width: "280px",
        minHeight: "200px",
      }}
    >
      <span className="text-6xl font-black" style={{ color: BLACK, lineHeight: 1 }}>{num}</span>
      <h3 className="mt-4 text-lg font-bold" style={{ color: BLACK }}>{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: TITANIUM }}>{desc}</p>
    </motion.div>
  );
}

/* ── Brand card ─────────────────────────────────── */
function BrandCard({
  logo, name, tag, bg = "#1a1a1a", logoFit = "contain", dark = true
}: {
  logo?: string; name: string; tag: string; bg?: string; logoFit?: "contain" | "cover"; dark?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl overflow-hidden relative cursor-pointer"
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="aspect-[4/3] flex items-center justify-center p-8">
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full"
            style={{ objectFit: logoFit, maxHeight: 140 }} />
        ) : (
          <span className="text-2xl font-black" style={{ color: dark ? "#fff" : BLACK }}>{name}</span>
        )}
      </div>
      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: dark ? "#fff" : BLACK }}>{name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          background: "rgba(255,255,255,0.1)",
          color: dark ? TITANIUM : GRAPHITE
        }}>{tag}</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════ */
export default function Home() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const { data: rawServices } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices.slice(0, 4) : [];
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const marqueeItems = [
    "Brand Strategy", "F&B Operations", "Business Development",
    "استراتيجية العلامة", "التشغيل", "تطوير الأعمال",
    "Management Systems", "AI & Automation", "Market Analysis",
  ];

  const experiences = [
    { role: t("Business Development", "تطوير أعمال"), company: "QIROX",        period: "2024 → Now" },
    { role: t("Brand Manager",        "مدير علامة"),  company: "Fuji Cafe",     period: "2023 → 2024" },
    { role: t("Operations Manager",   "مدير عمليات"), company: "F&B Group",     period: "2019 → 2023" },
    { role: t("Brand Consultant",     "مستشار ماركة"), company: "Freelance",    period: "2016 → 2019" },
  ];

  return (
    <RootLayout>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-0"
        style={{ background: BG }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(199,172,112,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">

          {/* Status badge */}
          <motion.div {...fu(0)} className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[13px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: GRAPHITE,
              }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
              {t("Available for New Projects", "متاح للمشاريع الجديدة")}
              <span className="mx-1 opacity-30">·</span>
              {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة تجارية · F&B · المملكة العربية السعودية")}
            </div>
          </motion.div>

          {/* Giant headline */}
          <motion.div {...fu(0.06)} className="text-center">
            {/* Line 1 */}
            <div className="flex items-center justify-center gap-4 flex-wrap" style={{ lineHeight: 0.9 }}>
              <span className="font-black text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7rem] leading-none tracking-tight"
                style={{ color: BLACK }}>
                {t("BRAND", "إدارة")}
              </span>
              {/* Logo mark embedded in headline */}
              <div className="inline-flex rounded-2xl overflow-hidden shadow-xl mx-2"
                style={{ width: "clamp(60px, 8vw, 110px)", height: "clamp(60px, 8vw, 110px)", background: BLACK }}>
                <img src={mdLogo} alt="MD" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="font-black text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7rem] leading-none tracking-tight"
                style={{ color: TITANIUM }}>
                {t("MANAGER", "العلامات")}
              </span>
            </div>

            {/* Line 2 */}
            <div className="flex items-center justify-center gap-4 flex-wrap mt-2" style={{ lineHeight: 0.9 }}>
              <span className="font-black text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7rem] leading-none tracking-tight"
                style={{ color: TITANIUM }}>
                {t("& BUSINESS", "والأعمال")}
              </span>
              <div className="inline-flex rounded-2xl overflow-hidden shadow-xl mx-2"
                style={{
                  width: "clamp(50px, 6vw, 90px)", height: "clamp(50px, 6vw, 90px)",
                  background: GOLD, alignItems: "center", justifyContent: "center"
                }}>
                <span className="text-white font-black text-2xl">F&B</span>
              </div>
              <span className="font-black text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7rem] leading-none tracking-tight"
                style={{ color: BLACK }}>
                {t("DEV", "تطوير")}
              </span>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p {...fu(0.12)} className="text-center mt-8 text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: TITANIUM }}>
            {t(
              "I seek a leadership position in business development and operations in the F&B sector, contributing to brand building through strategy, execution, and continuous performance improvement.",
              "أسعى لتولي منصب قيادي في مجال تطوير الأعمال والتشغيل بقطاع الأغذية والمشروبات، مساهماً في بناء العلامات من خلال الاستراتيجية والتنفيذ وتحسين الأداء المستمر."
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fu(0.16)} className={`flex items-center justify-center gap-3 mt-10 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/book">
              <button className="btn-black">
                {t("Book Consultation", "احجز استشارة")}
                <Arrow size={16} />
              </button>
            </Link>
            <Link href="/portfolio">
              <button className="btn-ghost">
                {t("See My Work", "أعمالي")}
              </button>
            </Link>
          </motion.div>

          {/* Brand logos strip */}
          <motion.div {...fu(0.22)} className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: TITANIUM }}>
              {t("Brands I've Worked With", "علامات عملت معها")}
            </p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {[
                { img: fujiLogo,      bg: "#fff",    size: 60 },
                { img: qiroxLogo,     bg: "#111",    size: 80 },
                { img: communityLogo, bg: "#1a2e5a", size: 60 },
              ].map(({ img, bg, size }, i) => (
                <div key={i} className="rounded-xl overflow-hidden flex items-center justify-center p-2"
                  style={{ background: bg, width: size + 16, height: 44 }}>
                  <img src={img} alt="" className="object-contain" style={{ height: 28, maxWidth: size }} />
                </div>
              ))}
              <div className="rounded-xl px-4 py-2 text-xs font-bold"
                style={{ background: "#f0f0f0", color: GRAPHITE }}>GENMZ</div>
              <div className="rounded-xl px-4 py-2 text-xs font-bold"
                style={{ background: "#2d6a4f", color: "#fff" }}>{t("MATCHA POWER", "ماتشا باور")}</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex justify-center pb-8 mt-14"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          >
            <div className="w-1 h-2 rounded-full" style={{ background: GOLD }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <Marquee items={marqueeItems} />

      {/* ══════════════════════════════════════════
          2. RECENT WORK — dark brand grid
      ══════════════════════════════════════════ */}
      <section className="py-24" style={{ background: BLACK }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <motion.div {...fu(0)} className={`flex items-end justify-between mb-12 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <div className="section-eyebrow mb-2" style={{ color: GOLD }}>
                {t("Our Projects", "مشاريعنا")}
              </div>
              <h2 className="text-4xl md:text-5xl font-black" style={{ color: "#fff" }}>
                {t("Recent Work", "أحدث الأعمال")}
              </h2>
            </div>
            <Link href="/portfolio">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: TITANIUM }}
              >
                {t("View All", "عرض الكل")} <Arrow size={14} />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div {...fu(0)} className="sm:col-span-2 lg:col-span-1">
              <BrandCard logo={fujiLogo}      name="Fuji Cafe"     tag={t("F&B Brand","علامة F&B")}       bg="#fff"    dark={false} logoFit="contain" />
            </motion.div>
            <motion.div {...fu(0.05)}>
              <BrandCard logo={qiroxLogo}     name="QIROX"         tag={t("Systems","أنظمة")}              bg="#111111" logoFit="contain" />
            </motion.div>
            <motion.div {...fu(0.1)}>
              <BrandCard logo={communityLogo} name={t("Community Initiative","مجتمع مبادرة")} tag={t("Marketing","تسويق")} bg="#1a2e5a" logoFit="contain" />
            </motion.div>
            <motion.div {...fu(0.15)}>
              <BrandCard logo={genmzImg}      name="GEN M&Z"       tag={t("Fashion Brand","علامة أزياء")} bg="#1a1a1a" logoFit="cover" />
            </motion.div>
            <motion.div {...fu(0.2)}>
              <BrandCard name={t("Matcha Power","ماتشا باور")} tag={t("Beverages","مشروبات")} bg="#2d6a4f" />
            </motion.div>
            {/* "See all" card */}
            <Link href="/portfolio">
              <motion.div
                {...fu(0.25)}
                whileHover={{ y: -4 }}
                className="rounded-2xl flex flex-col items-center justify-center aspect-[4/3] cursor-pointer border-2 border-dashed transition-all"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: TITANIUM }}
              >
                <Arrow size={24} />
                <p className="mt-3 text-sm font-semibold">{t("View All Work", "كل الأعمال")}</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. PROCESS — 3 tilted cards
      ══════════════════════════════════════════ */}
      <section className="py-28 overflow-hidden" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <motion.div {...fu(0)} className="text-center mb-24">
            <p className="section-eyebrow mb-3">{t("Our Process, Explained", "طريقة عملنا")}</p>
            <h2 className="text-4xl md:text-5xl font-black" style={{ color: BLACK }}>
              {t("Here's how it works", "كيف تسير الأمور")}
            </h2>
          </motion.div>

          {/* Cards container — tilt effect */}
          <div className="relative flex items-center justify-center" style={{ height: 320 }}>
            {/* Card 1 */}
            <ProcessCard
              num="1" zIndex={1}
              rotate="-5deg" translate="-230px, 20px"
              title={t("Connect", "التواصل")}
              desc={t("Book a free intro call to discuss your vision and goals.", "احجز مكالمة مجانية لمناقشة رؤيتك وأهدافك.")}
            />
            {/* Card 2 */}
            <ProcessCard
              num="2" zIndex={3}
              rotate="2deg" translate="0px, -30px"
              title={t("Strategize", "التخطيط")}
              desc={t("We build a tailored action plan aligned with your brand objectives.", "نبني خطة عمل مصممة لأهداف علامتك التجارية.")}
            />
            {/* Card 3 */}
            <ProcessCard
              num="3" zIndex={2}
              rotate="-2deg" translate="220px, 10px"
              title={t("Execute", "التنفيذ")}
              desc={t("Full execution — systems, operations, brand, results.", "تنفيذ كامل: أنظمة، عمليات، علامة تجارية، نتائج.")}
            />

            {/* SVG connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 320" fill="none">
              <path d="M 175 120 C 250 80, 320 100, 350 90" stroke="#C7AC70" strokeWidth="1.5" fill="none"
                strokeDasharray="4 4" opacity="0.5" />
              <path d="M 350 90 C 400 80, 460 100, 520 120" stroke="#C7AC70" strokeWidth="1.5" fill="none"
                strokeDasharray="4 4" opacity="0.5" />
              <circle cx="175" cy="120" r="4" fill="#C7AC70" opacity="0.6" />
              <circle cx="350" cy="90"  r="4" fill="#C7AC70" opacity="0.6" />
              <circle cx="520" cy="120" r="4" fill="#C7AC70" opacity="0.6" />
            </svg>
          </div>

          <motion.div {...fu(0.3)} className="flex justify-center mt-16">
            <Link href="/book">
              <button className="btn-black">
                {t("Start the Process", "ابدأ الآن")} <Arrow size={16} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. SERVICES — grid cards
      ══════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24" style={{ background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-12">

            <motion.div {...fu(0)} className={`flex items-end justify-between mb-12 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <p className="section-eyebrow mb-2">{t("What I Offer", "ما أقدمه")}</p>
                <h2 className="text-4xl md:text-5xl font-black" style={{ color: BLACK }}>
                  {t("Services", "الخدمات")}
                </h2>
              </div>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border border-black/10 transition-all hover:bg-black/4"
                  style={{ color: GRAPHITE }}>
                  {t("All Services", "كل الخدمات")} <Arrow size={14} />
                </motion.button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc: any, i: number) => (
                <motion.div
                  key={svc.id || i}
                  {...fu(i * 0.06)}
                  whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.08)" }}
                  className="p-7 rounded-2xl border transition-all cursor-default"
                  style={{ border: "1px solid rgba(0,0,0,0.06)", background: BG }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{svc.icon || "⚡"}</span>
                    {svc.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ background: GOLD + "22", color: GOLD }}>
                        {t("Featured", "مميز")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BLACK }}>
                    {isRTL ? svc.titleAr : svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TITANIUM }}>
                    {isRTL ? svc.descriptionAr : svc.description}
                  </p>
                  {svc.price && (
                    <p className="mt-4 text-sm font-bold" style={{ color: GOLD }}>{svc.price}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          5. ABOUT TEASER
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <motion.div {...fu(0)} className="mb-16">
            <p className="section-eyebrow mb-3">{t("About Me", "من أنا")}</p>
            <h2 className="text-4xl md:text-6xl font-black leading-tight" style={{ color: BLACK }}>
              {t("Building F&B brands", "أبني علامات F&B")}
              <br />
              <span style={{ color: TITANIUM }}>{t("since 2016", "منذ ٢٠١٦")}</span>
            </h2>
          </motion.div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 ${isRTL ? "lg:flex lg:flex-row-reverse" : ""}`}>

            {/* Left — big logo display */}
            <motion.div {...fu(0.06)}
              className="rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ background: BLACK, minHeight: 380 }}>
              <div className="p-12 flex flex-col items-center text-center">
                <img src={mdLogo} alt="MD Logo" className="w-40 h-40 object-contain mb-6" />
                <p className="text-white font-black text-xl tracking-wide">MOHAMMED</p>
                <p className="text-[#C7AC70] font-black text-xl tracking-wide">AL-DABBANI</p>
                <p className="text-[#8C9198] text-xs tracking-[0.3em] mt-2 uppercase">
                  {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة · F&B · المملكة")}
                </p>
              </div>
            </motion.div>

            {/* Right — bio + experience table */}
            <motion.div {...fu(0.1)} className="flex flex-col justify-center">
              <p className="text-base leading-loose mb-10" style={{ color: GRAPHITE }}>
                {t(
                  "I seek a leadership position in business development and operations in the F&B sector, contributing to brand building through strategy development, operational plan execution, and continuous performance improvement. I innovate solutions that guarantee sustainability and profitability.",
                  "أسعى لتولي منصب قيادي في مجال تطوير الأعمال والتشغيل بقطاع الأغذية والمشروبات، مساهماً في بناء العلامات التجارية من خلال وضع الاستراتيجيات وتنفيذ الخطط التشغيلية وتحسين الأداء المستمر. أبتكر حلولاً تضمن الاستدامة والربحية."
                )}
              </p>

              {/* Experience timeline */}
              <div className="space-y-0">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    {...fu(0.1 + i * 0.05)}
                    className="timeline-row"
                  >
                    <span className="text-sm font-semibold flex-1" style={{ color: GRAPHITE }}>{exp.role}</span>
                    <span className="text-sm font-bold" style={{ color: BLACK }}>{exp.company}</span>
                    <span className="text-xs font-mono" style={{ color: TITANIUM }}>{exp.period}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div {...fu(0.3)} className="mt-10">
                <Link href="/about">
                  <button className="btn-black">
                    {t("Learn More", "اعرف أكثر")} <Arrow size={16} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. CONTACT CTA — full dark
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-32 flex flex-col items-center justify-center text-center"
        style={{ background: BLACK }}>

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(199,172,112,0.08) 0%, transparent 70%)" }} />

        <motion.div {...fu(0)} className="relative z-10 max-w-3xl px-6">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: GOLD, opacity: 0.5 }} />
            <span className="section-eyebrow" style={{ color: GOLD }}>
              {t("2 spots available", "مكانان متاحان")}
            </span>
            <div className="h-px w-12" style={{ background: GOLD, opacity: 0.5 }} />
          </div>

          {/* Big headline */}
          <h2 className="font-black leading-none mb-6" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", color: "#fff" }}>
            {t("Let's", "دعنا")}{" "}
            <span style={{ color: TITANIUM }}>{t("Connect", "نتعاون")}</span>
          </h2>

          <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ color: TITANIUM }}>
            {t(
              "Feel free to reach out if you have a project in mind or want to explore collaboration.",
              "تواصل معي إذا كان لديك مشروع أو ترغب في التعاون."
            )}
          </p>

          <Link href="/book">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-9 py-4 rounded-full text-base font-bold border-2 mx-auto transition-all"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
            >
              {t("Book a free intro call", "احجز مكالمة مجانية")}
              <Arrow size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </RootLayout>
  );
}
