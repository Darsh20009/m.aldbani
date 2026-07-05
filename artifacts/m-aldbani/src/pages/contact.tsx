import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles, MessageSquare, Linkedin, Twitter, Instagram, CheckCircle } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  name:    z.string().min(2, "Name required"),
  email:   z.string().email("Valid email required"),
  phone:   z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message too short"),
});
type F = z.infer<typeof schema>;

export default function Contact() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [sent, setSent] = useState(false);
  const isRTL = language === "ar";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: F) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        setSent(true);
        reset();
        toast({ title: t("Message Sent!", "تم الإرسال!"), description: t("I'll get back to you soon.", "سأرد عليك قريباً.") });
      },
      onError: () => {
        toast({
          title: t("Error", "خطأ"),
          description: t("Failed to send. Please try again.", "فشل الإرسال. حاول مرة أخرى."),
          variant: "destructive",
        });
      },
    });
  };

  const contactItems = [
    {
      icon: <Mail size={20} />,
      labelEn: "Email",
      labelAr: "البريد الإلكتروني",
      value: settings.email || "Moh.aldbani@gmail.com",
      href: `mailto:${settings.email || "Moh.aldbani@gmail.com"}`,
      color: "#2563EB",
    },
    {
      icon: <Phone size={20} />,
      labelEn: "Phone / WhatsApp",
      labelAr: "الجوال / واتساب",
      value: settings.phone || "+966 552 469 643",
      href: `tel:${settings.phone || "+966552469643"}`,
      color: "#7C3AED",
    },
    {
      icon: <MapPin size={20} />,
      labelEn: "Location",
      labelAr: "الموقع",
      value: settings.address || "Riyadh, Saudi Arabia",
      href: null,
      color: "#B8860B",
    },
  ];

  return (
    <RootLayout>

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: "#FAF8F4" }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2563EB, #7C3AED)" }} />
        <div className="absolute inset-0 pattern-geo opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
          >
            <MessageSquare size={12} className="text-[#2563EB]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              {t("Get in Touch", "تواصل معي")}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 font-heading mb-4"
          >
            {t("Let's Talk", "لنتحدث")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            {t(
              "Have a project in mind or want to explore a collaboration? Reach out and let's make it happen.",
              "هل لديك مشروع في ذهنك أو تريد استكشاف تعاون؟ تواصل معي ولنحوّله إلى واقع."
            )}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-5 bg-[#FAF8F4]">
        <div className="max-w-5xl mx-auto">
          <div className={`grid lg:grid-cols-5 gap-10 items-start ${isRTL ? "direction-rtl" : ""}`}>

            {/* Contact info panel */}
            <div className="lg:col-span-2 space-y-4">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white rounded-2xl p-5 flex items-start gap-4"
                  style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: item.color }}>
                      {t(item.labelEn, item.labelAr)}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-slate-700 font-medium text-sm hover:text-[#2563EB] transition-colors" dir="ltr">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-slate-700 font-medium text-sm">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              {(settings.linkedin || settings.twitter || settings.instagram) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                    {t("Social Media", "وسائل التواصل")}
                  </p>
                  <div className="flex items-center gap-3">
                    {settings.linkedin && (
                      <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}>
                        <Linkedin size={16} className="text-[#2563EB]" />
                      </a>
                    )}
                    {settings.twitter && (
                      <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}>
                        <Twitter size={16} className="text-[#2563EB]" />
                      </a>
                    )}
                    {settings.instagram && (
                      <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}>
                        <Instagram size={16} className="text-[#2563EB]" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3 bg-white rounded-3xl p-8"
              style={{ border: "1px solid rgba(37,99,235,0.1)", boxShadow: "0 8px 40px rgba(37,99,235,0.07)" }}
            >
              {/* Top bar */}
              <div className="h-1 w-full bg-brand-gradient rounded-full mb-7 -mt-1" />

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "rgba(37,99,235,0.1)" }}>
                    <CheckCircle size={40} className="text-[#2563EB]" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-heading mb-2">
                    {t("Message Sent!", "تم الإرسال!")}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {t("I'll get back to you within 24 hours.", "سأرد عليك خلال 24 ساعة.")}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2.5 rounded-full font-semibold text-sm btn-brand text-white"
                  >
                    {t("Send Another", "إرسال آخر")}
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 font-heading mb-1">
                    {t("Send a Message", "أرسل رسالة")}
                  </h2>
                  <p className="text-slate-500 text-sm mb-7">
                    {t("Fill the form and I'll reply as soon as possible.", "امل النموذج وسأرد في أقرب وقت ممكن.")}
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {t("Name *", "الاسم *")}
                        </label>
                        <input
                          {...register("name")}
                          placeholder={t("Your name", "اسمك")}
                          className="w-full h-11 px-4 rounded-xl border bg-[#FAF8F4] text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          style={{ borderColor: errors.name ? "#EF4444" : "#E2E8F0" }}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {t("Email *", "البريد *")}
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="email@example.com"
                          dir="ltr"
                          className="w-full h-11 px-4 rounded-xl border bg-[#FAF8F4] text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          style={{ borderColor: errors.email ? "#EF4444" : "#E2E8F0" }}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Phone + Subject row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {t("Phone", "الجوال")}
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+966 5XX XXX XXX"
                          dir="ltr"
                          className="w-full h-11 px-4 rounded-xl border bg-[#FAF8F4] text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          {t("Subject", "الموضوع")}
                        </label>
                        <input
                          {...register("subject")}
                          placeholder={t("Project consultation", "استشارة مشروع")}
                          className="w-full h-11 px-4 rounded-xl border bg-[#FAF8F4] text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {t("Message *", "الرسالة *")}
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder={t("Tell me about your project or inquiry...", "أخبرني عن مشروعك أو استفسارك...")}
                        className="w-full px-4 py-3 rounded-xl border bg-[#FAF8F4] text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
                        style={{ borderColor: errors.message ? "#EF4444" : "#E2E8F0" }}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitContact.isPending}
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                      }}
                    >
                      {submitContact.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("Sending…", "جاري الإرسال…")}
                        </div>
                      ) : (
                        <>
                          <Send size={15} />
                          {t("Send Message", "إرسال الرسالة")}
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </RootLayout>
  );
}
