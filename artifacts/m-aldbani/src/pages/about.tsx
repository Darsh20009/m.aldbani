import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { motion } from "framer-motion";

export default function About() {
  const { t } = useLanguage();

  const experience = [
    {
      yearEn: "Oct 2025 – Present",
      yearAr: "أكتوبر 2025 – حتى الآن",
      titleEn: "Brand Manager",
      titleAr: "مدير العلامة التجارية",
      orgEn: "Thamarat Al-Khayr — Fuji Cafe",
      orgAr: "ثمار الخير لخدمات الإعاشة — فوجي كافية",
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
      orgEn: "Namq for Beverages",
      orgAr: "شركة نمق لتقديم المشروبات",
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

  const skills = [
    { en: "Brand Building & Positioning",       ar: "بناء البراندات والتموضع التجاري" },
    { en: "Business Development Strategy",       ar: "استراتيجية تطوير الأعمال" },
    { en: "Operations Management",               ar: "إدارة العمليات التشغيلية" },
    { en: "Market Analysis & Opportunity",       ar: "تحليل السوق واكتشاف الفرص" },
    { en: "Customer Experience Design",          ar: "تصميم تجربة العميل" },
    { en: "Team Leadership & Development",       ar: "قيادة وبناء الفرق" },
    { en: "Idea-to-Project Execution",           ar: "تحويل الأفكار إلى مشاريع" },
    { en: "Creativity + Profitability Linking",  ar: "ربط الإبداع بالربحية" },
  ];

  const courses = [
    { en: "Inventory & Procurement Management", ar: "إدارة المخزون والمشتريات", org: "Exclusive Technology Training Center / مركز التقنية الحصرية" },
    { en: "Advanced Restaurant & Café Management", ar: "إدارة وتشغيل المطاعم والمقاهي (المتقدمة)", org: "Mohammed Al-Tabshi / محمد الطبشي" },
    { en: "Barista Profession", ar: "مهنة البريستا", org: "Banan Training Center / مركز التدريب بنان" },
    { en: "Professional Operations Course", ar: "دورة التشغيل الاحترافي", org: "BCI Institute / معهد بي سي ايه" },
    { en: "Business Operations Management", ar: "إدارة عمليات الأعمال", org: "Idarek Platform / منصة إدارك" },
  ];

  return (
    <RootLayout>
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] z-0" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
                {t("About Me", "من أنا")}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                {t("Mohammed Ali Al-Dabbani", "محمد بن علي الدباني")}
              </h1>
              <h2 className="text-xl text-primary font-semibold mb-6">
                {t(
                  "Brand Manager & Business Development Specialist — F&B Sector",
                  "مدير علامة تجارية ومتخصص تطوير أعمال — قطاع الأغذية والمشروبات"
                )}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5">📍 {t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية")}</span>
                <span className="flex items-center gap-1.5">✉️ Moh.aldbani@gmail.com</span>
                <span className="flex items-center gap-1.5">📞 0552469643</span>
              </div>
              <div className="prose prose-lg text-foreground/70 max-w-none">
                <p>
                  {t(
                    "I seek a leadership position in business development and operations in the F&B sector, contributing to brand building through strategy development, operational plan execution, and continuous performance improvement. I innovate solutions that support growth and profitability.",
                    "أسعى لتولي منصب قيادي في مجال تطوير الأعمال والتشغيل بقطاع الأغذية والمشروبات، أساهم في بناء العلامة التجارية عبر تطوير الاستراتيجيات وتنفيذ الخطط التشغيلية بكفاءة، وتحسين جودة الأداء والمنتجات وابتكار حلول تدعم النمو والربحية."
                  )}
                </p>
              </div>
            </div>

            {/* Experience */}
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Professional Experience", "المسيرة المهنية")}
            </h3>

            <div className="space-y-6 mb-16">
              {experience.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col md:flex-row gap-4 md:gap-8 group"
                >
                  <div className="md:w-48 flex-shrink-0 text-primary font-mono text-sm pt-1">
                    {t(item.yearEn, item.yearAr)}
                  </div>
                  <div className="glass-card p-6 rounded-xl flex-1 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    <h4 className="text-lg font-bold mb-1">{t(item.titleEn, item.titleAr)}</h4>
                    <p className="text-primary/80 font-medium text-sm mb-4">{t(item.orgEn, item.orgAr)}</p>
                    <ul className="space-y-1.5">
                      {(t(item.pointsEn, item.pointsAr) as string[]).map((point, j) => (
                        <li key={j} className="text-foreground/60 text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Projects */}
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Projects", "المشاريع")}
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-xl mb-16 relative overflow-hidden"
            >
              <div className="absolute right-8 top-8 text-5xl opacity-10">🍵</div>
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <h4 className="text-xl font-bold">{t("Matcha Power", "ماتشا باور")}</h4>
                <span className="text-primary font-mono text-sm">{t("May 2025 – May 2026", "مايو 2025 – مايو 2026")}</span>
              </div>
              <p className="text-primary font-medium text-sm mb-4">{t("Founder & Project Developer", "مؤسس ومطور المشروع")}</p>
              <ul className="space-y-1.5">
                {(t(
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
                ) as string[]).map((point, j) => (
                  <li key={j} className="text-foreground/60 text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Skills */}
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Skills", "المهارات")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
              {skills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card px-5 py-3 rounded-xl flex items-center gap-3"
                >
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{t(skill.en, skill.ar)}</span>
                </motion.div>
              ))}
            </div>

            {/* Courses */}
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Training & Courses", "الدورات التدريبية")}
            </h3>
            <div className="space-y-3 mb-16">
              {courses.map((course, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card px-6 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <span className="font-semibold text-sm">{t(course.en, course.ar)}</span>
                  <span className="text-muted-foreground text-xs">{course.org}</span>
                </motion.div>
              ))}
            </div>

            {/* Languages */}
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Languages", "اللغات")}
            </h3>
            <div className="flex gap-4">
              {[
                { lang: "العربية", level: "Arabic — Native" },
                { lang: "English", level: "الإنجليزية" },
              ].map((l, i) => (
                <div key={i} className="glass-card px-6 py-4 rounded-xl flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-semibold text-sm">{l.lang} / {l.level}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </RootLayout>
  );
}
