import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useBookConsultation, useGetAvailableSlots, getGetAvailableSlotsQueryKey, useListServices } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Building2, Sparkles, BarChart3, ClipboardList, MessageCircle,
  Calendar, Clock, User, Mail, Phone, FileText, ChevronRight, ChevronLeft,
  CheckCircle2, ArrowRight
} from "lucide-react";

const formSchema = z.object({
  clientName: z.string().min(2, "الاسم مطلوب"),
  clientEmail: z.string().email("بريد إلكتروني صحيح مطلوب"),
  clientPhone: z.string().min(5, "رقم الهاتف مطلوب"),
  type: z.string().min(1, "نوع الاستشارة مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  time: z.string().min(1, "الوقت مطلوب"),
  duration: z.coerce.number().min(30),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const defaultServices = [
  {
    id: "tech",
    titleAr: "استشارة تقنية",
    title: "Tech Consultation",
    descAr: "حلول تقنية مخصصة لتحدياتك",
    desc: "Custom tech solutions for your challenges",
    icon: Cpu,
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-400/30",
    iconColor: "text-blue-500",
    ring: "ring-blue-400",
  },
  {
    id: "systems",
    titleAr: "بناء الأنظمة الإدارية",
    title: "Admin Systems",
    descAr: "أنظمة متكاملة لإدارة أعمالك",
    desc: "Integrated systems for your business",
    icon: Building2,
    gradient: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-400/30",
    iconColor: "text-violet-500",
    ring: "ring-violet-400",
  },
  {
    id: "ai",
    titleAr: "الذكاء الاصطناعي والأتمتة",
    title: "AI & Automation",
    descAr: "أتمتة ذكية لتوفير الوقت والجهد",
    desc: "Smart automation to save time",
    icon: Sparkles,
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-400/30",
    iconColor: "text-amber-500",
    ring: "ring-amber-400",
  },
  {
    id: "analysis",
    titleAr: "تحليل أعمال",
    title: "Business Analysis",
    descAr: "تحليل شامل لتحسين أداء مشروعك",
    desc: "Comprehensive analysis to improve performance",
    icon: BarChart3,
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-400/30",
    iconColor: "text-emerald-500",
    ring: "ring-emerald-400",
  },
  {
    id: "pm",
    titleAr: "إدارة مشاريع",
    title: "Project Management",
    descAr: "تخطيط وإدارة مشاريعك باحتراف",
    desc: "Professional project planning & management",
    icon: ClipboardList,
    gradient: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-400/30",
    iconColor: "text-rose-500",
    ring: "ring-rose-400",
  },
  {
    id: "general",
    titleAr: "استشارة تقنية عامة",
    title: "General Consultation",
    descAr: "نقاش مفتوح حول تحدياتك التقنية",
    desc: "Open discussion on your tech challenges",
    icon: MessageCircle,
    gradient: "from-sky-500/10 to-cyan-500/10",
    border: "border-sky-400/30",
    iconColor: "text-sky-500",
    ring: "ring-sky-400",
  },
];

const defaultTimeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const steps = ["الخدمة", "الموعد", "البيانات"];

export default function Book() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const bookConsultation = useBookConsultation();
  const { data: rawServices } = useListServices();
  const apiServices = Array.isArray(rawServices) && rawServices.length > 0 ? rawServices : null;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "", clientEmail: "", clientPhone: "",
      type: "", date: "", time: "", duration: 60, notes: ""
    }
  });

  const { data: rawSlots } = useGetAvailableSlots({ date: selectedDate }, {
    query: {
      enabled: !!selectedDate,
      queryKey: getGetAvailableSlotsQueryKey({ date: selectedDate })
    }
  });
  const availableSlots: string[] = Array.isArray(rawSlots) && rawSlots.length > 0
    ? rawSlots as string[]
    : defaultTimeSlots;

  const onSubmit = (data: FormValues) => {
    bookConsultation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: t("Booking Confirmed!", "تم تأكيد الحجز!"),
          description: t("We will contact you shortly.", "سنتواصل معك قريباً.")
        });
        setLocation("/");
      },
      onError: () => {
        toast({
          title: t("Error", "خطأ"),
          description: t("Failed to book. Please try again.", "فشل الحجز. حاول مرة أخرى."),
          variant: "destructive"
        });
      }
    });
  };

  const selectedType = form.watch("type");
  const selectedTime = form.watch("time");

  const servicesToShow = apiServices
    ? apiServices.map((s: { id: string; title: string; titleAr: string }) => {
        const match = defaultServices.find(d => d.id === s.id) || defaultServices[0];
        return { ...match, id: s.id, title: s.title, titleAr: s.titleAr };
      })
    : defaultServices;

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const period = hour >= 12 ? "م" : "ص";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <RootLayout>
      <section className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              {t("Book a Session", "احجز جلسة")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">
              {t("Book a Consultation", "احجز استشارتك")}
            </h1>
            <p className="text-foreground/60">
              {t("3 simple steps to get started", "٣ خطوات بسيطة للبدء")}
            </p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {steps.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{
                        backgroundColor: isDone ? "#2563EB" : isActive ? "#2563EB" : "transparent",
                        borderColor: isDone || isActive ? "#2563EB" : "#D1D5DB",
                        scale: isActive ? 1.1 : 1,
                      }}
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all"
                      style={{ color: isDone || isActive ? "#fff" : "#9CA3AF" }}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </motion.div>
                    <span className={`text-xs font-medium ${isActive ? "text-primary" : isDone ? "text-primary/60" : "text-foreground/40"}`}>
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-16 md:w-24 h-0.5 mx-1 mb-4 transition-colors ${step > stepNum ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">

                {/* ── Step 1: Service Cards ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card rounded-2xl p-6 md:p-8 mb-4">
                      <h2 className="text-lg font-bold font-heading mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {t("Choose your service", "اختر نوع الخدمة")}
                      </h2>

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {servicesToShow.map((service) => {
                                  const Icon = service.icon;
                                  const isSelected = field.value === service.id;
                                  return (
                                    <motion.button
                                      key={service.id}
                                      type="button"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => field.onChange(service.id)}
                                      className={`
                                        relative text-start p-4 rounded-xl border-2 transition-all duration-200
                                        bg-gradient-to-br ${service.gradient}
                                        ${isSelected
                                          ? `${service.border} ring-2 ${service.ring} shadow-lg`
                                          : "border-border/50 hover:border-border"
                                        }
                                      `}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute top-3 end-3"
                                        >
                                          <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </motion.div>
                                      )}
                                      <div className={`w-10 h-10 rounded-xl bg-white/80 dark:bg-black/20 flex items-center justify-center mb-3 ${service.iconColor}`}>
                                        <Icon className="w-5 h-5" />
                                      </div>
                                      <p className="font-bold text-sm text-foreground mb-1">
                                        {language === "ar" ? service.titleAr : service.title}
                                      </p>
                                      <p className="text-xs text-foreground/60 leading-relaxed">
                                        {language === "ar" ? service.descAr : service.desc}
                                      </p>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      onClick={() => form.trigger(["type"]).then(valid => valid && setStep(2))}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-13 text-base gap-2"
                      disabled={!selectedType}
                    >
                      {t("Next: Choose Date & Time", "التالي: اختر التاريخ والوقت")}
                      {language === "ar" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </Button>
                  </motion.div>
                )}

                {/* ── Step 2: Date & Time ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card rounded-2xl p-6 md:p-8 mb-4 space-y-6">
                      <h2 className="text-lg font-bold font-heading flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {t("Select Date & Time", "اختر التاريخ والوقت")}
                      </h2>

                      {/* Date picker */}
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <label className="text-sm font-semibold text-foreground/80 mb-2 block">
                              {t("Date", "التاريخ")}
                            </label>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                <Input
                                  type="date"
                                  className="bg-background/50 border-border ps-10 h-12 rounded-xl text-base"
                                  {...field}
                                  onChange={e => {
                                    field.onChange(e);
                                    setSelectedDate(e.target.value);
                                  }}
                                  min={new Date().toISOString().split("T")[0]}
                                />
                              </div>
                            </FormControl>
                            {field.value && (
                              <p className="text-xs text-primary mt-1">{formatDateDisplay(field.value)}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Time slots */}
                      {selectedDate && (
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <label className="text-sm font-semibold text-foreground/80 mb-3 block flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {t("Available Times", "الأوقات المتاحة")}
                              </label>
                              <FormControl>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="grid grid-cols-3 gap-2"
                                >
                                  {availableSlots.map((slot) => {
                                    const isSelected = field.value === slot;
                                    return (
                                      <motion.button
                                        key={slot}
                                        type="button"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => field.onChange(slot)}
                                        className={`
                                          py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150
                                          ${isSelected
                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                            : "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                                          }
                                        `}
                                      >
                                        {formatTime(slot)}
                                      </motion.button>
                                    );
                                  })}
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Summary pill */}
                      {selectedType && (
                        <div className="flex items-center gap-2 text-xs text-foreground/60 bg-muted/50 rounded-lg px-3 py-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>
                            {servicesToShow.find(s => s.id === selectedType)?.[language === "ar" ? "titleAr" : "title"]}
                            {selectedTime && <> · {formatTime(selectedTime)}</>}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl h-13 border-border gap-2">
                        {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {t("Back", "رجوع")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => form.trigger(["date", "time"]).then(valid => valid && setStep(3))}
                        className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-13 gap-2"
                        disabled={!selectedDate || !selectedTime}
                      >
                        {t("Next: Your Details", "التالي: بياناتك")}
                        {language === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Personal Details ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card rounded-2xl p-6 md:p-8 mb-4 space-y-5">
                      <h2 className="text-lg font-bold font-heading flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t("Your Details", "بياناتك")}
                      </h2>

                      {/* Booking summary */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                          {t("Booking Summary", "ملخص الحجز")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Sparkles className="w-4 h-4 text-primary shrink-0" />
                          {servicesToShow.find(s => s.id === selectedType)?.[language === "ar" ? "titleAr" : "title"]}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          {formatDateDisplay(form.watch("date"))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          {formatTime(form.watch("time"))}
                        </div>
                      </div>

                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <label className="text-sm font-semibold text-foreground/80 mb-1.5 block">
                              {t("Full Name", "الاسم الكامل")}
                            </label>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                                <Input
                                  placeholder={t("Your full name", "اسمك الكامل")}
                                  className="bg-background/50 border-border ps-10 h-12 rounded-xl"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="clientPhone"
                          render={({ field }) => (
                            <FormItem>
                              <label className="text-sm font-semibold text-foreground/80 mb-1.5 block">
                                {t("Phone", "الهاتف")}
                              </label>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                                  <Input
                                    placeholder="+966 5X XXX XXXX"
                                    className="bg-background/50 border-border ps-10 h-12 rounded-xl"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="clientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <label className="text-sm font-semibold text-foreground/80 mb-1.5 block">
                                {t("Email", "البريد")}
                              </label>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                                  <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="bg-background/50 border-border ps-10 h-12 rounded-xl"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Notes */}
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <label className="text-sm font-semibold text-foreground/80 mb-1.5 block flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-primary/50" />
                              {t("Notes (optional)", "ملاحظات (اختياري)")}
                            </label>
                            <FormControl>
                              <Textarea
                                placeholder={t("What would you like to discuss?", "ماذا تريد أن تناقش؟")}
                                className="min-h-[90px] bg-background/50 border-border rounded-xl resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-xl h-13 border-border gap-2">
                        {language === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {t("Back", "رجوع")}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-13 gap-2"
                        disabled={bookConsultation.isPending}
                      >
                        {bookConsultation.isPending ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            {t("Confirming...", "جاري التأكيد...")}
                          </span>
                        ) : (
                          <>
                            {t("Confirm Booking", "تأكيد الحجز")}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </div>
      </section>
    </RootLayout>
  );
}
