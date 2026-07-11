import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { useListServices } from "@workspace/api-client-react";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { LogoBrandImage, LogoInline } from "../components/Logo";
import { Tilt3D } from "../components/Tilt3D";
import { LuxuryConnectPanel } from "../components/LuxuryConnectPanel";

/* ── Brand logo imports ─────────────────────────── */
import fujiLogo      from "@assets/fuji_no_bg.png";
import communityLogo from "@assets/community_no_bg.png";
import qiroxLogo     from "@assets/qirox_no_bg.png";
import genmzImg      from "@assets/genmz_no_bg.png";

/* ── Design tokens ──────────────────────────────── */
const BG       = "#F5F5F3";
const BLACK    = "#0F0F10";
const GRAPHITE = "#3A3A3A";
const TITANIUM = "#8C9198";
const GOLD     = "#C7AC70";

/* ── Shared animation helpers ───────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.72, delay, ease: EASE },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ── Rotating word badge (F&B / RETAIL / HOSPITALITY…) ──── */
const BADGE_WORDS_EN = ["F&B", "BRAND STRATEGY", "BUSINESS DEV", "OPERATIONS"];
const BADGE_WORDS_AR = ["F&B", "استراتيجية العلامة", "تطوير الأعمال", "إدارة العمليات"];

