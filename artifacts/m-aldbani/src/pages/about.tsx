import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { motion } from "framer-motion";
import fujiLogo     from "@assets/Screenshot_2026-07-01_at_3.07.57_AM_1783549571265.png";
import communityLogo from "@assets/Screenshot_2026-07-01_at_3.13.59_AM_1783549571269.png";
import qiroxLogo    from "@assets/Screenshot_2026-07-09_at_1.27.26_AM_1783549658879.png";
import genmzLogo    from "@assets/Screenshot_2026-07-09_at_1.28.37_AM_1783569179187.png";

const GOLD  = "#B8860B";
const GOLD2 = "#D4A017";
const NAVY  = "#0A1628";

export default function About() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const experience = [
    {
      yearEn: "Oct 2025 – Present",
      yearAr: "أكتوبر 2025 – حتى الآن",
      titleEn: "Brand Manager",
      titleAr: "مدير العلامة التجارية",
      orgEn: "Thamarat Al-Khayr — Fuji Cafe",
      orgAr: "ثمار الخير لخدمات الإعاشة — فوجي كافية",
      current: true,
      icon: "🏆",
      pointsEn: [
        "Develop and execute growth and expansion strategy",
        "Analyze market and identify new business opportunities",
        "Develop innovative seasonal products and marketing initiatives",
        "Build strategic partnerships with stakeholders",
        "Improve customer experience and increase loyalty rates",
      ],
      pointsAr: [
        "وضع وتنفيذ استراتيجية النمو والتوسع",
        "تحليل السوق وتحديد الفرص التجارية الجديدة",
        "تطوير منتجات ومبادرات موسمية مبتكرة",
        "بناء شراكات استراتيجية مع الجهات ذات العلاقة",
        "تحسين تجربة العميل وزيادة معدلات الولاء",
      ],
    },
    {
      yearEn: "Oct 2024 – Oct 2025",
      yearAr: "أكتوبر 2024 – أكتوبر 2025",
      titleEn: "Operations & Business Development Manager",
      titleAr: "مدير العمليات وتطوير الأعمال",
      orgEn: "Thamarat Al-Khayr — Fuji Cafe",
      orgAr: "ثمار الخير لخدمات الإعاشة — فوجي كافية",
      current: false,
      icon: "📈",
      pointsEn: [
        "Led the founding of the project from zero to full commercial launch",
        "Developed and executed strategic and operational growth plans",
        "Developed products and recipes aligned with brand identity",
        "Built visual identity and launched the brand",
        "Designed and developed customer experience",
      ],
      pointsAr: [
        "قيادة تأسيس المشروع من الصفر حتى التشغيل التجاري الكامل",
        "إعداد وتنفيذ الخطط الاستراتيجية والتشغيلية للنمو",
        "تطوير المنتجات والوصفات بما يتوافق مع هوية العلامة",
        "بناء الهوية البصرية وإطلاق العلامة التجارية",
        "تصميم وتطوير تجربة العميل",
      ],
    },
    {
      yearEn: "2022 – Oct 2024",
      yearAr: "2022 – أكتوبر 2024",
      titleEn: "Branch Manager / Assistant Branch Manager",
      titleAr: "مدير فرع / مساعد مدير فرع",
      orgEn: "Namq for Beverages Co.",
      orgAr: "شركة نمق لتقديم المشروبات",
      current: false,
      icon: "☕",
      pointsEn: [
        "Managed daily branch operations",
        "Led teams and developed performance to achieve operational targets",
        "Monitored customer experience and resolved complaints professionally",
        "Managed cash flows and daily account reconciliation",
      ],
      pointsAr: [
        "إدارة العمليات التشغيلية اليومية للفرع",
        "قيادة فرق العمل وتطوير الأداء وتحقيق المستهدفات",
        "متابعة تجربة العملاء ومعالجة الشكاوى باحترافية",
        "إدارة التدفقات النقدية وتسوية الحسابات اليومية",
      ],
    },
    {
      yearEn: "2018 – 2022",
      yearAr: "2018 – 2022",
      titleEn: "Branch Manager / Assistant / Customer Service",
      titleAr: "مدير فرع / مساعد / خدمة عملاء",
      orgEn: "Al-Awaji Commercial Markets & Centers",
      orgAr: "أسواق ومراكز العواجي التجارية",
      current: false,
      icon: "🏪",
      pointsEn: [
        "Managed daily branch operations and achieved operational targets",
        "Managed inventory, purchasing, and availability monitoring",
        "Prepared weekly and monthly management reports",
        "Hired, trained, and evaluated staff performance",
      ],
      pointsAr: [
        "إدارة العمليات اليومية للفرع وتحقيق الأهداف التشغيلية",
        "إدارة المخزون والمشتريات ومراقبة مستويات التوفر",
        "إعداد التقارير الأسبوعية والشهرية للإدارة",
        "تعيين وتدريب وتقييم أداء الموظفين",
      ],
    },
  ];

  const brands = [
    { nameEn: "Fuji Cafe",                      nameAr: "فوجي كافية",               logo: fujiLogo,       bg: "#ffffff" },
    { nameEn: "Gen M&Z",                         nameAr: "جن ام آند زد",             logo: genmzLogo,      bg: "#f5f5f5" },
    { nameEn: "QIROX",                           nameAr: "كيروكس",                   logo: qiroxLogo,      bg: "#111111" },
    { nameEn: "Community Marketing Initiative",  nameAr: "مجتمع مبادرة تسويقية",    logo: communityLogo,  bg: "#1a2e5a" },
    { nameEn: "Matcha Power",                    nameAr: "ماتشا باور",               logo: null,           bg: "#2d6a4f" },
  ];

  return (
    <RootLayout>
      {/* ── Hero Banner ── */}
      <section
        className="relative overflow-hidden py-28 flex items-center"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f3c 60%, #112240 100%)` }}
      >
        {/* geometric accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />
          {/* Arabic watermark */}
          <div className="absolute inset-0 flex items-center justify-end pr-16 overflow-hidden select-none pointer-events-none">
            <span className="font-black leading-none opacity-[0.04] text-white"
              style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: 220 }}>
              من أنا
            </span>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                {t("About Me", "نبذة عني")}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-4 leading-tight">
              {t("Mohammed Ali", "محمد بن علي")}
              <br />
              <span style={{ color: GOLD }}>
                {t("Al-Dabbani", "الدباني")}
              </span>
            </h1>

            <p className="text-lg font-medium mb-8 max-w-xl leading-relaxed"
              style={{ color: "rgba(240,220,170,0.75)" }}>
              {t(
                "Brand Manager & Business Development Specialist — F&B Sector",
                "مدير علامة تجارية ومتخصص تطوير أعمال — قطاع الأغذية والمشروبات"
              )}
            </p>

            {/* contact chips */}
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { icon: "📍", text: t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية") },
                { icon: "✉️", text: "Moh.aldbani@gmail.com" },
                { icon: "📞", text: "0552469643" },
              ].map((c, i) => (
                <span key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${GOLD}30`, color: "rgba(240,220,170,0.8)" }}>
                  {c.icon} {c.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Summary ── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(184,134,11,0.06) 0%, transparent 60%)`,
              border: `1px solid ${GOLD}20`,
            }}
          >
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
              style={{ background: `linear-gradient(180deg, ${GOLD}, ${GOLD2}50, transparent)` }} />
            <p className="text-foreground/70 text-lg leading-relaxed" style={{ direction: isAr ? "rtl" : "ltr" }}>
              {t(
                "I seek a leadership position in business development and operations in the F&B sector, contributing to brand building through strategy development, operational plan execution, and continuous performance improvement. I innovate solutions that support growth and profitability.",
                "أسعى لتولي منصب قيادي في مجال تطوير الأعمال والتشغيل بقطاع الأغذية والمشروبات، أساهم في بناء العلامة التجارية عبر تطوير الاستراتيجيات وتنفيذ الخطط التشغيلية بكفاءة، وتحسين جودة الأداء والمنتجات وابتكار حلول تدعم النمو والربحية."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20" style={{ background: "hsl(var(--muted)/0.3)" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          {/* section title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                {t("Career Path", "المسيرة المهنية")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading">
              {t("Professional Experience", "الخبرة المهنية")}
            </h2>
          </motion.div>

          {/* vertical timeline */}
          <div className="relative">
            {/* spine line */}
            <div className={`absolute top-0 bottom-0 w-px ${isAr ? "right-6 md:right-[200px]" : "left-6 md:left-[200px]"}`}
              style={{ background: `linear-gradient(180deg, ${GOLD}, ${GOLD}40, transparent)` }} />

            <div className="space-y-10">
              {experience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-start gap-6 md:gap-10 ${isAr ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* year column */}
                  <div className={`hidden md:flex flex-col items-${isAr ? "start" : "end"} w-44 flex-shrink-0 pt-5`}>
                    <span className="text-sm font-bold leading-tight text-right"
                      style={{ color: item.current ? GOLD : "hsl(var(--muted-foreground))", direction: "ltr" }}>
                      {isAr ? item.yearAr : item.yearEn}
                    </span>
                  </div>

                  {/* dot */}
                  <div className="flex flex-col items-center flex-shrink-0 relative z-10">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
                      style={{
                        background: item.current
                          ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                          : "hsl(var(--card))",
                        border: `2px solid ${item.current ? GOLD : GOLD + "40"}`,
                        boxShadow: item.current ? `0 0 20px ${GOLD}50` : "none",
                      }}
                    >
                      {item.icon}
                    </div>
                    {i < experience.length - 1 && (
                      <div className="w-px flex-1 mt-2 min-h-[20px]"
                        style={{ background: `${GOLD}20` }} />
                    )}
                  </div>

                  {/* card */}
                  <div className="flex-1 pb-2">
                    {/* mobile year */}
                    <div className="md:hidden mb-2">
                      <span className="text-xs font-bold" style={{ color: item.current ? GOLD : "hsl(var(--muted-foreground))" }}>
                        {isAr ? item.yearAr : item.yearEn}
                      </span>
                    </div>

                    <div
                      className="rounded-2xl p-6 md:p-7 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "hsl(var(--card))",
                        border: `1px solid ${item.current ? GOLD + "40" : "hsl(var(--border))"}`,
                        boxShadow: item.current ? `0 4px 30px ${GOLD}12` : "0 2px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* glow top border for current */}
                      {item.current && (
                        <div className="absolute top-0 left-6 right-6 h-[1px]"
                          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                      )}

                      {/* current badge */}
                      {item.current && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-4"
                          style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {t("Current Position", "المنصب الحالي")}
                        </div>
                      )}

                      <h4 className="text-lg font-black font-heading mb-1 leading-snug">
                        {t(item.titleEn, item.titleAr)}
                      </h4>
                      <p className="text-sm font-semibold mb-5" style={{ color: GOLD }}>
                        {t(item.orgEn, item.orgAr)}
                      </p>

                      <ul className="space-y-2.5">
                        {t(item.pointsEn, item.pointsAr).map((point, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-foreground/65 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: GOLD }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Project ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                {t("My Projects", "مشاريعي")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading">{t("Projects", "المشاريع")}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #0f1e36 100%)`,
              border: `1px solid ${GOLD}30`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <div className="absolute -bottom-16 -right-16 text-[160px] opacity-[0.06] select-none pointer-events-none">🍵</div>

            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
              <h4 className="text-2xl font-black text-white">{t("Matcha Power", "ماتشا باور")}</h4>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                {t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}
              </span>
            </div>
            <p className="text-sm font-semibold mb-6" style={{ color: GOLD }}>
              {t("Founder & Project Developer", "مؤسس ومطور المشروع")}
            </p>

            <ul className="space-y-3">
              {t(
                [
                  "Founded the project from idea to operational launch",
                  "Formulated the brand's vision, mission, and core values",
                  "Developed the business model and growth plan",
                  "Conducted market studies and competitor analysis",
                  "Built brand identity and customer experience",
                ],
                [
                  "تأسيس المشروع من الفكرة وحتى الإطلاق التشغيلي",
                  "صياغة الرؤية والرسالة والقيم الأساسية للعلامة",
                  "إعداد نموذج العمل وخطة النمو والتوسع",
                  "تنفيذ دراسات السوق وتحليل المنافسين والجمهور المستهدف",
                  "بناء الهوية التجارية وتجربة العلامة التجارية",
                ]
              ).map((point, j) => (
                <li key={j} className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: "rgba(240,220,170,0.75)" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Brands / Works ── */}
      <section className="py-20" style={{ background: "hsl(var(--muted)/0.3)" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                {t("Portfolio", "الأعمال")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-heading">{t("Brands & Projects", "العلامات والمشاريع")}</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center justify-center rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: brand.bg,
                  border: `1px solid ${GOLD}20`,
                  minHeight: 150,
                  padding: "1.5rem 1rem",
                }}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.nameAr}
                    className="w-full object-contain"
                    style={{ maxHeight: 90 }}
                  />
                ) : (
                  <span className="text-white font-black text-xl text-center leading-tight">
                    {isAr ? brand.nameAr : brand.nameEn}
                  </span>
                )}
                <p className="mt-3 text-xs font-semibold text-center"
                  style={{ color: brand.bg === "#111111" || brand.bg === "#1a2e5a" || brand.bg === "#2d6a4f" ? "#fff" : "#555" }}>
                  {isAr ? brand.nameAr : brand.nameEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
