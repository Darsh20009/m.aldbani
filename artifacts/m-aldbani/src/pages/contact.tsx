import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Linkedin, Twitter, Instagram, CheckCircle } from "lucide-react";
import { useState } from "react";
import { LogoBrandImage } from "../components/Logo";

const BLACK    = "#0F0F10";
const GRAPHITE = "#3A3A3A";
const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";
const OFF_WHITE = "#F5F5F3";
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

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
      icon: <Mail size={18} />,
      labelEn: "Email", labelAr: "البريد",
      value: settings.email || "Moh.aldbani@gmail.com",
      href: `mailto:${settings.email || "Moh.aldbani@gmail.com"}`,
    },
    {
      icon: <Phone size={18} />,
      labelEn: "Phone / WhatsApp", labelAr: "الجوال / واتساب",
      value: settings.phone || "+966 552 469 643",
      href: `tel:${settings.phone || "+966552469643"}`,
    },
    {
      icon: <MapPin size={18} />,
      labelEn: "Location", labelAr: "الموقع",
      value: settings.address || "Riyadh, Saudi Arabia",
      href: null,
    },
  ];

  return (
    <RootLayout>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: BLACK, paddingTop: 120, paddingBottom: 80 }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.25)` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              {t("Get in Touch", "تواصل معي")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: EASE, duration: 0.7 }}
            className="text-6xl font-black font-heading mb-4"
            style={{ color: OFF_WHITE }}
          >
            {t("Let's Talk", "لنتحدث")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: EASE, duration: 0.7 }}
            className="text-lg leading-relaxed"
            style={{ color: TITANIUM }}
          >
            {t(
              "Have a brand project or want to explore a partnership? Let's make it happen.",
              "هل لديك مشروع علامة تجارية أو تريد استكشاف شراكة؟ لنحوّله إلى واقع."
            )}
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 px-5" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto">
          <div className={`grid lg:grid-cols-5 gap-8 items-start`}>

            {/* ── Left panel: info ── */}
            <div className="lg:col-span-2 space-y-3">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(199,172,112,0.1)`, color: GOLD }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: GOLD, opacity: 0.7 }}>
                      {t(item.labelEn, item.labelAr)}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium transition-colors" dir="ltr"
                        style={{ color: "rgba(245,245,243,0.7)" }}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: "rgba(245,245,243,0.7)" }}>{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Social */}
              {(settings.linkedin || settings.twitter || settings.instagram) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, ease: EASE }}
                  className="rounded-xl p-4"
                  style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, opacity: 0.7 }}>
                    {t("Social Media", "وسائل التواصل")}
                  </p>
                  <div className="flex items-center gap-2.5">
                    {settings.linkedin && (
                      <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.2)` }}>
                        <Linkedin size={15} style={{ color: GOLD }} />
                      </a>
                    )}
                    {settings.twitter && (
                      <a href={settings.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.2)` }}>
                        <Twitter size={15} style={{ color: GOLD }} />
                      </a>
                    )}
                    {settings.instagram && (
                      <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.2)` }}>
                        <Instagram size={15} style={{ color: GOLD }} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MD identity card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, ease: EASE }}
                className="rounded-xl p-5 flex items-center gap-4"
                style={{ background: GRAPHITE, border: `1px solid rgba(199,172,112,0.2)` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #08102E, #0F1E56)", boxShadow: "0 2px 10px rgba(37,99,235,0.3)" }}>
                  <LogoBrandImage size={28} style={{ filter: "drop-shadow(0 1px 4px rgba(37,99,235,0.4))" }} />
                </div>
                <div>
                  <p className="text-xs font-black" style={{ color: OFF_WHITE }}>Mohammed Al-Dabbani</p>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: GOLD, opacity: 0.7 }}>
                    {t("Brand Manager · F&B", "مدير علامة · مطاعم")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Contact form ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="lg:col-span-3 rounded-2xl p-7"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Gold top accent */}
              <div className="h-px w-full mb-7" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: `rgba(199,172,112,0.1)` }}>
                    <CheckCircle size={36} style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-2xl font-black font-heading mb-2" style={{ color: OFF_WHITE }}>
                    {t("Message Sent!", "تم الإرسال!")}
                  </h3>
                  <p className="mb-6" style={{ color: TITANIUM }}>
                    {t("I'll get back to you within 24 hours.", "سأرد عليك خلال 24 ساعة.")}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2.5 rounded-full font-semibold text-sm"
                    style={{ background: GOLD, color: BLACK }}
                  >
                    {t("Send Another", "إرسال آخر")}
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-xl font-black font-heading mb-1" style={{ color: OFF_WHITE }}>
                    {t("Send a Message", "أرسل رسالة")}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: TITANIUM }}>
                    {t("Fill the form and I'll reply as soon as possible.", "أملأ النموذج وسأرد في أقرب وقت.")}
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: TITANIUM }}>
                          {t("Name *", "الاسم *")}
                        </label>
                        <input {...register("name")}
                          placeholder={t("Your name", "اسمك")}
                          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "#1e1e1e",
                            border: `1px solid ${errors.name ? "#EF4444" : "rgba(255,255,255,0.08)"}`,
                            color: OFF_WHITE,
                          }}
                        />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: TITANIUM }}>
                          {t("Email *", "البريد *")}
                        </label>
                        <input {...register("email")} type="email" placeholder="email@example.com" dir="ltr"
                          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                          style={{
                            background: "#1e1e1e",
                            border: `1px solid ${errors.email ? "#EF4444" : "rgba(255,255,255,0.08)"}`,
                            color: OFF_WHITE,
                          }}
                        />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: TITANIUM }}>
                          {t("Phone", "الجوال")}
                        </label>
                        <input {...register("phone")} type="tel" placeholder="+966 5XX XXX XXX" dir="ltr"
                          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                          style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", color: OFF_WHITE }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: TITANIUM }}>
                          {t("Subject", "الموضوع")}
                        </label>
                        <input {...register("subject")} placeholder={t("Brand consultation", "استشارة علامة تجارية")}
                          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                          style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", color: OFF_WHITE }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: TITANIUM }}>
                        {t("Message *", "الرسالة *")}
                      </label>
                      <textarea {...register("message")} rows={5}
                        placeholder={t("Tell me about your project or inquiry...", "أخبرني عن مشروعك أو استفسارك...")}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                        style={{
                          background: "#1e1e1e",
                          border: `1px solid ${errors.message ? "#EF4444" : "rgba(255,255,255,0.08)"}`,
                          color: OFF_WHITE,
                        }}
                      />
                      {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitContact.isPending}
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{ background: GOLD, color: BLACK, letterSpacing: "0.02em" }}
                    >
                      {submitContact.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
