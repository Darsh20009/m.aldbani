import { useRef, useEffect, useCallback } from "react";
import {
  motion, useMotionValue, useTransform, useSpring,
  useInView, useScroll, useVelocity, useAnimationFrame,
} from "framer-motion";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782157376997.png";
import photoPath from "@assets/Screenshot_2026-06-22_at_6.27.49_PM_1782231945642.png";

/* ══════════════════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.parentElement!.addEventListener("mousemove", onMouseMove);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number };
    const N = 90;
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.2 + 0.3,
    }));

    let raf: number;
    const LINK = 130;
    const MOUSE_FORCE = 90;

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_FORCE) {
          const force = (1 - d / MOUSE_FORCE) * 0.8;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        // damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,120,255,0.7)";
        ctx.fill();
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const a = (1 - dist / LINK) * 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100,120,255,${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

/* ══════════════════════════════════════════════════════════
   3-D TILT CARD  (mouse tracking)
══════════════════════════════════════════════════════════ */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const sRx = useSpring(rx, { stiffness: 280, damping: 28 });
  const sRy = useSpring(ry, { stiffness: 280, damping: 28 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current!;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = (e.clientX - left) / width;
    const ny = (e.clientY - top) / height;
    rx.set((ny - 0.5) * -22);
    ry.set((nx - 0.5) * 22);
    gx.set(nx * 100);
    gy.set(ny * 100);
  }, [rx, ry, gx, gy]);

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }, [rx, ry, gx, gy]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: "900px" }}
      className={className}
    >
      <motion.div
        style={{
          rotateX: sRx,
          rotateY: sRy,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════════ */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const raw = useMotionValue(0);
  const val = useSpring(raw, { stiffness: 40, damping: 13 });
  useEffect(() => { if (inView) raw.set(to); }, [inView, to, raw]);
  useEffect(() =>
    val.on("change", (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; }),
    [val, suffix]
  );
  return <span ref={ref}>0{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════
   WORD REVEAL
══════════════════════════════════════════════════════════ */
function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline" }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLanguage();

  return (
    <RootLayout>

      {/* ═══════════════════════════════════════════════════
          HERO  — dark, full-viewport, 3D, particles
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 40%, rgba(76,60,180,0.22) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 70% at 20% 80%, rgba(37,99,235,0.12) 0%, transparent 55%)," +
            "linear-gradient(160deg, #060817 0%, #0a0e27 45%, #0d0820 100%)",
        }}
      >
        {/* particle field */}
        <ParticleCanvas />

        {/* glowing orbs */}
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)", filter: "blur(30px)" }} />

        <div className="container mx-auto px-8 lg:px-16 py-16 w-full relative z-10">
          <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-12 xl:gap-20 items-center">

            {/* ── TEXT COLUMN ──────────────────────── */}
            <div>
              {/* eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-white/40">
                  {t("Available · Riyadh, KSA", "متاح · الرياض، المملكة العربية السعودية")}
                </span>
              </motion.div>

              {/* big name */}
              <h1
                className="font-heading font-black leading-[0.88] tracking-tight text-white mb-3 select-none"
                style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
              >
                <WordReveal text={t("Mohammed", "محمد")} delay={0.1} />
                <br />
                <span
                  className="block"
                  style={{
                    background:
                      "linear-gradient(115deg, #60a5fa 0%, #a78bfa 40%, #f472b6 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "200% 200%",
                  }}
                >
                  <WordReveal
                    text={t("Al-Dabbani", "الدباني")}
                    delay={0.22}
                    className="block"
                  />
                </span>
              </h1>

              {/* title bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.65 }}
                className="flex items-center gap-3 mb-8 mt-4"
              >
                <div className="h-px w-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase"
                  style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {t("Brand Manager · Business Development · F&B", "مدير علامة · تطوير أعمال · قطاع F&B")}
                </span>
              </motion.div>

              {/* tagline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.65 }}
                className="text-white/40 text-lg leading-relaxed max-w-md mb-10"
              >
                {t(
                  "8+ years building F&B brands from zero — strategy, identity, operations, and full commercial launch.",
                  "أكثر من 8 سنوات في بناء علامات F&B من الصفر — استراتيجية، هوية، عمليات، وإطلاق تجاري كامل."
                )}
              </motion.p>

              {/* STATS — glass pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.65 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                {[
                  { n: 8,  s: "+", en: "Years",     ar: "سنوات" },
                  { n: 50, s: "+", en: "Brands",     ar: "علامة" },
                  { n: 2,  s: "M+",en: "Customers",  ar: "عميل" },
                  { n: 3,  s: "",  en: "Industries", ar: "قطاعات" },
                ].map((st, i) => (
                  <div key={i}
                    className="flex flex-col items-center px-5 py-3 rounded-2xl border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.09)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span className="text-2xl font-black font-heading"
                      style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      <CountUp to={st.n} suffix={st.s} />
                    </span>
                    <span className="text-[10px] text-white/35 font-bold uppercase tracking-widest mt-0.5">
                      {t(st.en, st.ar)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.65 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/book">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative h-14 px-9 rounded-xl font-bold text-sm text-white overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      boxShadow: "0 0 30px rgba(99,102,241,0.45), 0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span className="relative z-10">{t("Book Consultation", "احجز استشارة")}</span>
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-9 rounded-xl font-bold text-sm border text-white/70 hover:text-white transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {t("My Story →", "قصتي ←")}
                  </motion.button>
                </Link>
              </motion.div>

              {/* motto */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-10 text-[10px] tracking-[0.4em] uppercase text-white/18 font-bold"
              >
                EXPERIENCE · INNOVATION · IMPACT
              </motion.p>
            </div>

            {/* ── 3D PHOTO COLUMN ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="relative">
                {/* outer glow ring */}
                <div className="absolute inset-[-3px] rounded-[28px] pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(96,165,250,0.5), rgba(167,139,250,0.5), rgba(244,114,182,0.3))",
                    filter: "blur(1px)",
                    zIndex: 0,
                  }} />

                {/* photo container */}
                <div className="relative rounded-[26px] overflow-hidden z-10"
                  style={{
                    aspectRatio: "3/4",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(109,40,217,0.2)",
                    transformStyle: "preserve-3d",
                  }}>
                  {/* bg */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(170deg,#1e1b4b 0%,#1e0a3c 60%,#0a0e27 100%)" }} />

                  {/* photo */}
                  <img
                    src={photoPath}
                    alt="Mohammed Al-Dabbani"
                    className="relative z-10 w-full h-full object-cover object-top"
                    style={{ mixBlendMode: "luminosity", opacity: 0.92 }}
                  />

                  {/* color overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(9,11,32,0.85) 0%, rgba(9,11,32,0.1) 40%, transparent 70%)",
                    }} />

                  {/* bottom text */}
                  <div className="absolute bottom-6 left-6 right-6 z-30" style={{ transform: "translateZ(30px)" }}>
                    <p className="text-white font-bold text-base leading-tight">
                      {t("Mohammed Al-Dabbani", "محمد الدباني")}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      {t("Brand Manager · F&B Sector", "مدير علامة تجارية · قطاع F&B")}
                    </p>
                  </div>

                  {/* scan line shimmer */}
                  <motion.div
                    className="absolute inset-0 z-25 pointer-events-none"
                    animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "linear-gradient(to bottom, transparent 45%, rgba(139,120,255,0.07) 50%, transparent 55%)",
                      backgroundSize: "100% 400%",
                    }}
                  />
                </div>

                {/* floating logo card (translateZ) */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-10 z-20"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="rounded-2xl p-3 shadow-2xl border"
                    style={{
                      background: "rgba(15,17,40,0.85)",
                      borderColor: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(12px)",
                    }}>
                    <img src={logoPath} alt="md" className="h-10 w-auto object-contain"
                      style={{ filter: "brightness(0) invert(1)" }} />
                  </div>
                </motion.div>

                {/* floating status badge */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute -right-6 bottom-28 z-20"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2 border"
                    style={{
                      background: "rgba(15,17,40,0.9)",
                      borderColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)",
                    }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="text-xs font-bold text-white/80 whitespace-nowrap">
                      {t("Available 🇸🇦", "متاح 🇸🇦")}
                    </span>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          </div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-0.5 h-2 rounded-full bg-white/25" />
          </motion.div>
          <span className="text-[10px] tracking-widest uppercase text-white/20">scroll</span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════ */}
      <div className="border-y overflow-hidden py-4 bg-white border-slate-100">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
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
              t("Growth Strategy", "استراتيجية النمو"),
            ].map((item, i) => (
              <span key={`${rep}-${i}`} className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300 flex items-center gap-10">
                {item}
                <span className="text-blue-400/50">✦</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════
          EXPERTISE — 3D hover cards
      ═══════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 max-w-xl"
          >
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-600 mb-4">
              {t("Core Expertise", "التخصصات الأساسية")}
            </p>
            <h2 className="text-4xl md:text-[52px] font-black font-heading leading-tight">
              {t("What I bring\nto the table", "ماذا أقدم\nإلى الطاولة")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01", color: "#2563eb", glow: "rgba(37,99,235,0.1)",
                en: "Business Development",       ar: "تطوير الأعمال",
                dEn: "From zero to commercial launch — strategy, business models, market entry, and sustainable growth.",
                dAr: "من الصفر إلى الإطلاق التجاري — استراتيجية ونماذج أعمال ودخول السوق ونمو مستدام.",
              },
              {
                num: "02", color: "#7c3aed", glow: "rgba(124,58,237,0.1)",
                en: "Operations Management",      ar: "إدارة العمليات",
                dEn: "KPI frameworks, team development, quality systems, and daily operational excellence at scale.",
                dAr: "مؤشرات أداء وتطوير فرق وأنظمة جودة وتميز تشغيلي يومي على نطاق واسع.",
              },
              {
                num: "03", color: "#0ea5e9", glow: "rgba(14,165,233,0.1)",
                en: "Brand Strategy",             ar: "استراتيجية العلامة",
                dEn: "Visual identity, market positioning, customer loyalty ecosystems, and differentiated experiences.",
                dAr: "هوية بصرية وتموضع سوقي ومنظومة ولاء عملاء وتجارب متميزة.",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard>
                  <div
                    className="group relative border border-slate-100 rounded-3xl p-9 bg-white cursor-default overflow-hidden"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
                  >
                    {/* hover glow bg */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at top left, ${p.glow}, transparent 70%)` }}
                    />

                    {/* number */}
                    <span className="block font-black font-mono text-[64px] leading-none mb-5"
                      style={{ color: p.color, opacity: 0.1 }}>
                      {p.num}
                    </span>

                    {/* accent bar */}
                    <div className="w-10 h-1 rounded-full mb-6" style={{ background: p.color }} />

                    <h3 className="text-xl font-bold mb-3 relative z-10 transition-colors duration-300"
                      style={{ color: "inherit" }}>
                      <span className="group-hover:text-[var(--c)] transition-colors duration-300" style={{ "--c": p.color } as React.CSSProperties}>
                        {t(p.en, p.ar)}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                      {t(p.dEn, p.dAr)}
                    </p>

                    {/* bottom line grow */}
                    <div className="mt-8 h-[1.5px] w-0 group-hover:w-full rounded-full transition-all duration-700"
                      style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CAREER TIMELINE
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:sticky md:top-28"
            >
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-600 mb-4">
                {t("Career", "المسيرة")}
              </p>
              <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight mb-6">
                {t("8 Years of\nGrowth", "8 سنوات\nمن التطور")}
              </h2>
              <Link href="/about">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-bold text-blue-600 hover:text-violet-600 transition-colors"
                >
                  {t("Full biography →", "السيرة الكاملة ←")}
                </motion.button>
              </Link>
            </motion.div>

            <div className="relative space-y-4 pl-8">
              {/* timeline line */}
              <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                style={{ background: "linear-gradient(to bottom, #2563eb, #7c3aed, #0ea5e9)" }} />

              {[
                { yr: "2025 – Now",  en: "Brand Manager",           ar: "مدير العلامة التجارية",      org: "Thamarat Al-Khayr / Fuji Cafe",    c: "#2563eb", active: true },
                { yr: "2024 – 2025", en: "Operations & BD Manager",  ar: "مدير العمليات والتطوير",     org: "Thamarat Al-Khayr / Fuji Cafe",    c: "#5b21b6", active: false },
                { yr: "2022 – 2024", en: "Branch Manager",           ar: "مدير فرع",                   org: "Namq for Beverages",               c: "#7c3aed", active: false },
                { yr: "2018 – 2022", en: "Branch Manager",           ar: "مدير فرع",                   org: "Al-Awaji Commercial Markets",      c: "#0ea5e9", active: false },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ x: 4 }}
                  className="relative group"
                >
                  {/* dot */}
                  <div className="absolute -left-[38px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white z-10 transition-transform duration-300 group-hover:scale-125"
                    style={{ background: item.c }} />

                  <div className="bg-white rounded-2xl border border-slate-100 p-6 group-hover:border-blue-100 group-hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                      <p className="font-bold text-base group-hover:text-blue-600 transition-colors">
                        {t(item.en, item.ar)}
                      </p>
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: `${item.c}14`, color: item.c }}>
                        {item.active ? t("Current", "حالياً") : item.yr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{item.org}</p>
                    {item.active && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                          {t("Active Role", "دور حالي")}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROJECT — dark card
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold tracking-[0.28em] uppercase text-blue-600 text-center mb-12"
          >
            {t("Featured Project", "مشروع مميز")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard>
              <div
                className="relative rounded-3xl overflow-hidden border border-slate-800 cursor-default"
                style={{
                  background: "linear-gradient(135deg, #08091e 0%, #0d0d2c 50%, #100820 100%)",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.35), 0 0 80px rgba(109,40,217,0.12)",
                }}
              >
                {/* glows */}
                <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)", filter: "blur(40px)" }} />
                <div className="absolute -bottom-10 left-1/3 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(37,99,235,0.2), transparent 70%)", filter: "blur(40px)" }} />

                <div className="relative z-10 p-10 md:p-16">
                  <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                    {/* emoji */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border border-white/10"
                      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
                      🍵
                    </div>

                    {/* info */}
                    <div className="flex-1 text-white">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest border border-violet-500/40 text-violet-300 px-3 py-1 rounded-full"
                          style={{ background: "rgba(124,58,237,0.12)" }}>
                          {t("Founder & Developer", "مؤسس ومطور")}
                        </span>
                        <span className="text-xs text-white/30 font-mono">
                          {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black font-heading mb-4">
                        {t("Matcha Power", "ماتشا باور")}
                      </h3>
                      <p className="text-white/40 leading-relaxed max-w-xl text-sm mb-6">
                        {t(
                          "Founded from idea to full operational launch. Built the complete brand vision, business model, customer experience, and growth strategy from scratch.",
                          "تأسيس من الفكرة إلى الإطلاق التشغيلي الكامل. بناء رؤية العلامة ونموذج العمل وتجربة العميل واستراتيجية النمو من الصفر."
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(t(
                          ["Brand Identity","Business Model","Market Research","Growth Strategy","Customer Experience"],
                          ["هوية العلامة","نموذج العمل","بحث السوق","استراتيجية النمو","تجربة العميل"]
                        ) as string[]).map(tag => (
                          <span key={tag} className="text-[11px] font-semibold px-3 py-1 rounded-lg border border-white/8 text-white/40"
                            style={{ background: "rgba(255,255,255,0.04)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* link */}
                    <Link href="/portfolio" className="flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="h-12 px-7 rounded-xl font-bold text-sm text-white whitespace-nowrap border border-white/15 hover:border-white/40 transition-all"
                        style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
                      >
                        {t("View Portfolio", "استعرض الأعمال")}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA — final
      ═══════════════════════════════════════════════════ */}
      <section className="py-32 bg-white border-t border-slate-100">
        <div className="container mx-auto px-8 lg:px-16 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={logoPath} alt="m-aldbani" className="h-16 w-auto object-contain mx-auto mb-10 opacity-80" />
            <h2 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-5">
              {t("Let's build something", "لنبني شيئاً")}
              <br />
              <span style={{ background: "linear-gradient(115deg,#2563eb,#7c3aed,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("extraordinary.", "استثنائياً.")}
              </span>
            </h2>
            <p className="text-slate-400 mb-12 text-lg leading-relaxed">
              {t(
                "Ready to elevate your brand and operations? Let's talk.",
                "هل أنت مستعد للارتقاء بعلامتك التجارية وعملياتك؟ لنتحدث."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 rounded-xl font-bold text-sm text-white"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    boxShadow: "0 8px 40px rgba(37,99,235,0.3)",
                  }}
                >
                  {t("Book Free Consultation", "احجز استشارة مجانية")}
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 rounded-xl font-bold text-sm border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  {t("Get in Touch", "تواصل معي")}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
