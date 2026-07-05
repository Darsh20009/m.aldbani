import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

export function LogoMark({ className = "", size = 44 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoImg}
      alt="m-aldbani | محمد الدباني"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ filter: "drop-shadow(0 2px 8px rgba(37,99,235,0.15))" }}
    />
  );
}

export function LogoFull({ className = "", height = 48 }: { className?: string; height?: number }) {
  return (
    <img
      src={logoImg}
      alt="m-aldbani | محمد الدباني"
      height={height}
      className={`object-contain w-auto ${className}`}
      style={{ filter: "drop-shadow(0 2px 8px rgba(37,99,235,0.15))" }}
    />
  );
}