function RotatingWordBadge({ isRTL }: { isRTL: boolean }) {
  const words = isRTL ? BADGE_WORDS_AR : BADGE_WORDS_EN;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-black text-white text-xl md:text-2xl px-4 py-1 mx-1 shadow-lg"
      style={{ background: `linear-gradient(135deg, ${GOLD}, #a8914a)`, letterSpacing: "-0.01em" }}
    >
      {/* invisible widest word keeps badge width stable */}
      <span className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Marquee strip ──────────────────────────────── */
function Marquee({ items, rtl = false }: { items: string[]; rtl?: boolean }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-t border-b" style={{ borderColor: "rgba(0,0,0,0.08)", background: BLACK }}>
      <div className={`marquee-track py-3 gap-12 ${rtl ? "marquee-track-rtl" : ""}`}>
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

/* ── iPad 3D partner card ────────────────────────── */
function IpadPartnerCard({
  name, logo, url, screenBg = "#0a0a0a", invert = false, delay = 0, compact = false,
}: {
  name: string; logo?: string; url: string;
  screenBg?: string; invert?: boolean; delay?: number; compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <motion.div
        {...fu(delay)}
        className="flex flex-col items-center gap-5 cursor-pointer group select-none"
        onClick={() => { setOpen(true); setLoaded(false); }}
      >
        {/* 3-D iPad Pro shell */}
        <div style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}>
          <div
            className="relative transition-all duration-500 ease-out group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.06)]"
            style={{
              transform: "rotateY(-18deg) rotateX(7deg)",
              transformStyle: "preserve-3d",
              width: compact ? 100 : 170,
              height: compact ? 140 : 238,
            }}
          >
            {/* ── Front face ── */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: compact ? 14 : 22,
                background: "linear-gradient(145deg, #2c2c2e, #1a1a1c)",
                boxShadow:
                  "0 28px 70px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
              }}
            >
              {/* Screen */}
              <div
                className="absolute flex items-center justify-center overflow-hidden"
                style={{ inset: compact ? 6 : 10, borderRadius: compact ? 9 : 14, background: screenBg }}
              >
                {logo && (
                  <img
                    src={logo}
                    alt={name}
                    style={{
                      maxWidth: "68%",
                      maxHeight: "48%",
                      objectFit: "contain",
                      filter: invert ? "brightness(0) invert(1)" : "none",
                    }}
                  />
                )}
                {/* Glare */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%)",
                  }}
                />
              </div>
              {/* Front camera */}
              <div
                className="absolute"
                style={{
                  top: 5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3a3a3c",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
                }}
              />
            </div>
            {/* ── Right edge (depth) ── */}
            <div
              className="absolute"
              style={{
                top: 10,
                bottom: 10,
                right: -7,
                width: 7,
                background: "linear-gradient(to bottom, #1a1a1c, #111)",
                borderRadius: "0 3px 3px 0",
                transform: "rotateY(90deg)",
                transformOrigin: "left center",
              }}
            />
            {/* ── Bottom edge (depth) ── */}
            <div
              className="absolute"
              style={{
                bottom: -5,
                left: 10,
                right: 10,
                height: 5,
                background: "#111",
                borderRadius: "0 0 3px 3px",
                transform: "rotateX(-90deg)",
                transformOrigin: "top center",
              }}
            />
            {/* ── Power button on right edge ── */}
            <div
              className="absolute"
              style={{
                top: 56,
                right: -10,
                width: 3,
                height: 28,
                background: "#111",
                borderRadius: 2,
                transform: "rotateY(90deg) translateZ(-1px)",
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>

        {/* Label — hidden in compact mode */}
        {!compact && (
          <div className="text-center">
            <p
              className="text-sm font-bold transition-colors duration-300 group-hover:text-blue-600"
              style={{ color: BLACK }}
            >
              {name}
            </p>
            <p className="text-[11px] mt-0.5 transition-opacity duration-300 group-hover:opacity-100 opacity-60" style={{ color: TITANIUM }}>
              اضغط للزيارة ↗
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Iframe modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-3 md:p-8"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ maxWidth: 1000, height: "85vh", background: "#fff" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-4 py-2.5 shrink-0"
                style={{
                  background: "rgba(10,10,10,0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  {logo && (
                    <img
                      src={logo}
                      alt={name}
                      className="h-5 object-contain"
                      style={{ maxWidth: 72, filter: "brightness(0) invert(1)" }}
                    />
                  )}
                  <span className="text-white text-sm font-semibold">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] px-3 py-1 rounded-full font-semibold text-white"
                    style={{ background: "rgba(255,255,255,0.14)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    فتح ↗
                  </a>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-base leading-none"
                    style={{ background: "rgba(255,255,255,0.14)" }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Loading spinner */}
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: 44 }}>
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">جاري التحميل…</p>
                  </div>
                </div>
              )}

              <iframe
                src={url}
                title={name}
                className="flex-1 w-full"
                style={{
                  border: "none",
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 0.35s",
                }}
                onLoad={() => setLoaded(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Process card (tilted) ──────────────────────── */
function ProcessCard({
  num, title, desc, rotate = "0deg", translate = "0px,0px", zIndex = 0,
}: {
  num: string; title: string; desc: string;
  rotate?: string; translate?: string; zIndex?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: EASE }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="absolute rounded-2xl p-8 shadow-xl cursor-default"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        left: "calc(50% - 145px)",
        top: "60px",
        transform: `rotate(${rotate}) translate(${translate})`,
        zIndex,
        width: "290px",
        minHeight: "210px",
      }}
    >
      <span className="text-[4.5rem] font-black leading-none block" style={{ color: BLACK }}>{num}</span>
      <h3 className="mt-3 text-lg font-bold" style={{ color: BLACK }}>{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: TITANIUM }}>{desc}</p>
    </motion.div>
  );
}

/* ── Work showcase card ─────────────────────────── */
function WorkCard({
  logo, name, tag, bg = "#1a1a1a", logoFit = "contain", dark = true,
  wide = false, tall = false,
}: {
  logo?: string; name: string; tag: string; bg?: string;
  logoFit?: "contain" | "cover"; dark?: boolean;
  wide?: boolean; tall?: boolean;
}) {
  return (
    <Tilt3D className={`${wide ? "col-span-2" : ""} ${tall ? "row-span-2" : ""}`} maxTilt={7}>
      <motion.div
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="rounded-2xl overflow-hidden relative group cursor-pointer h-full"
        style={{
          background: bg,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 12px 28px -8px rgba(0,0,0,0.35)",
        }}
      >
        <div className={`flex items-center justify-center p-10 ${tall ? "min-h-[360px]" : "min-h-[200px]"}`}>
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              style={{ objectFit: logoFit, maxHeight: tall ? 180 : 120, maxWidth: "80%" }} />
          ) : (
            <span className="text-3xl font-black" style={{ color: dark ? "#fff" : BLACK }}>{name}</span>
          )}
        </div>
        <div className="px-5 pb-5 flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: dark ? "#fff" : BLACK }}>{name}</span>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{
            background: "rgba(255,255,255,0.08)",
            color: dark ? TITANIUM : GRAPHITE
          }}>{tag}</span>
        </div>
      </motion.div>
    </Tilt3D>
  );
}

