/**
 * ServerWakeup — detects Render free-tier cold starts and shows a friendly
 * Arabic overlay so users see progress instead of a blank white page.
 *
 * Flow:
 *  1. Fires a /api/ping immediately on mount.
 *  2. If ping resolves in < 2 s  → invisible (normal warm server).
 *  3. If ping takes ≥ 2 s        → overlay appears with spinner + message.
 *  4. Once ping resolves          → overlay fades out automatically.
 *  5. After 70 s with no reply   → shows a manual-reload button.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLOW_THRESHOLD_MS = 2000;
const GIVE_UP_MS        = 70_000;

export function ServerWakeup() {
  const [show, setShow]     = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let slowTimer: ReturnType<typeof setTimeout>;
    let giveUpTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    slowTimer  = setTimeout(() => { if (!cancelled) setShow(true); }, SLOW_THRESHOLD_MS);
    giveUpTimer = setTimeout(() => { if (!cancelled) setTimedOut(true); }, GIVE_UP_MS);

    fetch("/api/ping", { cache: "no-store" })
      .then(() => {
        if (cancelled) return;
        clearTimeout(slowTimer);
        clearTimeout(giveUpTimer);
        setShow(false);
      })
      .catch(() => {
        /* server unreachable — keep overlay visible until timeout */
      });

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
      clearTimeout(giveUpTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="wakeup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#F5F5F3",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 20, padding: 32, textAlign: "center", direction: "rtl",
          }}
        >
          {!timedOut ? (
            <>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "3px solid #E5E7EB", borderTop: "3px solid #2563EB",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ fontSize: 17, fontWeight: 700, color: "#0F0F10" }}>
                جاري تشغيل الخادم…
              </p>
              <p style={{ fontSize: 13, color: "#8C9198", maxWidth: 280 }}>
                الخادم في وضع الاستعداد — يستغرق عادةً أقل من دقيقة
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#0F0F10" }}>
                استغرق الاتصال وقتاً طويلاً
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 28px", background: "#2563EB", color: "#fff",
                  borderRadius: 8, border: "none", fontWeight: 600,
                  cursor: "pointer", fontSize: 14,
                }}
              >
                إعادة المحاولة
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
