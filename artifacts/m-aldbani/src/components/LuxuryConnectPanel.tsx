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

function WAIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        fill={color}
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
