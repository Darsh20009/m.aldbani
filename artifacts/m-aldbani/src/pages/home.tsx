import { motion } from "framer-motion";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png";

export default function Home() {
  const { t } = useLanguage();

  const services = [
    {
      icon: "🏗️",
      en: "Business Development",
      ar: "تطوير الأعمال",
      descEn: "From concept to full commercial launch — strategy, branding, and execution.",
      descAr: "من الفكرة حتى الإطلاق التجاري الكامل — استراتيجية وهوية وتنفيذ.",
    },
    {
      icon: "📊",
      en: "Operations Management",
      ar: "إدارة العمليات",
      descEn: "Operational excellence: KPIs, team leadership, and quality standards.",
      descAr: "التميز التشغيلي: مؤشرات الأداء وقيادة الفرق ومعايير الجودة.",
    },
    {
      icon: "🎯",
      en: "Brand & Marketing",
      ar: "الهوية والتسويق",
      descEn: "Build brands that convert — visual identity, positioning, and growth campaigns.",
      descAr: "بناء علامات تجارية تُحوِّل — هوية بصرية وتموضع وحملات نمو.",
    },
  ];

  const stats = [
    { value: "8+",  labelEn: "Years Experience",   labelAr: "سنوات خبرة" },
    { value: "50+", labelEn: "Brands Launched",    labelAr: "علامة تجارية أُطلقت" },
    { value: "2M+", labelEn: "Customers Served",   labelAr: "عميل تم خدمته" },
    { value: "3",   labelEn: "Major Industries",   labelAr: "قطاعات رئيسية" },
  ];

  return (
    <RootLayout>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-radial pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
              <img src={logoPath} alt="M-ALDBANI" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {t("Mohammed Al-Dabbani", "محمد الدباني")}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight text-foreground">
              {t("Precision. Authority. ", "دقة. احترافية. ")}
              <span className="gradient-text">
                {t("Sophistication.", "رقي.")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t(
                "Business development strategist with 8+ years elevating F&B brands, building operations from zero, and launching ventures that last.",
                "متخصص في تطوير الأعمال بخبرة تزيد عن 8 سنوات في رفع مستوى علامات F&B التجارية وبناء العمليات من الصفر وإطلاق مشاريع ناجحة.",
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-14 text-base shadow-lg shadow-primary/25">
                  {t("Book Consultation", "احجز استشارة")}
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="font-semibold px-8 h-14 text-base hover:border-primary hover:text-primary">
                  {t("View Work", "استعرض الأعمال")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="section-stripe py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl font-bold font-heading text-primary mb-2">{s.value}</p>
                <p className="text-muted-foreground text-sm">{t(s.labelEn, s.labelAr)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              {t("What I Do", "ماذا أقدم")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              {t("Premium Services", "خدمات مميزة")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("Tailored solutions for ambitious brands and ventures.", "حلول مخصصة للعلامات التجارية والمشاريع الطموحة.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-2xl">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{t(svc.en, svc.ar)}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t(svc.descEn, svc.descAr)}</p>
                <Link href="/services">
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold hover:gap-2 transition-all">
                    {t("Learn more →", "اكتشف المزيد ←")}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="section-stripe py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-primary/20 shadow-md">
                <img src={logoPath} alt="M-ALDBANI" className="h-full w-full object-cover" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              {t("Ready to grow your business?", "هل أنت مستعد لتطوير أعمالك؟")}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {t(
                "Let's discuss how we can elevate your brand and operations.",
                "لنتحدث عن كيفية رفع مستوى علامتك التجارية وعملياتك."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-14 shadow-lg shadow-primary/25">
                  {t("Book Free Consultation", "احجز استشارة مجانية")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-semibold px-8 h-14 hover:border-primary hover:text-primary">
                  {t("Send Message", "أرسل رسالة")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
