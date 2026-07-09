import { motion, useAnimationFrame, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ── Brand tokens ── */
const BLACK    = "#0F0F10";
const GRAPHITE = "#1e1e1e";
const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";
const OFF_WHITE = "#F5F5F3";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ── Brand data ── */
const BRANDS = [
  {
    name: "Fuji Cafe",
    nameAr: "فوجي كافية",
    tag: "Brand Identity · F&B",
    img: "/__mockup/images/fuji-logo.png",
    bg: "#111111",
    logoBg: "#fff",
    accent: "#E8C26E",
    year: "2025",
  },
  {
    name: "Gen M&Z",
    nameAr: "جن ام وزد",
    tag: "Marketing · Gen Z",
    img: "/__mockup/images/genmz.jpg",
    bg: "#0d0d0d",
    accent: "#C7AC70",
    year: "2024",
  },
  {
    name: "QIROX",
    nameAr: "كيروكس",
    tag: "Brand Strategy",
    img: "/__mockup/images/qirox-logo.png",
    bg: "#080808",
    accent: "#B8A06A",
    year: "2024",
  },
  {
    name: "Community Initiative",
    nameAr: "مبادرة تسويقية",
    tag: "Community · Marketing",
    img: "/__mockup/images/community-logo.png",
    bg: "#0a1428",
    accent: "#C7AC70",
    year: "2023",
  },
  {
    name: "Matcha Power",
    nameAr: "ماتشا باور",
    tag: "Founder · Build",
    img: null,
    bg: "#0d1f0f",
    accent: "#6db86d",
    year: "2025–2026",
  },
];

/* ── iPad Frame Component ── */
function IPadFrame({
  brand,
  style,
  delay = 0,
  rotate = 0,
  scale = 1,
}: {
  brand: typeof BRANDS[0];
  style?: React.CSSProperties;
  delay?: number;
  rotate?: number;
  scale?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rotate - 4, scale: scale * 0.85 }}
      animate={{ opacity: 1, y: 0, rotate, scale }}
      transition={{ delay, duration: 1.1, ease: EASE_OUT }}
      whileHover={{ y: -18, scale: scale * 1.04, rotate: rotate * 0.5 }}
      style={{
        position: "absolute",
        ...style,
        cursor: "default",
        transformOrigin: "center bottom",
        filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.7))",
      }}
    >
      {/* iPad chassis */}
      <div style={{
        width: 320,
        height: 440,
        borderRadius: 28,
        background: "linear-gradient(160deg, #3a3a3c 0%, #1c1c1e 50%, #2a2a2c 100%)",
        padding: 14,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.6)",
        position: "relative",
      }}>
        {/* Side button */}
        <div style={{
          position: "absolute", right: -3, top: 110, width: 3, height: 40,
          background: "linear-gradient(180deg, #4a4a4c, #2a2a2c)",
          borderRadius: "0 3px 3px 0",
        }} />
        {/* Volume buttons */}
        <div style={{
          position: "absolute", left: -3, top: 100, width: 3, height: 30,
          background: "linear-gradient(180deg, #4a4a4c, #2a2a2c)",
          borderRadius: "3px 0 0 3px",
        }} />
        <div style={{
          position: "absolute", left: -3, top: 140, width: 3, height: 30,
          background: "linear-gradient(180deg, #4a4a4c, #2a2a2c)",
          borderRadius: "3px 0 0 3px",
        }} />

        {/* Screen bezel */}
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
          background: brand.bg,
          position: "relative",
        }}>
          {/* Notch / camera */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "#1a1a1c",
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: 10,
          }} />

          {/* Screen content */}
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Status bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 16px 4px",
              fontSize: 8, color: "rgba(255,255,255,0.4)", fontFamily: "system-ui",
            }}>
              <span>9:41</span>
              <span>●●●</span>
            </div>

            {/* Brand logo area */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 20px",
              background: brand.bg,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle radial glow */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 50%, ${brand.accent}12, transparent 65%)`,
              }} />

              {brand.img ? (
                <div style={{
                  width: "100%",
                  maxWidth: 190,
                  aspectRatio: "3/2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "name" in brand && brand.name === "Fuji Cafe" ? "#fff" : "transparent",
                  padding: "name" in brand && brand.name === "Fuji Cafe" ? 12 : 0,
                }}>
                  <img
                    src={brand.img}
                    alt={brand.name}
                    onLoad={() => setLoaded(true)}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 120,
                      objectFit: "contain",
                      opacity: loaded ? 1 : 0,
                      transition: "opacity 0.4s",
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: `rgba(${hexToRgb(brand.accent)}, 0.15)`,
                    border: `1px solid ${brand.accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26,
                  }}>🍵</div>
                  <span style={{ color: brand.accent, fontSize: 18, fontWeight: 900, fontFamily: "system-ui" }}>
                    {brand.name}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom info bar */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: OFF_WHITE, fontSize: 11, fontWeight: 800, fontFamily: "system-ui" }}>
                  {brand.name}
                </span>
                <span style={{
                  color: brand.accent, fontSize: 8, fontWeight: 700,
                  padding: "2px 6px", borderRadius: 4,
                  background: `${brand.accent}18`,
                  fontFamily: "system-ui",
                }}>
                  {brand.year}
                </span>
              </div>
              <span style={{ color: TITANIUM, fontSize: 9, fontFamily: "system-ui" }}>
                {brand.tag}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

