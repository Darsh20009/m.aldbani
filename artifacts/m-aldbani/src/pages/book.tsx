import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useBookConsultation, useGetAvailableSlots, getGetAvailableSlotsQueryKey, useListServices } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";

const formSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(5, "Phone is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.coerce.number().min(30),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function Book() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const bookConsultation = useBookConsultation();
  const { data: rawServices } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices : [];
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      type: "",
      date: "",
      time: "",
      duration: 60,
      notes: ""
    }
  });

  const { data: rawSlots } = useGetAvailableSlots({ date: selectedDate }, {
    query: {
      enabled: !!selectedDate,
      queryKey: getGetAvailableSlotsQueryKey({ date: selectedDate })
    }
  });
  const availableSlots = Array.isArray(rawSlots) ? rawSlots : [];

  const onSubmit = (data: FormValues) => {
    bookConsultation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: t("Booking Confirmed", "تم تأكيد الحجز"),
          description: t("We will contact you shortly with the meeting details.", "سنتواصل معك قريباً بتفاصيل الاجتماع.")
        });
        setLocation("/");
      },
      onError: () => {
        toast({
          title: t("Error", "خطأ"),
          description: t("Failed to book consultation. Please try again.", "فشل في حجز الاستشارة. يرجى المحاولة مرة أخرى."),
          variant: "destructive"
        });
      }
    });
  };

  return (
    <RootLayout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading mb-4">
              {t("Book a Consultation", "احجز استشارة")}
            </h1>
            <p className="text-foreground/60 text-lg">
              {t("Schedule a focused session to discuss your technical challenges and strategic goals.", "حدد جلسة مركزة لمناقشة تحدياتك التقنية وأهدافك الاستراتيجية.")}
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-bold font-heading border-b border-border pb-4">
                      {t("Select Service", "اختر الخدمة")}
                    </h2>
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Consultation Type", "نوع الاستشارة")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border">
                                <SelectValue placeholder={t("Select a service", "اختر خدمة")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map(service => (
                                <SelectItem key={service.id} value={service.id}>
                                  {language === "ar" ? service.titleAr : service.title}
                                </SelectItem>
                              ))}
                              <SelectItem value="general">{t("General Tech Consultation", "استشارة تقنية عامة")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="button" onClick={() => form.trigger(["type"]).then(valid => valid && setStep(2))} className="w-full bg-primary hover:bg-primary/90 text-white">
                      {t("Next: Choose Date & Time", "التالي: اختر التاريخ والوقت")}
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-bold font-heading border-b border-border pb-4">
                      {t("Select Date & Time", "اختر التاريخ والوقت")}
                    </h2>
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Date", "التاريخ")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="bg-background/50 border-border" 
                              {...field} 
                              onChange={e => {
                                field.onChange(e);
                                setSelectedDate(e.target.value);
                              }}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedDate && (
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Available Times", "الأوقات المتاحة")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border">
                                  <SelectValue placeholder={t("Select a time slot", "اختر وقت")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableSlots.length > 0 ? availableSlots.map(slot => (
                                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                )) : (
                                  <SelectItem value="10:00" disabled>{t("No slots available", "لا يوجد أوقات متاحة")}</SelectItem>
                                )}
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="14:00">02:00 PM</SelectItem>
                                <SelectItem value="16:00">04:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full border-border">
                        {t("Back", "رجوع")}
                      </Button>
                      <Button type="button" onClick={() => form.trigger(["date", "time"]).then(valid => valid && setStep(3))} className="w-full bg-primary hover:bg-primary/90 text-white">
                        {t("Next: Your Details", "التالي: بياناتك")}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-bold font-heading border-b border-border pb-4">
                      {t("Your Details", "بياناتك")}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Full Name", "الاسم الكامل")}</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Phone Number", "رقم الهاتف")}</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" className="bg-background/50 border-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Notes / Goals", "ملاحظات / أهداف الجلسة")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("Briefly describe what you'd like to discuss...", "صف بإيجاز ما تود مناقشته...")} 
                              className="min-h-[100px] bg-background/50 border-border resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full border-border">
                        {t("Back", "رجوع")}
                      </Button>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold" disabled={bookConsultation.isPending}>
                        {bookConsultation.isPending ? t("Confirming...", "جاري التأكيد...") : t("Confirm Booking", "تأكيد الحجز")}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
