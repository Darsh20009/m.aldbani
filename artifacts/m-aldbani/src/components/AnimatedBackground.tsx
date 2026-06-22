import { motion } from "framer-motion";

const shapes = [
  { cx: "10%", cy: "20%", r: 180, opacity: 0.06, delay: 0, duration: 8 },
  { cx: "85%", cy: "15%", r: 220, opacity: 0.05, delay: 1.5, duration: 10 },
  { cx: "75%", cy: "75%", r: 160, opacity: 0.07, delay: 0.8, duration: 9 },
  { cx: "20%", cy: "80%", r: 200, opacity: 0.05, delay: 2, duration: 11 },
  { cx: "50%", cy: "45%", r: 300, opacity: 0.03, delay: 0.5, duration: 14 },
];

const lines = [
  { x1: "0%", y1: "35%", x2: "100%", y2: "65%", delay: 0 },
  { x1: "25%", y1: "0%", x2: "75%", y2: "100%", delay: 0.3 },
  { x1: "0%", y1: "70%", x2: "50%", y2: "0%", delay: 0.6 },
];

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="bgGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1f6e" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
          </linearGradient>
        </defs>

        {shapes.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="url(#bgGrad1)"
            fillOpacity={s.opacity}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.08, 0.9], opacity: [0, s.opacity, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {lines.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="url(#bgGrad1)"
            strokeWidth="0.5"
            strokeOpacity="0.12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: l.delay + 0.5, ease: "easeOut" }}
          />
        ))}

        <motion.polygon
          points="90,10 70,50 110,50"
          fill="url(#bgGrad1)"
          fillOpacity="0.06"
          style={{ transformOrigin: "90px 30px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.polygon
          points="200,80 185,110 215,110"
          fill="url(#bgGrad2)"
          fillOpacity="0.08"
          style={{ transformOrigin: "200px 95px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.rect
          x="calc(100% - 120px)" y="60%" width="40" height="40" rx="6"
          fill="url(#bgGrad1)"
          fillOpacity="0.06"
          style={{ transformOrigin: "calc(100% - 100px) calc(60% + 20px)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
