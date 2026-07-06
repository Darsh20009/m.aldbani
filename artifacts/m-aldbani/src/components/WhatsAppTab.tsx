import { useState } from "react";
import { useLanguage } from "../hooks/use-language";

const WA_PHONE = "966552469643";
const WA_MESSAGE_EN = "Hello Mohammed, I'd like to discuss a project with you.";
const WA_MESSAGE_AR = "مرحباً محمد، أود مناقشة مشروع معك.";

export function WhatsAppTab() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const isRTL = language === "ar";
  const message = encodeURIComponent(t(WA_MESSAGE_EN, WA_MESSAGE_AR));
  const href = `https://wa.me/${WA_PHONE}?text=${message}`;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        alignItems: "stretch",
        direction: "ltr",
      }}
    >
      {/* Expanded panel — slides in from right */}
      <div
        style={{
          width: open ? 220 : 0,
          overflow: "hidden",
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: 220,
            background: "#0a1628",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            padding: "20px 20px 20px 24px",
            textDecoration: "none",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
          onClick={() => setOpen(false)}
        >
          {/* WA icon + label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {/* WhatsApp SVG icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#25D366" />
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                fill="white"
              />
            </svg>
            <div>
              <p style={{ margin: 0, color: "white", fontSize: 13, fontWeight: 800, lineHeight: 1 }}>WhatsApp</p>
              <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}>
                {t("Start conversation", "ابدأ محادثة")}
              </p>
            </div>
          </div>

          {/* Phone number */}
          <p
            dir="ltr"
            style={{
              margin: "0 0 14px",
              color: "#25D366",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            +966 55 246 9643
          </p>

          {/* CTA button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 20,
              background: "#25D366",
              color: "white",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("Open Chat", "افتح المحادثة")}
          </div>
        </a>
      </div>

      {/* The tab itself — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="WhatsApp"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: 36,
          paddingTop: 20,
          paddingBottom: 20,
          background: "#0a1628",
          borderTopLeftRadius: open ? 0 : 10,
          borderBottomLeftRadius: open ? 0 : 10,
          cursor: "pointer",
          border: "none",
          outline: "none",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* Green accent strip on the far left of the tab */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 16,
            bottom: 16,
            width: 2,
            borderRadius: 2,
            background: "#25D366",
            opacity: open ? 1 : 0.6,
            transition: "opacity 0.3s",
          }}
        />

        {/* WA icon small */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
            fill="#25D366"
          />
        </svg>

        {/* Rotated label */}
        <span
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            userSelect: "none",
          }}
        >
          {t("WhatsApp", "واتساب")}
        </span>
      </button>
    </div>
  );
}
