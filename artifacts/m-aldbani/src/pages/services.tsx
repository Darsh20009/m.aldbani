import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Services() {
  const { t, language } = useLanguage();
  const { data: services = [], isLoading } = useListServices();

  return (
    <RootLayout>
      <section className="py-24 relative">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] z-0 pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold font-heading mb-4">
              {t("Consulting Services", "الخدمات الاستشارية")}
            </h1>
            <p className="text-foreground/60 text-lg">
              {t("Strategic advisory and technical execution for forward-thinking organizations.", "استشارات استراتيجية وتنفيذ تقني للمنظمات ذات التفكير المستقبلي.")}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-8 flex flex-col relative overflow-hidden group"
                >
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                  
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 border border-border text-2xl">
                    {service.icon || "⚡"}
                  </div>
                  
                  <h3 className="text-2xl font-bold font-heading mb-4">
                    {language === "ar" ? service.titleAr : service.title}
                  </h3>
                  
                  <p className="text-foreground/60 mb-8 flex-1">
                    {language === "ar" ? service.descriptionAr : service.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    {service.price && (
                      <span className="text-lg font-mono text-primary font-semibold">
                        {service.price}
                      </span>
                    )}
                    <Link href={`/book?service=${service.id}`} className={!service.price ? "w-full" : ""}>
                      <Button className={!service.price ? "w-full bg-primary hover:bg-primary/90 text-white" : "bg-white/10 hover:bg-primary hover:text-white text-white"}>
                        {t("Book Now", "احجز الآن")}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </RootLayout>
  );
}
