import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { LogoMark } from "../components/Logo";
import { ArrowRight, ArrowLeft } from "lucide-react";

const BLACK    = "#0F0F10";
const GRAPHITE = "#3A3A3A";
const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";
const OFF_WHITE = "#F5F5F3";
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── Static services (shown if API returns nothing) ── */
const DEFAULT_SERVICES = [
  {
    icon: "🎯",
    titleEn: "Brand Strategy",
    titleAr: "استراتيجية العلامة",
    descEn: "Complete brand positioning, vision, mission, and competitive differentiation tailored for the F&B sector.",
    descAr: "تحديد موقع العلامة التجارية، الرؤية، الرسالة، والتميز التنافسي المصمم لقطاع الأغذية والمشروبات.",
  },
  {
    icon: "🖼️",
    titleEn: "Visual Identity",
    titleAr: "الهوية البصرية",
    descEn: "Logo systems, color palettes, typography, and brand guidelines that command attention and build recognition.",
    descAr: "أنظمة الشعارات، لوحات الألوان، الخطوط، وإرشادات العلامة التي تستقطب الانتباه وتبني الإدراك.",
  },
  {
    icon: "📈",
    titleEn: "Business Development",
    titleAr: "تطوير الأعمال",
    descEn: "Market studies, expansion planning, and business model development for sustainable F&B growth.",
    descAr: "دراسات السوق، تخطيط التوسع، وتطوير نماذج الأعمال للنمو المستدام في قطاع الأغذية والمشروبات.",
  },
  {
    icon: "⚙️",
    titleEn: "Operations Management",
    titleAr: "إدارة العمليات",
    descEn: "Process optimization, team structure, and performance systems that drive operational excellence.",
    descAr: "تحسين العمليات، هيكلة الفرق، وأنظمة الأداء التي تحقق التميز التشغيلي.",
  },
  {
    icon: "🤝",
    titleEn: "Marketing & Partnerships",
    titleAr: "التسويق والشراكات",
    descEn: "Community campaigns, seasonal launches, and strategic partnerships that grow loyalty and revenue.",
    descAr: "حملات مجتمعية، إطلاقات موسمية، وشراكات استراتيجية تنمو الولاء والإيرادات.",
  },
  {
    icon: "☕",
    titleEn: "Product Development",
    titleAr: "تطوير المنتجات",
    descEn: "Menu engineering, recipe formulation, and seasonal innovation aligned with brand identity.",
    descAr: "هندسة القائمة، صياغة الوصفات، والابتكار الموسمي المتوافق مع هوية العلامة.",
  },
];

function ServiceCard({ icon, titleEn, titleAr, descEn, descAr, i }: {
  icon: string; titleEn: string; titleAr: string; descEn: string; descAr: string; i: number;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl p-7 flex flex-col"
      style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s",
      }}
    >
      {/* Gold top accent on hover */}
      <div className="absolute top-0 left-8 right-8 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
        style={{ background: "rgba(199,172,112,0.08)", border: `1px solid rgba(199,172,112,0.15)` }}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-black font-heading mb-2.5 group-hover:text-[#C7AC70] transition-colors"
        style={{ color: OFF_WHITE }}>
        {t(titleEn, titleAr)}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: TITANIUM }}>
        {t(descEn, descAr)}
      </p>

      {/* CTA */}
      <div className="mt-6">
        <Link href="/contact">
          <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: GOLD, opacity: 0.7, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {t("Enquire", "استفسر")}
            <ArrowRight size={12} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t, language } = useLanguage();
  const { data: rawServices } = useListServices();
  const apiServices = Array.isArray(rawServices) ? rawServices : [];
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  /* Merge API services with defaults (API takes priority if populated) */
  const displayServices = apiServices.length > 0
    ? apiServices.map((s: any) => ({
        icon: s.icon || "⚡",
        titleEn: s.title, titleAr: s.titleAr || s.title,
        descEn: s.description, descAr: s.descriptionAr || s.description,
      }))
    : DEFAULT_SERVICES;

  return (
    <RootLayout>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: BLACK, paddingTop: 120, paddingBottom: 80 }}>
        {/* Noise grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />

        {/* Large MD watermark */}
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
          <LogoMark color="#ffffff" size={320} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.25)` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              {t("Professional Advisory", "استشارات متخصصة")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: EASE, duration: 0.7 }}
            className="text-6xl font-black font-heading mb-5"
            style={{ color: OFF_WHITE }}
          >
            {t("Services", "الخدمات")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: EASE, duration: 0.7 }}
            className="text-lg leading-relaxed"
            style={{ color: TITANIUM }}
          >
            {t(
              "Strategic advisory and operational execution — from brand inception to commercial dominance.",
              "استشارات استراتيجية وتنفيذ تشغيلي — من انطلاق العلامة إلى السيطرة التجارية."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-20 px-5" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayServices.map((s, i) => (
              <ServiceCard key={i} {...s} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-5" style={{ background: BLACK }}>
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* MD monogram */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: GRAPHITE }}>
                <LogoMark color={GOLD} size={36} />
              </div>
            </div>

            <h2 className="text-3xl font-black font-heading mb-4" style={{ color: OFF_WHITE }}>
              {t("Ready to build something great?", "جاهز لبناء شيء استثنائي؟")}
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: TITANIUM }}>
              {t(
                "Let's find the right strategy for your brand's next chapter.",
                "لنجد الاستراتيجية الصحيحة للفصل التالي من علامتك التجارية."
              )}
            </p>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm"
                style={{ background: GOLD, color: BLACK, letterSpacing: "0.02em" }}
              >
                {t("Get in Touch", "تواصل معي")}
                <ArrowIcon size={15} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
