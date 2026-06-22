import { motion } from "framer-motion";
import { useLanguage } from "../hooks/use-language";
import { RootLayout } from "../components/layout/RootLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useLanguage();

  return (
    <RootLayout>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
              {t("Precision. Authority. ", "دقة. احترافية. ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {t("Sophistication.", "رقي.")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10">
              {t(
                "Elevating tech ventures with world-class consulting and execution.",
                "نرفع من مستوى مشاريعك التقنية باستشارات وتنفيذ على مستوى عالمي."
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-14 text-lg w-full sm:w-auto">
                  {t("Book Consultation", "احجز استشارة")}
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-14 text-lg w-full sm:w-auto">
                  {t("View Work", "استعرض الأعمال")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-heading">{t("Premium Services", "خدمات مميزة")}</h2>
            <p className="text-white/60 max-w-xl mx-auto">{t("Tailored solutions for elite clients.", "حلول مخصصة لعملاء النخبة.")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-8 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                  <div className="w-6 h-6 bg-primary rounded-sm" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t(`Service ${i}`, `الخدمة ${i}`)}</h3>
                <p className="text-white/60 mb-6">{t("A brief description of this premium service and how it benefits your business.", "وصف موجز لهذه الخدمة المميزة وكيف تفيد عملك.")}</p>
                <Link href="/services">
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold">
                    {t("Learn more →", "اكتشف المزيد ←")}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