/* ── Floating particle ── */
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x, top: y,
        width: size, height: size,
        borderRadius: "50%",
        background: GOLD,
        opacity: 0,
      }}
      animate={{
        y: [-20, -60, -20],
        opacity: [0, 0.4, 0],
      }}
      transition={{
        duration: 3.5 + delay,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ── Animated gold line ── */
function GoldLine({ x1, y1, x2, y2, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; delay?: number }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={GOLD}
      strokeWidth={0.5}
      strokeOpacity={0}
      initial={{ pathLength: 0, strokeOpacity: 0 }}
      animate={{ pathLength: 1, strokeOpacity: 0.2 }}
      transition={{ delay, duration: 1.8, ease: EASE_OUT }}
    />
  );
}

/* ── Main showcase ── */
export function IPadShowcase() {
  const t = useMotionValue(0);
  const rotateGlobe = useTransform(t, [0, 1], [0, 360]);
  const [activeIdx, setActiveIdx] = useState(0);

  useAnimationFrame((time) => {
    t.set((time / 30000) % 1);
  });

  // Cycle active brand
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % BRANDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: BLACK,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>

      {/* ── Background decorations ── */}
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }} />

      {/* Gold radial bloom */}
      <motion.div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}08 0%, transparent 65%)`,
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SVG connecting lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <GoldLine x1={240} y1={300} x2={600} y2={480} delay={1.2} />
        <GoldLine x1={600} y1={480} x2={960} y2={340} delay={1.6} />
        <GoldLine x1={960} y1={340} x2={1320} y2={520} delay={2.0} />
        <GoldLine x1={1320} y1={520} x2={1660} y2={360} delay={2.4} />

        {/* Decorative arcs */}
        <motion.circle
          cx="50%" cy="50%" r="320"
          fill="none" stroke={GOLD} strokeWidth="0.5"
          strokeDasharray="8 24"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.08, rotate: 360 }}
          transition={{ opacity: { duration: 1.5, delay: 0.5 }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.circle
          cx="50%" cy="50%" r="460"
          fill="none" stroke={GOLD} strokeWidth="0.5"
          strokeDasharray="4 20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05, rotate: -360 }}
          transition={{ opacity: { duration: 1.5, delay: 0.8 }, rotate: { duration: 90, repeat: Infinity, ease: "linear" } }}
          style={{ transformOrigin: "50% 50%" }}
        />
      </svg>

      {/* Floating particles */}
      {[
        { x: 180, y: 550, size: 3, delay: 0 },
        { x: 450, y: 650, size: 2, delay: 0.8 },
        { x: 780, y: 600, size: 4, delay: 1.5 },
        { x: 1100, y: 680, size: 2.5, delay: 0.4 },
        { x: 1380, y: 560, size: 3, delay: 1.1 },
        { x: 1650, y: 620, size: 2, delay: 0.7 },
        { x: 320, y: 200, size: 2, delay: 2.0 },
        { x: 960, y: 150, size: 3, delay: 1.8 },
        { x: 1500, y: 180, size: 2, delay: 2.3 },
      ].map((p, i) => <Particle key={i} {...p} />)}

      {/* ── Header ── */}
      <motion.div
        style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", zIndex: 20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 18px", borderRadius: 100,
          background: "rgba(199,172,112,0.08)",
          border: `1px solid rgba(199,172,112,0.2)`,
          marginBottom: 12,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
          <span style={{ color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Portfolio · الأعمال
          </span>
        </div>
        <h1 style={{
          color: OFF_WHITE,
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: 0,
        }}>
          Mohammed Al-Dabbani
        </h1>
        <p style={{ color: TITANIUM, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>
          Brand Manager · F&B · Riyadh
        </p>
      </motion.div>

      {/* ── iPad row ── */}
      <div style={{
        position: "relative",
        width: "100%",
        height: 520,
        marginTop: 60,
      }}>
        {/* iPad 1 — Fuji */}
        <IPadFrame brand={BRANDS[0]} delay={0.2} rotate={-8}
          style={{ left: "8%", top: 60 }} scale={0.92} />

        {/* iPad 2 — Gen M&Z (tall center-left) */}
        <IPadFrame brand={BRANDS[1]} delay={0.45} rotate={-3}
          style={{ left: "24%", top: 20 }} scale={1.0} />

        {/* iPad 3 — QIROX (center hero) */}
        <IPadFrame brand={BRANDS[2]} delay={0.6} rotate={0}
          style={{ left: "42%", top: 0, zIndex: 10 }} scale={1.1} />

        {/* iPad 4 — Community */}
        <IPadFrame brand={BRANDS[3]} delay={0.8} rotate={3}
          style={{ left: "61%", top: 20 }} scale={1.0} />

        {/* iPad 5 — Matcha Power */}
        <IPadFrame brand={BRANDS[4]} delay={1.0} rotate={8}
          style={{ left: "77%", top: 60 }} scale={0.92} />
      </div>

      {/* ── Active brand label ── */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 20,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            style={{ textAlign: "center" }}
          >
            <p style={{ color: GOLD, fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
              {BRANDS[activeIdx].name}
            </p>
            <p style={{ color: TITANIUM, fontSize: 12, margin: "4px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {BRANDS[activeIdx].tag}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
          {BRANDS.map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === activeIdx ? GOLD : "rgba(199,172,112,0.25)",
                cursor: "pointer",
              }}
              animate={{ width: i === activeIdx ? 20 : 6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </div>

      {/* ── Corner MD mark watermark ── */}
      <motion.div
        style={{ position: "absolute", bottom: 24, right: 32, opacity: 0.08 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 1.5 }}
      >
        <svg width="64" height="50" viewBox="0 0 130 101" fill="none">
          <polyline points="7,94 7,7 48,58 89,7 89,94" stroke={OFF_WHITE} strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
          <path d="M89,7 C89,7 124,7 124,50.5 C124,94 89,94 89,94" stroke={OFF_WHITE} strokeWidth="13" strokeLinecap="square" strokeLinejoin="round" fill="none" />
        </svg>
      </motion.div>

      {/* ── Est badge ── */}
      <motion.div
        style={{ position: "absolute", bottom: 24, left: 32, opacity: 0.4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
      >
        <p style={{ color: TITANIUM, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
          Est. 2016 · Riyadh · KSA
        </p>
      </motion.div>
    </div>
  );
}
