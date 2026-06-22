import { RootLayout } from "../../components/layout/RootLayout";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useLogin } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

const formSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { login: setAuth } = useAuth();
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({
          title: t("Welcome back", "مرحباً بعودتك"),
        });
        setLocation(res.user.role === "admin" ? "/admin" : "/client");
      },
      onError: () => {
        toast({
          title: t("Login Failed", "فشل تسجيل الدخول"),
          description: t("Invalid email or password.", "البريد الإلكتروني أو كلمة المرور غير صحيحة."),
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
              {t("Client Portal", "بوابة العملاء")}
            </h1>
            <p className="text-white/60">
              {t("Sign in to access your dashboard.", "سجل الدخول للوصول إلى لوحة التحكم.")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@example.com" className="bg-background/50 border-white/10" {...field} />
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
                      <Input type="password" placeholder="••••••••" className="bg-background/50 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? t("Signing in...", "جاري تسجيل الدخول...") : t("Sign In", "تسجيل الدخول")}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-white/60">
            {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              {t("Request access", "اطلب الانضمام")}
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
