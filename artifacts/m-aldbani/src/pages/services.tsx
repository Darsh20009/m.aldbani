import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Star, Zap, Shield } from "lucide-react";

/* ══════════════════════════════
   SERVICE CARD
══════════════════════════════ */
function ServiceCard({ service, i }: { service: any; i: number }) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(37,99,235,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        transition: "all 0.35s ease",
      }}
      whileHover={{ y: -8, boxShadow: "0 24px 64px rgba(37,99,235,0.14)" }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full bg-brand-gradient" />

      {/* Background hover glow */}
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

      <div className="relative z-10 p-8 flex flex-col flex-1">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" }}>
          {service.icon || "⚡"}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-3 font-heading">
          {language === "ar" ? service.titleAr : service.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
          {language === "ar" ? service.descriptionAr : service.description}
        </p>

        {/* Price block */}
        {service.price && (
          <div className="mb-6 p-4 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.06))", border: "1px solid rgba(37,99,235,0.12)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-1">
              {t("Starting from", "يبدأ من")}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{service.price}</span>
              <span className="text-sm font-semibold text-[#2563EB]">{t("SAR", "ر.س")}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href="/book">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}
          >
            <Sparkles size={14} />
            {t("Book This Service", "احجز هذه الخدمة")}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════
   PRICING PACKAGES SECTION
══════════════════════════════ */
function PricingSection() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const plans = [
    {
      nameEn: "Starter",
      nameAr: "أساسي",
      priceEn: "Free",
      priceAr: "مجاني",
      subtitleEn: "First consultation",
      subtitleAr: "أول استشارة",
      color: "#2563EB",
      popular: false,
      featuresEn: [
        "30-minute strategy session",
        "Business overview review",
        "Key recommendations",
        "Follow-up summary",
      ],
      featuresAr: [
        "جلسة استراتيجية 30 دقيقة",
        "مراجعة نظرة عامة للأعمال",
        "توصيات رئيسية",
        "ملخص متابعة",
      ],
    },
    {
      nameEn: "Professional",
      nameAr: "احترافي",
      priceEn: "2,500",
      priceAr: "2,500",
      subtitleEn: "Per project",
      subtitleAr: "للمشروع",
      color: "#7C3AED",
      popular: true,
      featuresEn: [
        "Full brand strategy",
        "Business development plan",
        "Operations audit & KPIs",
        "3 months follow-up",
        "Priority support",
      ],
      featuresAr: [
        "استراتيجية علامة كاملة",
        "خطة تطوير أعمال",
        "مراجعة عمليات ومؤشرات أداء",
        "متابعة 3 أشهر",
        "دعم ذو أولوية",
      ],
    },
    {
      nameEn: "Enterprise",
      nameAr: "مؤسسي",
      priceEn: "Custom",
      priceAr: "مخصص",
      subtitleEn: "Full partnership",
      subtitleAr: "شراكة كاملة",
      color: "#B8860B",
      popular: false,
      featuresEn: [
        "Everything in Professional",
        "Monthly retainer model",
        "On-site visits",
        "Team training & workshops",
        "Dedicated support",
        "Annual strategy review",
      ],
      featuresAr: [
        "كل ما في الاحترافي",
        "نموذج شهري دوري",
        "زيارات ميدانية",
        "تدريب الفريق وورش العمل",
        "دعم مخصص",
        "مراجعة استراتيجية سنوية",
      ],
    },
  ];

  return (
    <section className="py-24 px-5" style={{ background: "linear-gradient(135deg, #060e1e 0%, #0a1628 80%)" }}>
      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-blue absolute" style={{ width: 500, height: 500, top: "-10%", left: "10%", opacity: 0.5 }} />
        <div className="orb-purple absolute" style={{ width: 400, height: 400, bottom: "-10%", right: "10%", opacity: 0.5 }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.25)" }}>
            <Star size={12} className="text-blue-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
              {t("Transparent Pricing", "أسعار شفافة")}
            </span>
          </div>
          <h2 className="text-4xl font-black text-white font-heading mb-4">
            {t("Simple, Clear Pricing", "أسعار واضحة وبسيطة")}
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            {t(
              "No hidden fees. Choose the plan that fits your needs.",
              "لا رسوم مخفية. اختر الخطة التي تناسب احتياجاتك."
            )}
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-3xl overflow-hidden flex flex-col ${plan.popular ? "scale-105" : ""}`}
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))"
                  : "rgba(255,255,255,0.04)",
                border: plan.popular ? "2px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-0">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "white", marginTop: "-1px" }}>
                    <Zap size={11} />
                    {t("Most Popular", "الأكثر طلباً")}
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1" style={{ paddingTop: plan.popular ? "2.5rem" : "2rem" }}>
                {/* Plan name */}
                <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: plan.color }}>
                  {t(plan.nameEn, plan.nameAr)}
                </p>
                <p className="text-slate-400 text-xs mb-5">{t(plan.subtitleEn, plan.subtitleAr)}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl font-black text-white font-heading">
                    {t(plan.priceEn, plan.priceAr)}
                  </span>
                  {plan.priceEn !== "Free" && plan.priceEn !== "Custom" && (
                    <span className="text-slate-400 text-sm">{t("SAR", "ر.س")}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {(language === "ar" ? plan.featuresAr : plan.featuresEn).map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={plan.priceEn === "Custom" ? "/contact" : "/book"}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={plan.popular ? {
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      color: "white",
                      boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
                    } : {
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(220,235,255,0.85)",
                    }}
                  >
                    {plan.priceEn === "Custom"
                      ? t("Contact Us", "تواصل معنا")
                      : plan.priceEn === "Free"
                        ? t("Start Free", "ابدأ مجاناً")
                        : t("Get Started", "ابدأ الآن")}
                    <ArrowIcon size={14} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-500 text-sm mt-10 flex items-center justify-center gap-2"
        >
          <Shield size={14} className="text-slate-400" />
          {t("All prices are in Saudi Riyals. Custom packages available upon request.", "جميع الأسعار بالريال السعودي. تتوفر باقات مخصصة عند الطلب.")}
        </motion.p>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   MAIN SERVICES PAGE
══════════════════════════════ */
export default function Services() {
  const { t, language } = useLanguage();
  const { data: rawServices, isLoading } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices : [];
  const isRTL = language === "ar";

  return (
    <RootLayout>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: "#FAF8F4" }}>
        {/* Decorative */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2563EB, #7C3AED)" }} />
        <div className="absolute inset-0 pattern-geo opacity-[0.5] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
          >
            <Sparkles size={12} className="text-[#2563EB]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              {t("Professional Advisory", "استشارات متخصصة")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl font-black text-slate-900 font-heading mb-5"
          >
            {t("Consulting Services", "الخدمات الاستشارية")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            {t(
              "Strategic advisory and operational execution for forward-thinking organizations across the Kingdom.",
              "استشارات استراتيجية وتنفيذ تشغيلي للمنظمات ذات التفكير المستقبلي في أنحاء المملكة."
            )}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-5 bg-[#FAF8F4]">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse"
                  style={{ border: "1px solid rgba(37,99,235,0.1)" }} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.id} service={service} i={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400">
              <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">{t("Services coming soon", "الخدمات قادمة قريباً")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <div className="relative">
        <PricingSection />
      </div>

      {/* CTA */}
      <section className="py-20 px-5 bg-[#FAF8F4]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-black text-slate-900 font-heading mb-4">
              {t("Not Sure Which Plan?", "غير متأكد من الخطة؟")}
            </h2>
            <p className="text-slate-500 mb-8">
              {t("Book a free consultation and we'll find the best fit together.", "احجز استشارة مجانية وسنجد الخطة الأنسب معاً.")}
            </p>
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold btn-brand text-white"
              >
                <Sparkles size={16} />
                {t("Book Free Consultation", "احجز استشارة مجانية")}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </RootLayout>
  );
}
