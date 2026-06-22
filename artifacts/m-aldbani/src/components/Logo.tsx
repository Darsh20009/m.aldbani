export function LogoMark({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="80" height="80" rx="16" fill="white" />
      <rect width="80" height="80" rx="16" fill="url(#grad)" fillOpacity="0.06" />
      <rect x="1" y="1" width="78" height="78" rx="15" stroke="#2563EB" strokeOpacity="0.18" strokeWidth="1.5" />

      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Sora', 'Inter', sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="-1"
        fill="url(#textGrad)"
      >
        MA
      </text>

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="textGrad" x1="10" y1="25" x2="70" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}
