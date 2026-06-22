import { RootLayout } from "../../components/layout/RootLayout";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useRegister } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const registerMutation = useRegister();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    registerMutation.mutate({ data }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({
          title: t("Account Created", "تم إنشاء الحساب"),
          description: t("Welcome to the client portal.", "مرحباً بك في بوابة العملاء.")
        });
        setLocation("/client");
      },
      onError: () => {
        toast({
          title: t("Registration Failed", "فشل التسجيل"),
          description: t("Email may already be in use.", "قد يكون البريد الإلكتروني مستخدماً بالفعل."),
          variant: "destructive"
        });
      }
    });
  };

  return (
    <RootLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">
              {t("Request Access", "طلب الانضمام")}
            </h1>
            <p className="text-foreground/60">
              {t("Create an account for the client portal.", "قم بإنشاء حساب للوصول إلى بوابة العملاء.")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@example.com" className="bg-background/50 border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Phone Number (Optional)", "رقم الهاتف (اختياري)")}</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" className="bg-background/50 border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Password", "كلمة المرور")}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-background/50 border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? t("Creating account...", "جاري إنشاء الحساب...") : t("Create Account", "إنشاء حساب")}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-foreground/60">
            {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("Sign in", "تسجيل الدخول")}
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
