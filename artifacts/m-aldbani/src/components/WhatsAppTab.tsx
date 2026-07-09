import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../hooks/use-language";
import { X } from "lucide-react";

const WA_PHONE   = "966552469643";
const WA_MSG_EN  = "Hello Mohammed, I'd like to discuss a project with you.";
const WA_MSG_AR  = "مرحباً محمد، أود مناقشة مشروع معك.";
const GOLD       = "#C7AC70";
const BLACK      = "#0F0F10";
const WA_GREEN   = "#25D366";

/* WhatsApp SVG icon */
function WAIcon({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        fill={color}
      />
    </svg>
  );
}

export function WhatsAppTab() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const isRTL = language === "ar";
  const href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(t(WA_MSG_EN, WA_MSG_AR))}`;

  return (
    <>
      {/* Backdrop — closes card on outside click */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 48 }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 49, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>

        {/* ── Popup card ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 300,
                background: "#141414",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Green header strip */}
              <div style={{
                background: `linear-gradient(135deg, #128C7E, ${WA_GREEN})`,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>
                    👤
                  </div>
                  <div>
                    <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>
                      Mohammed Al-Dabbani
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#A8D5A2" }} />
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 600 }}>
                        {t("Online", "متصل الآن")}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff",
                  }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Message bubble */}
              <div style={{ padding: "16px 18px 12px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "12px 14px",
                  marginBottom: 4,
                  position: "relative",
                }}>
                  {/* Small tail */}
                  <div style={{
                    position: "absolute", top: 0, left: -5,
                    width: 0, height: 0,
                    borderTop: "8px solid rgba(255,255,255,0.05)",
                    borderLeft: "8px solid transparent",
                  }} />
                  <p style={{ margin: 0, color: "rgba(245,245,243,0.75)", fontSize: 12.5, lineHeight: 1.6 }}>
                    {t(
                      "Hi 👋 Ready to work on your next brand project? Send me a message!",
                      "مرحباً 👋 جاهز للعمل على مشروع علامتك التجارية؟ أرسل لي رسالة!"
                    )}
                  </p>
                </div>
                <p style={{ margin: "6px 0 0 4px", color: "rgba(255,255,255,0.2)", fontSize: 10 }}>
                  {t("Typically replies in minutes", "يرد في غضون دقائق")}
                </p>
              </div>

              {/* Phone + CTA */}
              <div style={{ padding: "0 18px 18px" }}>
                <p dir="ltr" style={{ margin: "0 0 12px", color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  +966 55 246 9643
                </p>
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
                    padding: "13px 0",
                    borderRadius: 14,
                    background: WA_GREEN,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 800,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  <WAIcon size={17} color="#fff" />
                  {t("Open WhatsApp", "افتح واتساب")}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAB button ── */}
        <motion.button
          onClick={() => setOpen(v => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label="WhatsApp"
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: WA_GREEN,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.3)`,
            position: "relative",
            outline: "none",
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} color="#fff" />
              </motion.div>
            ) : (
              <motion.div
                key="wa"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <WAIcon size={26} color="#fff" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {!open && (
            <motion.div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: `2px solid ${WA_GREEN}`,
                pointerEvents: "none",
              }}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
}
