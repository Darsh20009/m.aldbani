import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: t("Message Sent", "تم إرسال الرسالة"),
          description: t("Thank you for reaching out. I'll get back to you soon.", "شكراً لتواصلك معي. سأرد عليك قريباً.")
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: t("Error", "خطأ"),
          description: t("Failed to send message. Please try again.", "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."),
          variant: "destructive"
        });
      }
    });
  };

  return (
    <RootLayout>
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                {t("Let's build something extraordinary.", "دعنا نبني شيئاً استثنائياً.")}
              </h1>
              <p className="text-lg text-white/60 mb-12">
                {t("Whether you're looking for technical consulting, project architecture, or executive advisory, I'm here to help.", "سواء كنت تبحث عن استشارات تقنية، أو هندسة مشاريع، أو استشارات تنفيذية، أنا هنا للمساعدة.")}
              </p>

              <div className="space-y-6">
                <div className="glass-card p-6 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-white/80">{t("Email", "البريد الإلكتروني")}</h3>
                    <a href="mailto:contact@m-aldbani.com" className="text-white hover:text-primary transition-colors">
                      contact@m-aldbani.com
                    </a>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366]">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-white/80">{t("WhatsApp", "واتساب")}</h3>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#25D366] transition-colors">
                      {t("Message on WhatsApp", "راسلني على الواتساب")}
                    </a>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href="/book">
                    <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 font-bold h-14">
                      {t("Book a Consultation", "احجز استشارة")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-2xl relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-2xl font-bold font-heading mb-8 relative z-10">
                {t("Send a Message", "أرسل رسالة")}
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Name", "الاسم")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("Your name", "اسمك")} className="bg-background/50 border-white/10 focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" className="bg-background/50 border-white/10 focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Subject", "الموضوع")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("How can I help?", "كيف يمكنني المساعدة؟")} className="bg-background/50 border-white/10 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Message", "الرسالة")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("Tell me about your project...", "أخبرني عن مشروعك...")} 
                            className="min-h-[150px] bg-background/50 border-white/10 focus-visible:ring-primary resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold" disabled={submitContact.isPending}>
                    {submitContact.isPending ? t("Sending...", "جاري الإرسال...") : t("Send Message", "إرسال الرسالة")}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
