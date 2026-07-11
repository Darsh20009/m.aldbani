import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../hooks/use-language";
import { LogoInline } from "./Logo";
import { Tilt3D } from "./Tilt3D";
import { ChevronDown } from "lucide-react";

const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";

const WA_PHONE  = "966552469643";
const WA_MSG_EN = "Hello Mohammed, I'd like to discuss a project with you.";
const WA_MSG_AR = "مرحباً محمد، أود مناقشة مشروع معك.";

/** Official WhatsApp glyph (brand-accurate two-tone mark: green circle + white handset). */
function WAIcon({ size = 22 }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.004 0C7.166 0 0 7.163 0 16c0 2.822.738 5.583 2.14 8.012L.02 32l8.192-2.15A15.94 15.94 0 0016.004 32C24.84 32 32 24.837 32 16S24.84 0 16.004 0z"
        fill="#25D366"
      />
      <path
        d="M24.973 22.548c-.377 1.061-1.872 1.941-3.062 2.197-.814.174-1.878.313-5.457-1.172-4.577-1.898-7.52-6.55-7.749-6.85-.22-.301-1.837-2.446-1.837-4.665 0-2.22 1.157-3.31 1.57-3.762.377-.412.822-.516 1.096-.516.274 0 .548.003.788.015.253.012.593-.096.927.708.343.826 1.166 2.851 1.269 3.06.104.208.174.451.035.729-.14.278-.209.451-.416.694-.208.243-.437.542-.624.729-.208.208-.424.434-.182.85.243.417 1.078 1.782 2.316 2.886 1.592 1.42 2.934 1.86 3.351 2.069.417.208.66.174.903-.104.243-.278 1.043-1.217 1.322-1.635.278-.417.556-.347.928-.208.372.14 2.36 1.113 2.767 1.317.407.204.678.306.777.475.099.169.099.977-.278 2.038z"
        fill="#fff"
      />
    </svg>
  );
}

/** Slow-drifting 3D icosahedron-ish gold shape built from pure CSS 3D transforms — no extra deps. */
function FloatingGoldPolyhedron({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ perspective: 900 }}>
      <motion.div
        style={{ width: size, height: size, transformStyle: "preserve-3d" }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120].map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, rgba(199,172,112,0.22), rgba(199,172,112,0.02))`,
              border: "1px solid rgba(199,172,112,0.35)",
              transform: `rotateY(${deg}deg) translateZ(${size / 2}px)`,
              backdropFilter: "blur(2px)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

async function fetchFaqs() {
  const res = await fetch("/api/faqs");
  if (!res.ok) return [];
  return res.json();
}

function FaqAccordion({ isRTL, t }: { isRTL: boolean; t: (en: string, ar: string) => string }) {
  const { data } = useQuery({ queryKey: ["/api/faqs"], queryFn: fetchFaqs });
  const faqs = Array.isArray(data) ? data : [];
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto text-left" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px w-12 opacity-40" style={{ background: GOLD }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
          {t("Frequently Asked", "الأسئلة الشائعة")}
        </span>
        <div className="h-px w-12 opacity-40" style={{ background: GOLD }} />
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq: any) => {
          const open = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl overflow-hidden transition-colors"
              style={{
                background: open ? "rgba(199,172,112,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${open ? "rgba(199,172,112,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <button
                onClick={() => setOpenId(open ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm md:text-[15px] font-bold" style={{ color: "#fff" }}>
                  {t(faq.question, faq.questionAr)}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={16} color={GOLD} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="px-5 pb-4 text-[13px] md:text-sm leading-relaxed" style={{ color: TITANIUM }}>
                      {t(faq.answer, faq.answerAr)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Luxury panel merged into the very bottom of the homepage:
 * brand-logo WhatsApp CTA + admin-managed FAQ accordion + drifting 3D gold flourishes.
 * Replaces the old floating WhatsApp corner tab.
 */
export function LuxuryConnectPanel() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(t(WA_MSG_EN, WA_MSG_AR))}`;
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="connect" className="relative overflow-hidden py-24 px-6" style={{ background: "#0A0A0B" }}>
      {/* Ambient 3D flourishes */}
      <FloatingGoldPolyhedron size={140} className="absolute hidden md:block" />
      <div className="absolute top-10 left-[6%] hidden md:block">
        <FloatingGoldPolyhedron size={90} />
      </div>
      <div className="absolute bottom-16 right-[8%] hidden md:block">
        <FloatingGoldPolyhedron size={130} />
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(199,172,112,0.08), transparent 70%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Brand-logo WhatsApp CTA, merged and integrated (not floating) */}
        <Tilt3D maxTilt={6} className="mb-16">
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 px-8 py-8 md:px-12 md:py-9 rounded-[28px]"
            style={{
              background: "linear-gradient(135deg, rgba(199,172,112,0.1), rgba(255,255,255,0.02))",
              border: "1px solid rgba(199,172,112,0.28)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
            }}
          >
            {/* Brand logo badge with WhatsApp pulse ring */}
            <div className="relative flex items-center justify-center" style={{ width: 76, height: 76 }}>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${GOLD}` }}
                animate={{ scale: pulse ? [1, 1.35] : 1, opacity: pulse ? [0.5, 0] : 0.5 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              />
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a8914a)` }}
              >
                <LogoInline size={38} className="brightness-0 invert" />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "#25D366", border: "2px solid #0A0A0B" }}
              >
                <WAIcon size={13} />
              </div>
            </div>

            <div className={isRTL ? "text-center md:text-right" : "text-center md:text-left"}>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: GOLD }}>
                {t("Talk to Mohammed directly", "تواصل مباشرة مع محمد")}
              </p>
              <p className="text-xl md:text-2xl font-black text-white mb-1">
                {t("Start a conversation on WhatsApp", "ابدأ محادثة عبر واتساب")}
              </p>
              <p className="text-sm" style={{ color: TITANIUM }}>
                {t("Usually replies within minutes", "يرد عادة خلال دقائق")}
              </p>
            </div>

            <div
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shrink-0"
              style={{ background: "#25D366" }}
            >
              <WAIcon size={16} />
              {t("Chat Now", "راسلني الآن")}
            </div>
          </motion.a>
        </Tilt3D>

        <FaqAccordion isRTL={isRTL} t={t} />
      </div>
    </section>
  );
}