/* ── Section eyebrow ────────────────────────────── */
function Eyebrow({ en, ar, t, gold = false }: { en: string; ar: string; t: (e: string, a: string) => string; gold?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px w-8 opacity-40" style={{ background: gold ? GOLD : GRAPHITE }} />
      <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: gold ? GOLD : TITANIUM }}>
        {t(en, ar)}
      </p>
      <div className="h-px w-8 opacity-40" style={{ background: gold ? GOLD : GRAPHITE }} />
    </div>
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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const marqueeItems = [
    "Brand Strategy", "F&B Operations", "Business Development",
    "استراتيجية العلامة", "التشغيل", "تطوير الأعمال",
    "Management Systems", "Market Analysis", "Saudi Arabia",
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
          1. HERO — editorial, big, minimal
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-6 mesh-bg"
        style={{ background: BG }}
      >
        {/* Background: blue/purple brand mesh + subtle conic rays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Conic gold ray */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] opacity-[0.06]"
            style={{
              background: "conic-gradient(from 270deg at 50% -10%, #C7AC70 0deg, transparent 40deg, transparent 320deg, #C7AC70 360deg)",
            }} />
          {/* Brand blue glow top-center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #2563EB 0%, transparent 70%)" }} />
          {/* Brand purple glow bottom-right */}
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse 80% 80% at 100% 100%, #7C3AED 0%, transparent 70%)" }} />
          {/* Orbit rings for depth */}
          <div className="orbit-ring absolute" style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-60%) rotate(20deg)", animationDuration: "40s" }} />
          <div className="orbit-ring absolute" style={{ width: 900, height: 900, top: "50%", left: "50%", transform: "translate(-50%,-55%) rotate(-10deg)", animationDuration: "60s", animationDirection: "reverse", borderColor: "rgba(124,58,237,0.06)" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto w-full px-6 lg:px-12">

          {/* Status badge */}
          <motion.div {...fu(0)} className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[13px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(37,99,235,0.12)",
                color: GRAPHITE,
                boxShadow: "0 2px 16px rgba(37,99,235,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
              }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", borderRadius: "50%" }} />
              {t("Available for New Projects", "متاح للمشاريع الجديدة")}
              <span className="mx-0.5 opacity-25">·</span>
              {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة · F&B · المملكة")}
            </div>
          </motion.div>

          {/* Giant headline — Framer-style inline logo embed */}
          <motion.div {...fu(0.06)} className="text-center select-none">

            {/* Line 1: BRAND [logo] MANAGER */}
            <div className={`flex items-center justify-center gap-3 md:gap-5 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ lineHeight: 0.88 }}>
              <span
                className="font-black tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7.5rem)", color: BLACK }}
              >
                {t("BRAND", "إدارة")}
              </span>

              {/* MD logo embedded in headline */}
              <LogoInline size={Math.min(100, 80)} dark className="mx-1" />

              <span
                className="font-black tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7.5rem)", color: TITANIUM }}
              >
                {t("MANAGER", "العلامات")}
              </span>
            </div>

            {/* Line 2: & BUSINESS [gold box] DEV */}
            <div className={`flex items-center justify-center gap-3 md:gap-5 flex-wrap mt-1 ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ lineHeight: 0.88 }}>
              <span
                className="font-black tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7.5rem)", color: TITANIUM }}
              >
                {t("& BUSINESS", "والأعمال")}
              </span>

              {/* Gold rotating badge */}
              <RotatingWordBadge isRTL={isRTL} />

              <span
                className="font-black tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7.5rem)", color: BLACK }}
              >
                {t("DEV", "تطوير")}
              </span>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p {...fu(0.14)} className="text-center mt-8 max-w-md mx-auto leading-relaxed text-[15px] md:text-base"
            style={{ color: TITANIUM }}>
            {t(
              "I help F&B brands scale through strategy, operations, and relentless execution — fast and without the noise.",
              "أساعد علامات F&B على النمو من خلال الاستراتيجية والتشغيل والتنفيذ المستمر."
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fu(0.19)}
            className={`flex items-center justify-center gap-3 mt-10 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14px] font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
                  boxShadow: "0 6px 28px rgba(37,99,235,0.35), 0 2px 8px rgba(124,58,237,0.2)",
                }}
              >
                {t("Book Consultation", "احجز استشارة")}
                <Arrow size={15} />
              </motion.button>
            </Link>
            <Link href="/portfolio">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "rgba(37,99,235,0.3)", color: "#2563EB" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-bold border transition-all"
                style={{ borderColor: "rgba(0,0,0,0.12)", color: GRAPHITE }}
              >
                {t("See My Work", "أعمالي")}
              </motion.button>
            </Link>
          </motion.div>

        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="flex justify-center pb-6 mt-14"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(0,0,0,0.13)" }}
          >
            <div className="w-1 h-2 rounded-full" style={{ background: GOLD }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <Marquee items={marqueeItems} rtl={isRTL} />

      {/* ══════════════════════════════════════════
          2. RECENT WORK — dark editorial grid
      ══════════════════════════════════════════ */}
      <section className="py-24 relative" style={{ background: BLACK }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          {/* Header row */}
          <motion.div {...fu(0)} className={`flex items-end justify-between mb-14 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <Eyebrow en="Our Projects" ar="مشاريعنا" t={t} gold />
              <h2 className="text-4xl md:text-5xl font-black mt-1" style={{ color: "#fff" }}>
                {t("Recent Work", "أحدث الأعمال")}
              </h2>
            </div>
            <Link href="/portfolio">
              <motion.button
                whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.96 }}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: TITANIUM }}
              >
                {t("View All", "عرض الكل")} <ArrowUpRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Bento-style work grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div {...fu(0)}>
              <WorkCard logo={fujiLogo} name="Fuji Cafe" tag={t("F&B Brand","علامة F&B")} bg="#ffffff" dark={false} logoFit="contain" tall />
            </motion.div>
            <motion.div {...fu(0.06)}>
              <WorkCard logo={qiroxLogo} name="QIROX" tag={t("Systems","أنظمة")} bg="#111111" logoFit="contain" />
            </motion.div>
            <motion.div {...fu(0.1)}>
              <WorkCard logo={communityLogo} name={t("Community","المجتمع")} tag={t("Marketing","تسويق")} bg="#1a2e5a" logoFit="contain" />
            </motion.div>
            <motion.div {...fu(0.14)}>
              <WorkCard logo={genmzImg} name="GEN M&Z" tag={t("Fashion","أزياء")} bg="#1a1a1a" logoFit="cover" />
            </motion.div>
            <motion.div {...fu(0.18)}>
              <WorkCard name={t("Matcha Power","ماتشا باور")} tag={t("Beverages","مشروبات")} bg="#2d6a4f" />
            </motion.div>

            {/* See all card */}
            <Link href="/portfolio">
              <motion.div
                {...fu(0.22)}
                whileHover={{ y: -6, borderColor: "rgba(199,172,112,0.4)" }}
                className="rounded-2xl flex flex-col items-center justify-center min-h-[200px] cursor-pointer border-2 border-dashed transition-all"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: TITANIUM }}
              >
                <motion.div
                  whileHover={{ rotate: 45 }}
                  transition={{ duration: 0.25 }}
                  className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-3"
                >
                  <ArrowUpRight size={20} />
                </motion.div>
                <p className="text-sm font-semibold">{t("View All Work", "كل الأعمال")}</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. PROCESS — 3 tilted scattered cards
      ══════════════════════════════════════════ */}
      <section className="py-24 overflow-hidden" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <motion.div {...fu(0)} className="text-center mb-16 md:mb-28">
            <Eyebrow en="Our Process, Explained" ar="طريقة عملنا" t={t} />
            <h2 className="text-4xl md:text-5xl font-black mt-2" style={{ color: BLACK }}>
              {t("Here's how it works", "كيف تسير الأمور")}
            </h2>
          </motion.div>

          {/* MOBILE: vertical stack */}
          <div className="grid grid-cols-1 gap-5 md:hidden">
            {[
              { num: "1", title: t("Connect", "التواصل"),    desc: t("Book a free intro call to discuss your vision and goals.", "احجز مكالمة مجانية لمناقشة رؤيتك وأهدافك.") },
              { num: "2", title: t("Strategize", "التخطيط"), desc: t("We build a tailored action plan aligned with your brand objectives.", "نبني خطة عمل مصممة لأهداف علامتك التجارية.") },
              { num: "3", title: t("Execute", "التنفيذ"),    desc: t("Full execution — systems, operations, brand, results.", "تنفيذ كامل: أنظمة، عمليات، علامة تجارية، نتائج.") },
            ].map((card, i) => (
              <motion.div key={i} {...fu(i * 0.08)}
                className="rounded-2xl p-7 shadow-md"
                style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <span className="text-5xl font-black block mb-3 leading-none" style={{ color: BLACK }}>{card.num}</span>
                <h3 className="text-lg font-bold mb-2" style={{ color: BLACK }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TITANIUM }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP: tilted / overlapping */}
          <div className="hidden md:flex justify-center relative" style={{ height: 360 }}>
            {/* Centered group */}
            <div className="relative" style={{ width: 700 }}>
              <ProcessCard
                num="1" zIndex={1}
                rotate="-6deg" translate="-220px, 30px"
                title={t("Connect", "التواصل")}
                desc={t("Book a free intro call to discuss your vision and goals.", "احجز مكالمة مجانية لمناقشة رؤيتك وأهدافك.")}
              />
              <ProcessCard
                num="2" zIndex={3}
                rotate="1.5deg" translate="0px, -20px"
                title={t("Strategize", "التخطيط")}
                desc={t("We build a tailored action plan aligned with your brand objectives.", "نبني خطة عمل مصممة لأهداف علامتك التجارية.")}
              />
              <ProcessCard
                num="3" zIndex={2}
                rotate="-2.5deg" translate="218px, 15px"
                title={t("Execute", "التنفيذ")}
                desc={t("Full execution — systems, operations, brand, results.", "تنفيذ كامل: أنظمة، عمليات، علامة تجارية، نتائج.")}
              />
              {/* SVG connector curves */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 360" fill="none">
                <path d="M 180 150 C 260 100, 330 120, 360 105"
                  stroke={GOLD} strokeWidth="1.5" fill="none" strokeDasharray="5 5" opacity="0.45" />
                <path d="M 360 105 C 400 92, 460 115, 530 145"
                  stroke={GOLD} strokeWidth="1.5" fill="none" strokeDasharray="5 5" opacity="0.45" />
                <circle cx="180" cy="150" r="4.5" fill={GOLD} opacity="0.55" />
                <circle cx="360" cy="105" r="4.5" fill={GOLD} opacity="0.55" />
                <circle cx="530" cy="145" r="4.5" fill={GOLD} opacity="0.55" />
              </svg>
            </div>
          </div>

          <motion.div {...fu(0.3)} className="flex justify-center mt-12 md:mt-20">
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[14px] font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
                  boxShadow: "0 6px 28px rgba(37,99,235,0.35), 0 2px 8px rgba(124,58,237,0.2)",
                }}
              >
                {t("Start the Process", "ابدأ الآن")} <Arrow size={15} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. SERVICES — no pricing shown
      ══════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24" style={{ background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-12">

            <motion.div {...fu(0)} className={`flex items-end justify-between mb-14 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <Eyebrow en="What I Offer" ar="ما أقدمه" t={t} />
                <h2 className="text-4xl md:text-5xl font-black mt-2" style={{ color: BLACK }}>
                  {t("Services", "الخدمات")}
                </h2>
              </div>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border border-black/10 transition-all hover:bg-black/4"
                  style={{ color: GRAPHITE }}>
                  {t("All Services", "كل الخدمات")} <ArrowUpRight size={14} />
                </motion.button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc: any, i: number) => (
                <motion.div
                  key={svc.id || i}
                  {...fu(i * 0.06)}
                  whileHover={{ y: -4, boxShadow: "0 24px 52px rgba(0,0,0,0.07)" }}
                  className="p-7 rounded-2xl border transition-all cursor-default group"
                  style={{ border: "1px solid rgba(0,0,0,0.06)", background: BG }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-3xl">{svc.icon || "⚡"}</span>
                    {svc.featured && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{ background: GOLD + "22", color: GOLD }}>
                        {t("Featured", "مميز")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2.5" style={{ color: BLACK }}>
                    {isRTL ? svc.titleAr : svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TITANIUM }}>
                    {isRTL ? svc.descriptionAr : svc.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          5. ABOUT — "Pushing boundaries since 2016"
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          <motion.div {...fu(0)} className="mb-16">
            <Eyebrow en="About Me" ar="من أنا" t={t} />
            <h2 className="text-4xl md:text-6xl font-black leading-none mt-2" style={{ color: BLACK }}>
              {t("Pushing boundaries", "أبني علامات")}
              <br />
              <span style={{ color: TITANIUM }}>{t("since 2016", "F&B منذ ٢٠١٦")}</span>
            </h2>
          </motion.div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start ${isRTL ? "lg:[direction:rtl]" : ""}`}>

            {/* Left — brand identity card */}
            <motion.div
              {...fu(0.06)}
              className="rounded-3xl overflow-hidden relative"
              style={{ background: BLACK, minHeight: 420 }}
            >
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(199,172,112,0.1) 0%, transparent 70%)" }} />

              <div className="relative z-10 p-12 flex flex-col items-center justify-center h-full text-center min-h-[420px]">
                {/* Real brand logo mark — 3D blue */}
                <LogoBrandImage size={100} className="mb-6 float-logo" style={{ filter: "drop-shadow(0 8px 32px rgba(37,99,235,0.5))" }} />

                <div className="space-y-1">
                  <p className="text-white font-black text-2xl tracking-[0.12em] leading-tight">MOHAMMED</p>
                  <p className="font-black text-2xl tracking-[0.12em] leading-tight" style={{ color: GOLD }}>AL-DABBANI</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-px w-6 opacity-30" style={{ background: GOLD }} />
                  <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: TITANIUM }}>
                    {t("Brand Manager · F&B · Saudi Arabia", "مدير علامة · F&B · المملكة")}
                  </p>
                  <div className="h-px w-6 opacity-30" style={{ background: GOLD }} />
                </div>

                {/* Decorative gold corners */}
                <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 rounded-tl-md opacity-30" style={{ borderColor: GOLD }} />
                <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 rounded-tr-md opacity-30" style={{ borderColor: GOLD }} />
                <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 rounded-bl-md opacity-30" style={{ borderColor: GOLD }} />
                <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 rounded-br-md opacity-30" style={{ borderColor: GOLD }} />
              </div>
            </motion.div>

            {/* Right — bio + experience timeline */}
            <motion.div {...fu(0.1)} className="flex flex-col justify-center">
              <p className="text-[15px] leading-loose mb-10" style={{ color: GRAPHITE }}>
                {t(
                  "I seek a leadership position in business development and operations in the F&B sector, contributing to brand building through strategy, execution, and continuous performance improvement. I innovate solutions that guarantee sustainability and profitability.",
                  "أسعى لتولي منصب قيادي في مجال تطوير الأعمال والتشغيل بقطاع الأغذية والمشروبات، مساهماً في بناء العلامات التجارية من خلال وضع الاستراتيجيات وتنفيذ الخطط التشغيلية وتحسين الأداء المستمر."
                )}
              </p>

              {/* Experience timeline */}
              <div className="space-y-0 border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    {...fu(0.1 + i * 0.06)}
                    className="timeline-row"
                  >
                    <span className="text-sm font-semibold flex-1" style={{ color: GRAPHITE }}>{exp.role}</span>
                    <span className="text-sm font-bold" style={{ color: BLACK }}>{exp.company}</span>
                    <span className="text-xs font-mono" style={{ color: TITANIUM }}>{exp.period}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div {...fu(0.35)} className="mt-10">
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14px] font-bold text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
                      boxShadow: "0 6px 28px rgba(37,99,235,0.3), 0 2px 8px rgba(124,58,237,0.15)",
                    }}
                  >
                    {t("Learn More", "اعرف أكثر")} <Arrow size={15} />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. CONTACT CTA — full dark with light rays
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ background: BLACK, minHeight: "60vh", padding: "8rem 1.5rem" }}
      >
        {/* Light ray effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06]"
            style={{
              background: "conic-gradient(from 270deg at 50% -5%, white 0deg, transparent 35deg, transparent 325deg, white 360deg)",
            }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(199,172,112,0.07) 0%, transparent 70%)" }} />
        </div>

        {/* Brand logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <LogoBrandImage size={320} style={{ opacity: 0.03, filter: "brightness(0) invert(1)" }} />
        </div>

        <motion.div {...fu(0)} className="relative z-10 max-w-3xl">

          {/* Eyebrow with lines */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 opacity-40" style={{ background: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              {t("Let's Collaborate", "لنتعاون")}
            </span>
            <div className="h-px w-12 opacity-40" style={{ background: GOLD }} />
          </div>

          {/* Big headline */}
          <h2 className="font-black leading-none mb-6" style={{ fontSize: "clamp(3rem, 11vw, 7.5rem)", color: "#fff" }}>
            {t("Let's", "دعنا")}{" "}
            <span style={{ color: TITANIUM }}>{t("Connect", "نتعاون")}</span>
          </h2>

          <p className="text-[15px] md:text-base mb-10 leading-relaxed" style={{ color: TITANIUM }}>
            {t(
              "Feel free to reach out if you have a project in mind or want to explore collaboration.",
              "تواصل معي إذا كان لديك مشروع أو ترغب في التعاون."
            )}
          </p>

          <Link href="/book">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-[14px] font-bold transition-all text-white"
              style={{
                background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
                boxShadow: "0 8px 32px rgba(37,99,235,0.45), 0 2px 8px rgba(124,58,237,0.25)",
              }}
            >
              {t("Book a free intro call", "احجز مكالمة مجانية")}
              <Arrow size={16} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer bar */}
        <div className="absolute bottom-0 left-0 right-0 px-8 py-5 flex items-center justify-between border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <LogoBrandImage size={22} style={{ opacity: 0.5, filter: "brightness(0) invert(1)" }} />
            <span className="text-[11px] font-semibold tracking-[0.15em] opacity-40" style={{ color: "#fff" }}>
              © {new Date().getFullYear()} MOHAMMED AL-DABBANI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "@", href: "/contact" },
              { label: "in", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href}>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {label}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. LUXURY CONNECT — WhatsApp + FAQ, merged at the very bottom
      ══════════════════════════════════════════ */}
      <LuxuryConnectPanel />

    </RootLayout>
  );
}
