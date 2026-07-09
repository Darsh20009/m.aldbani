import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../hooks/use-language";

const WA_PHONE = "966552469643";
const WA_MESSAGE_EN = "Hello Mohammed, I'd like to discuss a project with you.";
const WA_MESSAGE_AR = "مرحباً محمد، أود مناقشة مشروع معك.";

const GOLD  = "#C7AC70";
const BLACK = "#0F0F10";

export function WhatsAppTab() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const message = encodeURIComponent(t(WA_MESSAGE_EN, WA_MESSAGE_AR));
  const href = `https://wa.me/${WA_PHONE}?text=${message}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        direction: "ltr",
        gap: 0,
      }}
    >
      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginRight: 8,
              background: BLACK,
              borderRadius: 20,
              padding: "24px 22px 20px",
              width: 260,
              border: `1px solid rgba(199,172,112,0.25)`,
              boxShadow: "0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: "#25D366",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                  {t("WhatsApp", "واتساب")}
                </p>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>
                  {t("Typically replies in minutes", "يرد في غضون دقائق")}
                </p>
              </div>
            </div>

            {/* Message bubble */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "14px 14px 14px 4px",
              padding: "10px 14px",
              marginBottom: 16,
            }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>
                {t(
                  "Hi! Ready to discuss your brand project? Send a message and I'll get back shortly.",
                  "مرحباً! جاهز لنقاش مشروع علامتك التجارية؟ أرسل رسالة وسأرد قريباً."
                )}
              </p>
            </div>

            {/* Phone */}
            <p dir="ltr" style={{ margin: "0 0 16px", color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
              +966 55 246 9643
            </p>

            {/* CTA */}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "11px 0",
                borderRadius: 12,
                background: "#25D366",
                color: "white",
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {t("Start Chat", "ابدأ المحادثة")}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill trigger */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="WhatsApp"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: 48,
          paddingTop: 16,
          paddingBottom: 16,
          background: BLACK,
          borderRadius: "14px 0 0 14px",
          cursor: "pointer",
          border: "none",
          outline: "none",
          borderTop: `1px solid rgba(199,172,112,0.2)`,
          borderBottom: `1px solid rgba(199,172,112,0.2)`,
          borderLeft: `1px solid rgba(199,172,112,0.2)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Gold top accent */}
        <div style={{
          position: "absolute",
          top: 0, left: 8, right: 8,
          height: 2,
          borderRadius: "0 0 2px 2px",
          background: GOLD,
          opacity: open ? 1 : 0.5,
          transition: "opacity 0.25s",
        }} />

        {/* WA icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
            fill="#25D366"
          />
        </svg>

        {/* Rotated label */}
        <span style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: GOLD,
          opacity: 0.75,
          userSelect: "none",
        }}>
          {t("Chat", "تواصل")}
        </span>
      </motion.button>
    </div>
  );
}
