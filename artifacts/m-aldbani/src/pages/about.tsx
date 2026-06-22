import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { motion } from "framer-motion";

export default function About() {
  const { t } = useLanguage();

  return (
    <RootLayout>
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8">
              {t("Mohammed Al-Dabbani", "محمد الدباني")}
            </h1>
            <h2 className="text-2xl text-primary font-semibold mb-6">
              {t("Technology Consultant & Entrepreneur", "مستشار تقني ورائد أعمال")}
            </h2>
            <div className="prose prose-invert prose-lg text-foreground/70 max-w-none mb-12">
              <p>
                {t(
                  "With over a decade of experience bridging the gap between complex technological capabilities and strategic business objectives, I help visionary leaders build, scale, and optimize their digital infrastructure.",
                  "مع أكثر من عقد من الخبرة في سد الفجوة بين القدرات التكنولوجية المعقدة وأهداف الأعمال الاستراتيجية، أساعد القادة أصحاب الرؤى على بناء وتوسيع وتحسين بنيتهم التحتية الرقمية."
                )}
              </p>
              <p>
                {t(
                  "My approach is rooted in precision. I believe that true luxury in technology is found when systems are so meticulously engineered that they become invisible to the user, yet undeniable in their impact.",
                  "نهجي متجذر في الدقة. أعتقد أن الرفاهية الحقيقية في التكنولوجيا توجد عندما يتم هندسة الأنظمة بدقة شديدة بحيث تصبح غير مرئية للمستخدم، لكن لا يمكن إنكار تأثيرها."
                )}
              </p>
            </div>
            
            <h3 className="text-2xl font-bold font-heading mb-8 border-b border-border pb-4">
              {t("Experience & Milestones", "الخبرات والمحطات")}
            </h3>
            
            <div className="space-y-8">
              {[
                { year: "2023 - Present", title: "Founder & Lead Consultant", org: "M-ALDBANI Advisory" },
                { year: "2020 - 2023", title: "CTO", org: "TechVentures LLC" },
                { year: "2016 - 2020", title: "Senior Solutions Architect", org: "Global Innovations Group" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 group">
                  <div className="md:w-48 flex-shrink-0 text-primary font-mono text-sm pt-1">
                    {item.year}
                  </div>
                  <div className="glass-card p-6 rounded-xl flex-1 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    <h4 className="text-xl font-bold mb-2">{t(item.title, item.title)}</h4>
                    <p className="text-foreground/60">{t(item.org, item.org)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </RootLayout>
  );
}
