/* ── Mohammed Al-Dabbani · MD Brand Logo System ───────────────────────────
   Real brand image + SVG fallback variants.
   LogoBrandImage — uses the actual 3D blue logo (PNG)
   LogoMark       — inline SVG monogram (email / fallback)
   LogoFull       — mark + wordmark stacked
   LogoPill       — navbar pill layout
   LogoInline     — embedded in headlines
─────────────────────────────────────────────────────────────────────────── */

interface LogoProps {
  className?: string;
  color?: string;
  size?: number;
}

/** Real brand image logo — the M/D mark.
 *  variant="dark" (default) = dark-ink mark, for light backgrounds.
 *  variant="light" = cream-ink mark, for dark/navy backgrounds. */
export function LogoBrandImage({
  size = 44,
  className = "",
  style = {},
  variant = "dark",
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  variant?: "dark" | "light";
}) {
  return (
    <img
      src={variant === "light" ? "/logo-light.png" : "/logo-transparent.png"}
      alt="M-ALDBANI"
      width={size}
      height={size}
      draggable={false}
      className={`select-none object-contain flex-shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}

/** Standalone MD monogram mark (SVG — for dark/light backgrounds) */
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
      <polyline
        points="7,94 7,7 48,58 89,7 89,94"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
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

/** Full lockup: MD image mark + wordmark stacked */
export function LogoFull({ className = "", color = "#0F0F10", height = 48, variant = "dark" }: { className?: string; color?: string; height?: number; variant?: "dark" | "light" }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} style={{ height }}>
      <LogoBrandImage size={Math.round(height * 0.72)} variant={variant} />
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

/** Pill-style logo for the navbar: real brand image + text side by side */
export function LogoPill({ className = "", color = "#0F0F10", variant = "dark" }: { className?: string; color?: string; variant?: "dark" | "light" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoBrandImage size={32} variant={variant} />
      <span className="text-[13px] font-bold tracking-tight leading-none" style={{ color }}>
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
  variant = "dark",
}: {
  size?: number;
  dark?: boolean;
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <LogoBrandImage size={size} variant={variant} />
    </span>
  );
}
