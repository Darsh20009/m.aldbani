import sarSymbol from "@assets/Screenshot_2026-06-11_at_4.27.34_PM_1782782357449.png";

interface SarIconProps {
  size?: number;
  className?: string;
}

export function SarIcon({ size = 16, className = "" }: SarIconProps) {
  return (
    <img
      src={sarSymbol}
      alt="ر.س"
      style={{ width: size, height: size, display: "inline", verticalAlign: "middle", objectFit: "contain" }}
      className={className}
    />
  );
}

interface SarPriceProps {
  amount: number | string;
  className?: string;
  iconSize?: number;
}

export function SarPrice({ amount, className = "", iconSize = 14 }: SarPriceProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{typeof amount === "number" ? amount.toLocaleString("ar-SA") : amount}</span>
      <SarIcon size={iconSize} />
    </span>
  );
}

export function SarText({ text, iconSize = 13 }: { text: string; iconSize?: number }) {
  if (!text.includes("ر.س")) return <span>{text}</span>;
  const parts = text.split("ر.س");
  return (
    <span className="inline-flex items-center flex-wrap gap-0.5">
      {parts.map((part, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          <span>{part}</span>
          {i < parts.length - 1 && <SarIcon size={iconSize} />}
        </span>
      ))}
    </span>
  );
}
