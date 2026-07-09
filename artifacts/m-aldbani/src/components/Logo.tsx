/* ── Mohammed Al-Dabbani · MD Monogram Logo ───────────────────────────────
   Pure SVG – no image dependencies.
   Matches the geometric brand identity: bold M + D sharing a vertical stroke.
─────────────────────────────────────────────────────────────────────────── */

interface LogoProps {
  className?: string;
  color?: string;
  size?: number;
}

/** Standalone MD monogram mark */
export function LogoMark({ className = "", color = "#0F0F10", size = 44 }: LogoProps) {
  const h = Math.round(size * 0.78);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 130 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MD"
    >
      {/* M — two peaks, angular midpoint */}
      <polyline
        points="7,94 7,7 48,58 89,7 89,94"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* D — smooth curve sharing the right stroke of M */}
      <path
        d="M89,7 C89,7 124,7 124,50.5 C124,94 89,94 89,94"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Full lockup: MD mark + wordmark stacked */
export function LogoFull({ className = "", color = "#0F0F10", height = 48 }: { className?: string; color?: string; height?: number }) {
  return (
    <div className={`flex flex-col items-center gap-0 ${className}`} style={{ height }}>
      <LogoMark color={color} size={Math.round(height * 0.72)} />
      <div
        style={{
          color,
          fontSize: Math.round(height * 0.13),
          fontWeight: 900,
          letterSpacing: "0.22em",
          lineHeight: 1.1,
          fontFamily: "var(--app-font-heading)",
          marginTop: 2,
        }}
      >
        MOHAMMED AL-DABBANI
      </div>
    </div>
  );
}

/** Pill-style logo for the navbar: small mark + text side by side */
export function LogoPill({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Mark in a dark circle */}
      <div className="w-8 h-8 rounded-full bg-[#0F0F10] flex items-center justify-center flex-shrink-0">
        <LogoMark color="#F5F5F3" size={20} />
      </div>
      <span className="text-[13px] font-bold text-[#0F0F10] tracking-tight leading-none">
        M-ALDBANI
      </span>
    </div>
  );
}

/** Inline logo mark for embedding in headlines */
export function LogoInline({
  size = 80,
  dark = true,
  className = "",
}: {
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl overflow-hidden flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: dark ? "#0F0F10" : "#F5F5F3",
        border: dark ? "none" : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <LogoMark color={dark ? "#F5F5F3" : "#0F0F10"} size={Math.round(size * 0.6)} />
    </span>
  );
}
