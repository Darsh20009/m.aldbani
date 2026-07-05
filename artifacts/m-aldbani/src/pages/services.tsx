import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

/* ─── Service Card ─── */
function ServiceCard({ service, i }: { service: any; i: number }) {
  const { t, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(37,99,235,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        transition: "all 0.35s ease",
      }}
      whileHover={{ y: -8, boxShadow: "0 24px 64px rgba(37,99,235,0.12)" }}
    >
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-brand-gradient" />

      {/* Background hover glow */}
      <div className="absolute inset-0 bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

      <div className="relative z-10 p-8 flex flex-col flex-1">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))" }}>
          {service.icon || "⚡"}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-3 font-heading">
          {language === "ar" ? service.titleAr : service.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed flex-1">
          {language === "ar" ? service.descriptionAr : service.description}
        </p>

        {/* CTA */}
        <div className="mt-7">
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
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Services() {
  const { t, language } = useLanguage();
  const { data: rawServices, isLoading } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices : [];
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <RootLayout>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "#FAF8F4" }}>
        {/* Luxury arcs */}
        <svg className="absolute top-0 right-0 opacity-[0.07] pointer-events-none" width="500" height="500" viewBox="0 0 500 500" fill="none">
          <circle cx="500" cy="0" r="280" stroke="url(#sg1)" strokeWidth="1" fill="none" />
          <circle cx="500" cy="0" r="400" stroke="url(#sg1)" strokeWidth="0.5" fill="none" />
          <defs>
            <linearGradient id="sg1" x1="0" y1="0" x2="500" y2="500">
              <stop stopColor="#2563EB" /><stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #B8860B 1px, transparent 0)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-7"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(184,134,11,0.2)",
              boxShadow: "0 4px 20px rgba(184,134,11,0.06)",
            }}
          >
            <Sparkles size={12} style={{ color: "#B8860B" }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{
                background: "linear-gradient(135deg, #B8860B, #D4A017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              {t("Professional Advisory", "استشارات متخصصة")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 font-heading mb-5"
          >
            {t("Consulting Services", "الخدمات الاستشارية")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
      <section className="py-16 px-5" style={{ background: "#FAF8F4" }}>
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse"
                  style={{ border: "1px solid rgba(37,99,235,0.08)" }} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.id} service={service} i={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(37,99,235,0.06)" }}>
                <Briefcase size={36} className="text-[#2563EB] opacity-40" />
              </div>
              <p className="text-lg font-bold text-slate-700 mb-2">{t("Services coming soon", "الخدمات قادمة قريباً")}</p>
              <p className="text-slate-400 text-sm">{t("Check back soon for updates.", "تحقق مرة أخرى قريباً.")}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5" style={{ background: "#FAF8F4" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-black text-slate-900 font-heading mb-4">
              {t("Ready to get started?", "جاهز للبدء؟")}
            </h2>
            <p className="text-slate-500 mb-8">
              {t("Book a free consultation and let's find the right approach for your goals.", "احجز استشارة مجانية ولنجد النهج الصحيح لأهدافك.")}
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
